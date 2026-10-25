import { useState } from 'react';
import type { Profile } from '../lib/types';
import { setState } from '../lib/store';
import { generateProgram } from '../lib/generator';
import { BasicsSection, ExperienceSection, GoalSection, ScheduleSection, EquipmentSection, HealthSection, defaultProfile } from '../components/ProfileSections';
import { Icon } from '../components/ui';
import { PhotoUploader } from './Photos';

const STEPS = [
  { t: 'Sobre você', s: 'Dados básicos para calcular metas e cargas.' },
  { t: 'Experiência', s: 'Define volume, complexidade e progressão.' },
  { t: 'Objetivo', s: 'O que você quer conquistar?' },
  { t: 'Agenda', s: 'Quando e quanto tempo você tem.' },
  { t: 'Sua academia', s: 'Quais equipamentos você tem disponível?' },
  { t: 'Saúde e estilo de vida', s: 'Para adaptar e proteger você.' },
  { t: 'Fotos de início (opcional)', s: 'Registre o "antes" para comparar a evolução.' },
];

export default function Onboarding() {
  const [step, setStep] = useState(-1);
  const [p, setP] = useState<Profile>(defaultProfile());
  const set = (patch: Partial<Profile>) => setP((x) => ({ ...x, ...patch }));

  const valid = [
    p.age > 10 && p.heightCm > 100 && p.weightKg > 25,
    true,
    true,
    p.days.length > 0,
    true,
    true,
    true,
  ];

  function finish() {
    const profile = { ...p, createdAt: new Date().toISOString() };
    const program = generateProgram(profile);
    setState((s) => ({
      profile,
      program,
      measurements: [...s.measurements, { id: 'm0', date: new Date().toISOString().slice(0, 10), weightKg: p.weightKg, bodyFat: p.bodyFat }],
    }));
  }

  if (step === -1) {
    return (
      <div className="app" style={{ paddingTop: 40 }}>
        <div className="center">
          <img src={`${import.meta.env.BASE_URL}icon.svg`} width={84} height={84} alt="" style={{ borderRadius: 22 }} />
          <h1 className="mt2">Meu Personal</h1>
          <p className="muted" style={{ fontSize: 16 }}>Seu personal trainer no bolso, baseado nas evidências científicas mais atuais.</p>
        </div>
        <div className="card mt2">
          {[
            ['dumbbell', 'Treino montado para você', 'Seus dias, seu tempo, seus aparelhos, seus objetivos.'],
            ['video', 'Como executar cada exercício', 'Passo a passo, erros comuns, imagens e vídeos.'],
            ['chart', 'Progressão automática', 'O app diz quanto de carga usar em cada série.'],
            ['camera', 'Fotos e medidas', 'Compare sua evolução lado a lado.'],
            ['chat', 'Coach com IA', 'Tire dúvidas e analise seu físico (opcional).'],
          ].map(([i, t, d]) => (
            <div key={t} className="row" style={{ padding: '8px 0', alignItems: 'flex-start' }}>
              <div className="iconbtn" style={{ color: 'var(--accent)' }}><Icon name={i} /></div>
              <div><b>{t}</b><div className="muted">{d}</div></div>
            </div>
          ))}
        </div>
        <button className="btn primary block mt" onClick={() => setStep(0)}>Começar avaliação (3 min)</button>
        <p className="muted center mt">Seus dados ficam salvos só neste aparelho.</p>
      </div>
    );
  }

  const Section = [BasicsSection, ExperienceSection, GoalSection, ScheduleSection, EquipmentSection, HealthSection][step];

  return (
    <div className="app">
      <div className="pill-steps">{STEPS.map((_, i) => <div key={i} className={i <= step ? 'on' : ''} />)}</div>
      <button className="back" onClick={() => setStep(step - 1)}><Icon name="back" size={18} /> Voltar</button>
      <h1 className="mt">{STEPS[step].t}</h1>
      <p className="muted mb">{STEPS[step].s}</p>
      {Section ? <Section p={p} set={set} /> : <PhotoUploader compact />}
      <div style={{ height: 80 }} />
      <div className="tabbar" style={{ padding: '12px 16px calc(12px + env(safe-area-inset-bottom))' }}>
        <div className="tabbar-inner">
          {step < STEPS.length - 1 ? (
            <button className="btn primary block" disabled={!valid[step]} onClick={() => setStep(step + 1)}>Continuar</button>
          ) : (
            <button className="btn primary block" onClick={finish}><Icon name="spark" /> Montar meu treino</button>
          )}
        </div>
      </div>
    </div>
  );
}
