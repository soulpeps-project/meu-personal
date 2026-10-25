import { EXERCISES, type Exercise, type Muscle, type Pattern, type EquipmentId, type Injury } from '../data/exercises';
import type { Profile, Program, PlannedDay, PlannedExercise, WeekPlan, SplitId, CardioType, Goal } from './types';
import { MUSCLE_SHORT, WEEKDAYS_FULL } from './catalog';
import { uid, todayISO } from './store';

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

const EX_BY_ID = new Map(EXERCISES.map((e) => [e.id, e]));
export const getEx = (id: string): Exercise | undefined => EX_BY_ID.get(id);

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Unidade da "repetição": segundos para pranchas, passos para caminhadas. */
export function repUnit(id: string): 'reps' | 's' | 'passos' {
  if (id.startsWith('prancha')) return 's';
  if (id.startsWith('caminhada')) return 'passos';
  return 'reps';
}

export function isAvailable(ex: Exercise, equipment: EquipmentId[]) {
  return ex.equipment.every((e) => e === 'none' || equipment.includes(e));
}

export function isSafe(ex: Exercise, injuries: Injury[]) {
  return !ex.avoidIf.some((i) => injuries.includes(i));
}

const MACHINE_EQUIP: EquipmentId[] = [
  'smith', 'cable', 'lat_pulldown', 'seated_row', 'chest_supported_row', 'assisted_pullup', 'chest_press_machine',
  'incline_press_machine', 'pec_deck', 'shoulder_press_machine', 'lateral_raise_machine', 'leg_press', 'hack_squat',
  'pendulum_squat', 'leg_extension', 'leg_curl_lying', 'leg_curl_seated', 'hip_thrust_machine', 'glute_kickback_machine',
  'abductor_machine', 'adductor_machine', 'calf_standing_machine', 'calf_seated_machine', 'biceps_curl_machine',
  'triceps_machine', 'ab_crunch_machine',
];
const isMachine = (ex: Exercise) => ex.equipment.some((e) => MACHINE_EQUIP.includes(e));

/** Exercícios "base" com ótima relação estímulo/fadiga e fácil progressão de carga. */
const STAPLES = new Set([
  'supino-reto-barra', 'supino-reto-halteres', 'supino-inclinado-halteres', 'supino-inclinado-barra', 'supino-maquina',
  'supino-inclinado-maquina', 'supino-inclinado-smith', 'crossover-polia-media', 'voador-peck-deck', 'crucifixo-reto-halteres',
  'barra-fixa-pronada', 'barra-fixa-neutra', 'puxada-frente-aberta', 'puxada-triangulo', 'puxada-unilateral-polia',
  'remada-curvada-barra', 'remada-maquina', 'remada-baixa-triangulo', 'remada-unilateral-halter', 'remada-apoiada-halteres',
  'remada-seal', 'remada-cavalinho', 'desenvolvimento-halteres-sentado', 'desenvolvimento-maquina', 'elevacao-lateral-halteres',
  'elevacao-lateral-polia', 'elevacao-lateral-maquina', 'crucifixo-inverso-maquina', 'crucifixo-inverso-polia', 'face-pull',
  'rosca-inclinada-halteres', 'rosca-bayesian', 'rosca-direta-ez', 'rosca-martelo', 'rosca-scott-ez', 'rosca-alternada-halteres',
  'triceps-frances-polia', 'triceps-corda', 'triceps-testa-ez', 'triceps-frances-halter', 'triceps-barra-polia',
  'agachamento-livre', 'agachamento-hack', 'agachamento-pendulo', 'leg-press-45', 'agachamento-bulgaro', 'agachamento-smith',
  'agachamento-goblet', 'cadeira-extensora', 'terra-romeno-barra', 'terra-romeno-halteres', 'stiff-barra', 'cadeira-flexora',
  'mesa-flexora', 'elevacao-pelvica-barra', 'elevacao-pelvica-maquina', 'elevacao-pelvica-smith', 'cadeira-abdutora',
  'cadeira-adutora', 'panturrilha-em-pe-maquina', 'panturrilha-sentado', 'panturrilha-leg-press', 'panturrilha-smith',
  'abdominal-polia', 'abdominal-maquina', 'elevacao-pernas-suspenso', 'roda-abdominal', 'encolhimento-halteres', 'passada-caminhando',
]);

const LOADED: EquipmentId[] = ['barbell', 'dumbbell', 'cable', 'leg_press', 'smith', 'hack_squat', 'kettlebell', 'chest_press_machine'];
const BW_WEAK_PATTERNS: Pattern[] = ['squat', 'lunge', 'hinge', 'hip_extension', 'knee_flexion', 'knee_extension', 'calf', 'horizontal_push', 'vertical_push', 'incline_push', 'elbow_extension'];

// ---------------------------------------------------------------------------
// Modelos de dia
// ---------------------------------------------------------------------------

type DayKind =
  | 'FB_A' | 'FB_B' | 'FB_C' | 'UPPER_A' | 'UPPER_B' | 'LOWER_A' | 'LOWER_B'
  | 'PUSH' | 'PULL' | 'LEGS' | 'CHEST' | 'BACK' | 'SHOULDERS' | 'ARMS' | 'BRO_LEGS';

interface DayTemplate {
  name: string;
  focus: string;
  muscles: Muscle[];
  hint?: Partial<Record<Muscle, Pattern[]>>;
  legDay?: boolean;
}

