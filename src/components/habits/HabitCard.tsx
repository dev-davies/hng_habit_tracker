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
      className={`border rounded-lg p-4 flex flex-col gap-3 transition-colors ${
        completedToday
          ? 'bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-700'
          : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={`font-medium text-sm break-words ${completedToday ? 'line-through opacity-70' : ''}`}>
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-xs text-gray-500 mt-1 break-words">{habit.description}</p>
          )}
        </div>
        <span
          data-testid={`habit-streak-${slug}`}
          className="text-xs font-mono whitespace-nowrap px-2 py-1 rounded bg-gray-100 dark:bg-gray-800"
        >
          {streak}d streak
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggleComplete(habit)}
          className={`text-xs px-3 py-1.5 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            completedToday
              ? 'bg-green-600 text-white focus:ring-green-600'
              : 'bg-foreground text-background focus:ring-foreground'
          }`}
        >
          {completedToday ? 'Completed' : 'Mark Done'}
        </button>
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="text-xs px-3 py-1.5 rounded border font-medium focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
        >
          Edit
        </button>

        {confirmingDelete ? (
          <div className="flex gap-1">
            <button
              data-testid="confirm-delete-button"
              onClick={() => {
                onDelete(habit.id);
                setConfirmingDelete(false);
              }}
              className="text-xs px-3 py-1.5 rounded bg-red-600 text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="text-xs px-3 py-1.5 rounded border font-medium focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirmingDelete(true)}
            className="text-xs px-3 py-1.5 rounded border border-red-300 text-red-600 font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
