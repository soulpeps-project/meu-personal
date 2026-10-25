import { useEffect, useMemo, useRef, useState } from 'react';
import { setState, useStore, uid, todayISO } from '../lib/store';
import { savePhoto, getPhoto, deletePhoto, resizeImage } from '../lib/photos';
import type { PhotoMeta, Pose } from '../lib/types';
import { Icon, Seg, Sheet, Markdown, fmtDate } from '../components/ui';
import { analyzePhysique, aiErrorMessage } from '../lib/ai';

const POSES: { v: Pose; l: string }[] = [
  { v: 'front', l: 'Frente' }, { v: 'side', l: 'Lado' }, { v: 'back', l: 'Costas' }, { v: 'other', l: 'Outra' },
];
const POSE_LABEL: Record<Pose, string> = { front: 'Frente', side: 'Lado', back: 'Costas', other: 'Outra' };

function usePhoto(id: string | undefined) {
  const [src, setSrc] = useState<string>();
  useEffect(() => { let on = true; if (id) getPhoto(id).then((s) => on && setSrc(s)); return () => { on = false; }; }, [id]);
  return src;
}

export function PhotoUploader({ compact = false }: { compact?: boolean }) {
  const [pose, setPose] = useState<Pose>('front');
  const [date, setDate] = useState(todayISO());
  const ref = useRef<HTMLInputElement>(null);
  const weight = useStore((s) => s.profile?.weightKg);
  const photos = useStore((s) => s.photos);

  async function onFiles(files: FileList | null) {
    if (!files) return;
    for (const f of [...files]) {
      const data = await resizeImage(f, 1400, 0.85);
      const id = uid();
      await savePhoto(id, data);
      setState((s) => ({ photos: [...s.photos, { id, date, pose, weightKg: weight }] }));
    }
    if (ref.current) ref.current.value = '';
  }

  return (
    <div>
      {compact && (
        <div className="info-box mb">
          <b>Dicas para fotos comparáveis:</b> mesma luz, mesmo local e horário (de manhã, em jejum), câmera na altura do umbigo a ~2 m,
          postura relaxada, roupa justa ou de banho. Repita a cada 2–4 semanas.
        </div>
      )}
      <Seg value={pose} onChange={setPose} options={POSES} />
      <label className="field">Data<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      <button className="btn block" onClick={() => ref.current?.click()}><Icon name="camera" /> Adicionar foto ({POSE_LABEL[pose]})</button>
      {compact && photos.length > 0 && <p className="muted mt">{photos.length} foto(s) salva(s).</p>}
    </div>
  );
}

function PhotoTile({ m, onClick }: { m: PhotoMeta; onClick: () => void }) {
  const src = usePhoto(m.id);
  return (
    <div className="ph" onClick={onClick}>
      {src && <img src={src} alt={`${POSE_LABEL[m.pose]} ${m.date}`} />}
      <span>{fmtDate(m.date)} · {POSE_LABEL[m.pose]}</span>
    </div>
  );
}

function Compare({ a, b }: { a: PhotoMeta; b: PhotoMeta }) {
  const sa = usePhoto(a.id), sb = usePhoto(b.id);
  const [x, setX] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const move = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setX(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div>
      <div ref={box} className="compare" onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); move(e.clientX); }}
        onPointerMove={(e) => e.buttons && move(e.clientX)}>
        {sb && <img src={sb} alt="depois" />}
        {sa && <img src={sa} alt="antes" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }} />}
        <div className="divider" style={{ left: `${x}%` }} />
      </div>
      <div className="row between muted mt"><span>◀ {fmtDate(a.date)}{a.weightKg ? ` · ${a.weightKg} kg` : ''}</span><span>{fmtDate(b.date)}{b.weightKg ? ` · ${b.weightKg} kg` : ''} ▶</span></div>
      <p className="muted center">Arraste para comparar</p>
    </div>
  );
}

