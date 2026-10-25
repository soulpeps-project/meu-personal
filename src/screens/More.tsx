import { useRef, useState } from 'react';
import { useStore, setState, exportData, importData, resetAll } from '../lib/store';
import { go, useNav, type Screen } from '../lib/nav';
import { generateProgram } from '../lib/generator';
import { e1rm, plates } from '../lib/progression';
import type { Profile } from '../lib/types';
import { BasicsSection, ExperienceSection, GoalSection, ScheduleSection, EquipmentSection, HealthSection } from '../components/ProfileSections';
import { Icon, NumField } from '../components/ui';
import Nutrition from './Nutrition';
import { Library, Learn } from './Library';

const MENU: { s: Exclude<Screen, null>; i: string; t: string; d: string }[] = [
  { s: 'profile', i: 'user', t: 'Meu perfil', d: 'Dados, objetivo, agenda, lesões' },
  { s: 'equipment', i: 'dumbbell', t: 'Equipamentos da academia', d: 'Marque o que você tem disponível' },
  { s: 'nutrition', i: 'food', t: 'Nutrição', d: 'Calorias, macros e suplementos' },
  { s: 'library', i: 'video', t: 'Biblioteca de exercícios', d: 'Execução, erros comuns e vídeos' },
  { s: 'learn', i: 'book', t: 'Aprender', d: 'Ciência do treino e fisiologia' },
  { s: 'tools', i: 'tool', t: 'Ferramentas', d: 'Calculadora de 1RM, anilhas, RIR' },
  { s: 'settings', i: 'info', t: 'Configurações', d: 'Coach IA, backup, tema' },
];

