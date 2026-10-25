import { useSyncExternalStore } from 'react';

export type Tab = 'home' | 'plan' | 'progress' | 'coach' | 'more';
export type Screen =
  | null | 'workout' | 'profile' | 'equipment' | 'nutrition' | 'library' | 'learn' | 'tools' | 'settings' | 'photos' | 'regenerate';

interface Nav { tab: Tab; screen: Screen; exercise: string | null; article: string | null; workoutDay: string | null; exerciseCtx: { dayId?: string; idx?: number } | null }

let nav: Nav = { tab: 'home', screen: null, exercise: null, article: null, workoutDay: null, exerciseCtx: null };
const ls = new Set<() => void>();
const emit = () => ls.forEach((l) => l());

export function go(patch: Partial<Nav>) {
  nav = { ...nav, ...patch };
  emit();
  if (patch.tab || patch.screen !== undefined) window.scrollTo({ top: 0 });
}

export const openExercise = (id: string, ctx: Nav['exerciseCtx'] = null) => go({ exercise: id, exerciseCtx: ctx });
export const closeExercise = () => go({ exercise: null, exerciseCtx: null });

export function useNav() {
  return useSyncExternalStore((cb) => { ls.add(cb); return () => ls.delete(cb); }, () => nav);
}