export default function PhotosPanel() {
  const allPhotos = useStore((s) => s.photos);
  const photos = useMemo(() => [...allPhotos].sort((a, b) => b.date.localeCompare(a.date)), [allPhotos]);
  const hasKey = useStore((s) => !!s.settings.apiKey);
  const [filter, setFilter] = useState<Pose | 'all'>('all');
  const [view, setView] = useState<PhotoMeta | null>(null);
  const [cmp, setCmp] = useState<[string, string] | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [busy, setBusy] = useState(false);
  const viewSrc = usePhoto(view?.id);
  const shown = photos.filter((p) => filter === 'all' || p.pose === filter);

  const byPose = (pose: Pose) => photos.filter((p) => p.pose === pose).sort((a, b) => a.date.localeCompare(b.date));
  const canCompare = (['front', 'side', 'back'] as Pose[]).find((ps) => byPose(ps).length >= 2);

  async function runAnalysis() {
    const dates = [...new Set(photos.map((p) => p.date))].sort();
    const chosenDates = dates.length > 1 ? [dates[0], dates[dates.length - 1]] : dates;
    const sel = photos.filter((p) => chosenDates.includes(p.date)).slice(0, 6);
    if (!sel.length) return;
    setBusy(true); setAnalysis('');
    try {
      const imgs = await Promise.all(sel.map(async (p) => ({ dataUrl: (await getPhoto(p.id))!, label: `${POSE_LABEL[p.pose]} em ${p.date}${p.weightKg ? ` (${p.weightKg} kg)` : ''}` })));
      let acc = '';
      const text = await analyzePhysique(imgs, (t) => { acc += t; setAnalysis(acc); });
      setAnalysis(text);
      const last = sel[sel.length - 1].id;
      setState((s) => ({ photos: s.photos.map((p) => (p.id === last ? { ...p, analysis: text } : p)) }));
    } catch (e) {
      setAnalysis('⚠️ ' + aiErrorMessage(e));
    } finally { setBusy(false); }
  }

  const lastAnalysis = photos.find((p) => p.analysis)?.analysis;

  return (
    <div>
      <div className="card">
        <h3>Nova foto</h3>
        <PhotoUploader />
      </div>

      {canCompare && (
        <div className="card">
          <div className="row between"><h3 style={{ margin: 0 }}>Antes × Depois</h3>
            <button className="btn sm" onClick={() => { const l = byPose(canCompare); setCmp([l[0].id, l[l.length - 1].id]); }}>Comparar</button>
          </div>
          <p className="muted mt">Compare a primeira e a última foto de cada pose.</p>
        </div>
      )}

      <div className="card">
        <div className="row between"><h3 style={{ margin: 0 }}>Análise do físico (IA)</h3><Icon name="spark" /></div>
        <p className="muted mt">A IA avalia pontos fortes, pontos a melhorar, postura aparente e sugere músculos prioritários. Usa a primeira e a última data de fotos.</p>
        <button className="btn sm primary" disabled={!hasKey || busy || !photos.length} onClick={runAnalysis}>{busy ? 'Analisando…' : 'Analisar minhas fotos'}</button>
        {!hasKey && <p className="muted mt">Configure a chave da API em Mais → Configurações.</p>}
        {(analysis || lastAnalysis) && <div className="mt"><Markdown text={analysis || lastAnalysis!} /></div>}
      </div>

      <Seg value={filter} onChange={setFilter} options={[{ v: 'all', l: 'Todas' }, ...POSES]} />
      {shown.length === 0 ? <div className="empty">Nenhuma foto ainda.</div> : (
        <div className="photo-grid">{shown.map((m) => <PhotoTile key={m.id} m={m} onClick={() => setView(m)} />)}</div>
      )}

      <Sheet open={!!view} onClose={() => setView(null)} title={view ? `${POSE_LABEL[view.pose]} · ${fmtDate(view.date)}` : ''}>
        {viewSrc && <img src={viewSrc} alt="" style={{ width: '100%', borderRadius: 14 }} />}
        {view && (
          <button className="btn danger block mt" onClick={async () => {
            if (!confirm('Apagar esta foto?')) return;
            await deletePhoto(view.id);
            setState((s) => ({ photos: s.photos.filter((p) => p.id !== view.id) }));
            setView(null);
          }}><Icon name="trash" /> Apagar foto</button>
        )}
      </Sheet>

      <Sheet open={!!cmp} onClose={() => setCmp(null)} title="Antes × Depois">
        {cmp && (() => {
          const a = photos.find((p) => p.id === cmp[0]), b = photos.find((p) => p.id === cmp[1]);
          if (!a || !b) return null;
          const same = photos.filter((p) => p.pose === a.pose).sort((x, y) => x.date.localeCompare(y.date));
          return (
            <>
              <Compare key={a.id + b.id} a={a} b={b} />
              <div className="grid2 mt">
                <label className="field">Antes
                  <select value={a.id} onChange={(e) => setCmp([e.target.value, b.id])}>{same.map((p) => <option key={p.id} value={p.id}>{fmtDate(p.date)}</option>)}</select>
                </label>
                <label className="field">Depois
                  <select value={b.id} onChange={(e) => setCmp([a.id, e.target.value])}>{same.map((p) => <option key={p.id} value={p.id}>{fmtDate(p.date)}</option>)}</select>
                </label>
              </div>
            </>
          );
        })()}
      </Sheet>
    </div>
  );
}
