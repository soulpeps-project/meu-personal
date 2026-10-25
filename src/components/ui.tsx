import { useEffect, useState, type ReactNode } from 'react';
import type { Exercise } from '../data/exercises';

// --------------------------------------------------------------------------- ícones
const P: Record<string, string> = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  plan: 'M4 5h16M4 12h16M4 19h10',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  chat: 'M4 5h16v11H8l-4 4z',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  play: 'M7 4l13 8-13 8z',
  check: 'M5 12l5 5 9-10',
  x: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  swap: 'M7 7h13l-4-4M17 17H4l4 4',
  back: 'M15 18l-6-6 6-6',
  timer: 'M12 8v5l3 2M9 2h6M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  video: 'M3 6h12v12H3zM15 10l6-3v10l-6-3z',
  book: 'M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6M20 4v14h-6',
  food: 'M7 3v8a2 2 0 0 0 2 2v8M5 3v5M9 3v5M17 3c-2 0-3 3-3 6s1 4 3 4v8',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  dumbbell: 'M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12',
  tool: 'M14 7l3-3 3 3-3 3M3 21l9-9M12 12l2-2',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  fire: 'M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-4 5-4 7-1-1-2-2-2-4-2 2-3 5-3 9 0 4 3 7 7 7z',
  star: 'M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.3L12 17.5 6.5 20.4l1-6.3L3 9.7l6.2-.9z',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 11v6M12 7h.01',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6',
  ext: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  download: 'M12 4v12M6 11l6 6 6-6M4 20h16',
  upload: 'M12 20V8M6 13l6-6 6 6M4 4h16',
};

export function Icon({ name, size = 20, fill = false }: { name: keyof typeof P | string; size?: number; fill?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={P[name] || P.info} />
    </svg>
  );
}

// --------------------------------------------------------------------------- sheet
export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal>
        <div className="grab" />
        {title && (
          <div className="row between mb">
            <h2 style={{ margin: 0 }}>{title}</h2>
            <button className="iconbtn" onClick={onClose} aria-label="Fechar"><Icon name="x" size={18} /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------- segmented
export function Seg<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { v: T; l: string }[] }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.v} className={value === o.v ? 'on' : ''} onClick={() => onChange(o.v)}>{o.l}</button>
      ))}
    </div>
  );
}

export function Chips<T extends string | number>({ options, value, onChange, multi = true }: {
  options: { v: T; l: string }[]; value: T[]; onChange: (v: T[]) => void; multi?: boolean;
}) {
  return (
    <div className="chips">
      {options.map((o) => {
        const on = value.includes(o.v);
        return (
          <button key={String(o.v)} type="button" className={`chip ${on ? 'on' : ''}`}
            onClick={() => onChange(multi ? (on ? value.filter((x) => x !== o.v) : [...value, o.v]) : [o.v])}>
            {on && <Icon name="check" size={14} />}{o.l}
          </button>
        );
      })}
    </div>
  );
}

export function Option({ on, onClick, emoji, title, desc }: { on: boolean; onClick: () => void; emoji?: string; title: string; desc?: string }) {
  return (
    <button type="button" className={`option ${on ? 'on' : ''}`} onClick={onClick}>
      {emoji && <span className="emoji">{emoji}</span>}
      <span><b>{title}</b>{desc && <small>{desc}</small>}</span>
    </button>
  );
}

export function NumField({ label, value, onChange, step = 1, min, max, suffix }: {
  label: string; value: number | undefined; onChange: (v: number | undefined) => void; step?: number; min?: number; max?: number; suffix?: string;
}) {
  return (
    <label className="field">
      {label}{suffix ? ` (${suffix})` : ''}
      <input type="number" inputMode="decimal" value={value ?? ''} step={step} min={min} max={max}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
    </label>
  );
}

// --------------------------------------------------------------------------- mídia dos exercícios
const FEDB = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

export function ExerciseMedia({ ex, animate = true }: { ex: Exercise; animate?: boolean }) {
  const [frame, setFrame] = useState(0);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!animate || !ex.fedb) return;
    const t = setInterval(() => setFrame((f) => 1 - f), 1100);
    return () => clearInterval(t);
  }, [animate, ex.fedb]);
  if (!ex.fedb || failed) return <div className="media ph"><Icon name="dumbbell" size={48} /></div>;
  return (
    <div className="media">
      <img src={`${FEDB}${ex.fedb}/0.jpg`} alt={`${ex.name} — posição inicial`} style={{ opacity: frame === 0 ? 1 : 0 }} onError={() => setFailed(true)} />
      <img src={`${FEDB}${ex.fedb}/1.jpg`} alt={`${ex.name} — posição final`} style={{ opacity: frame === 1 ? 1 : 0 }} />
      <span className="badge">{frame === 0 ? 'Início' : 'Fim'} do movimento</span>
    </div>
  );
}

