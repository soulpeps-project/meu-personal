import { useMemo, useState } from 'react';
import { useStore, setState, uid, todayISO } from '../lib/store';
import { getEx } from '../lib/generator';
import { prs, history, bestSet, e1rm, hardSets, sessionVolume } from '../lib/progression';
import { navyBodyFat, weightTrend, ffmi, bmi, bmiLabel } from '../lib/nutrition';
import type { Measurement } from '../lib/types';
import type { Muscle } from '../data/exercises';
import { LineChart, Seg, Sheet, NumField, Icon, fmtDate, Thumb } from '../components/ui';
import { openExercise } from '../lib/nav';
import PhotosPanel from './Photos';
import { VolumeBars } from './Plan';

type T = 'body' | 'photos' | 'strength' | 'history';

const FIELDS: { k: keyof Measurement; l: string }[] = [
  { k: 'weightKg', l: 'Peso (kg)' }, { k: 'waist', l: 'Cintura (cm, no umbigo)' }, { k: 'hip', l: 'Quadril (cm)' }, { k: 'neck', l: 'Pescoço (cm)' },
  { k: 'chest', l: 'Peitoral (cm)' }, { k: 'arm', l: 'Braço contraído (cm)' }, { k: 'thigh', l: 'Coxa (cm)' }, { k: 'calf', l: 'Panturrilha (cm)' },
];

