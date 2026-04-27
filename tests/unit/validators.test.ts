import { describe, test, expect } from 'vitest';
import { validateHabitName } from '@/lib/validators';

describe('validateHabitName', () => {
  test('returns an error when habit name is empty', () => {
    const result = validateHabitName('   ');
    expect(result).toEqual({ valid: false, value: '', error: 'Habit name is required' });
  });

  test('returns an error when habit name exceeds 60 characters', () => {
    const longName = 'a'.repeat(61);
    const result = validateHabitName(longName);
    expect(result).toEqual({ valid: false, value: longName, error: 'Habit name must be 60 characters or fewer' });
  });

  test('returns a trimmed value when habit name is valid', () => {
    const result = validateHabitName('  Morning Run  ');
    expect(result).toEqual({ valid: true, value: 'Morning Run', error: null });
  });
});
