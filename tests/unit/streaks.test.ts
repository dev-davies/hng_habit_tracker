import { describe, test, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

describe('calculateCurrentStreak', () => {
  test('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], '2025-01-10')).toBe(0);
    expect(calculateCurrentStreak([])).toBe(0);
  });

  test('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak(['2025-01-08', '2025-01-09'], '2025-01-10')).toBe(0);
  });

  test('returns the correct streak for consecutive completed days', () => {
    expect(calculateCurrentStreak(['2025-01-08', '2025-01-09', '2025-01-10'], '2025-01-10')).toBe(3);
  });

  test('ignores duplicate completion dates', () => {
    expect(calculateCurrentStreak(['2025-01-09', '2025-01-09', '2025-01-10'], '2025-01-10')).toBe(2);
  });

  test('breaks the streak when a calendar day is missing', () => {
    expect(calculateCurrentStreak(['2025-01-07', '2025-01-09', '2025-01-10'], '2025-01-10')).toBe(2);
  });
});