function Body() {
  const profile = useStore((s) => s.profile)!;
  const raw = useStore((s) => s.measurements);
  const ms = useMemo(() => [...raw].sort((a, b) => a.date.localeCompare(b.date)), [raw]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Measurement>({ id: '', date: todayISO() });
  const [metric, setMetric] = useState<keyof Measurement>('weightKg');
  const trend = weightTrend(ms);
  const last = [...ms].reverse();
  const latest = (k: keyof Measurement) => last.find((m) => m[k] != null)?.[k] as number | undefined;
  const navy = navyBodyFat(profile.sex, profile.heightCm, latest('waist'), latest('neck'), latest('hip'));
  const bf = latest('bodyFat') ?? navy ?? profile.bodyFat;
  const ff = bf ? ffmi(profile.weightKg, profile.heightCm, bf) : null;
  const b = bmi(profile);
  const pts = ms.filter((m) => m[metric] != null).map((m) => ({ x: fmtDate(m.date), y: Number(m[metric]) }));

  return (
    <div>
      <div className="grid2">
        <div className="stat"><div className="v">{trend?.avg ? trend.avg.toFixed(1) : profile.weightKg} kg</div><div className="l">média 7 dias</div></div>
        <div className="stat"><div className="v">{trend?.perWeek != null ? `${trend.perWeek > 0 ? '+' : ''}${trend.perWeek.toFixed(2)}` : '—'}</div><div className="l">kg/semana</div></div>
        <div className="stat"><div className="v">{bf ? `${bf.toFixed(1)}%` : '—'}</div><div className="l">gordura {navy && !latest('bodyFat') ? '(Marinha)' : ''}</div></div>
        <div className="stat"><div className="v">{ff ? ff.normalized.toFixed(1) : b.toFixed(1)}</div><div className="l">{ff ? 'FFMI' : `IMC · ${bmiLabel(b)}`}</div></div>
      </div>
      <button className="btn primary block mt" onClick={() => { setForm({ id: uid(), date: todayISO(), weightKg: profile.weightKg }); setOpen(true); }}><Icon name="plus" /> Registrar medidas</button>
      <div className="card mt">
        <select value={metric} onChange={(e) => setMetric(e.target.value as keyof Measurement)}>
          {[...FIELDS, { k: 'bodyFat' as const, l: '% gordura' }].map((f) => <option key={f.k} value={f.k}>{f.l}</option>)}
        </select>
        <div className="mt"><LineChart points={pts} /></div>
      </div>
      {trend?.perWeek != null && (
        <div className="info-box">
          {profile.goal === 'fat_loss' && (trend.perWeek > -0.2 ? 'Perda lenta. Se ficar assim por 2+ semanas, reduza ~150 kcal/dia ou aumente passos.' : trend.perWeek < -profile.weightKg * 0.01 ? 'Perda rápida (>1%/sem). Considere comer um pouco mais para preservar músculo.' : 'Ritmo de perda ideal. Continue!')}
          {profile.goal === 'hypertrophy' && (trend.perWeek < 0 ? 'Peso caindo — aumente ~150–200 kcal/dia para ganhar massa.' : trend.perWeek > 0.5 ? 'Ganho rápido — boa parte pode ser gordura. Reduza um pouco as calorias.' : 'Ritmo de ganho adequado.')}
          {!['fat_loss', 'hypertrophy'].includes(profile.goal) && 'Acompanhe a tendência semanal; variações diárias de 1–2 kg são água e conteúdo intestinal.'}
        </div>
      )}
      <div className="card mt">
        <h3>Histórico</h3>
        <table className="t">
          <thead><tr><th>Data</th><th>Peso</th><th>Cintura</th><th>Braço</th><th></th></tr></thead>
          <tbody>{last.slice(0, 15).map((m) => (
            <tr key={m.id}><td>{fmtDate(m.date)}</td><td>{m.weightKg ?? '–'}</td><td>{m.waist ?? '–'}</td><td>{m.arm ?? '–'}</td>
              <td><button className="iconbtn" style={{ width: 28, height: 28 }} onClick={() => confirm('Apagar registro?') && setState((s) => ({ measurements: s.measurements.filter((x) => x.id !== m.id) }))}><Icon name="trash" size={13} /></button></td></tr>
          ))}</tbody>
        </table>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title="Novas medidas">
        <label className="field">Data<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
        <div className="grid2">
          {FIELDS.map((f) => <NumField key={f.k} label={f.l} step={0.1} value={form[f.k] as number | undefined} onChange={(v) => setForm({ ...form, [f.k]: v })} />)}
        </div>
        <NumField label="% gordura (bioimpedância/dobras, se tiver)" step={0.1} value={form.bodyFat} onChange={(v) => setForm({ ...form, bodyFat: v })} />
        <p className="muted">Cintura + pescoço{profile.sex === 'F' ? ' + quadril' : ''} permitem estimar a gordura pelo método da Marinha dos EUA.</p>
        <button className="btn primary block" onClick={() => {
          setState((s) => ({ measurements: [...s.measurements, form], profile: s.profile && form.weightKg ? { ...s.profile, weightKg: form.weightKg } : s.profile }));
          setOpen(false);
        }}>Salvar</button>
      </Sheet>
    </div>
  );
}

function Strength() {
  const sessions = useStore((s) => s.sessions);
  const best = useMemo(() => prs(sessions), [sessions]);
  const ids = [...best.keys()];
  const [sel, setSel] = useState<string>(ids[0] || '');
  if (!ids.length) return <div className="empty">Complete treinos para ver sua evolução de força.</div>;
  const h = history(sel, sessions);
  const pts = h.map((x) => { const b = bestSet(x.log.sets); return { x: fmtDate(x.date), y: b ? Math.round(e1rm(b.weight, b.reps, b.rir) * 10) / 10 : 0 }; }).filter((p) => p.y > 0);
  return (
    <div>
      <div className="card">
        <select value={sel} onChange={(e) => setSel(e.target.value)}>{ids.map((id) => <option key={id} value={id}>{getEx(id)?.name ?? id}</option>)}</select>
        <h3 className="mt">1RM estimado</h3>
        <LineChart points={pts} unit=" kg" />
      </div>
      <div className="card">
        <h3>Recordes pessoais</h3>
        {ids.sort((a, b) => best.get(b)!.e1rm - best.get(a)!.e1rm).map((id) => {
          const r = best.get(id)!;
          return (
            <div key={id} className="exrow" onClick={() => openExercise(id)}>
              <Thumb ex={getEx(id)} />
              <div className="grow"><b>{getEx(id)?.name}</b><div className="muted">{r.weight} kg × {r.reps} · {fmtDate(r.date)}</div></div>
              <b>{r.e1rm.toFixed(0)} kg</b>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function History() {
  const raw = useStore((s) => s.sessions);
  const program = useStore((s) => s.program);
  const sessions = useMemo(() => [...raw].sort((a, b) => b.date.localeCompare(a.date)), [raw]);
  const [view, setView] = useState<string | null>(null);
  // volume real dos últimos 7 dias
  const weekAgo = Date.now() - 7 * 86400000;
  const weekly: Partial<Record<Muscle, number>> = {};
  for (const s of raw.filter((x) => new Date(x.date).getTime() >= weekAgo)) for (const e of s.exercises) {
    const ex = getEx(e.exId); if (!ex) continue;
    const n = e.sets.filter((x) => x.done).length;
    for (const m of ex.primary) weekly[m] = (weekly[m] || 0) + n;
    for (const m of ex.secondary) weekly[m] = (weekly[m] || 0) + n * 0.5;
  }
  // calendário de 12 semanas
  const days = Array.from({ length: 84 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 83 + i); return d.toISOString().slice(0, 10); });
  const set = new Set(raw.map((s) => s.date.slice(0, 10)));
  const s = sessions.find((x) => x.id === view);
  return (
    <div>
      <div className="card">
        <h3>Últimas 12 semanas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoFlow: 'column', gridTemplateRows: 'repeat(7, 1fr)', gap: 3 }}>
          {days.map((d) => <div key={d} title={d} style={{ aspectRatio: '1', borderRadius: 3, background: set.has(d) ? 'var(--accent)' : 'var(--bg2)' }} />)}
        </div>
        <p className="muted mt" style={{ marginBottom: 0 }}>{raw.length} treinos no total.</p>
      </div>
      {program && Object.keys(weekly).length > 0 && (
        <div className="card"><h3>Volume real (últimos 7 dias)</h3><VolumeBars weekly={weekly} target={program.targetSets} /></div>
      )}
      {sessions.length === 0 && <div className="empty">Nenhum treino registrado ainda.</div>}
      {sessions.map((x) => (
        <div key={x.id} className="card tap" onClick={() => setView(x.id)}>
          <div className="row between"><b>{x.dayName}</b><span className="muted">{fmtDate(x.date)}</span></div>
          <div className="muted">{x.durationMin} min · {hardSets(x)} séries · {Math.round(sessionVolume(x))} kg{x.rpe ? ` · PSE ${x.rpe}` : ''}</div>
        </div>
      ))}
      <Sheet open={!!s} onClose={() => setView(null)} title={s ? `${s.dayName} · ${fmtDate(s.date)}` : ''}>
        {s && (
          <>
            {s.exercises.map((e, i) => (
              <div key={i} className="mb">
                <b>{getEx(e.exId)?.name}</b>
                <div className="muted">{e.sets.map((x) => `${x.weight}kg×${x.reps}${x.rir != null ? ` @${x.rir}` : ''}`).join(' · ')}</div>
              </div>
            ))}
            {s.notes && <p className="muted">📝 {s.notes}</p>}
            <button className="btn danger block" onClick={() => { if (confirm('Apagar este treino do histórico?')) { setState((st) => ({ sessions: st.sessions.filter((y) => y.id !== s.id) })); setView(null); } }}>Apagar treino</button>
          </>
        )}
      </Sheet>
    </div>
  );
}

export default function Progress() {
  const [t, setT] = useState<T>('body');
  return (
    <div>
      <div className="topbar"><div className="title">Evolução</div></div>
      <Seg value={t} onChange={setT} options={[{ v: 'body', l: 'Corpo' }, { v: 'photos', l: 'Fotos' }, { v: 'strength', l: 'Força' }, { v: 'history', l: 'Histórico' }]} />
      {t === 'body' && <Body />}
      {t === 'photos' && <PhotosPanel />}
      {t === 'strength' && <Strength />}
      {t === 'history' && <History />}
    </div>
  );
}
