import { useRef, useState } from 'react';
import type { Profile, Goal, Experience, Activity, CardioType, SplitId } from '../lib/types';
import type { EquipmentId, Injury } from '../data/exercises';
import { Chips, Option, NumField, Icon } from './ui';
import { EQUIPMENT, EQUIPMENT_PRESETS, INJURY_LABEL, PRIORITY_OPTIONS, WEEKDAYS } from '../lib/catalog';
import { SPLIT_INFO, autoSplit } from '../lib/generator';
import { identifyEquipment, aiErrorMessage } from '../lib/ai';
import { resizeImage } from '../lib/photos';
import { useStore } from '../lib/store';

type P = { p: Profile; set: (patch: Partial<Profile>) => void };

export function BasicsSection({ p, set }: P) {
  return (
    <>
      <label className="field">Como quer ser chamado?
        <input type="text" value={p.name} onChange={(e) => set({ name: e.target.value })} placeholder="Seu nome" />
      </label>
      <div className="field" style={{ marginBottom: 12 }}>
        <span className="muted">Sexo biológico (usado nos cálculos de gasto calórico e gordura)</span>
        <Chips multi={false} value={[p.sex]} onChange={(v) => set({ sex: v[0] })} options={[{ v: 'M', l: 'Masculino' }, { v: 'F', l: 'Feminino' }]} />
      </div>
      <div className="grid3">
        <NumField label="Idade" value={p.age} onChange={(v) => set({ age: v ?? 0 })} />
        <NumField label="Altura" suffix="cm" value={p.heightCm} onChange={(v) => set({ heightCm: v ?? 0 })} />
        <NumField label="Peso" suffix="kg" step={0.1} value={p.weightKg} onChange={(v) => set({ weightKg: v ?? 0 })} />
      </div>
      <NumField label="% de gordura (opcional, se souber)" value={p.bodyFat} step={0.5} onChange={(v) => set({ bodyFat: v })} />
    </>
  );
}

const EXP: { v: Experience; e: string; t: string; d: string }[] = [
  { v: 'beginner', e: '🌱', t: 'Iniciante', d: 'Menos de 1 ano treinando com regularidade (ou voltando após longa pausa).' },
  { v: 'intermediate', e: '💪', t: 'Intermediário', d: '1 a 3 anos de treino consistente. Conhece os exercícios básicos.' },
  { v: 'advanced', e: '🏆', t: 'Avançado', d: '3+ anos, progresso já é lento, domina técnica e intensidade.' },
];

export function ExperienceSection({ p, set }: P) {
  return (
    <>
      {EXP.map((x) => <Option key={x.v} on={p.experience === x.v} onClick={() => set({ experience: x.v })} emoji={x.e} title={x.t} desc={x.d} />)}
      <NumField label="Há quantos meses você treina (no total)?" value={p.monthsTraining} onChange={(v) => set({ monthsTraining: v ?? 0 })} />
    </>
  );
}

export const GOALS: { v: Goal; e: string; t: string; d: string }[] = [
  { v: 'hypertrophy', e: '🦍', t: 'Ganhar massa muscular', d: 'Hipertrofia com leve superávit calórico.' },
  { v: 'fat_loss', e: '🔥', t: 'Perder gordura', d: 'Preservar músculos em déficit calórico.' },
  { v: 'recomp', e: '⚖️', t: 'Recomposição', d: 'Perder gordura e ganhar músculo ao mesmo tempo.' },
  { v: 'strength', e: '🏋️', t: 'Ficar mais forte', d: 'Foco em cargas nos básicos (agachamento, supino, terra).' },
  { v: 'health', e: '❤️', t: 'Saúde e bem-estar', d: 'Treino eficiente, longevidade e disposição.' },
  { v: 'endurance', e: '🏃', t: 'Condicionamento', d: 'Resistência muscular e cardiovascular.' },
];

