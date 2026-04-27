import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/app/dashboard/page';
import { setSession, setHabits, getHabits } from '@/lib/storage';

const pushMock = vi.fn();
const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));

beforeEach(() => {
  localStorage.clear();
  pushMock.mockClear();
  replaceMock.mockClear();
  setSession({ userId: 'user-1', email: 'test@example.com' });
});

describe('habit form', () => {
  test('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await user.click(screen.getByTestId('create-habit-button'));
    await user.click(screen.getByTestId('habit-save-button'));

    expect(screen.getByText('Habit name is required')).toBeInTheDocument();
  });

  test('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await user.click(screen.getByTestId('create-habit-button'));
    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    await user.type(screen.getByTestId('habit-description-input'), 'Stay hydrated');
    await user.click(screen.getByTestId('habit-save-button'));

    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
    expect(screen.getByText('Drink Water')).toBeInTheDocument();
    expect(screen.getByText('Stay hydrated')).toBeInTheDocument();

    const stored = getHabits();
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Drink Water');
    expect(stored[0].userId).toBe('user-1');
    expect(stored[0].frequency).toBe('daily');
  });

  test('edits an existing habit and preserves immutable fields', async () => {
    const user = userEvent.setup();

    const habit = {
      id: 'habit-1',
      userId: 'user-1',
      name: 'Morning Run',
      description: 'Run 5k',
      frequency: 'daily' as const,
      createdAt: '2025-01-01T00:00:00.000Z',
      completions: ['2025-06-01'],
    };
    setHabits([habit]);

    render(<DashboardPage />);

    await user.click(screen.getByTestId('habit-edit-morning-run'));

    const nameInput = screen.getByTestId('habit-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Evening Run');

    await user.click(screen.getByTestId('habit-save-button'));

    expect(screen.getByTestId('habit-card-evening-run')).toBeInTheDocument();
    expect(screen.getByText('Evening Run')).toBeInTheDocument();

    const stored = getHabits();
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Evening Run');
    expect(stored[0].id).toBe('habit-1');
    expect(stored[0].createdAt).toBe('2025-01-01T00:00:00.000Z');
    expect(stored[0].completions).toEqual(['2025-06-01']);
  });

  test('deletes a habit only after explicit confirmation', async () => {
    const user = userEvent.setup();

    setHabits([
      {
        id: 'habit-1',
        userId: 'user-1',
        name: 'Meditate',
        description: '',
        frequency: 'daily',
        createdAt: '2025-01-01T00:00:00.000Z',
        completions: [],
      },
    ]);

    render(<DashboardPage />);

    expect(screen.getByTestId('habit-card-meditate')).toBeInTheDocument();

    await user.click(screen.getByTestId('habit-delete-meditate'));

    expect(screen.getByTestId('habit-card-meditate')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();

    await user.click(screen.getByTestId('confirm-delete-button'));

    expect(screen.queryByTestId('habit-card-meditate')).not.toBeInTheDocument();
    expect(getHabits()).toHaveLength(0);
  });

  test('toggles completion and updates the streak display', async () => {
    const user = userEvent.setup();
    const today = new Date().toISOString().slice(0, 10);

    setHabits([
      {
        id: 'habit-1',
        userId: 'user-1',
        name: 'Read',
        description: '',
        frequency: 'daily',
        createdAt: '2025-01-01T00:00:00.000Z',
        completions: [],
      },
    ]);

    render(<DashboardPage />);

    const streakBefore = screen.getByTestId('habit-streak-read');
    expect(streakBefore).toHaveTextContent('0d streak');

    await user.click(screen.getByTestId('habit-complete-read'));

    const streakAfter = screen.getByTestId('habit-streak-read');
    expect(streakAfter).toHaveTextContent('1d streak');

    const stored = getHabits();
    expect(stored[0].completions).toContain(today);

    await user.click(screen.getByTestId('habit-complete-read'));

    expect(screen.getByTestId('habit-streak-read')).toHaveTextContent('0d streak');
    expect(getHabits()[0].completions).not.toContain(today);
  });
});
