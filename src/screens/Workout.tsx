import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore, setState, getState, uid } from '../lib/store';
import { go, openExercise, useNav } from '../lib/nav';
import { currentWeek, getEx, setsForWeek, cardioLabel, repUnit } from '../lib/generator';
import { suggest, prs, e1rm } from '../lib/progression';
import type { ActiveSession, ExerciseLog, PlannedExercise, SetLog } from '../lib/types';
import { Icon, Sheet, Thumb } from '../components/ui';

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    [0, 0.25, 0.5].forEach((t) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.25, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.2);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.21);
    });
  } catch { /* sem áudio */ }
}

function RestTimer({ until, total, onDone, onAdd }: { until: number; total: number; onDone: () => void; onAdd: (s: number) => void }) {
  const [now, setNow] = useState(Date.now());
  const settings = useStore((s) => s.settings);
  const fired = useRef(false);
  useEffect(() => { fired.current = false; }, [until]);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);
  const left = Math.max(0, Math.ceil((until - now) / 1000));
  useEffect(() => {
    if (left === 0 && !fired.current) {
      fired.current = true;
      if (settings.restSound) beep();
      if (settings.vibration && navigator.vibrate) navigator.vibrate([200, 100, 200]);
      setTimeout(onDone, 1500);
    }
  }, [left, onDone, settings]);
  const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0');
  return (
    <div className="timer">
      <Icon name="timer" />
      <div className="grow">
        <div className="t">{mm}:{ss}</div>
        <div className="progress"><div style={{ width: `${(1 - left / Math.max(1, total)) * 100}%` }} /></div>
      </div>
      <button className="btn sm" onClick={() => onAdd(15)}>+15s</button>
      <button className="btn sm primary" onClick={onDone}>Pular</button>
    </div>
  );
}

function buildActive(dayId: string): ActiveSession | null {
  const s = getState();
  const day = s.program?.days.find((d) => d.id === dayId);
  if (!s.program || !day) return null;
  const week = currentWeek(s.program);
  return {
    dayId,
    startedAt: new Date().toISOString(),
    swaps: {},
    exercises: day.exercises.map((pe) => {
      const sug = suggest(pe, s.sessions, week);
      const n = setsForWeek(pe, week, s.profile);
      return { exId: pe.exId, sets: Array.from({ length: n }, () => ({ weight: sug.weight, reps: sug.reps, rir: null, done: false, type: 'work' as const })) };
    }),
  };
}

