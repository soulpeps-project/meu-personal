import { useState } from 'react';
import { useStore, setState } from '../lib/store';
import { go, openExercise, useNav } from '../lib/nav';
import { currentWeek, getEx, setsForWeek, estimateMinutes, generateProgram, SPLIT_INFO, autoSplit, cardioLabel, availableExercises, repUnit } from '../lib/generator';
import { MUSCLE_SHORT, WEEKDAYS_FULL, ALL_MUSCLES } from '../lib/catalog';
import type { PlannedDay, SplitId } from '../lib/types';
import type { Muscle } from '../data/exercises';
import { Icon, Sheet, Thumb, Option } from '../components/ui';

export function VolumeBars({ weekly, target }: { weekly: Partial<Record<Muscle, number>>; target: Partial<Record<Muscle, number>> }) {
  const muscles = ALL_MUSCLES.filter((m) => (weekly[m] || 0) > 0.4 || target[m]);
  const max = Math.max(22, ...muscles.map((m) => Math.max(weekly[m] || 0, target[m] || 0)));
  return (
    <div>
      {muscles.map((m) => {
        const v = Math.round((weekly[m] || 0) * 10) / 10;
        const t = target[m];
        return (
          <div className="bar" key={m}>
            <span className="name">{MUSCLE_SHORT[m]}</span>
            <div className="track">
              <div className="fill" style={{ width: `${(v / max) * 100}%`, opacity: t ? 1 : 0.5 }} />
              {t ? <div className="target" style={{ left: `${(t / max) * 100}%` }} /> : null}
            </div>
            <span className="val">{v}{t ? `/${t}` : ''}</span>
          </div>
        );
      })}
      <p className="muted">Barra = séries semanais (compostos contam 0,5 para músculos auxiliares). Linha azul = alvo.</p>
    </div>
  );
}

