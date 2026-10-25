import { useEffect, useRef, useState } from 'react';
import { useStore, setState } from '../lib/store';
import { chatStream, aiErrorMessage } from '../lib/ai';
import { go } from '../lib/nav';
import { Icon, Markdown } from '../components/ui';
import type { ChatMsg } from '../lib/types';

const SUGGESTIONS = [
  'Analise meus últimos treinos: estou progredindo?',
  'Senti dor no ombro no supino. O que faço?',
  'Monte um cardápio de um dia para bater minha proteína',
  'Estou sem tempo hoje: só tenho 30 minutos. Como adapto?',
  'Por que meu supino estagnou?',
  'Explique como sentir mais o dorsal na puxada',
];

export default function Coach() {
  const chat = useStore((s) => s.chat);
  const hasKey = useStore((s) => !!s.settings.apiKey);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat.length, streaming]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const msg: ChatMsg = { role: 'user', content: text.trim(), ts: new Date().toISOString() };
    const history = [...chat, msg].slice(-30);
    setState(() => ({ chat: [...chat, msg] }));
    setInput(''); setBusy(true); setErr(''); setStreaming('');
    try {
      let acc = '';
      const answer = await chatStream(history, (t) => { acc += t; setStreaming(acc); });
      setState((s) => ({ chat: [...s.chat, { role: 'assistant', content: answer, ts: new Date().toISOString() }] }));
    } catch (e) {
      setErr(aiErrorMessage(e));
    } finally { setBusy(false); setStreaming(''); }
  }

  if (!hasKey) {
    return (
      <div>
        <div className="topbar"><div className="title">Coach IA</div></div>
        <div className="card hero">
          <h2>Seu personal 24h</h2>
          <p>Converse com um coach que conhece seu perfil, seu programa e seu histórico de treinos. Ele também analisa fotos do seu físico e identifica aparelhos da sua academia.</p>
          <p className="muted">Funciona com a API da Anthropic (Claude). Crie uma chave em console.anthropic.com e cole em Configurações. A chave fica salva só neste aparelho e o uso é cobrado na sua conta da Anthropic.</p>
          <button className="btn primary" onClick={() => go({ tab: 'more', screen: 'settings' })}>Configurar chave</button>
        </div>
        <p className="muted center">O restante do app funciona 100% sem IA.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="topbar">
        <div className="title">Coach IA</div>
        {chat.length > 0 && <button className="btn sm ghost" onClick={() => confirm('Apagar a conversa?') && setState(() => ({ chat: [] }))}>Limpar</button>}
      </div>
      {chat.length === 0 && (
        <div className="card">
          <p>Pergunte qualquer coisa sobre treino, técnica, dor, nutrição, sono ou motivação. Eu já conheço seu perfil e seu programa.</p>
          <div className="chips">{SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => send(s)}>{s}</button>)}</div>
        </div>
      )}
      {chat.map((m, i) => (
        <div key={i} className={`bubble ${m.role}`}>{m.role === 'assistant' ? <Markdown text={m.content} /> : m.content}</div>
      ))}
      {streaming && <div className="bubble assistant"><Markdown text={streaming} /></div>}
      {busy && !streaming && <div className="bubble assistant muted">Pensando…</div>}
      {err && <div className="warn-box mb">{err}</div>}
      <div ref={end} style={{ height: 70 }} />
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 'calc(64px + env(safe-area-inset-bottom))', zIndex: 15, display: 'flex', justifyContent: 'center', padding: '8px 16px', background: 'linear-gradient(transparent, var(--bg) 30%)' }}>
        <form className="row" style={{ width: '100%', maxWidth: 688 }} onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <input type="text" placeholder="Pergunte ao seu coach…" value={input} onChange={(e) => setInput(e.target.value)} disabled={busy} />
          <button className="btn primary" disabled={busy || !input.trim()} aria-label="Enviar"><Icon name="play" fill size={16} /></button>
        </form>
      </div>
    </div>
  );
}
