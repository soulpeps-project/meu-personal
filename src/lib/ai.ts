import Anthropic from '@anthropic-ai/sdk';
import { getState } from './store';
import { getEx, currentWeek } from './generator';
import { EQUIPMENT } from './catalog';
import { MUSCLE_SHORT, INJURY_LABEL } from './catalog';
import type { ChatMsg } from './types';
import type { EquipmentId } from '../data/exercises';

function client() {
  const { apiKey } = getState().settings;
  if (!apiKey) throw new Error('Configure sua chave da API da Anthropic em Perfil → Coach IA.');
  // App pessoal que roda só no seu navegador: a chave fica no seu aparelho.
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

const model = () => getState().settings.model || 'claude-opus-5-5';

const COACH_SYSTEM = `Você é o personal trainer e coach do usuário dentro do app "Meu Personal". Fale em português do Brasil, de forma direta, motivadora e prática.
Baseie-se em evidências científicas atuais (Schoenfeld, Helms, Israetel/RP, Nuckols, Pelland 2024, Refalo 2023, Wolf 2023, posicionamentos ACSM/ISSN). Quando a evidência for incerta, diga.
Use os dados do usuário (perfil, programa, histórico) fornecidos no contexto. Dê números concretos (séries, reps, RIR, cargas, gramas) quando fizer sentido.
Segurança: você não é médico. Para dor aguda, lesão, doença, uso de medicamentos/hormônios ou sinais de alerta (dor no peito, desmaio, falta de ar anormal), oriente procurar um profissional de saúde. Não prescreva esteroides nem dietas extremas.
Respostas curtas por padrão (até ~200 palavras), com listas quando ajudar. Use **negrito** para o essencial.`;

function userContext(): string {
  const s = getState();
  const p = s.profile;
  if (!p) return 'Usuário ainda sem perfil.';
  const lines: string[] = [];
  lines.push(`Perfil: ${p.name || 'usuário'}, ${p.sex === 'M' ? 'homem' : 'mulher'}, ${p.age} anos, ${p.heightCm} cm, ${p.weightKg} kg${p.bodyFat ? `, ~${p.bodyFat}% gordura` : ''}.`);
  lines.push(`Nível: ${p.experience} (${p.monthsTraining} meses de treino). Objetivo: ${p.goal}${p.secondaryGoal ? ` (secundário ${p.secondaryGoal})` : ''}.`);
  lines.push(`Dias: ${p.days.length}/semana, ${p.sessionMinutes} min por sessão. Sono: ${p.sleepHours}h. Atividade diária: ${p.activity}.`);
  if (p.priorityMuscles.length) lines.push(`Prioridades: ${p.priorityMuscles.map((m) => MUSCLE_SHORT[m]).join(', ')}.`);
  if (p.injuries.length || p.injuryNotes) lines.push(`Lesões/limitações: ${p.injuries.map((i) => INJURY_LABEL[i]).join(', ')} ${p.injuryNotes}`);
  lines.push(`Equipamentos: ${p.equipment.join(', ')}.`);
  if (p.notes) lines.push(`Observações do usuário: ${p.notes}`);
  if (s.program) {
    const w = currentWeek(s.program);
    lines.push(`Programa atual: ${s.program.splitName}. Semana ${w.week} (${w.label}, RIR ${w.rir}).`);
    for (const d of s.program.days) {
      lines.push(`- ${d.name}: ${d.exercises.map((e) => `${getEx(e.exId)?.name} ${e.sets}x${e.reps[0]}-${e.reps[1]}`).join('; ')}`);
    }
  }
  const recent = [...s.sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  if (recent.length) {
    lines.push('Últimos treinos:');
    for (const r of recent) {
      lines.push(`- ${r.date.slice(0, 10)} ${r.dayName} (${r.durationMin} min${r.rpe ? `, PSE ${r.rpe}` : ''}): ` +
        r.exercises.map((e) => `${getEx(e.exId)?.name}: ${e.sets.filter((x) => x.done).map((x) => `${x.weight}kg×${x.reps}`).join(', ')}`).join(' | '));
    }
  }
  const ms = [...s.measurements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  if (ms.length) lines.push('Medidas recentes: ' + ms.map((m) => `${m.date}: ${m.weightKg ?? '-'}kg cintura ${m.waist ?? '-'}cm`).join('; '));
  return lines.join('\n');
}

export async function chatStream(history: ChatMsg[], onText: (t: string) => void): Promise<string> {
  const c = client();
  const messages: Anthropic.Beta.BetaMessageParam[] = history.map((m) => ({ role: m.role, content: m.content }));
  const stream = c.beta.messages.stream({
    model: model(),
    max_tokens: 8000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    thinking: { type: 'adaptive' },
    output_config: { effort: 'low' },
    system: [
      { type: 'text', text: COACH_SYSTEM, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: `Contexto atual do usuário:\n${userContext()}` },
    ],
    messages,
  });
  stream.on('text', onText);
  const final = await stream.finalMessage();
  if (final.stop_reason === 'refusal') throw new Error('O modelo não pôde responder a essa pergunta.');
  return final.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text').map((b) => b.text).join('');
}

function imageBlock(dataUrl: string): Anthropic.Beta.BetaImageBlockParam {
  const [head, data] = dataUrl.split(',');
  const media = (head.match(/data:(.*?);/)?.[1] || 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  return { type: 'image', source: { type: 'base64', media_type: media, data } };
}

export async function analyzePhysique(images: { dataUrl: string; label: string }[], onText: (t: string) => void): Promise<string> {
  const c = client();
  const content: Anthropic.Beta.BetaContentBlockParam[] = [];
  for (const img of images) {
    content.push({ type: 'text', text: `Foto: ${img.label}` });
    content.push(imageBlock(img.dataUrl));
  }
  content.push({
    type: 'text',
    text: `Analise meu físico como um treinador experiente e respeitoso, para orientar meu treino. Estruture assim:
1. **Pontos fortes** visíveis.
2. **Pontos a desenvolver** (proporções, grupos que parecem menos desenvolvidos).
3. **Postura** (sinais aparentes como ombros protusos, anteversão pélvica — com a ressalva de que foto não substitui avaliação presencial).
4. **Faixa estimada de gordura corporal** (dê uma faixa larga e diga que é uma estimativa visual imprecisa).
5. **Músculos que eu deveria priorizar** no programa (até 4) e por quê.
6. **Ajustes sugeridos** no treino/nutrição.
Se houver mais de uma data, compare a evolução. Seja honesto, mas sem julgamentos sobre aparência.`,
  });
  const stream = c.beta.messages.stream({
    model: model(),
    max_tokens: 8000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: [{ type: 'text', text: COACH_SYSTEM }, { type: 'text', text: `Contexto atual do usuário:\n${userContext()}` }],
    messages: [{ role: 'user', content }],
  });
  stream.on('text', onText);
  const final = await stream.finalMessage();
  if (final.stop_reason === 'refusal') throw new Error('O modelo não pôde analisar essas fotos.');
  return final.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text').map((b) => b.text).join('');
}

/** Identifica equipamentos em fotos da academia e devolve ids do catálogo. */
export async function identifyEquipment(images: string[]): Promise<{ ids: EquipmentId[]; notes: string }> {
  const c = client();
  const catalog = EQUIPMENT.map((e) => `${e.id}: ${e.label}`).join('\n');
  const content: Anthropic.Beta.BetaContentBlockParam[] = images.map(imageBlock);
  content.push({ type: 'text', text: `Estas são fotos da minha academia. Identifique quais equipamentos do catálogo abaixo aparecem (inclua só os que você tem razoável certeza que estão visíveis). Catálogo (id: nome):\n${catalog}` });
  const res = await c.beta.messages.create({
    model: model(),
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: {
      effort: 'low',
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['ids', 'notes'],
          properties: {
            ids: { type: 'array', items: { type: 'string', enum: EQUIPMENT.map((e) => e.id) } },
            notes: { type: 'string', description: 'Comentário curto em português sobre o que foi visto' },
          },
        },
      },
    },
    messages: [{ role: 'user', content }],
  });
  if (res.stop_reason === 'refusal') throw new Error('Não foi possível analisar as fotos.');
  const text = res.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text').map((b) => b.text).join('');
  const parsed = JSON.parse(text) as { ids: EquipmentId[]; notes: string };
  return parsed;
}

export function aiErrorMessage(e: unknown): string {
  if (e instanceof Anthropic.AuthenticationError) return 'Chave da API inválida. Confira em Perfil → Coach IA.';
  if (e instanceof Anthropic.RateLimitError) return 'Limite de uso atingido. Tente novamente em instantes.';
  if (e instanceof Anthropic.APIConnectionError) return 'Sem conexão com a API. Verifique sua internet.';
  if (e instanceof Anthropic.APIError) return `Erro da API (${e.status}): ${e.message}`;
  return e instanceof Error ? e.message : String(e);
}