export function GoalSection({ p, set }: P) {
  return (
    <>
      {GOALS.map((g) => <Option key={g.v} on={p.goal === g.v} onClick={() => set({ goal: g.v })} emoji={g.e} title={g.t} desc={g.d} />)}
      <NumField label="Peso meta (opcional)" suffix="kg" step={0.5} value={p.targetWeightKg} onChange={(v) => set({ targetWeightKg: v })} />
      <h3 className="mt">Músculos que quer priorizar</h3>
      <p className="muted">Escolha até 4. Eles recebem mais volume e vêm primeiro no treino.</p>
      <Chips value={p.priorityMuscles} onChange={(v) => set({ priorityMuscles: v.slice(-4) })} options={PRIORITY_OPTIONS.map((o) => ({ v: o.id, l: o.label }))} />
    </>
  );
}

export function ScheduleSection({ p, set }: P) {
  const n = p.days.length;
  const auto = n ? SPLIT_INFO[autoSplit(n)].name : '—';
  return (
    <>
      <h3>Dias que você consegue treinar</h3>
      <Chips value={p.days} onChange={(v) => set({ days: [...v].sort() })} options={WEEKDAYS.map((l, i) => ({ v: i, l }))} />
      <p className="muted mt">{n} dia(s) por semana{n === 7 ? ' — recomendamos ao menos 1 dia de descanso; o 7º vira recuperação ativa.' : ''}</p>
      <h3 className="mt2">Tempo por treino: {p.sessionMinutes} min</h3>
      <input type="range" min={20} max={150} step={5} value={p.sessionMinutes} onChange={(e) => set({ sessionMinutes: Number(e.target.value) })} />
      <div className="row between muted"><span>20 min</span><span>1h</span><span>2h30</span></div>
      <h3 className="mt2">Divisão do treino</h3>
      <Option on={p.split === 'auto'} onClick={() => set({ split: 'auto' })} emoji="✨" title={`Automática (recomendado): ${auto}`} desc="O app escolhe a melhor divisão para seus dias." />
      {(Object.keys(SPLIT_INFO) as Exclude<SplitId, 'auto'>[]).filter((k) => n >= SPLIT_INFO[k].min && n <= SPLIT_INFO[k].max).map((k) => (
        <Option key={k} on={p.split === k} onClick={() => set({ split: k })} title={SPLIT_INFO[k].name} desc={SPLIT_INFO[k].desc} />
      ))}
    </>
  );
}

