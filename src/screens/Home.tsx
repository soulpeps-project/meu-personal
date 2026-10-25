import { useMemo, useState } from 'react';
import { useStore, setState, todayISO, uid } from '../lib/store';
import { go } from '../lib/nav';
import { currentWeek, getEx, setsForWeek } from '../lib/generator';
import { macros } from '../lib/nutrition';
import { hardSets, sessionVolume } from '../lib/progression';
import { WEEKDAYS, WEEKDAYS_FULL } from '../lib/catalog';
import { Icon, Thumb, fmtDateLong } from '../components/ui';
import { ARTICLES } from '../data/articles';
import { cardioLabel } from '../lib/generator';

function startOfWeek(d = new Date()) {
  const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x;
}

export default function Home() {
  const profile = useStore((s) => s.profile)!;
  const program = useStore((s) => s.program);
  const sessions = useStore((s) => s.sessions);
  const active = useStore((s) => s.active);
  const checklist = useStore((s) => s.checklist);
  const [weightInput, setWeightInput] = useState<string>('');
  const today = new Date();
  const wd = today.getDay();
  const week = program ? currentWeek(program) : null;
  const todayDay = program?.days.find((d) => d.weekday === wd);
  const doneToday = sessions.some((s) => s.date.slice(0, 10) === todayISO());
  const nextDay = useMemo(() => {
    if (!program) return null;
    for (let i = 1; i <= 7; i++) {
      const d = program.days.find((x) => x.weekday === (wd + i) % 7);
      if (d) return { d, inDays: i };
    }
    return null;
  }, [program, wd]);

  const sow = startOfWeek();
  const weekSessions = sessions.filter((s) => new Date(s.date) >= sow);
  const doneWeekdays = new Set(weekSessions.map((s) => new Date(s.date).getDay()));
  const m = macros(profile);

  // sequência de semanas com pelo menos 1 treino
  let streak = 0;
  for (let i = 0; i < 52; i++) {
    const a = new Date(sow); a.setDate(a.getDate() - 7 * i);
    const b = new Date(a); b.setDate(b.getDate() + 7);
    if (sessions.some((s) => { const t = new Date(s.date); return t >= a && t < b; })) streak++;
    else if (i > 0) break;
  }

  const key = todayISO();
  const habits = [
    { id: 'protein', l: `Proteína ~${m.protein} g` },
    { id: 'water', l: `Água ${m.waterL} L` },
    { id: 'sleep', l: `Dormir 7–9 h` },
    { id: 'creatine', l: 'Creatina 3–5 g' },
    { id: 'steps', l: profile.goal === 'fat_loss' ? '8–10 mil passos' : '7 mil+ passos' },
  ];
  const checked = checklist[key] || [];
  const toggleHabit = (id: string) => setState((s) => ({ checklist: { ...s.checklist, [key]: checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id] } }));
  const tip = ARTICLES.length ? ARTICLES[(today.getDate() + today.getMonth()) % ARTICLES.length] : null;

  const day = active ? program?.days.find((d) => d.id === active.dayId) : todayDay && !doneToday ? todayDay : undefined;

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="muted" style={{ textTransform: 'capitalize' }}>{fmtDateLong(todayISO())}</div>
          <div className="title">Olá{profile.name ? `, ${profile.name}` : ''} 👋</div>
        </div>
        <button className="iconbtn" onClick={() => go({ tab: 'more', screen: 'profile' })} aria-label="Perfil"><Icon name="user" /></button>
      </div>

      {!program ? (
        <div className="card hero">
          <h2>Sem programa ativo</h2>
          <button className="btn primary" onClick={() => go({ tab: 'plan', screen: 'regenerate' })}>Gerar treino</button>
        </div>
      ) : day ? (
        <div className="card hero">
          <div className="row between">
            <span className="tag accent">{active ? 'Em andamento' : 'Treino de hoje'}</span>
            <span className="muted">~{day.estMinutes} min</span>
          </div>
          <h2 className="mt">{day.name}</h2>
          <p className="muted">{day.focus}</p>
          <div className="col" style={{ gap: 0 }}>
            {day.exercises.slice(0, 4).map((pe, i) => {
              const ex = getEx(pe.exId);
              return (
                <div key={i} className="row" style={{ padding: '6px 0' }}>
                  <Thumb ex={ex} />
                  <div className="grow"><b>{ex?.name}</b><div className="muted">{week ? setsForWeek(pe, week, profile) : pe.sets} × {pe.reps[0]}–{pe.reps[1]} · RIR {week?.rir}</div></div>
                </div>
              );
            })}
            {day.exercises.length > 4 && <div className="muted">+ {day.exercises.length - 4} exercício(s)</div>}
            {day.cardio && <div className="muted mt">+ {day.cardio.minutes} min de {cardioLabel(day.cardio.type).toLowerCase()}</div>}
          </div>
          <button className="btn primary block mt" onClick={() => go({ screen: 'workout', workoutDay: day.id })}>
            <Icon name="play" fill /> {active ? 'Continuar treino' : 'Iniciar treino'}
          </button>
        </div>
      ) : (
        <div className="card hero">
          <span className="tag">{doneToday ? 'Treino concluído ✅' : 'Dia de descanso'}</span>
          <h2 className="mt">{doneToday ? 'Mandou bem hoje!' : 'Recupere-se'}</h2>
          <p className="muted">{doneToday ? 'Agora é comer bem, hidratar e dormir. É no descanso que o músculo cresce.' : 'Descanso faz parte do treino. Uma caminhada leve ou mobilidade ajudam na recuperação.'}</p>
          {nextDay && (
            <div className="row between mt">
              <div><div className="muted">Próximo: {nextDay.inDays === 1 ? 'amanhã' : WEEKDAYS_FULL[nextDay.d.weekday]}</div><b>{nextDay.d.name}</b></div>
              <button className="btn sm" onClick={() => go({ screen: 'workout', workoutDay: nextDay.d.id })}>Treinar agora</button>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <div className="row between mb"><h3 style={{ margin: 0 }}>Esta semana</h3><span className="muted">{weekSessions.length}/{program?.days.length ?? 0} treinos</span></div>
        <div className="week">
          {[1, 2, 3, 4, 5, 6, 0].map((d) => {
            const date = new Date(sow); date.setDate(sow.getDate() + ((d + 6) % 7));
            const train = program?.days.some((x) => x.weekday === d);
            return (
              <div key={d} className={`d ${train ? 'train' : ''} ${doneWeekdays.has(d) ? 'done' : ''} ${d === wd ? 'today' : ''}`}>
                {WEEKDAYS[d]}<b>{date.getDate()}</b>
              </div>
            );
          })}
        </div>
      </div>

      {week && program && (
        <div className="card tap" onClick={() => go({ tab: 'plan' })}>
          <div className="row between">
            <h3 style={{ margin: 0 }}>Semana {week.week} de {program.weeks.length} · {week.label}</h3>
            <span className={`tag ${week.deload ? 'blue' : 'accent'}`}>RIR {week.rir}</span>
          </div>
          <div className="progress mt"><div style={{ width: `${(week.week / program.weeks.length) * 100}%` }} /></div>
          <p className="muted mt" style={{ marginBottom: 0 }}>{week.notes}</p>
        </div>
      )}

      <div className="grid3">
        <div className="stat"><div className="v">{streak}</div><div className="l">semanas seguidas</div></div>
        <div className="stat"><div className="v">{weekSessions.reduce((a, s) => a + hardSets(s), 0)}</div><div className="l">séries na semana</div></div>
        <div className="stat"><div className="v">{Math.round(weekSessions.reduce((a, s) => a + sessionVolume(s), 0) / 1000 * 10) / 10}t</div><div className="l">tonelagem</div></div>
      </div>

      <div className="card mt">
        <div className="row between"><h3 style={{ margin: 0 }}>Hábitos de hoje</h3><span className="muted">{checked.length}/{habits.length}</span></div>
        <div className="chips mt">
          {habits.map((h) => (
            <button key={h.id} className={`chip ${checked.includes(h.id) ? 'on' : ''}`} onClick={() => toggleHabit(h.id)}>
              {checked.includes(h.id) && <Icon name="check" size={14} />}{h.l}
            </button>
          ))}
        </div>
        <div className="row mt">
          <input type="number" inputMode="decimal" step="0.1" placeholder="Peso de hoje (kg)" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} />
          <button className="btn" disabled={!weightInput} onClick={() => {
            const w = Number(weightInput);
            setState((s) => ({
              measurements: [...s.measurements.filter((x) => !(x.date === key && Object.keys(x).length <= 3)), { id: uid(), date: key, weightKg: w }],
              profile: s.profile && { ...s.profile, weightKg: w },
            }));
            setWeightInput('');
          }}>Salvar</button>
        </div>
        <p className="muted mt" style={{ marginBottom: 0 }}>Pese-se de manhã, em jejum, após ir ao banheiro. Olhe a média semanal, não o dia.</p>
      </div>

      <div className="card tap" onClick={() => go({ tab: 'more', screen: 'nutrition' })}>
        <div className="row between"><h3 style={{ margin: 0 }}>Nutrição do dia</h3><Icon name="food" /></div>
        <div className="grid3 mt">
          <div><div className="kpi" style={{ fontSize: 24 }}>{m.kcal}</div><div className="muted">kcal</div></div>
          <div><div className="kpi" style={{ fontSize: 24 }}>{m.protein}g</div><div className="muted">proteína</div></div>
          <div><div className="kpi" style={{ fontSize: 24 }}>{m.carbs}g</div><div className="muted">carbo · {m.fat}g gord.</div></div>
        </div>
      </div>

      {tip && (
        <div className="card tap" onClick={() => go({ tab: 'more', screen: 'learn', article: tip.id })}>
          <span className="tag blue">Dica do dia · {tip.category}</span>
          <h3 className="mt">{tip.title}</h3>
          <p className="muted" style={{ marginBottom: 0 }}>{tip.summary}</p>
        </div>
      )}
    </div>
  );
}
