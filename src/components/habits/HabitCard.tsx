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
      className="group relative bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-[4px_4px_0px_0px_rgba(249,115,22,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(249,115,22,0.1)] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(249,115,22,0.4)] first:md:col-span-2 first:md:row-span-2 flex flex-col justify-between"
    >
      <div className="flex min-w-0 items-start gap-3">
        <button
          type="button"
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggleComplete(habit)}
          className={`mt-0.5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
            completedToday
              ? 'border-orange-500 bg-orange-500 text-white'
              : 'border-stone-300 bg-white text-stone-700 dark:bg-stone-950 dark:text-stone-300'
          }`}
          aria-pressed={completedToday}
          aria-label={completedToday ? `Mark ${habit.name} as incomplete` : `Mark ${habit.name} as complete`}
        >
          {completedToday ? 'Done' : 'Mark'}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={`break-words font-extrabold text-2xl leading-tight ${
              completedToday ? 'text-stone-400 line-through' : 'text-stone-900 dark:text-stone-50'
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
