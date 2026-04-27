import { Habit } from '@/types/habit';
import { getHabits, setHabits } from '@/lib/storage';

export function createHabit(userId: string, name: string, description: string = ''): Habit {
  const habit: Habit = {
    id: crypto.randomUUID(),
    userId,
    name,
    description,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    completions: [],
  };

  setHabits([...getHabits(), habit]);
  return habit;
}

export function editHabit(id: string, updates: { name?: string; description?: string }): Habit {
  const habits = getHabits();
  const index = habits.findIndex((h) => h.id === id);

  if (index === -1) {
    throw new Error('Habit not found');
  }

  const updated = { ...habits[index], ...updates };
  habits[index] = updated;
  setHabits(habits);
  return updated;
}

export function deleteHabit(id: string): void {
  setHabits(getHabits().filter((h) => h.id !== id));
}

export function getHabitsByUserId(userId: string): Habit[] {
  return getHabits().filter((h) => h.userId === userId);
}

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const hasDate = habit.completions.includes(date);

  const completions = hasDate
    ? habit.completions.filter((d) => d !== date)
    : [...new Set([...habit.completions, date])];

  return { ...habit, completions };
}
