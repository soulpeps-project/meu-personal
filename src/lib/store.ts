import { useSyncExternalStore } from 'react';
import type { AppState } from './types';

const KEY = 'meu-personal:v1';

const initial: AppState = {
  version: 1,
  profile: null,
  program: null,
  sessions: [],
  measurements: [],
  photos: [],
  chat: [],
  settings: { apiKey: '', model: 'claude-opus-5-5', restSound: true, vibration: true, theme: 'dark' },
  customVideos: {},
  exerciseNotes: {},
  active: null,
  checklist: {},
};

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw);
    return { ...initial, ...parsed, settings: { ...initial.settings, ...(parsed.settings || {}) } };
  } catch {
    return initial;
  }
}

let state: AppState = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Falha ao salvar', e);
  }
}

export function getState() {
  return state;
}

export function setState(updater: (s: AppState) => AppState | Partial<AppState>) {
  const next = updater(state);
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
}

export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(state),
  );
}

export function exportData(): string {
  return JSON.stringify({ ...state, settings: { ...state.settings, apiKey: '' } }, null, 2);
}

export function importData(json: string) {
  const parsed = JSON.parse(json);
  if (parsed.version !== 1) throw new Error('Arquivo de backup inválido');
  state = { ...initial, ...parsed, settings: { ...initial.settings, ...parsed.settings, apiKey: state.settings.apiKey } };
  persist();
  listeners.forEach((l) => l());
}

export function resetAll() {
  state = { ...initial, settings: state.settings };
  persist();
  listeners.forEach((l) => l());
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
export const todayISO = () => new Date().toISOString().slice(0, 10);