function DayCard({ day, editable }: { day: PlannedDay; editable: boolean }) {
  const program = useStore((s) => s.program)!;
  const profile = useStore((s) => s.profile);
  const week = currentWeek(program);
  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState('');

  const updateDay = (fn: (d: PlannedDay) => PlannedDay) => setState((s) => ({
    program: s.program && { ...s.program, days: s.program.days.map((d) => (d.id === day.id ? (() => { const nd = fn(d); return { ...nd, estMinutes: estimateMinutes(nd.exercises) + (nd.cardio?.minutes || 0) }; })() : d)) },
  }));
  const move = (i: number, dir: number) => updateDay((d) => {
    const ex = [...d.exercises]; const j = i + dir; if (j < 0 || j >= ex.length) return d;
    [ex[i], ex[j]] = [ex[j], ex[i]]; return { ...d, exercises: ex };
  });

  const pool = availableExercises(profile).filter((e) => !q || e.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="card">
      <div className="row between">
        <div>
          <div className="muted">{WEEKDAYS_FULL[day.weekday]}</div>
          <h3 style={{ margin: 0 }}>{day.name}</h3>
        </div>
        <div className="row">
          <span className="muted">~{day.estMinutes} min</span>
          <button className="btn sm primary" onClick={() => go({ screen: 'workout', workoutDay: day.id })}><Icon name="play" size={14} fill /></button>
        </div>
      </div>
      <p className="muted">{day.focus}</p>
      {day.exercises.map((pe, i) => {
        const ex = getEx(pe.exId);
        const unit = repUnit(pe.exId);
        const prev = day.exercises[i - 1];
        const isPairSecond = pe.supersetWith && prev?.exId === pe.supersetWith;
        return (
          <div key={pe.exId + i}>
            {pe.supersetWith && !isPairSecond && <div className="superset-tag mt">BI-SET ↓ alterne os dois exercícios</div>}
            <div className="exrow" onClick={() => openExercise(pe.exId, { dayId: day.id, idx: i })}>
              <Thumb ex={ex} />
              <div className="grow">
                <b>{ex?.name ?? pe.exId}</b>
                <div className="muted">
                  {setsForWeek(pe, week, profile)} × {pe.reps[0]}–{pe.reps[1]}{unit !== 'reps' ? ` ${unit}` : ''} · RIR {week.rir} · desc. {Math.round(pe.rest / 15) * 15}s
                </div>
                {pe.role === 'main' && <span className="tag accent">Principal</span>}
              </div>
              {editable && (
                <div className="col" style={{ gap: 4 }} onClick={(e) => e.stopPropagation()}>
                  <div className="row" style={{ gap: 4 }}>
                    <button className="iconbtn" style={{ width: 30, height: 30 }} onClick={() => updateDay((d) => ({ ...d, exercises: d.exercises.map((x, k) => (k === i ? { ...x, sets: Math.max(1, x.sets - 1) } : x)) }))}><Icon name="minus" size={14} /></button>
                    <button className="iconbtn" style={{ width: 30, height: 30 }} onClick={() => updateDay((d) => ({ ...d, exercises: d.exercises.map((x, k) => (k === i ? { ...x, sets: Math.min(8, x.sets + 1) } : x)) }))}><Icon name="plus" size={14} /></button>
                  </div>
                  <div className="row" style={{ gap: 4 }}>
                    <button className="iconbtn" style={{ width: 30, height: 30 }} onClick={() => move(i, -1)}>↑</button>
                    <button className="iconbtn" style={{ width: 30, height: 30 }} onClick={() => move(i, 1)}>↓</button>
                  </div>
                  <button className="iconbtn" style={{ width: 64, height: 26 }} onClick={() => updateDay((d) => ({ ...d, exercises: d.exercises.filter((_, k) => k !== i).map((x) => (x.supersetWith === pe.exId ? { ...x, supersetWith: undefined, technique: 'normal' } : x)) }))}><Icon name="trash" size={14} /></button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {day.cardio && (
        <div className="exrow" style={{ cursor: 'default' }}>
          <div className="thumb ph">🫀</div>
          <div className="grow"><b>{cardioLabel(day.cardio.type)} · {day.cardio.minutes} min</b><div className="muted">{day.cardio.intensity}</div></div>
        </div>
      )}
      {editable && <button className="btn sm block mt" onClick={() => setAdding(true)}><Icon name="plus" size={16} /> Adicionar exercício</button>}
      <Sheet open={adding} onClose={() => setAdding(false)} title="Adicionar exercício">
        <input type="text" placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="mt">
          {pool.slice(0, 60).map((e) => (
            <div key={e.id} className="exrow" onClick={() => {
              updateDay((d) => ({ ...d, exercises: [...d.exercises, { exId: e.id, sets: 3, reps: e.reps, rir: 2, rest: e.rest, technique: 'normal', role: e.mechanic === 'compound' ? 'secondary' : 'accessory' }] }));
              setAdding(false); setQ('');
            }}>
              <Thumb ex={e} />
              <div className="grow"><b>{e.name}</b><div className="muted">{e.primary.map((m) => MUSCLE_SHORT[m]).join(', ')}</div></div>
              <Icon name="plus" />
            </div>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

export function Regenerate({ onDone }: { onDone: () => void }) {
  const profile = useStore((s) => s.profile)!;
  const n = Math.min(6, profile.days.length);
  const [split, setSplit] = useState<SplitId>(profile.split);
  const options = (Object.keys(SPLIT_INFO) as Exclude<SplitId, 'auto'>[]).filter((k) => n >= SPLIT_INFO[k].min && n <= SPLIT_INFO[k].max);
  return (
    <div>
      <p className="muted">Gera um novo programa com seus dados atuais (dias, tempo, equipamentos, objetivos). Seu histórico é mantido.</p>
      <Option on={split === 'auto'} onClick={() => setSplit('auto')} emoji="✨" title={`Automática: ${SPLIT_INFO[autoSplit(n)].name}`} />
      {options.map((k) => <Option key={k} on={split === k} onClick={() => setSplit(k)} title={SPLIT_INFO[k].name} desc={SPLIT_INFO[k].desc} />)}
      <button className="btn primary block mt" onClick={() => {
        if (!confirm('Substituir o programa atual por um novo?')) return;
        setState((s) => ({ program: generateProgram({ ...s.profile!, split }, Date.now() % 100000), profile: { ...s.profile!, split } }));
        onDone();
      }}><Icon name="spark" /> Gerar novo programa</button>
      <button className="btn block mt" onClick={() => {
        setState((s) => ({ program: s.program ? generateProgram({ ...s.profile!, split }, (s.program.seed + 7919) % 100000) : s.program }));
        onDone();
      }}>Variar exercícios (mesma estrutura)</button>
    </div>
  );
}

export default function Plan() {
  const program = useStore((s) => s.program);
  const nav = useNav();
  const [tab, setTab] = useState<'days' | 'why' | 'cycle' | 'volume'>('days');
  const [edit, setEdit] = useState(false);
  if (!program) return <div className="card"><Regenerate onDone={() => go({ screen: null })} /></div>;
  const week = currentWeek(program);
  const sorted = [...program.days].sort((a, b) => ((a.weekday + 6) % 7) - ((b.weekday + 6) % 7));
  // volume atual (inclui edições manuais)
  const weekly: Partial<Record<Muscle, number>> = {};
  for (const d of program.days) for (const pe of d.exercises) {
    const ex = getEx(pe.exId); if (!ex) continue;
    for (const m of ex.primary) weekly[m] = (weekly[m] || 0) + pe.sets;
    for (const m of ex.secondary) weekly[m] = (weekly[m] || 0) + pe.sets * 0.5;
  }

  return (
    <div>
      <div className="topbar">
        <div><div className="muted">Seu programa</div><div className="title">{program.splitName}</div></div>
        <button className="iconbtn" onClick={() => go({ screen: 'regenerate' })} aria-label="Gerar novo"><Icon name="spark" /></button>
      </div>
      <div className="card hero">
        <div className="row between"><b>Semana {week.week}/{program.weeks.length} · {week.label}</b><span className="tag accent">RIR {week.rir}</span></div>
        <p className="muted mt" style={{ marginBottom: 0 }}>{week.notes}</p>
      </div>
      <div className="seg">
        {([['days', 'Treinos'], ['volume', 'Volume'], ['cycle', 'Ciclo'], ['why', 'Por quê?']] as const).map(([v, l]) => (
          <button key={v} className={tab === v ? 'on' : ''} onClick={() => setTab(v)}>{l}</button>
        ))}
      </div>

      {tab === 'days' && (
        <>
          <div className="row between mb">
            <span className="muted">Toque num exercício para ver execução e trocar.</span>
            <button className={`btn sm ${edit ? 'primary' : ''}`} onClick={() => setEdit(!edit)}><Icon name="edit" size={14} /> {edit ? 'Concluir' : 'Editar'}</button>
          </div>
          {sorted.map((d) => <DayCard key={d.id} day={d} editable={edit} />)}
          {program.cardioPlan.length > 0 && (
            <div className="card">
              <h3>Cardio e atividade</h3>
              <ul className="list">{program.cardioPlan.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </div>
          )}
          <div className="card">
            <h3>Aquecimento padrão</h3>
            <ol className="steps">
              <li>5 min de cardio leve (bike, esteira) até começar a suar.</li>
              <li>Mobilidade específica das articulações do dia (ex.: rotação de ombros, quadril, tornozelo) — 2–3 min.</li>
              <li>Séries de aproximação no primeiro exercício de cada grupo (indicadas no treino).</li>
            </ol>
            <p className="muted">Alongamento estático longo antes do treino não é necessário; deixe para depois ou outro horário, se quiser ganhar flexibilidade.</p>
          </div>
        </>
      )}

      {tab === 'volume' && <div className="card"><h3>Séries semanais por músculo</h3><VolumeBars weekly={weekly} target={program.targetSets} /></div>}

      {tab === 'cycle' && (
        <div className="card">
          <h3>Mesociclo</h3>
          <p className="muted">Um ciclo de {program.weeks.length} semanas: o esforço sobe gradualmente e termina com uma semana leve (deload) para dissipar fadiga.</p>
          <table className="t">
            <thead><tr><th>Sem.</th><th>Fase</th><th>RIR</th><th>O que fazer</th></tr></thead>
            <tbody>{program.weeks.map((w) => (
              <tr key={w.week} style={w.week === week.week ? { background: 'color-mix(in srgb, var(--accent) 10%, transparent)' } : undefined}>
                <td><b>{w.week}</b></td><td>{w.label}</td><td>{w.rir}</td><td className="muted">{w.notes}</td>
              </tr>
            ))}</tbody>
          </table>
          <div className="info-box mt"><b>RIR</b> = repetições na reserva. RIR 2 significa que você terminaria a série sabendo que conseguiria fazer mais 2 repetições com boa técnica.</div>
          <label className="field mt">Data de início do ciclo
            <input type="date" value={program.startDate} onChange={(e) => setState((s) => ({ program: s.program && { ...s.program, startDate: e.target.value } }))} />
          </label>
        </div>
      )}

      {tab === 'why' && program.rationale.map((r, i) => (
        <div className="card" key={i}><h3>{r.title}</h3><p style={{ marginBottom: 0 }}>{r.text}</p></div>
      ))}

      <Sheet open={nav.screen === 'regenerate'} onClose={() => go({ screen: null })} title="Novo programa">
        <Regenerate onDone={() => go({ screen: null })} />
      </Sheet>
    </div>
  );
}