const T: Record<DayKind, DayTemplate> = {
  FB_A: {
    name: 'Corpo inteiro A', focus: 'Agachamento + empurrar horizontal + puxar vertical',
    muscles: ['quads', 'chest', 'lats', 'hamstrings', 'sideDelts', 'triceps', 'biceps', 'calves', 'abs'],
    hint: { quads: ['squat'], chest: ['horizontal_push'], lats: ['vertical_pull'], hamstrings: ['knee_flexion'] }, legDay: true,
  },
  FB_B: {
    name: 'Corpo inteiro B', focus: 'Dobradiça de quadril + remada + supino inclinado',
    muscles: ['hamstrings', 'upperBack', 'chest', 'glutes', 'sideDelts', 'rearDelts', 'biceps', 'triceps', 'abs'],
    hint: { hamstrings: ['hinge'], upperBack: ['horizontal_pull'], chest: ['incline_push'], glutes: ['hip_extension'] }, legDay: true,
  },
  FB_C: {
    name: 'Corpo inteiro C', focus: 'Unilateral + puxada + máquinas',
    muscles: ['quads', 'lats', 'chest', 'glutes', 'hamstrings', 'sideDelts', 'triceps', 'biceps', 'calves'],
    hint: { quads: ['lunge', 'squat'], lats: ['vertical_pull', 'horizontal_pull'], chest: ['chest_fly', 'horizontal_push'], hamstrings: ['knee_flexion'] }, legDay: true,
  },
  UPPER_A: {
    name: 'Superior A', focus: 'Ênfase em empurrar/puxar horizontal',
    muscles: ['chest', 'upperBack', 'lats', 'sideDelts', 'triceps', 'biceps', 'rearDelts'],
    hint: { chest: ['horizontal_push'], upperBack: ['horizontal_pull'], lats: ['vertical_pull'] },
  },
  UPPER_B: {
    name: 'Superior B', focus: 'Ênfase em puxada vertical e inclinado',
    muscles: ['lats', 'chest', 'upperBack', 'sideDelts', 'rearDelts', 'biceps', 'triceps'],
    hint: { lats: ['vertical_pull'], chest: ['incline_push'], upperBack: ['horizontal_pull'] },
  },
  LOWER_A: {
    name: 'Inferior A', focus: 'Ênfase em quadríceps',
    muscles: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'],
    hint: { quads: ['squat'], hamstrings: ['knee_flexion', 'hinge'], glutes: ['hip_extension', 'lunge'] }, legDay: true,
  },
  LOWER_B: {
    name: 'Inferior B', focus: 'Ênfase em posteriores e glúteos',
    muscles: ['hamstrings', 'glutes', 'quads', 'calves', 'abs'],
    hint: { hamstrings: ['hinge', 'knee_flexion'], glutes: ['hip_extension'], quads: ['lunge', 'squat', 'knee_extension'] }, legDay: true,
  },
  PUSH: {
    name: 'Empurrar (Push)', focus: 'Peito, ombros e tríceps',
    muscles: ['chest', 'sideDelts', 'triceps'],
    hint: { chest: ['horizontal_push', 'incline_push'] },
  },
  PULL: {
    name: 'Puxar (Pull)', focus: 'Costas, posterior de ombro e bíceps',
    muscles: ['lats', 'upperBack', 'rearDelts', 'biceps'],
    hint: { lats: ['vertical_pull'], upperBack: ['horizontal_pull'] },
  },
  LEGS: {
    name: 'Pernas (Legs)', focus: 'Quadríceps, posteriores, glúteos e panturrilhas',
    muscles: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'],
    hint: { quads: ['squat'], hamstrings: ['hinge', 'knee_flexion'] }, legDay: true,
  },
  CHEST: { name: 'Peito', focus: 'Peitoral e tríceps', muscles: ['chest', 'triceps', 'abs'] },
  BACK: { name: 'Costas', focus: 'Costas e bíceps', muscles: ['lats', 'upperBack', 'biceps'] },
  SHOULDERS: { name: 'Ombros', focus: 'Deltoides e trapézio', muscles: ['sideDelts', 'rearDelts', 'frontDelts', 'traps', 'abs'] },
  ARMS: { name: 'Braços', focus: 'Bíceps, tríceps e antebraço', muscles: ['biceps', 'triceps', 'forearms', 'sideDelts'] },
  BRO_LEGS: {
    name: 'Pernas', focus: 'Membros inferiores completos',
    muscles: ['quads', 'hamstrings', 'glutes', 'calves'], legDay: true,
  },
};

export const SPLIT_INFO: Record<Exclude<SplitId, 'auto'>, { name: string; desc: string; min: number; max: number }> = {
  full_body: { name: 'Corpo inteiro (Full Body)', desc: 'Todos os grupos em todo treino. Ótimo para 1–3 dias e para iniciantes.', min: 1, max: 4 },
  upper_lower: { name: 'Superior / Inferior', desc: 'Alterna superiores e inferiores. Frequência 2x por músculo com 4 dias.', min: 2, max: 6 },
  ppl: { name: 'Push / Pull / Legs', desc: 'Empurrar, puxar e pernas. Com 3 dias = frequência 1x (menos eficiente).', min: 3, max: 6 },
  ul_ppl: { name: 'Superior/Inferior + PPL', desc: 'Híbrido de 5 dias: frequência ~2x com sessões mais curtas.', min: 5, max: 5 },
  ppl_x2: { name: 'PPL 2x', desc: 'Push/Pull/Legs duas vezes por semana. Para quem treina 6 dias.', min: 6, max: 6 },
  bro: { name: 'Divisão por grupo (ABCDE)', desc: 'Um grupo por dia. Popular, mas frequência 1x por músculo é inferior para a maioria.', min: 3, max: 6 },
};

export function autoSplit(n: number): Exclude<SplitId, 'auto'> {
  if (n <= 3) return 'full_body';
  if (n === 4) return 'upper_lower';
  if (n === 5) return 'ul_ppl';
  return 'ppl_x2';
}

