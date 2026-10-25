import { useMemo, useState } from 'react';
import { EXERCISES, type Muscle } from '../data/exercises';
import { ARTICLES } from '../data/articles';
import { useStore } from '../lib/store';
import { isAvailable } from '../lib/generator';
import { openExercise, go, useNav } from '../lib/nav';
import { MUSCLE_SHORT, PRIORITY_OPTIONS } from '../lib/catalog';
import { Thumb, Markdown, Icon } from '../components/ui';

export function Library() {
  const profile = useStore((s) => s.profile);
  const [q, setQ] = useState('');
  const [muscle, setMuscle] = useState<Muscle | ''>('');
  const [onlyMine, setOnlyMine] = useState(true);
  const list = useMemo(() => EXERCISES.filter((e) =>
    (!q || (e.name + ' ' + e.nameEn).toLowerCase().includes(q.toLowerCase()))
    && (!muscle || e.primary.includes(muscle))
    && (!onlyMine || !profile || isAvailable(e, profile.equipment)),
  ), [q, muscle, onlyMine, profile]);
  return (
    <div>
      <input type="text" placeholder="Buscar exercício…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="row mt wrap">
        <select value={muscle} onChange={(e) => setMuscle(e.target.value as Muscle | '')} style={{ flex: 1 }}>
          <option value="">Todos os músculos</option>
          {PRIORITY_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          <option value="frontDelts">Ombro anterior</option><option value="obliques">Oblíquos</option><option value="lowerBack">Lombar</option>
        </select>
        <button className={`chip ${onlyMine ? 'on' : ''}`} onClick={() => setOnlyMine(!onlyMine)}>Só da minha academia</button>
      </div>
      <p className="muted mt">{list.length} exercícios</p>
      <div className="card">
        {list.map((e) => (
          <div key={e.id} className="exrow" onClick={() => openExercise(e.id)}>
            <Thumb ex={e} />
            <div className="grow">
              <b>{e.name}</b>
              <div className="muted">{e.primary.map((m) => MUSCLE_SHORT[m]).join(', ')}{e.stretch ? ' · alongamento' : ''}</div>
            </div>
            {profile?.favorites.includes(e.id) && <Icon name="star" size={16} fill />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Learn() {
  const nav = useNav();
  const [cat, setCat] = useState('');
  const art = ARTICLES.find((a) => a.id === nav.article);
  if (art) {
    return (
      <div>
        <button className="back" onClick={() => go({ article: null })}><Icon name="back" size={18} /> Artigos</button>
        <div className="mt"><span className="tag blue">{art.category} · {art.minutes} min</span></div>
        <h1 className="mt">{art.title}</h1>
        <p className="muted">{art.summary}</p>
        <div className="card"><Markdown text={art.body} /></div>
        {art.sources.length > 0 && (
          <div className="card">
            <h3>Fontes</h3>
            <ul className="list">{art.sources.map((s, i) => <li key={i}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>)}</ul>
          </div>
        )}
      </div>
    );
  }
  const cats = [...new Set(ARTICLES.map((a) => a.category))];
  return (
    <div>
      <p className="muted">Ciência do treino explicada de forma simples, com fontes.</p>
      <div className="chips mb">
        <button className={`chip ${!cat ? 'on' : ''}`} onClick={() => setCat('')}>Todos</button>
        {cats.map((c) => <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      {ARTICLES.filter((a) => !cat || a.category === cat).map((a) => (
        <div key={a.id} className="card tap" onClick={() => go({ article: a.id })}>
          <div className="row between"><span className="tag blue">{a.category}</span><span className="muted">{a.minutes} min</span></div>
          <h3 className="mt">{a.title}</h3>
          <p className="muted" style={{ marginBottom: 0 }}>{a.summary}</p>
        </div>
      ))}
    </div>
  );
}
