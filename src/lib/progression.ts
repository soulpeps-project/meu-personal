import type { ExerciseLog, PlannedExercise, SessionLog, SetLog, WeekPlan } from './types';
import { getEx } from './generator';

/** 1RM estimado (Epley) considerando as repetições na reserva. */
export function e1rm(weight: number, reps: number, rir: number | null = 0) {
  if (!weight || !reps) return 0;
  const total = reps + (rir ?? 0);
  return total <= 1 ? weight : weight * (1 + total / 30);
}

export function bestSet(sets: SetLog[]) {
  return sets.filter((s) => s.done && s.type !== 'warmup').reduce<SetLog | null>((best, s) =>
    !best || e1rm(s.weight, s.reps, s.rir) > e1rm(best.weight, best.reps, best.rir) ? s : best, null);
}

export function history(exId: string, sessions: SessionLog[]) {
  return sessions
    .filter((s) => s.exercises.some((e) => e.exId === exId && e.sets.some((x) => x.done)))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => ({ date: s.date, log: s.exercises.find((e) => e.exId === exId)! }));
}

export function lastLog(exId: string, sessions: SessionLog[]): ExerciseLog | undefined {
  const h = history(exId, sessions);
  return h.length ? h[h.length - 1].log : undefined;
}

const round = (x: number, step: number) => Math.max(0, Math.round(x / step) * step);

export interface Suggestion { weight: number; reps: number; message: string; kind: 'up' | 'same' | 'down' | 'new' | 'deload' }

/**
 * Progressão dupla com autorregulação por RIR:
 * - todas as séries no topo da faixa (com RIR >= alvo-1) -> sobe a carga
 * - dentro da faixa -> mantém a carga e busca +1 repetição
 * - abaixo do mínimo -> reduz ~5–10%
 */
export function suggest(planned: PlannedExercise, sessions: SessionLog[], week: WeekPlan): Suggestion {
  const ex = getEx(planned.exId);
  const inc = ex?.increment || 2.5;
  const [min, max] = planned.reps;
  const last = lastLog(planned.exId, sessions);
  const work = last?.sets.filter((s) => s.done && s.type !== 'warmup' && s.type !== 'drop') || [];
  if (!work.length) {
    return {
      weight: 0, reps: min, kind: 'new',
      message: ex?.bodyweight
        ? `Primeira vez: faça ${min}–${max} reps com o peso corporal, parando a ~${week.rir} reps da falha.`
        : `Primeira vez: escolha uma carga que permita ${min}–${max} reps sobrando ~${week.rir} na reserva. Essa sessão serve para calibrar.`,
    };
  }
  const topWeight = Math.max(...work.map((s) => s.weight));
  const top = work.filter((s) => s.weight === topWeight);
  if (week.deload) {
    return { weight: round(topWeight * 0.9, inc), reps: min, kind: 'deload', message: `Deload: ~10% menos carga (${round(topWeight * 0.9, inc)} kg) e metade das séries. Saia do treino descansado.` };
  }
  const allTop = top.every((s) => s.reps >= max && (s.rir == null || s.rir >= planned.rir - 1));
  const anyBelow = top.some((s) => s.reps < min);
  const avgReps = Math.round(top.reduce((a, s) => a + s.reps, 0) / top.length);
  if (allTop && top.length >= Math.min(2, planned.sets)) {
    if (ex?.bodyweight) return { weight: topWeight, reps: max, kind: 'up', message: `Bateu ${max} reps! Adicione carga (colete/anilha), pause embaixo ou use variação mais difícil.` };
    const next = round(topWeight + inc, inc > 2 ? inc / 2 : 1);
    return { weight: next, reps: min, kind: 'up', message: `Você bateu o topo da faixa. Suba para ${next} kg e volte para ~${min} reps.` };
  }
  if (anyBelow && top.every((s) => s.reps < min)) {
    const next = round(topWeight * 0.92, inc > 2 ? inc / 2 : 1);
    return { weight: next, reps: min, kind: 'down', message: `Ficou abaixo de ${min} reps. Reduza para ~${next} kg e capriche na execução.` };
  }
  return { weight: topWeight, reps: Math.min(max, avgReps + 1), kind: 'same', message: `Mantenha ${topWeight} kg e tente ${Math.min(max, avgReps + 1)}+ reps por série.` };
}

export function prs(sessions: SessionLog[]) {
  const best = new Map<string, { e1rm: number; weight: number; reps: number; date: string }>();
  for (const s of [...sessions].sort((a, b) => a.date.localeCompare(b.date))) {
    for (const e of s.exercises) {
      for (const set of e.sets) {
        if (!set.done || set.type === 'warmup') continue;
        const v = e1rm(set.weight, set.reps, set.rir);
        const cur = best.get(e.exId);
        if (!cur || v > cur.e1rm) best.set(e.exId, { e1rm: v, weight: set.weight, reps: set.reps, date: s.date });
      }
    }
  }
  return best;
}

export function sessionVolume(s: SessionLog) {
  return s.exercises.reduce((acc, e) => acc + e.sets.filter((x) => x.done && x.type !== 'warmup').reduce((a, x) => a + x.weight * x.reps, 0), 0);
}

export function hardSets(s: SessionLog) {
  return s.exercises.reduce((acc, e) => acc + e.sets.filter((x) => x.done && x.type !== 'warmup').length, 0);
}

/** Calculadora de anilhas por lado. */
export function plates(total: number, bar = 20) {
  const avail = [25, 20, 15, 10, 5, 2.5, 1.25];
  let side = (total - bar) / 2;
  const out: number[] = [];
  if (side <= 0) return out;
  for (const p of avail) {
    while (side >= p - 1e-9) { out.push(p); side -= p; }
  }
  return out;
}