function splitKinds(split: Exclude<SplitId, 'auto'>, n: number): DayKind[] {
  const cycle = (arr: DayKind[]) => Array.from({ length: n }, (_, i) => arr[i % arr.length]);
  switch (split) {
    case 'full_body': return cycle(n === 2 ? ['FB_A', 'FB_B'] : ['FB_A', 'FB_B', 'FB_C']);
    case 'upper_lower':
      if (n === 3) return ['UPPER_A', 'LOWER_A', 'FB_C'];
      if (n === 5) return ['UPPER_A', 'LOWER_A', 'UPPER_B', 'LOWER_B', 'FB_C'];
      return cycle(['UPPER_A', 'LOWER_A', 'UPPER_B', 'LOWER_B']);
    case 'ppl':
      if (n === 4) return ['PUSH', 'PULL', 'LEGS', 'FB_C'];
      if (n === 5) return ['PUSH', 'PULL', 'LEGS', 'UPPER_A', 'LOWER_B'];
      return cycle(['PUSH', 'PULL', 'LEGS']);
    case 'ul_ppl':
      if (n !== 5) return splitKinds(autoSplit(n), n);
      return ['UPPER_A', 'LOWER_A', 'PUSH', 'PULL', 'LEGS'];
    case 'ppl_x2': return cycle(['PUSH', 'PULL', 'LEGS']);
    case 'bro':
      if (n === 3) return ['PUSH', 'PULL', 'LEGS'];
      if (n === 4) return ['CHEST', 'BACK', 'BRO_LEGS', 'SHOULDERS'];
      if (n === 5) return ['CHEST', 'BACK', 'BRO_LEGS', 'SHOULDERS', 'ARMS'];
      return ['CHEST', 'BACK', 'BRO_LEGS', 'SHOULDERS', 'ARMS', 'LEGS'];
  }
}

// ---------------------------------------------------------------------------
// Volume semanal alvo (séries "duras" por músculo / semana)
// Base: Schoenfeld 2017; Pelland et al. 2024/2025 (dose-resposta com retornos decrescentes);
// marcos de volume (RP). Séries de músculos sinérgicos contam 0,5 (contagem fracionada).
// ---------------------------------------------------------------------------

const MAJOR: Muscle[] = ['chest', 'lats', 'upperBack', 'quads', 'hamstrings', 'glutes'];
const SMALL: Muscle[] = ['sideDelts', 'rearDelts', 'triceps', 'biceps', 'calves', 'abs'];
const OPTIONAL: Muscle[] = ['frontDelts', 'traps', 'forearms', 'adductors', 'abductors', 'obliques', 'lowerBack'];

const SIZE_FACTOR: Partial<Record<Muscle, number>> = {
  chest: 1, lats: 1, upperBack: 0.8, quads: 1, hamstrings: 0.85, glutes: 0.8,
  sideDelts: 0.9, rearDelts: 0.6, triceps: 0.8, biceps: 0.8, calves: 0.7, abs: 0.6,
  frontDelts: 0.4, traps: 0.5, forearms: 0.5, adductors: 0.5, abductors: 0.5, obliques: 0.3, lowerBack: 0.3,
};

const GOAL_VOLUME: Record<Goal, number> = {
  hypertrophy: 1, recomp: 1, strength: 0.8, fat_loss: 0.85, health: 0.6, endurance: 0.7,
};

