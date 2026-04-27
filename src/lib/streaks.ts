export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayDate = today ?? new Date().toISOString().slice(0, 10);

  const dateSet = new Set(completions);

  if (!dateSet.has(todayDate)) {
    return 0;
  }

  let streak = 1;
  const [y, m, d] = todayDate.split('-').map(Number);
  let current = new Date(Date.UTC(y, m - 1, d));

  while (true) {
    current.setUTCDate(current.getUTCDate() - 1);
    const prevStr = current.toISOString().slice(0, 10);

    if (dateSet.has(prevStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