export default function Workout() {
  const nav = useNav();
  const program = useStore((s) => s.program);
  const profile = useStore((s) => s.profile);
  const sessions = useStore((s) => s.sessions);
  const active = useStore((s) => s.active);
  const [rest, setRest] = useState<{ until: number; total: number } | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [rpe, setRpe] = useState(8);
  const [notes, setNotes] = useState('');
  const [cardioDone, setCardioDone] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [, tick] = useState(0);

  const dayId = nav.workoutDay;
  useEffect(() => {
    if (!dayId) return;
    const cur = getState().active;
    if (cur && cur.dayId !== dayId) {
      if (!confirm('Há outro treino em andamento. Descartá-lo e iniciar este?')) { go({ workoutDay: cur.dayId }); return; }
    }
    if (!cur || cur.dayId !== dayId) setState(() => ({ active: buildActive(dayId) }));
  }, [dayId]);
  useEffect(() => { const t = setInterval(() => tick((x) => x + 1), 30000); return () => clearInterval(t); }, []);

  const day = program?.days.find((d) => d.id === active?.dayId);
  const week = program ? currentWeek(program) : null;
  const oldPRs = useMemo(() => prs(sessions), [sessions]);
  if (!program || !day || !active || !week) return <div className="empty">Carregando treino…</div>;

  const planFor = (i: number): PlannedExercise | undefined => day.exercises[i];
  const elapsed = Math.round((Date.now() - new Date(active.startedAt).getTime()) / 60000);
  const totalSets = active.exercises.reduce((a, e) => a + e.sets.length, 0);
  const doneSets = active.exercises.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0);

  const updEx = (i: number, fn: (e: ExerciseLog) => ExerciseLog) =>
    setState((s) => ({ active: s.active && { ...s.active, exercises: s.active.exercises.map((e, k) => (k === i ? fn(e) : e)) } }));
  const updSet = (i: number, j: number, patch: Partial<SetLog>) =>
    updEx(i, (e) => ({ ...e, sets: e.sets.map((x, k) => (k === j ? { ...x, ...patch } : x)) }));

  function toggleDone(i: number, j: number) {
    const set = active!.exercises[i].sets[j];
    const nowDone = !set.done;
    // ao concluir, propaga carga/reps para as próximas séries ainda não feitas
    updEx(i, (e) => ({
      ...e,
      sets: e.sets.map((x, k) => (k === j ? { ...x, done: nowDone } : k > j && !x.done && nowDone ? { ...x, weight: e.sets[j].weight } : x)),
    }));
    if (nowDone) {
      const pe = planFor(i);
      let secs = pe?.rest ?? 90;
      if (pe?.supersetWith) {
        const partnerIdx = active!.exercises.findIndex((e) => e.exId === pe.supersetWith);
        secs = partnerIdx > i ? 15 : secs; // primeiro do bi-set: transição rápida
      }
      setRest({ until: Date.now() + secs * 1000, total: secs });
    }
  }

  function finish(save: boolean) {
    if (save) {
      const log = {
        id: uid(),
        date: new Date().toISOString(),
        dayId: day!.id,
        dayName: day!.name,
        week: week!.week,
        exercises: active!.exercises.map((e) => ({ ...e, sets: e.sets.filter((s) => s.done) })).filter((e) => e.sets.length),
        durationMin: Math.max(1, elapsed),
        rpe,
        notes,
        cardioMin: cardioDone ? day!.cardio?.minutes : undefined,
      };
      setState((s) => ({ sessions: [...s.sessions, log], active: null }));
    } else {
      setState(() => ({ active: null }));
    }
    setFinishing(false);
    go({ screen: null, workoutDay: null, tab: 'home' });
  }

  // PRs da sessão atual
  const newPRs = active.exercises.flatMap((e) => {
    const best = e.sets.filter((s) => s.done && s.weight > 0).reduce((m, s) => Math.max(m, e1rm(s.weight, s.reps, s.rir)), 0);
    const old = oldPRs.get(e.exId)?.e1rm || 0;
    return best > old && old > 0 ? [{ exId: e.exId, value: best, old }] : [];
  });

  return (
    <div>
      <div className="topbar">
        <button className="back" onClick={() => go({ screen: null })}><Icon name="back" size={18} /> Sair</button>
        <div className="center"><b>{day.name}</b><div className="muted">{elapsed} min · {doneSets}/{totalSets} séries</div></div>
        <button className="btn sm primary" onClick={() => setFinishing(true)}>Finalizar</button>
      </div>
      <div className="progress mb"><div style={{ width: `${(doneSets / Math.max(1, totalSets)) * 100}%` }} /></div>
      {week.deload && <div className="info-box mb"><b>Semana de deload:</b> metade das séries e ~10% menos carga. Treine leve e saia descansado.</div>}

      {active.exercises.map((e, i) => {
        const ex = getEx(e.exId);
        const pe = planFor(i);
        const unit = repUnit(e.exId);
        const plannedSame = pe && pe.exId === e.exId ? pe : pe ? { ...pe, exId: e.exId } : undefined;
        const sug = plannedSame ? suggest(plannedSame, sessions, week) : null;
        const partner = pe?.supersetWith ? active.exercises.findIndex((x) => x.exId === pe.supersetWith) : -1;
        const allDone = e.sets.length > 0 && e.sets.every((s) => s.done);
        const note = getState().exerciseNotes[e.exId];
        return (
          <div className="card" key={i} style={allDone ? { borderColor: 'var(--ok)' } : undefined}>
            {partner > i && <div className="superset-tag mb">BI-SET com o próximo exercício — alterne as séries</div>}
            <div className="row" onClick={() => openExercise(e.exId, { dayId: day.id, idx: i })} style={{ cursor: 'pointer' }}>
              <Thumb ex={ex} />
              <div className="grow">
                <b>{ex?.name}</b>
                {pe && <div className="muted">{e.sets.length} × {pe.reps[0]}–{pe.reps[1]}{unit !== 'reps' ? ` ${unit}` : ''} · RIR {week.rir} · descanso {Math.round(pe.rest / 15) * 15}s</div>}
              </div>
              <Icon name="info" />
            </div>
            {sug && <div className={sug.kind === 'up' ? 'info-box mt' : 'muted mt'} style={{ fontSize: 13 }}>{sug.kind === 'up' ? '📈 ' : '💡 '}{sug.message}</div>}
            {pe?.warmup && <div className="muted mt" style={{ fontSize: 13 }}>🔥 {pe.warmup}</div>}
            {pe?.note && <div className="muted" style={{ fontSize: 13 }}>🎯 {pe.note}</div>}
            {note && <div className="muted" style={{ fontSize: 13 }}>📝 {note}</div>}
            <div className="setgrid mt">
              <div className="h">#</div><div className="h">{ex?.bodyweight ? '+kg' : 'kg'}</div><div className="h">{unit === 'reps' ? 'reps' : unit}</div><div className="h">RIR</div><div className="h">✓</div>
              {e.sets.map((s, j) => (
                <div key={j} style={{ display: 'contents' }} className={s.done ? 'donecell' : ''}>
                  <div className="n">{j + 1}</div>
                  <input type="number" inputMode="decimal" step="0.5" value={s.weight || ''} placeholder="0" onChange={(ev) => updSet(i, j, { weight: Number(ev.target.value) })} />
                  <input type="number" inputMode="numeric" value={s.reps || ''} placeholder="0" onChange={(ev) => updSet(i, j, { reps: Number(ev.target.value) })} />
                  <select value={s.rir ?? ''} onChange={(ev) => updSet(i, j, { rir: ev.target.value === '' ? null : Number(ev.target.value) })} style={{ padding: '9px 4px', fontSize: 15 }}>
                    <option value="">–</option>{[0, 1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r}{r === 5 ? '+' : ''}</option>)}
                  </select>
                  <button className={`check ${s.done ? 'on' : ''}`} onClick={() => toggleDone(i, j)} aria-label="Concluir série"><Icon name="check" /></button>
                </div>
              ))}
            </div>
            <div className="row mt">
              <button className="btn sm" onClick={() => updEx(i, (x) => ({ ...x, sets: [...x.sets, { ...(x.sets[x.sets.length - 1] || { weight: 0, reps: 0, rir: null, type: 'work' }), done: false }] }))}><Icon name="plus" size={14} /> Série</button>
              {e.sets.length > 1 && <button className="btn sm ghost" onClick={() => updEx(i, (x) => ({ ...x, sets: x.sets.slice(0, -1) }))}><Icon name="minus" size={14} /> Série</button>}
              <div className="grow" />
              <button className="btn sm ghost" onClick={() => openExercise(e.exId, { dayId: day.id, idx: i })}><Icon name="swap" size={14} /> Trocar</button>
            </div>
          </div>
        );
      })}

      {day.cardio && (
        <div className="card">
          <div className="row">
            <button className={`check ${cardioDone ? 'on' : ''}`} onClick={() => setCardioDone(!cardioDone)}><Icon name="check" /></button>
            <div><b>{cardioLabel(day.cardio.type)} · {day.cardio.minutes} min</b><div className="muted">{day.cardio.intensity}</div></div>
          </div>
        </div>
      )}

      <button className="btn primary block" onClick={() => setFinishing(true)}>Finalizar treino</button>
      <div className="muted center mt">O progresso fica salvo mesmo se você fechar o app.</div>

      {rest && <RestTimer until={rest.until} total={rest.total} onDone={() => setRest(null)} onAdd={(s) => setRest((r) => r && { until: r.until + s * 1000, total: r.total + s })} />}

      <Sheet open={finishing} onClose={() => setFinishing(false)} title="Finalizar treino">
        <div className="grid3">
          <div className="stat"><div className="v">{elapsed}′</div><div className="l">duração</div></div>
          <div className="stat"><div className="v">{doneSets}</div><div className="l">séries feitas</div></div>
          <div className="stat"><div className="v">{Math.round(active.exercises.reduce((a, e) => a + e.sets.filter((s) => s.done).reduce((b, s) => b + s.weight * s.reps, 0), 0))}</div><div className="l">kg movidos</div></div>
        </div>
        {newPRs.length > 0 && (
          <div className="info-box mt">
            <b>🏆 Novos recordes!</b>
            <ul className="list">{newPRs.map((p) => <li key={p.exId}>{getEx(p.exId)?.name}: 1RM est. {p.value.toFixed(1)} kg (antes {p.old.toFixed(1)})</li>)}</ul>
          </div>
        )}
        <h3 className="mt">Esforço geral da sessão (PSE): {rpe}/10</h3>
        <input type="range" min={1} max={10} value={rpe} onChange={(e) => setRpe(Number(e.target.value))} />
        <label className="field mt">Como foi? (sono, energia, dores)
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        {doneSets < totalSets && <p className="muted">{totalSets - doneSets} série(s) não marcada(s) serão ignoradas.</p>}
        <button className="btn primary block" onClick={() => finish(true)} disabled={doneSets === 0}>Salvar treino</button>
        <button className="btn danger block mt" onClick={() => (confirmDiscard ? finish(false) : setConfirmDiscard(true))}>
          {confirmDiscard ? 'Toque de novo para descartar' : 'Descartar'}
        </button>
        {profile && null}
      </Sheet>
    </div>
  );
}
