'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';

type HabitCardProps = {
  habit: Habit;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

export default function HabitCard({ habit, onToggleComplete, onEdit, onDelete }: HabitCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().slice(0, 10);
  const completedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions);

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`w-full min-w-0 rounded-xl border p-4 transition-colors ${
        completedToday
          ? 'border-orange-200 bg-orange-50'
          : 'border-zinc-200 bg-white'
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <button
          type="button"
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggleComplete(habit)}
          className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
            completedToday
              ? 'border-orange-500 bg-orange-500 text-white'
              : 'border-zinc-300 bg-white text-slate-700'
          }`}
          aria-pressed={completedToday}
          aria-label={completedToday ? `Mark ${habit.name} as incomplete` : `Mark ${habit.name} as complete`}
        >
          {completedToday ? 'Done' : 'Mark'}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={`break-words text-sm font-semibold leading-5 ${
              completedToday ? 'text-slate-400 line-through' : 'text-slate-900'
            }`}
          >
            {habit.name}
          </h3>
          {habit.description && (
            <p className="mt-1 break-words text-xs leading-5 text-slate-500">{habit.description}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span
          data-testid={`habit-streak-${slug}`}
          className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
            completedToday ? 'bg-orange-100 text-orange-700' : 'bg-zinc-100 text-slate-600'
          }`}
        >
          {streak}d streak
        </span>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Edit
          </button>

          {confirmingDelete ? (
            <button
              type="button"
              data-testid="confirm-delete-button"
              onClick={() => {
                onDelete(habit.id);
                setConfirmingDelete(false);
              }}
              className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Confirm
            </button>
          ) : (
            <button
              type="button"
              data-testid={`habit-delete-${slug}`}
              onClick={() => setConfirmingDelete(true)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
