import { describe, test, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';

const baseHabit: Habit = {
  id: '1',
  userId: 'user-1',
  name: 'Morning Run',
  description: 'Run every morning',
  frequency: 'daily',
  createdAt: '2025-01-01',
  completions: ['2025-01-08', '2025-01-09'],
};

describe('toggleHabitCompletion', () => {
  test('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(baseHabit, '2025-01-10');
    expect(result.completions).toContain('2025-01-10');
    expect(result.completions).toHaveLength(3);
  });

  test('removes a completion date when the date already exists', () => {
    const result = toggleHabitCompletion(baseHabit, '2025-01-09');
    expect(result.completions).not.toContain('2025-01-09');
    expect(result.completions).toHaveLength(1);
  });

  test('does not mutate the original habit object', () => {
    const originalCompletions = [...baseHabit.completions];
    toggleHabitCompletion(baseHabit, '2025-01-10');
    expect(baseHabit.completions).toEqual(originalCompletions);
  });

  test('does not return duplicate completion dates', () => {
    const habitWithDupes: Habit = {
      ...baseHabit,
      completions: ['2025-01-08', '2025-01-08', '2025-01-09'],
    };
    const result = toggleHabitCompletion(habitWithDupes, '2025-01-10');
    const uniqueDates = new Set(result.completions);
    expect(result.completions.length).toBe(uniqueDates.size);
  });
});