export function EquipmentSection({ p, set }: P) {
  const groups = [...new Set(EQUIPMENT.map((e) => e.group))];
  const hasKey = useStore((s) => !!s.settings.apiKey);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const toggle = (id: EquipmentId) => set({ equipment: p.equipment.includes(id) ? p.equipment.filter((x) => x !== id) : [...p.equipment, id] });

  async function onPhotos(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setMsg('Analisando fotos…');
    try {
      const imgs = await Promise.all([...files].slice(0, 8).map((f) => resizeImage(f, 1024, 0.8)));
      const res = await identifyEquipment(imgs);
      const merged = [...new Set([...p.equipment, ...res.ids])];
      set({ equipment: merged });
      setMsg(`Identifiquei ${res.ids.length} equipamento(s). ${res.notes}`);
    } catch (e) {
      setMsg(aiErrorMessage(e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <>
      <p className="muted">Comece por um modelo e ajuste marcando/desmarcando.</p>
      <div className="grid2 mb">
        {EQUIPMENT_PRESETS.map((pr) => (
          <button key={pr.id} className="option" style={{ margin: 0 }} onClick={() => set({ equipment: [...pr.items] })}>
            <span><b>{pr.label}</b><small>{pr.desc}</small></span>
          </button>
        ))}
      </div>
      <div className="card" style={{ background: 'var(--card2)' }}>
        <div className="row"><Icon name="camera" /><b>Tire fotos da sua academia</b></div>
        <p className="muted mt">A IA reconhece os aparelhos e marca para você. {hasKey ? '' : 'Requer a chave da API (configure em Perfil → Coach IA).'}</p>
        <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" hidden onChange={(e) => onPhotos(e.target.files)} />
        <button className="btn sm" disabled={busy || !hasKey} onClick={() => fileRef.current?.click()}>{busy ? 'Analisando…' : 'Enviar fotos'}</button>
        {msg && <p className="muted mt">{msg}</p>}
      </div>
      {groups.map((g) => (
        <div key={g} className="mt">
          <h3>{g}</h3>
          <div className="chips">
            {EQUIPMENT.filter((e) => e.group === g).map((e) => (
              <button key={e.id} className={`chip ${p.equipment.includes(e.id) ? 'on' : ''}`} onClick={() => toggle(e.id)}>
                {p.equipment.includes(e.id) && <Icon name="check" size={14} />}{e.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <p className="muted mt">{p.equipment.length} equipamento(s) selecionado(s). Exercícios com peso corporal estão sempre disponíveis.</p>
    </>
  );
}

const ACT: { v: Activity; t: string; d: string }[] = [
  { v: 'sedentary', t: 'Sedentário', d: 'Trabalho sentado, < 5 mil passos/dia' },
  { v: 'light', t: 'Levemente ativo', d: '5–8 mil passos/dia' },
  { v: 'moderate', t: 'Ativo', d: '8–12 mil passos ou trabalho em pé' },
  { v: 'high', t: 'Muito ativo', d: 'Trabalho físico pesado ou 12 mil+ passos' },
];

const CARDIO: { v: CardioType; l: string }[] = [
  { v: 'walk', l: 'Caminhada / esteira' }, { v: 'bike', l: 'Bicicleta' }, { v: 'elliptical', l: 'Elíptico' }, { v: 'run', l: 'Corrida' },
  { v: 'rower', l: 'Remo' }, { v: 'stairs', l: 'Escada' }, { v: 'swim', l: 'Natação' }, { v: 'jump_rope', l: 'Pular corda' },
];

export function HealthSection({ p, set }: P) {
  return (
    <>
      <h3>Lesões ou dores</h3>
      <p className="muted">Exercícios que costumam agravar essas regiões serão evitados.</p>
      <Chips value={p.injuries} onChange={(v) => set({ injuries: v as Injury[] })} options={(Object.keys(INJURY_LABEL) as Injury[]).map((k) => ({ v: k, l: INJURY_LABEL[k] }))} />
      <label className="field mt">Detalhes (opcional)
        <textarea value={p.injuryNotes} onChange={(e) => set({ injuryNotes: e.target.value })} placeholder="Ex.: condromalácia no joelho direito, dor ao agachar fundo" />
      </label>
      {p.injuries.length > 0 && <div className="warn-box mb">Dor persistente ou lesão recente? Procure um médico/fisioterapeuta. O app adapta exercícios, mas não substitui avaliação profissional.</div>}
      <h3 className="mt">Nível de atividade fora da academia</h3>
      {ACT.map((a) => <Option key={a.v} on={p.activity === a.v} onClick={() => set({ activity: a.v })} title={a.t} desc={a.d} />)}
      <h3 className="mt">Sono médio: {p.sleepHours} h</h3>
      <input type="range" min={4} max={10} step={0.5} value={p.sleepHours} onChange={(e) => set({ sleepHours: Number(e.target.value) })} />
      {p.sleepHours < 7 && <p className="muted">Menos de 7h prejudica recuperação e composição corporal. O volume será levemente ajustado.</p>}
      <h3 className="mt">Cardio que você curte</h3>
      <Chips value={p.cardioTypes} onChange={(v) => set({ cardioTypes: v })} options={CARDIO} />
      <label className="field mt">Algo mais que o personal deva saber?
        <textarea value={p.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Ex.: gosto de treinar pesado, odeio burpee, quero bumbum mais redondo, treino de manhã cedo…" />
      </label>
    </>
  );
}

export function defaultProfile(): Profile {
  return {
    name: '', sex: 'M', age: 28, heightCm: 175, weightKg: 75, experience: 'beginner', monthsTraining: 0, goal: 'hypertrophy',
    priorityMuscles: [], days: [1, 3, 5], sessionMinutes: 60, equipment: [...EQUIPMENT_PRESETS[1].items], injuries: [], injuryNotes: '',
    activity: 'light', sleepHours: 7, cardioTypes: ['walk', 'bike'], split: 'auto', dislikes: [], favorites: [], notes: '',
    createdAt: new Date().toISOString(),
  };
}
