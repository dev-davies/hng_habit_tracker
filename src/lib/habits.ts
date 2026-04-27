import { Habit } from '@/types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const hasDate = habit.completions.includes(date);

  const completions = hasDate
    ? habit.completions.filter((d) => d !== date)
    : [...new Set([...habit.completions, date])];

  return { ...habit, completions };
}