export function weeklyTargets(p: Profile): Partial<Record<Muscle, number>> {
  const base = p.experience === 'beginner' ? 9 : p.experience === 'intermediate' ? 13 : 17;
  let f = GOAL_VOLUME[p.goal];
  if (p.sleepHours < 6) f *= 0.9;
  if (p.age >= 55) f *= 0.9;
  const out: Partial<Record<Muscle, number>> = {};
  for (const m of [...MAJOR, ...SMALL, ...OPTIONAL]) {
    const optional = OPTIONAL.includes(m);
    const prio = p.priorityMuscles.includes(m);
    if (optional && !prio) continue;
    let v = base * (SIZE_FACTOR[m] ?? 0.6) * f;
    if (prio) v = Math.max(v * 1.35, base * 0.8);
    out[m] = Math.round(v);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Seleção de exercícios
// ---------------------------------------------------------------------------

const MUSCLE_PATTERNS: Record<Muscle, Pattern[][]> = {
  chest: [['horizontal_push', 'incline_push'], ['chest_fly', 'incline_push', 'horizontal_push'], ['chest_fly', 'horizontal_push']],
  lats: [['vertical_pull'], ['horizontal_pull', 'vertical_pull'], ['vertical_pull', 'chest_fly']],
  upperBack: [['horizontal_pull'], ['horizontal_pull', 'rear_delt'], ['shrug', 'horizontal_pull']],
  quads: [['squat', 'lunge'], ['knee_extension', 'lunge', 'squat'], ['lunge', 'knee_extension']],
  hamstrings: [['hinge', 'knee_flexion'], ['knee_flexion', 'hinge'], ['knee_flexion']],
  glutes: [['hip_extension', 'lunge', 'squat'], ['hip_abduction', 'hip_extension', 'lunge'], ['hip_extension']],
  sideDelts: [['lateral_raise'], ['lateral_raise', 'vertical_push']],
  rearDelts: [['rear_delt'], ['rear_delt', 'horizontal_pull']],
  frontDelts: [['vertical_push'], ['vertical_push', 'incline_push']],
  biceps: [['elbow_flexion']],
  triceps: [['elbow_extension'], ['elbow_extension', 'horizontal_push']],
  forearms: [['wrist', 'carry', 'elbow_flexion']],
  traps: [['shrug'], ['shrug', 'carry']],
  calves: [['calf']],
  abs: [['core_flexion', 'core_anti_extension'], ['core_anti_extension', 'core_rotation']],
  obliques: [['core_rotation']],
  adductors: [['hip_adduction'], ['hip_adduction', 'lunge']],
  abductors: [['hip_abduction']],
  lowerBack: [['hinge', 'hip_extension']],
};

interface Ctx {
  p: Profile;
  r: () => number;
  usedWeek: Map<string, number>;
  fatigue3Week: number;
}

function candidatesFor(m: Muscle, ctx: Ctx, allowUnsafe = false) {
  const { p } = ctx;
  const maxLevel = p.experience === 'beginner' ? 2 : 3;
  return EXERCISES.filter(
    (e) => e.primary.includes(m) && isAvailable(e, p.equipment) && !p.dislikes.includes(e.id)
      && (allowUnsafe || isSafe(e, p.injuries)) && e.level <= maxLevel,
  );
}

function pickExercise(m: Muscle, idx: number, dayUsed: Set<string>, dayPatterns: Map<Muscle, Pattern[]>, hint: Pattern[] | undefined,
  ctx: Ctx, dayFatigue3: number, timeTight: boolean): Exercise | undefined {
  let pool = candidatesFor(m, ctx).filter((e) => !dayUsed.has(e.id));
  if (!pool.length) pool = candidatesFor(m, ctx, true).filter((e) => !dayUsed.has(e.id));
  if (!pool.length) return undefined;
  const lists = MUSCLE_PATTERNS[m];
  const wanted = idx === 0 && hint ? hint : lists[Math.min(idx, lists.length - 1)];
  const usedPatterns = dayPatterns.get(m) || [];
  const { p, r } = ctx;
  const strength = p.goal === 'strength';
  const scored = pool.map((e) => {
    let s = 0;
    const pi = wanted.indexOf(e.pattern);
    if (pi >= 0) s += 6 - pi * 1.5; else s -= 4;
    if (usedPatterns.includes(e.pattern)) s -= 3;
    if (e.primary[0] === m) s += 1.5;
    if (e.stretch) s += 2;
    if (p.favorites.includes(e.id)) s += 4;
    if (idx === 0 && MAJOR.includes(m)) s += e.mechanic === 'compound' ? 3 : -2;
    if (idx > 0 && e.mechanic === 'isolation') s += 1;
    if (strength && idx === 0 && e.equipment.includes('barbell') && e.mechanic === 'compound') s += 3;
    if (p.experience === 'beginner') { if (isMachine(e)) s += 1.5; s -= (e.level - 1) * 1.5; if (e.fatigue === 3) s -= 1.5; }
    if (timeTight && e.fatigue === 3) s -= 1;
    if (e.fatigue === 3 && (dayFatigue3 >= 1 || ctx.fatigue3Week >= (p.experience === 'beginner' ? 1 : 3))) s -= 6;
    if (e.unilateral && timeTight) s -= 1;
    if (!isSafe(e, p.injuries)) s -= 10;
    if (STAPLES.has(e.id)) s += 2.5;
    const hasLoad = p.equipment.some((x) => LOADED.includes(x));
    if (hasLoad) {
      // com cargas disponíveis, elástico e peso corporal "fraco" viram último recurso
      if (e.equipment.includes('bands')) s -= 4;
      if (e.bodyweight && BW_WEAK_PATTERNS.includes(e.pattern)) s -= 4.5;
    }
    if (e.id.includes('declinad')) s -= 2;
    const hasPulldown = p.equipment.includes('lat_pulldown') || p.equipment.includes('assisted_pullup');
    if (hasPulldown && (e.id === 'barra-fixa-negativa' || e.id === 'barra-fixa-elastico')) s -= 4;
    if (hasPulldown && p.experience === 'beginner' && e.bodyweight && e.pattern === 'vertical_pull') s -= 3;
    // iniciante sem puxador: barra assistida com elástico antes da barra livre
    if (!hasPulldown && p.experience === 'beginner' && p.equipment.includes('bands') && e.bodyweight && e.pattern === 'vertical_pull' && e.id !== 'barra-fixa-elastico') s -= 3;
    s -= (ctx.usedWeek.get(e.id) || 0) * 3; // variedade entre os dias da semana
    s += r() * 1.8;
    return { e, s };
  });
  scored.sort((a, b) => b.s - a.s);
  return scored[0].e;
}

// ---------------------------------------------------------------------------
// Parâmetros de séries
// ---------------------------------------------------------------------------

function prescription(ex: Exercise, p: Profile, role: PlannedExercise['role']) {
  let reps: [number, number] = [...ex.reps] as [number, number];
  let rest = ex.rest;
  let rir = p.experience === 'beginner' ? 3 : 2;
  switch (p.goal) {
    case 'strength':
      if (role === 'main' && ex.mechanic === 'compound' && !ex.bodyweight
        && ex.equipment.some((e) => ['barbell', 'trap_bar', 'smith'].includes(e))
        && ['squat', 'hinge', 'horizontal_push', 'incline_push', 'vertical_push'].includes(ex.pattern)) { reps = [3, 6]; rest = Math.max(rest, 180); }
      else if (ex.mechanic === 'compound') { reps = [6, 10]; rest = Math.max(rest, 120); }
      break;
    case 'endurance':
      reps = ex.mechanic === 'compound' ? [12, 20] : [15, 25];
      rest = Math.min(rest, ex.mechanic === 'compound' ? 75 : 45);
      break;
    case 'health':
      reps = ex.mechanic === 'compound' ? [8, 12] : [12, 15];
      rir = 3;
      rest = Math.min(rest, 120);
      break;
    default:
      break;
  }
  return { reps, rest, rir };
}

const WORK_MIN = (ex: Exercise) => (ex.mechanic === 'compound' ? 0.75 : 0.6) * (ex.unilateral ? 1.8 : 1);

export function estimateMinutes(exs: PlannedExercise[]): number {
  let min = 7; // aquecimento geral
  const seen = new Set<string>();
  let firstMain = true;
  for (const pe of exs) {
    if (seen.has(pe.exId)) continue;
    const ex = getEx(pe.exId);
    if (!ex) continue;
    if (pe.supersetWith) {
      const other = exs.find((x) => x.exId === pe.supersetWith);
      const ex2 = other && getEx(other.exId);
      if (other && ex2) {
        seen.add(other.exId);
        const sets = Math.max(pe.sets, other.sets);
        min += sets * (WORK_MIN(ex) + WORK_MIN(ex2) + Math.max(pe.rest, other.rest) / 60) + 0.5;
        seen.add(pe.exId);
        continue;
      }
    }
    min += pe.sets * (WORK_MIN(ex) + pe.rest / 60) + 0.5;
    if (pe.role === 'main' && !ex.bodyweight) { min += firstMain ? 3 : 1; firstMain = false; } // séries de aproximação
    seen.add(pe.exId);
  }
  return Math.round(min);
}

// ---------------------------------------------------------------------------
// Mesociclo
// ---------------------------------------------------------------------------

export function mesocycle(p: Profile): WeekPlan[] {
  // Iniciantes: sem deload planejado (recuperam rápido). Intermediários: deload a cada ~6 semanas; avançados a cada ~5.
  // Deload ativo (metade das séries, mesma frequência) — Bell 2023; Coleman 2024.
  if (p.experience === 'beginner') {
    return [
      { week: 1, label: 'Adaptação', rir: '3–4', volumeFactor: 1, deload: false, notes: 'Aprenda a técnica. Cargas confortáveis, foque em amplitude completa e controle.' },
      { week: 2, label: 'Adaptação', rir: '3', volumeFactor: 1, deload: false, notes: 'Aumente cargas ou repetições aos poucos. Anote tudo.' },
      { week: 3, label: 'Progressão', rir: '2–3', volumeFactor: 1, deload: false, notes: 'Progressão dupla: bateu o topo da faixa em todas as séries? Suba a carga.' },
      { week: 4, label: 'Progressão', rir: '2', volumeFactor: 1, deload: false, notes: 'Continue progredindo. Iniciantes evoluem quase toda sessão.' },
      { week: 5, label: 'Progressão', rir: '2', volumeFactor: 1, deload: false, notes: 'Se a técnica está sólida, as séries devem ficar realmente desafiadoras.' },
      { week: 6, label: 'Progressão', rir: '1–2', volumeFactor: 1.1, deload: false, notes: '+1 série nos músculos prioritários.' },
      { week: 7, label: 'Progressão', rir: '1–2', volumeFactor: 1.1, deload: false, notes: 'Isoladores podem chegar perto da falha na última série.' },
      { week: 8, label: 'Reavaliação', rir: '1–2', volumeFactor: 1.1, deload: false, notes: 'Fim do ciclo: tire fotos, meça e gere um novo programa (variar exercícios). Se estiver muito cansado, faça uma semana leve.' },
    ];
  }
  const weeks: WeekPlan[] = [
    { week: 1, label: 'Introdução', rir: '3', volumeFactor: 1, deload: false, notes: 'Volume base, cargas que deixam ~3 repetições na reserva. Calibre as cargas.' },
    { week: 2, label: 'Acumulação', rir: '2', volumeFactor: 1, deload: false, notes: 'Suba carga ou repetições em relação à semana 1.' },
    { week: 3, label: 'Acumulação', rir: '2', volumeFactor: 1.1, deload: false, notes: '+1 série nos músculos prioritários.' },
    { week: 4, label: 'Acumulação', rir: '1–2', volumeFactor: 1.15, deload: false, notes: 'Perto do limite produtivo. Compostos livres pesados ficam em RIR ≥ 1.' },
    { week: 5, label: 'Pico', rir: '0–1', volumeFactor: 1.25, deload: false, notes: 'Semana mais dura: +1 série nos isoladores; última série dos isoladores/máquinas até a falha (parciais alongadas opcionais). Compostos livres em RIR 1.' },
    { week: 6, label: 'Deload', rir: '4+', volumeFactor: 0.5, deload: true, notes: 'Metade das séries, mesma frequência, ~10% menos carga. Dissipa a fadiga e prepara o próximo ciclo.' },
  ];
  if (p.experience === 'advanced') return [weeks[0], weeks[1], { ...weeks[3], week: 3 }, { ...weeks[4], week: 4 }, { ...weeks[5], week: 5 }];
  return weeks;
}

export function currentWeek(program: Program, date = new Date()): WeekPlan {
  const start = new Date(program.startDate + 'T00:00:00');
  const diff = Math.floor((date.getTime() - start.getTime()) / (7 * 86400000));
  const idx = Math.max(0, diff) % program.weeks.length;
  return program.weeks[idx];
}

/** Ajusta as séries planejadas conforme a semana do mesociclo. */
export function setsForWeek(pe: PlannedExercise, week: WeekPlan, p: Profile | null): number {
  const ex = getEx(pe.exId);
  if (week.deload) return Math.max(1, Math.ceil(pe.sets / 2));
  let s = pe.sets;
  const prio = !!ex && !!p && ex.primary.some((m) => p.priorityMuscles.includes(m));
  if (week.volumeFactor >= 1.1 && prio) s += 1;
  if (week.volumeFactor >= 1.25 && ex?.mechanic === 'isolation' && !prio) s += 1;
  return s;
}

// ---------------------------------------------------------------------------
// Gerador principal
// ---------------------------------------------------------------------------

export function generateProgram(p: Profile, seed = Date.now() % 100000, splitOverride?: SplitId): Program {
  const lifting = [...p.days].sort((a, b) => a - b).slice(0, 6);
  const n = Math.max(1, lifting.length);
  const chosen = splitOverride && splitOverride !== 'auto' ? splitOverride : p.split !== 'auto' ? p.split : autoSplit(n);
  const valid = SPLIT_INFO[chosen].min <= n && n <= SPLIT_INFO[chosen].max ? chosen : autoSplit(n);
  const kinds = splitKinds(valid, n);
  const targets = weeklyTargets(p);
  const ctx: Ctx = { p, r: rng(seed), usedWeek: new Map(), fatigue3Week: 0 };
  const timeTight = p.sessionMinutes < 50;

  // Dias e músculos (prioridades vão para o início; opcionais entram onde fazem sentido)
  const days = kinds.map((k, i) => {
    const t = T[k];
    let muscles = [...t.muscles];
    for (const m of OPTIONAL) {
      if (!targets[m]) continue;
      const fits =
        (['frontDelts'].includes(m) && muscles.some((x) => x === 'chest' || x === 'sideDelts')) ||
        (['traps', 'forearms'].includes(m) && muscles.some((x) => x === 'lats' || x === 'upperBack' || x === 'biceps')) ||
        (['adductors', 'abductors', 'lowerBack'].includes(m) && !!t.legDay) ||
        (m === 'obliques' && muscles.includes('abs'));
      if (fits && !muscles.includes(m)) muscles.push(m);
    }
    for (const m of SMALL) {
      // garante prioridade pequena presente em dias compatíveis
      if (p.priorityMuscles.includes(m) && !muscles.includes(m)) {
        const upper = muscles.some((x) => ['chest', 'lats', 'upperBack'].includes(x));
        if ((upper && ['sideDelts', 'rearDelts', 'biceps', 'triceps'].includes(m)) || (t.legDay && ['calves', 'abs'].includes(m))) muscles.push(m);
      }
    }
    const order = (m: Muscle) => (p.priorityMuscles.includes(m) ? -100 : 0) + (MAJOR.includes(m) ? 0 : 50) + muscles.indexOf(m);
    muscles = muscles.sort((a, b) => order(a) - order(b));
    return { kind: k, t, weekday: lifting[i] ?? i, muscles, exercises: [] as PlannedExercise[], used: new Set<string>(), patterns: new Map<Muscle, Pattern[]>(), fatigue3: 0 };
  });

  const weekly: Partial<Record<Muscle, number>> = {};
  const addVolume = (ex: Exercise, sets: number) => {
    for (const m of ex.primary) weekly[m] = (weekly[m] || 0) + sets;
    for (const m of ex.secondary) weekly[m] = (weekly[m] || 0) + sets * 0.5;
  };

  const dailyCap = p.experience === 'advanced' ? 10 : 8;

  const allocate = (m: Muscle, weeklySets: number) => {
    const allDays = days.map((d, i) => (d.muscles.includes(m) ? i : -1)).filter((i) => i >= 0);
    if (!allDays.length || weeklySets <= 0) return;
    // poucas séries? concentra em menos dias (mínimo de 2 séries por sessão), espaçados na semana
    const useDays = Math.max(1, Math.min(allDays.length, Math.floor(weeklySets / 2)));
    const dayIdx = Array.from({ length: useDays }, (_, k) => allDays[Math.floor((k * allDays.length) / useDays)]);
    const per = weeklySets / dayIdx.length;
    let carry = 0;
    dayIdx.forEach((di, k) => {
      const d = days[di];
      let sets = Math.round(per + carry);
      carry = per + carry - sets;
      if (sets <= 0) return;
      sets = Math.min(Math.max(sets, 2), dailyCap);
      const nEx = sets <= 4 ? 1 : sets <= 8 ? 2 : 3;
      const split = Array.from({ length: nEx }, (_, j) => Math.floor(sets / nEx) + (j < sets % nEx ? 1 : 0));
      split.forEach((s, j) => {
        const ex = pickExercise(m, j, d.used, d.patterns, d.t.hint?.[m], ctx, d.fatigue3, timeTight);
        if (!ex) return;
        d.used.add(ex.id);
        d.patterns.set(m, [...(d.patterns.get(m) || []), ex.pattern]);
        ctx.usedWeek.set(ex.id, (ctx.usedWeek.get(ex.id) || 0) + 1);
        if (ex.fatigue === 3) { d.fatigue3++; ctx.fatigue3Week++; }
        const role: PlannedExercise['role'] = j === 0 && MAJOR.includes(m) && ex.mechanic === 'compound' ? 'main' : ex.mechanic === 'compound' ? 'secondary' : 'accessory';
        const pr = prescription(ex, p, role);
        const sets2 = Math.max(2, Math.min(5, s));
        d.exercises.push({ exId: ex.id, sets: sets2, reps: pr.reps, rir: pr.rir, rest: !timeTight ? pr.rest : ex.mechanic === 'isolation' ? Math.min(pr.rest, 75) : role !== 'main' ? Math.min(pr.rest, 105) : pr.rest, technique: 'normal', role });
        addVolume(ex, sets2);
      });
      void k;
    });
  };

  // 1) músculos grandes — cada um desconta o que já recebeu de exercícios anteriores
  // (ex.: remadas alocadas para o dorsal já trabalham as costas médias; agachamentos e stiffs trabalham glúteos)
  for (const m of ['chest', 'lats', 'quads', 'hamstrings', 'upperBack', 'glutes'] as Muscle[]) {
    const target = targets[m] || 0;
    const prio = p.priorityMuscles.includes(m);
    const remaining = target - (weekly[m] || 0);
    const direct = Math.max(remaining, prio ? Math.round(target * 0.5) : 0);
    if (direct >= 2) allocate(m, Math.round(direct));
  }
  // 2) pequenos e opcionais: desconta volume indireto (contagem fracionada)
  const minDirect = p.goal === 'health' ? 2 : 4;
  for (const m of [...SMALL, ...OPTIONAL]) {
    const target = targets[m];
    if (!target) continue;
    const indirect = weekly[m] || 0;
    const prio = p.priorityMuscles.includes(m);
    let direct = Math.max(target - indirect, prio ? Math.round(target * 0.6) : minDirect);
    if (m === 'frontDelts' && !prio) direct = 0;
    allocate(m, Math.round(direct));
  }

  // 3) ordenar exercícios: compostos pesados primeiro, prioridades antes
  for (const d of days) {
    const muscleRank = (pe: PlannedExercise) => {
      const ex = getEx(pe.exId)!;
      const prio = ex.primary.some((m) => p.priorityMuscles.includes(m));
      const tier = pe.role === 'main' ? 0 : pe.role === 'secondary' ? 10 : 20;
      return tier - (prio ? 5 : 0) - ex.fatigue + d.muscles.indexOf(ex.primary[0]) * 0.1;
    };
    d.exercises.sort((a, b) => muscleRank(a) - muscleRank(b));
  }

  // 4) caber no tempo disponível: bi-sets de isoladores, depois cortar séries de músculos não prioritários
  const budget = p.sessionMinutes;
  for (const d of days) {
    const cardioReserve = 0;
    if (estimateMinutes(d.exercises) > budget - cardioReserve) applySupersets(d.exercises);
    let guard = 0;
    while (estimateMinutes(d.exercises) > budget && guard++ < 60) {
      const candidates = d.exercises
        .map((pe, i) => {
          const ex = getEx(pe.exId)!;
          const prio = ex.primary.some((m) => p.priorityMuscles.includes(m));
          const surplus = ex.primary.reduce((acc, m) => acc + (weekly[m] || 0) / Math.max(1, targets[m] || 1), 0) / ex.primary.length;
          return { pe, i, ex, score: (prio ? -10 : 0) + pe.sets + (pe.role === 'accessory' ? 2 : 0) + surplus * 3 + (ex.unilateral ? 1 : 0) };
        })
        .sort((a, b) => b.score - a.score);
      // dois exercícios do mesmo músculo com poucas séries? funde num só (menos trocas de aparelho)
      const merge = candidates.find((c) => c.pe.sets <= 2 && c.pe.role !== 'main'
        && d.exercises.some((o) => o !== c.pe && getEx(o.exId)?.primary[0] === c.ex.primary[0]));
      if (merge) {
        const sib = d.exercises.find((o) => o !== merge.pe && getEx(o.exId)?.primary[0] === merge.ex.primary[0])!;
        d.exercises = d.exercises.filter((x) => x !== merge.pe);
        d.exercises.forEach((x) => { if (x.supersetWith === merge.pe.exId) { x.supersetWith = undefined; x.technique = 'normal'; } });
        addVolume(merge.ex, -merge.pe.sets);
        if (sib.sets < 5) { sib.sets += 1; addVolume(getEx(sib.exId)!, 1); }
        continue;
      }
      const dec = candidates.find((c) => c.pe.sets > 2);
      if (dec) {
        dec.pe.sets -= 1;
        addVolume(dec.ex, -1);
        continue;
      }
      const drop = candidates.find((c) => c.pe.role !== 'main') || (d.exercises.length > 2 ? candidates[0] : undefined);
      if (!drop) break;
      d.exercises = d.exercises.filter((x) => x !== drop.pe);
      d.exercises.forEach((x) => { if (x.supersetWith === drop.pe.exId) x.supersetWith = undefined; });
      addVolume(drop.ex, -drop.pe.sets);
    }
    // aquecimento e dicas
    let firstCompound = true;
    for (const pe of d.exercises) {
      const ex = getEx(pe.exId)!;
      if (ex.mechanic === 'compound' && firstCompound && !ex.bodyweight) {
        pe.warmup = 'Aproximação: 1×8 com ~50% da carga, 1×4 com ~70%, 1×2 com ~85%. Não conte como série de trabalho.';
        firstCompound = false;
      } else if (pe.role === 'main' && !ex.bodyweight) {
        pe.warmup = '1–2 séries de aproximação (60% e 80% da carga).';
      }
      if (ex.stretch && ex.mechanic === 'isolation') pe.note = 'Priorize a posição alongada: desça devagar e pause 1s embaixo.';
    }
  }

  const planned: PlannedDay[] = days.map((d) => ({
    id: uid(),
    weekday: d.weekday,
    name: d.t.name,
    focus: d.t.focus,
    exercises: d.exercises,
    estMinutes: estimateMinutes(d.exercises),
  }));

  // 5) cardio
  const cardioPlan = buildCardio(p, planned, days.map((d) => !!d.t.legDay));

  // volume final
  const finalWeekly: Partial<Record<Muscle, number>> = {};
  for (const d of planned) for (const pe of d.exercises) {
    const ex = getEx(pe.exId);
    if (!ex) continue;
    for (const m of ex.primary) finalWeekly[m] = (finalWeekly[m] || 0) + pe.sets;
    for (const m of ex.secondary) finalWeekly[m] = (finalWeekly[m] || 0) + pe.sets * 0.5;
  }

  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    startDate: mondayOf(todayISO()),
    splitId: valid,
    splitName: SPLIT_INFO[valid].name,
    days: planned,
    weeks: mesocycle(p),
    weeklySets: finalWeekly,
    targetSets: targets,
    rationale: buildRationale(p, valid, n, targets, planned),
    cardioPlan,
    seed,
  };
}

function mondayOf(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  const day = d.getDay();
  d.setDate(d.getDate() - ((day + 6) % 7));
  return d.toISOString().slice(0, 10);
}

const ANTAGONIST: [Muscle, Muscle][] = [
  ['biceps', 'triceps'], ['sideDelts', 'abs'], ['rearDelts', 'calves'], ['sideDelts', 'calves'], ['rearDelts', 'abs'],
  ['quads', 'hamstrings'], ['chest', 'upperBack'], ['chest', 'lats'], ['sideDelts', 'biceps'], ['triceps', 'rearDelts'],
  ['calves', 'abs'], ['glutes', 'abs'], ['forearms', 'traps'], ['adductors', 'abductors'],
];

function applySupersets(exs: PlannedExercise[]) {
  const free = exs.filter((pe) => pe.role !== 'main' && !pe.supersetWith);
  for (const [a, b] of ANTAGONIST) {
    const x = free.find((pe) => !pe.supersetWith && getEx(pe.exId)?.primary[0] === a);
    const y = free.find((pe) => pe !== x && !pe.supersetWith && getEx(pe.exId)?.primary[0] === b);
    if (x && y) {
      x.supersetWith = y.exId; y.supersetWith = x.exId;
      x.technique = 'superset'; y.technique = 'superset';
      // aproxima os dois na ordem
      const iy = exs.indexOf(y); exs.splice(iy, 1);
      exs.splice(exs.indexOf(x) + 1, 0, y);
    }
  }
}

const CARDIO_LABEL: Record<CardioType, string> = {
  walk: 'Caminhada inclinada', bike: 'Bicicleta', elliptical: 'Elíptico', run: 'Corrida', rower: 'Remo ergômetro',
  stairs: 'Escada', swim: 'Natação', jump_rope: 'Pular corda',
};
export const cardioLabel = (c: CardioType) => CARDIO_LABEL[c];

function buildCardio(p: Profile, days: PlannedDay[], legDays: boolean[]): string[] {
  const types = p.cardioTypes.length ? p.cardioTypes : (['walk', 'bike'] as CardioType[]);
  const lowImpact = types.find((t) => ['bike', 'walk', 'elliptical', 'rower', 'swim'].includes(t)) || types[0];
  const weeklyTarget = { fat_loss: 180, health: 150, endurance: 200, recomp: 120, hypertrophy: 90, strength: 60 }[p.goal];
  const plan: string[] = [];
  let remaining = weeklyTarget;
  days.forEach((d, i) => {
    const spare = p.sessionMinutes - d.estMinutes;
    if (spare >= 10 && remaining > 0) {
      const minutes = Math.min(spare, 30, remaining);
      const type = legDays[i] ? (types.find((t) => t !== 'run') || lowImpact) : types[i % types.length];
      d.cardio = { type, minutes, intensity: 'Zona 2 — consegue conversar, mas com esforço (≈60–70% FCmáx)' };
      d.estMinutes += minutes;
      remaining -= minutes;
    }
  });
  if (remaining > 0) {
    const restDays = 7 - days.length;
    if (restDays > 0) plan.push(`Nos dias de descanso: ${Math.round(remaining / Math.min(restDays, 3))} min de ${CARDIO_LABEL[lowImpact].toLowerCase()} em zona 2, em até ${Math.min(restDays, 3)} dias.`);
    else plan.push(`Complete ${remaining} min/semana de cardio leve fora da academia (ex.: caminhadas).`);
  }
  if (p.goal === 'fat_loss' || p.goal === 'recomp') plan.push('Meta de passos: 8.000–10.000/dia. O NEAT (movimento do dia a dia) gasta mais calorias que o cardio formal para a maioria.');
  if (p.goal === 'endurance' || (p.goal === 'fat_loss' && p.experience !== 'beginner')) plan.push('Opcional: 1 sessão de intervalado (HIIT) por semana — ex.: 6–10 × 30s forte / 90s leve na bike, longe de treinos de perna.');
  plan.push('Prefira bike/elíptico/caminhada a corrida quando o objetivo é hipertrofia: menor interferência e menos dano muscular nas pernas. Faça o cardio depois da musculação ou com 6h+ de intervalo.');
  plan.push('Mínimo da OMS para saúde: 150–300 min/semana de atividade moderada (ou 75–150 vigorosa).');
  return plan;
}

function buildRationale(p: Profile, split: Exclude<SplitId, 'auto'>, n: number, targets: Partial<Record<Muscle, number>>, days: PlannedDay[]) {
  const out: { title: string; text: string }[] = [];
  const freq = split === 'full_body' ? n : split === 'bro' ? 1 : split === 'ppl' && n === 3 ? 1 : 2;
  out.push({
    title: `Divisão: ${SPLIT_INFO[split].name}`,
    text: `Com ${n} dia(s) por semana, essa divisão permite treinar cada músculo ~${freq}x por semana. Meta-análises mostram que, com o mesmo volume, a frequência importa pouco — mas distribuir as séries em 2+ sessões deixa cada treino mais curto e com séries de melhor qualidade.`,
  });
  const exp = { beginner: 'iniciante', intermediate: 'intermediário', advanced: 'avançado' }[p.experience];
  const tList = Object.entries(targets).map(([m, v]) => `${MUSCLE_SHORT[m as Muscle]} ${v}`).join(' · ');
  out.push({
    title: 'Volume semanal (séries por músculo)',
    text: `Para nível ${exp}, o alvo é: ${tList}. A relação volume × hipertrofia é dose-dependente com retornos decrescentes (Schoenfeld 2017; Pelland 2024). Séries de exercícios compostos contam meia série para os músculos auxiliares (ex.: supino conta 0,5 para tríceps).`,
  });
  if (p.priorityMuscles.length) {
    out.push({ title: 'Músculos prioritários', text: `${p.priorityMuscles.map((m) => MUSCLE_SHORT[m]).join(', ')} recebem ~35% mais volume e são treinados primeiro na sessão, quando você está menos fatigado.` });
  }
  out.push({
    title: 'Intensidade (RIR)',
    text: 'RIR = repetições na reserva. Treinar perto da falha (0–3 RIR) é necessário para estimular o músculo; ir à falha em todas as séries aumenta a fadiga sem ganho proporcional (Refalo 2023; Robinson 2024). Por isso o RIR cai ao longo do ciclo e a falha fica para os isoladores na semana de pico.',
  });
  out.push({
    title: 'Exercícios escolhidos',
    text: `Selecionados pelos equipamentos da sua academia${p.injuries.length ? ', evitando os que agravam suas lesões' : ''}, com preferência por exercícios que carregam o músculo alongado (ex.: rosca inclinada, tríceps acima da cabeça, flexora sentada, stiff) — estudos recentes (Maeo 2021/2023; Wolf 2023) mostram mais hipertrofia quando há tensão em comprimentos longos.`,
  });
  const maxMin = Math.max(...days.map((d) => d.estMinutes));
  out.push({
    title: 'Duração',
    text: `Cada treino foi ajustado para caber em ${p.sessionMinutes} min (maior sessão estimada: ${maxMin} min incluindo aquecimento e descansos).${days.some((d) => d.exercises.some((e) => e.supersetWith)) ? ' Para caber no tempo, alguns isoladores foram pareados em bi-set (alternando músculos não concorrentes), o que economiza tempo sem prejudicar o resultado (Iversen 2021).' : ''}`,
  });
  out.push({
    title: 'Progressão',
    text: 'Progressão dupla: trabalhe dentro da faixa de repetições. Quando completar o topo da faixa em todas as séries com o RIR alvo, suba a carga no próximo treino. O app sugere a carga de cada série com base no seu histórico.',
  });
  out.push({
    title: 'Descanso entre séries',
    text: 'Compostos: 2–3 min; isoladores: 1–1,5 min. Descansos curtos demais (<60s) reduzem o volume de carga e parecem prejudicar levemente a hipertrofia (Schoenfeld 2016; Singer 2024).',
  });
  void WEEKDAYS_FULL;
  return out;
}

/** Alternativas para trocar um exercício mantendo o mesmo músculo/padrão. */
export function alternatives(exId: string, p: Profile): Exercise[] {
  const ex = getEx(exId);
  if (!ex) return [];
  return EXERCISES.filter((e) => e.id !== exId && e.primary[0] === ex.primary[0] && isAvailable(e, p.equipment) && !p.dislikes.includes(e.id))
    .map((e) => ({ e, s: (e.pattern === ex.pattern ? 5 : 0) + (isSafe(e, p.injuries) ? 3 : -5) + (e.stretch ? 1 : 0) + (e.mechanic === ex.mechanic ? 2 : 0) }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.e)
    .slice(0, 12);
}

/** Exercícios que o usuário consegue fazer com o equipamento atual. */
export function availableExercises(p: Profile | null): Exercise[] {
  if (!p) return EXERCISES;
  return EXERCISES.filter((e) => isAvailable(e, p.equipment));
}
