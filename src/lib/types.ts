import type { EquipmentId, Injury, Muscle } from '../data/exercises';

export type Sex = 'M' | 'F';
export type Experience = 'beginner' | 'intermediate' | 'advanced';
export type Goal = 'hypertrophy' | 'strength' | 'fat_loss' | 'recomp' | 'health' | 'endurance';
export type Activity = 'sedentary' | 'light' | 'moderate' | 'high';
export type SplitId = 'auto' | 'full_body' | 'upper_lower' | 'ppl' | 'ul_ppl' | 'ppl_x2' | 'bro';
export type CardioType = 'walk' | 'bike' | 'elliptical' | 'run' | 'rower' | 'stairs' | 'swim' | 'jump_rope';

export interface Profile {
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  bodyFat?: number;
  experience: Experience;
  monthsTraining: number;
  goal: Goal;
  secondaryGoal?: Goal;
  targetWeightKg?: number;
  priorityMuscles: Muscle[];
  days: number[]; // 0 = domingo
  sessionMinutes: number;
  equipment: EquipmentId[];
  injuries: Injury[];
  injuryNotes: string;
  activity: Activity;
  stepsPerDay?: number;
  sleepHours: number;
  cardioTypes: CardioType[];
  split: SplitId;
  dislikes: string[]; // ids de exercícios
  favorites: string[];
  notes: string;
  createdAt: string;
}

export type Technique = 'normal' | 'superset' | 'myo' | 'drop' | 'lengthened';

export interface PlannedExercise {
  exId: string;
  sets: number;
  reps: [number, number];
  rir: number;
  rest: number;
  technique: Technique;
  supersetWith?: string; // exId pareado
  role: 'main' | 'secondary' | 'accessory';
  note?: string;
  warmup?: string;
}

export interface PlannedDay {
  id: string;
  weekday: number;
  name: string;
  focus: string;
  exercises: PlannedExercise[];
  estMinutes: number;
  cardio?: { type: CardioType; minutes: number; intensity: string };
}

export interface WeekPlan {
  week: number;
  label: string;
  rir: string;
  volumeFactor: number;
  deload: boolean;
  notes: string;
}

export interface Program {
  id: string;
  createdAt: string;
  startDate: string;
  splitId: Exclude<SplitId, 'auto'>;
  splitName: string;
  days: PlannedDay[];
  weeks: WeekPlan[];
  weeklySets: Partial<Record<Muscle, number>>;
  targetSets: Partial<Record<Muscle, number>>;
  rationale: { title: string; text: string }[];
  cardioPlan: string[];
  seed: number;
}

export interface SetLog { weight: number; reps: number; rir: number | null; done: boolean; type?: 'warmup' | 'work' | 'drop' }

export interface ExerciseLog { exId: string; sets: SetLog[]; note?: string }

export interface SessionLog {
  id: string;
  date: string; // ISO
  dayId: string;
  dayName: string;
  week: number;
  exercises: ExerciseLog[];
  durationMin: number;
  rpe?: number;
  notes?: string;
  cardioMin?: number;
}

export interface Measurement {
  id: string;
  date: string;
  weightKg?: number;
  waist?: number;
  hip?: number;
  neck?: number;
  chest?: number;
  arm?: number;
  thigh?: number;
  calf?: number;
  bodyFat?: number;
}

export type Pose = 'front' | 'side' | 'back' | 'other';
export interface PhotoMeta { id: string; date: string; pose: Pose; weightKg?: number; note?: string; analysis?: string }

export interface ChatMsg { role: 'user' | 'assistant'; content: string; ts: string }

export interface Settings {
  apiKey: string;
  model: string;
  restSound: boolean;
  vibration: boolean;
  theme: 'dark' | 'light';
}

export interface ActiveSession {
  dayId: string;
  startedAt: string;
  exercises: ExerciseLog[];
  swaps: Record<string, string>; // exId planejado -> exId usado
}

export interface AppState {
  version: 1;
  profile: Profile | null;
  program: Program | null;
  sessions: SessionLog[];
  measurements: Measurement[];
  photos: PhotoMeta[];
  chat: ChatMsg[];
  settings: Settings;
  customVideos: Record<string, string>;
  exerciseNotes: Record<string, string>;
  active: ActiveSession | null;
  checklist: Record<string, string[]>; // data -> itens de hábitos marcados
}
