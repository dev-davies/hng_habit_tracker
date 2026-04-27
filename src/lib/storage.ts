import { User, Session } from '@/types/auth';
import { Habit } from '@/types/habit';

const KEYS = {
  users: 'habit-tracker-users',
  session: 'habit-tracker-session',
  habits: 'habit-tracker-habits',
} as const;

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function getItem<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isClient()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers(): User[] {
  return getItem<User[]>(KEYS.users, []);
}

export function setUsers(users: User[]): void {
  setItem(KEYS.users, users);
}

export function getSession(): Session | null {
  return getItem<Session | null>(KEYS.session, null);
}

export function setSession(session: Session | null): void {
  setItem(KEYS.session, session);
}

export function getHabits(): Habit[] {
  return getItem<Habit[]>(KEYS.habits, []);
}

export function setHabits(habits: Habit[]): void {
  setItem(KEYS.habits, habits);
}
