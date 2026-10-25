import { useState } from 'react';
import { useNav, closeExercise, openExercise } from '../lib/nav';
import { getEx, alternatives, isAvailable, isSafe } from '../lib/generator';
import { setState, useStore, getState } from '../lib/store';
import { MUSCLE_SHORT, EQUIPMENT_LABEL, INJURY_LABEL, PATTERN_LABEL } from '../lib/catalog';
import { history, bestSet, e1rm } from '../lib/progression';
import { ExerciseMedia, Icon, LineChart, Sheet, Thumb, youtubeEmbed, youtubeSearch, fmtDate } from './ui';

export default function ExerciseSheet() {
  const nav = useNav();
  const ex = nav.exercise ? getEx(nav.exercise) : undefined;
  const profile = useStore((s) => s.profile);
  const sessions = useStore((s) => s.sessions);
  const custom = useStore((s) => (nav.exercise ? s.customVideos[nav.exercise] : undefined));
  const note = useStore((s) => (nav.exercise ? s.exerciseNotes[nav.exercise] : undefined));
  const [videoInput, setVideoInput] = useState('');
  const [showSwap, setShowSwap] = useState(false);
  if (!ex) return null;

  const hist = history(ex.id, sessions);
  const points = hist.map((h) => { const b = bestSet(h.log.sets); return { x: fmtDate(h.date), y: b ? Math.round(e1rm(b.weight, b.reps, b.rir) * 10) / 10 : 0 }; }).filter((p) => p.y > 0);
  const embed = custom ? youtubeEmbed(custom) : null;
  const fav = profile?.favorites.includes(ex.id);
  const disliked = profile?.dislikes.includes(ex.id);
  const ctx = nav.exerciseCtx;
  const unavailable = profile && !isAvailable(ex, profile.equipment);
  const unsafe = profile && !isSafe(ex, profile.injuries);

  const toggleList = (key: 'favorites' | 'dislikes') => setState((s) => {
    if (!s.profile) return {};
    const list = s.profile[key];
    return { profile: { ...s.profile, [key]: list.includes(ex.id) ? list.filter((x) => x !== ex.id) : [...list, ex.id] } };
  });

  function swapTo(newId: string) {
    if (!ctx?.dayId || ctx.idx == null) return;
    const st = getState();
    if (st.active && st.active.dayId === ctx.dayId) {
      // troca dentro do treino em andamento
      setState((s) => ({
        active: s.active && { ...s.active, exercises: s.active.exercises.map((e, i) => (i === ctx.idx ? { ...e, exId: newId, sets: e.sets.map((x) => ({ ...x, done: false })) } : e)) },
      }));
    }
    setState((s) => ({
      program: s.program && {
        ...s.program,
        days: s.program.days.map((d) => d.id !== ctx.dayId ? d : {
          ...d, exercises: d.exercises.map((pe, i) => (i === ctx.idx ? { ...pe, exId: newId, supersetWith: pe.supersetWith } : pe.supersetWith === ex!.id ? { ...pe, supersetWith: newId } : pe)),
        }),
      },
    }));
    setShowSwap(false);
    openExercise(newId, ctx);
  }

  return (
    <Sheet open onClose={() => { closeExercise(); setShowSwap(false); }}>
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div className="grow">
          <h2 style={{ marginBottom: 4 }}>{ex.name}</h2>
          <div className="muted">{ex.nameEn} · {PATTERN_LABEL[ex.pattern]}</div>
        </div>
        <button className="iconbtn" onClick={closeExercise} aria-label="Fechar"><Icon name="x" size={18} /></button>
      </div>
      <div className="row wrap mt">
        {ex.primary.map((m) => <span key={m} className="tag accent">{MUSCLE_SHORT[m]}</span>)}
        {ex.secondary.map((m) => <span key={m} className="tag">{MUSCLE_SHORT[m]}</span>)}
        {ex.stretch && <span className="tag blue">Ênfase no alongamento</span>}
        <span className="tag">{ex.mechanic === 'compound' ? 'Multiarticular' : 'Isolado'}</span>
        <span className="tag">Nível {ex.level}</span>
      </div>
      {(unavailable || unsafe) && (
        <div className="warn-box mt">
          {unavailable && <div>Requer equipamento que não está marcado na sua academia.</div>}
          {unsafe && <div>Atenção: pode agravar {ex.avoidIf.filter((i) => profile!.injuries.includes(i)).map((i) => INJURY_LABEL[i]).join(', ')}.</div>}
        </div>
      )}

      <div className="mt"><ExerciseMedia ex={ex} /></div>

      {embed ? (
        <div className="video mt"><iframe src={embed} title={ex.name} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
      ) : null}
      <div className="row mt">
        <a className="btn grow" href={youtubeSearch(ex.video)} target="_blank" rel="noreferrer"><Icon name="video" /> Ver vídeos de execução</a>
      </div>
      <details className="mt">
        <summary className="muted" style={{ cursor: 'pointer' }}>{custom ? 'Trocar vídeo fixado' : 'Fixar um vídeo do YouTube neste exercício'}</summary>
        <div className="row mt">
          <input type="url" placeholder="Cole o link do vídeo" value={videoInput} onChange={(e) => setVideoInput(e.target.value)} />
          <button className="btn sm" onClick={() => { if (youtubeEmbed(videoInput)) { setState((s) => ({ customVideos: { ...s.customVideos, [ex.id]: videoInput } })); setVideoInput(''); } else alert('Link do YouTube inválido'); }}>Salvar</button>
        </div>
        {custom && <button className="btn sm ghost mt" onClick={() => setState((s) => { const c = { ...s.customVideos }; delete c[ex.id]; return { customVideos: c }; })}>Remover vídeo fixado</button>}
      </details>

      <h3 className="mt2">Como executar</h3>
      <ol className="steps">{ex.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      <h3 className="mt">Dicas de ouro</h3>
      <ul className="list">{ex.cues.map((s, i) => <li key={i}>{s}</li>)}</ul>
      <h3 className="mt">Erros comuns</h3>
      <ul className="list">{ex.mistakes.map((s, i) => <li key={i}>{s}</li>)}</ul>
      <h3 className="mt">Respiração</h3>
      <p>{ex.breathing}</p>

      <div className="grid3 mt">
        <div className="stat"><div className="v">{ex.reps[0]}–{ex.reps[1]}</div><div className="l">reps sugeridas</div></div>
        <div className="stat"><div className="v">{Math.round(ex.rest / 60 * 10) / 10}′</div><div className="l">descanso</div></div>
        <div className="stat"><div className="v">{ex.increment || '—'}</div><div className="l">incremento (kg)</div></div>
      </div>
      <p className="muted mt">Equipamento: {ex.equipment.map((e) => EQUIPMENT_LABEL[e]).join(' + ')}
        {ex.avoidIf.length > 0 && <> · Cautela com: {ex.avoidIf.map((i) => INJURY_LABEL[i]).join(', ')}</>}</p>

      {points.length > 0 && (
        <>
          <h3 className="mt2">Sua evolução (1RM estimado)</h3>
          <LineChart points={points} unit=" kg" />
          <table className="t mt">
            <thead><tr><th>Data</th><th>Séries</th></tr></thead>
            <tbody>{[...hist].reverse().slice(0, 6).map((h) => (
              <tr key={h.date}><td>{fmtDate(h.date)}</td><td>{h.log.sets.filter((s) => s.done).map((s) => `${s.weight}×${s.reps}`).join(' · ')}</td></tr>
            ))}</tbody>
          </table>
        </>
      )}

      <label className="field mt2">Suas anotações (regulagem do aparelho, pegada…)
        <textarea value={note || ''} onChange={(e) => setState((s) => ({ exerciseNotes: { ...s.exerciseNotes, [ex.id]: e.target.value } }))} placeholder="Ex.: banco no furo 4, pegada 1 palmo além do ombro" />
      </label>

      {profile && (
        <div className="row wrap">
          <button className={`btn sm ${fav ? 'primary' : ''}`} onClick={() => toggleList('favorites')}><Icon name="star" size={16} /> {fav ? 'Favorito' : 'Favoritar'}</button>
          <button className={`btn sm ${disliked ? 'danger' : ''}`} onClick={() => toggleList('dislikes')}>{disliked ? 'Evitando' : 'Não gosto / evitar'}</button>
          {ctx?.dayId && <button className="btn sm" onClick={() => setShowSwap(!showSwap)}><Icon name="swap" size={16} /> Trocar exercício</button>}
        </div>
      )}
      {showSwap && profile && (
        <div className="card mt">
          <h3>Alternativas com seus equipamentos</h3>
          {alternatives(ex.id, profile).map((a) => (
            <div key={a.id} className="exrow" onClick={() => swapTo(a.id)}>
              <Thumb ex={a} />
              <div className="grow"><b>{a.name}</b><div className="muted">{PATTERN_LABEL[a.pattern]}{a.stretch ? ' · alongamento' : ''}</div></div>
              <Icon name="swap" />
            </div>
          ))}
        </div>
      )}
    </Sheet>
  );
}
