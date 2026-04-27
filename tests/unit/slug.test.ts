import { describe, test, expect } from 'vitest';
import { getHabitSlug } from '@/lib/slug';

describe('getHabitSlug', () => {
  test('returns lowercase hyphenated slug for a basic habit name', () => {
    expect(getHabitSlug('Morning Run')).toBe('morning-run');
  });

  test('trims outer spaces and collapses repeated internal spaces', () => {
    expect(getHabitSlug('  Read   a   Book  ')).toBe('read-a-book');
  });

  test('removes non-alphanumeric characters except hyphens', () => {
    expect(getHabitSlug('Yoga & Meditation!!')).toBe('yoga--meditation');
  });
});