function ProfileEdit({ only }: { only?: 'equipment' }) {
  const profile = useStore((s) => s.profile)!;
  const [p, setP] = useState<Profile>(profile);
  const [open, setOpen] = useState<number>(only ? 4 : 0);
  const set = (patch: Partial<Profile>) => setP((x) => ({ ...x, ...patch }));
  const sections = [
    ['Dados pessoais', BasicsSection], ['Experiência', ExperienceSection], ['Objetivo e prioridades', GoalSection],
    ['Agenda e divisão', ScheduleSection], ['Equipamentos', EquipmentSection], ['Saúde e estilo de vida', HealthSection],
  ] as const;
  const dirty = JSON.stringify(p) !== JSON.stringify(profile);
  const save = (regen: boolean) => {
    setState((s) => ({ profile: p, program: regen ? generateProgram(p, (s.program?.seed ?? 1) + 1) : s.program }));
    if (regen) go({ screen: null, tab: 'plan' });
  };
  return (
    <div>
      {sections.map(([title, C], i) => (only && i !== 4 ? null : (
        <div className="card" key={title}>
          <div className="row between" style={{ cursor: 'pointer' }} onClick={() => setOpen(open === i ? -1 : i)}>
            <h3 style={{ margin: 0 }}>{title}</h3><span className="muted">{open === i ? '▲' : '▼'}</span>
          </div>
          {open === i && <div className="mt"><C p={p} set={set} /></div>}
        </div>
      )))}
      <div style={{ height: 70 }} />
      {dirty && (
        <div className="tabbar" style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))', padding: 12, border: 0 }}>
          <div className="tabbar-inner row">
            <button className="btn grow" onClick={() => save(false)}>Salvar</button>
            <button className="btn primary grow" onClick={() => save(true)}><Icon name="spark" size={16} /> Salvar e refazer treino</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Tools() {
  const [w, setW] = useState<number | undefined>(80);
  const [r, setR] = useState<number | undefined>(8);
  const [rir, setRir] = useState<number | undefined>(2);
  const [plate, setPlate] = useState<number | undefined>(100);
  const [bar, setBar] = useState(20);
  const one = w && r ? e1rm(w, r, rir ?? 0) : 0;
  const pl = plate ? plates(plate, bar) : [];
  return (
    <div>
      <div className="card">
        <h3>1RM estimado</h3>
        <div className="grid3">
          <NumField label="Carga (kg)" value={w} onChange={setW} step={0.5} />
          <NumField label="Reps" value={r} onChange={setR} />
          <NumField label="RIR" value={rir} onChange={setRir} />
        </div>
        <div className="kpi">{one ? one.toFixed(1) : '—'} kg</div>
        {one > 0 && (
          <table className="t mt"><thead><tr><th>%1RM</th><th>Carga</th><th>Reps aprox.</th></tr></thead><tbody>
            {[[95, 2], [90, 4], [85, 6], [80, 8], [75, 10], [70, 12], [65, 15], [60, 18]].map(([pc, rp]) => (
              <tr key={pc}><td>{pc}%</td><td>{(one * pc / 100).toFixed(1)} kg</td><td>~{rp}</td></tr>
            ))}
          </tbody></table>
        )}
        <p className="muted mt">Fórmula de Epley ajustada por RIR. Estimativas ficam menos precisas acima de ~12 reps.</p>
      </div>
      <div className="card">
        <h3>Calculadora de anilhas</h3>
        <div className="grid2">
          <NumField label="Carga total (kg)" value={plate} onChange={setPlate} step={2.5} />
          <label className="field">Barra
            <select value={bar} onChange={(e) => setBar(Number(e.target.value))}><option value={20}>Olímpica 20 kg</option><option value={15}>Feminina 15 kg</option><option value={10}>Barra W/curta 10 kg</option></select>
          </label>
        </div>
        <p><b>Cada lado:</b> {pl.length ? pl.join(' + ') + ' kg' : 'só a barra'}</p>
      </div>
      <div className="card">
        <h3>Escala de esforço (RIR / RPE)</h3>
        <table className="t"><thead><tr><th>RPE</th><th>RIR</th><th>Sensação</th></tr></thead><tbody>
          <tr><td>10</td><td>0</td><td>Falha: não sairia mais nenhuma repetição</td></tr>
          <tr><td>9</td><td>1</td><td>Sairia mais 1 repetição</td></tr>
          <tr><td>8</td><td>2</td><td>Sairiam mais 2 — zona ideal para a maioria das séries</td></tr>
          <tr><td>7</td><td>3</td><td>Mais 3 — velocidade já começa a cair</td></tr>
          <tr><td>≤6</td><td>4+</td><td>Aquecimento / deload</td></tr>
        </tbody></table>
        <p className="muted mt">Dica: iniciantes subestimam o quanto aguentam. Teste de vez em quando ir até a falha num isolador (com segurança) para calibrar.</p>
      </div>
    </div>
  );
}

function Settings() {
  const settings = useStore((s) => s.settings);
  const [key, setKey] = useState(settings.apiKey);
  const fileRef = useRef<HTMLInputElement>(null);
  const upd = (patch: Partial<typeof settings>) => setState((s) => ({ settings: { ...s.settings, ...patch } }));
  return (
    <div>
      <div className="card">
        <h3>Coach IA (Claude)</h3>
        <p className="muted">Habilita chat com o coach, análise de fotos do físico e reconhecimento de aparelhos por foto. Crie uma chave em <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">console.anthropic.com</a>. A chave fica só neste navegador e não é incluída no backup.</p>
        <label className="field">Chave da API
          <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-ant-…" autoComplete="off" />
        </label>
        <label className="field">Modelo
          <select value={settings.model} onChange={(e) => upd({ model: e.target.value })}>
            <option value="claude-opus-5-5">Claude Opus 5.5 (mais inteligente)</option>
            <option value="claude-sonnet-5-5">Claude Sonnet 5.5 (rápido e mais barato)</option>
            <option value="claude-haiku-5-5">Claude Haiku 5.5 (o mais econômico)</option>
          </select>
        </label>
        <div className="row">
          <button className="btn primary" onClick={() => upd({ apiKey: key.trim() })}>Salvar chave</button>
          {settings.apiKey && <button className="btn ghost danger" onClick={() => { upd({ apiKey: '' }); setKey(''); }}>Remover</button>}
        </div>
        {settings.apiKey && <p className="muted mt">✅ Chave configurada.</p>}
      </div>
      <div className="card">
        <h3>Treino</h3>
        <label className="row" style={{ marginBottom: 10 }}><input type="checkbox" checked={settings.restSound} onChange={(e) => upd({ restSound: e.target.checked })} /> Som ao fim do descanso</label>
        <label className="row" style={{ marginBottom: 10 }}><input type="checkbox" checked={settings.vibration} onChange={(e) => upd({ vibration: e.target.checked })} /> Vibrar ao fim do descanso</label>
        <label className="row"><input type="checkbox" checked={settings.theme === 'light'} onChange={(e) => upd({ theme: e.target.checked ? 'light' : 'dark' })} /> Tema claro</label>
      </div>
      <div className="card">
        <h3>Backup</h3>
        <p className="muted">Seus dados ficam só neste aparelho. Exporte para não perder (fotos não entram no arquivo).</p>
        <div className="row wrap">
          <button className="btn" onClick={() => {
            const blob = new Blob([exportData()], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob); a.download = `meu-personal-${new Date().toISOString().slice(0, 10)}.json`; a.click();
          }}><Icon name="download" /> Exportar</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            try { importData(await f.text()); alert('Backup restaurado!'); } catch (err) { alert('Erro: ' + (err as Error).message); }
          }} />
          <button className="btn" onClick={() => fileRef.current?.click()}><Icon name="upload" /> Importar</button>
        </div>
      </div>
      <div className="card">
        <h3>Zona de perigo</h3>
        <button className="btn danger" onClick={() => { if (confirm('Apagar TODOS os dados (perfil, treinos, medidas)? Isso não pode ser desfeito.')) resetAll(); }}>Apagar todos os dados</button>
      </div>
      <p className="muted center">Meu Personal · as orientações são educativas e não substituem avaliação médica ou de um profissional de educação física.</p>
    </div>
  );
}

export default function More() {
  const nav = useNav();
  const screen = nav.screen;
  const item = MENU.find((m) => m.s === screen);
  if (item) {
    return (
      <div>
        <button className="back" onClick={() => go({ screen: null, article: null })}><Icon name="back" size={18} /> Mais</button>
        <h1 className="mt mb">{item.t}</h1>
        {screen === 'profile' && <ProfileEdit />}
        {screen === 'equipment' && <ProfileEdit only="equipment" />}
        {screen === 'nutrition' && <Nutrition />}
        {screen === 'library' && <Library />}
        {screen === 'learn' && <Learn />}
        {screen === 'tools' && <Tools />}
        {screen === 'settings' && <Settings />}
      </div>
    );
  }
  return (
    <div>
      <div className="topbar"><div className="title">Mais</div></div>
      {MENU.map((m) => (
        <div key={m.s} className="card tap row" onClick={() => go({ screen: m.s })}>
          <div className="iconbtn" style={{ color: 'var(--accent)' }}><Icon name={m.i} /></div>
          <div className="grow"><b>{m.t}</b><div className="muted">{m.d}</div></div>
          <span className="muted">›</span>
        </div>
      ))}
    </div>
  );
}