export function Thumb({ ex }: { ex?: Exercise }) {
  const [failed, setFailed] = useState(false);
  if (!ex?.fedb || failed) return <div className="thumb ph"><Icon name="dumbbell" size={24} /></div>;
  return <div className="thumb"><img loading="lazy" src={`${FEDB}${ex.fedb}/0.jpg`} alt="" onError={() => setFailed(true)} /></div>;
}

export function youtubeSearch(q: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

export function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}

// --------------------------------------------------------------------------- markdown simples
function inline(s: string): ReactNode[] {
  const parts = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <b key={i}>{p.slice(2, -2)}</b>;
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <i key={i}>{p.slice(1, -1)}</i>;
    const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a key={i} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    return p;
  });
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, '').split('\n');
  const out: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let para: string[] = [];
  const flushPara = () => { if (para.length) { out.push(<p key={out.length}>{inline(para.join(' '))}</p>); para = []; } };
  const flushList = () => {
    if (list) {
      const items = list.items.map((it, i) => <li key={i}>{inline(it)}</li>);
      out.push(list.ordered ? <ol key={out.length}>{items}</ol> : <ul key={out.length}>{items}</ul>);
      list = null;
    }
  };
  for (const raw of lines) {
    const l = raw.trimEnd();
    const h = l.match(/^(#{1,4})\s+(.*)/);
    const ul = l.match(/^\s*[-*•]\s+(.*)/);
    const ol = l.match(/^\s*\d+[.)]\s+(.*)/);
    if (h) { flushPara(); flushList(); out.push(h[1].length <= 2 ? <h3 key={out.length}>{inline(h[2])}</h3> : <h4 key={out.length}>{inline(h[2])}</h4>); }
    else if (ul || ol) {
      flushPara();
      const ordered = !!ol;
      if (!list || list.ordered !== ordered) { flushList(); list = { ordered, items: [] }; }
      list.items.push((ul || ol)![1]);
    } else if (!l.trim()) { flushPara(); flushList(); }
    else { flushList(); para.push(l.trim()); }
  }
  flushPara(); flushList();
  return <div className="md">{out}</div>;
}

// --------------------------------------------------------------------------- gráfico de linha
export function LineChart({ points, height = 160, unit = '', color = 'var(--accent)' }: {
  points: { x: string; y: number }[]; height?: number; unit?: string; color?: string;
}) {
  if (points.length < 2) return <div className="empty">Registre pelo menos 2 pontos para ver o gráfico.</div>;
  const w = 600, h = height, pad = { l: 40, r: 12, t: 12, b: 24 };
  const ys = points.map((p) => p.y);
  let min = Math.min(...ys), max = Math.max(...ys);
  if (max - min < 1e-6) { max += 1; min -= 1; }
  const span = max - min; min -= span * 0.1; max += span * 0.1;
  const X = (i: number) => pad.l + (i / (points.length - 1)) * (w - pad.l - pad.r);
  const Y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (h - pad.t - pad.b);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ');
  const area = `${d} L${X(points.length - 1)},${h - pad.b} L${X(0)},${h - pad.b} Z`;
  const ticks = [min + (max - min) * 0.15, (min + max) / 2, max - (max - min) * 0.15];
  const fmt = (v: number) => (Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(1));
  const labelIdx = points.length <= 6 ? points.map((_, i) => i) : [0, Math.floor(points.length / 2), points.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role="img">
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={pad.l} x2={w - pad.r} y1={Y(t)} y2={Y(t)} stroke="var(--line)" strokeDasharray="3 4" />
          <text x={pad.l - 6} y={Y(t) + 4} fontSize="11" textAnchor="end" fill="var(--muted)">{fmt(t)}</text>
        </g>
      ))}
      <path d={area} fill={color} opacity={0.12} />
      <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
      {points.map((p, i) => <circle key={i} cx={X(i)} cy={Y(p.y)} r={3.5} fill={color}><title>{`${p.x}: ${fmt(p.y)}${unit}`}</title></circle>)}
      {labelIdx.map((i) => (
        <text key={i} x={X(i)} y={h - 6} fontSize="11" textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'} fill="var(--muted)">{points[i].x}</text>
      ))}
    </svg>
  );
}

export const fmtDate = (iso: string) => new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
export const fmtDateLong = (iso: string) => new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
