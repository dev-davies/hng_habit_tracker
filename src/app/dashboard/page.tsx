'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import HabitForm from '@/components/habits/HabitForm';
import HabitCard from '@/components/habits/HabitCard';
import { Habit } from '@/types/habit';
import { getSession } from '@/lib/storage';
import { logout } from '@/lib/auth';
import {
  createHabit,
  editHabit,
  deleteHabit,
  getHabitsByUserId,
  toggleHabitCompletion,
} from '@/lib/habits';
import { setHabits, getHabits } from '@/lib/storage';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

function Dashboard() {
  const router = useRouter();
  const [habits, setHabitsState] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const [session] = useState(() => getSession());

  const loadHabits = useCallback(() => {
    if (session) {
      setHabitsState(getHabitsByUserId(session.userId));
    }
  }, [session]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  function handleSave(name: string, description: string) {
    if (!session) return;

    if (editingHabit) {
      editHabit(editingHabit.id, { name, description });
    } else {
      createHabit(session.userId, name, description);
    }

    setShowForm(false);
    setEditingHabit(null);
    loadHabits();
  }

  function handleCancel() {
    setShowForm(false);
    setEditingHabit(null);
  }

  function handleToggleComplete(habit: Habit) {
    const today = new Date().toISOString().slice(0, 10);
    const updated = toggleHabitCompletion(habit, today);
    const allHabits = getHabits().map((h) => (h.id === updated.id ? updated : h));
    setHabits(allHabits);
    loadHabits();
  }

  function handleEdit(habit: Habit) {
    setEditingHabit(habit);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    deleteHabit(id);
    loadHabits();
  }

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen bg-stone-50 dark:bg-stone-950"
    >
      <div className="mx-auto flex w-full flex-col p-6 sm:p-10">
        <header className="mb-8 flex w-full items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">My Habits</h1>
            <p className="mt-1 text-stone-500 dark:text-stone-400 font-medium">Stay consistent one day at a time.</p>
          </div>
          <button
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </header>

        {(showForm || editingHabit) ? (
          <div className="mb-6 w-full">
            <HabitForm
              onSave={handleSave}
              onCancel={handleCancel}
              initial={editingHabit ? { name: editingHabit.name, description: editingHabit.description } : undefined}
            />
          </div>
        ) : (
          <button
            data-testid="create-habit-button"
            onClick={() => setShowForm(true)}
            className="mb-6 w-full rounded-lg bg-orange-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            + New Habit
          </button>
        )}

        {habits.length === 0 && !showForm ? (
          <div
            data-testid="empty-state"
            className="flex flex-col items-center justify-center py-20 px-6 text-center bg-stone-100/50 dark:bg-stone-900/30 rounded-3xl border-2 border-dashed border-stone-300 dark:border-stone-700"
          >
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-2">No habits yet</h3>
              <p className="text-stone-500 dark:text-stone-400">
                Create your first habit to start building a steady routine.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min w-full max-w-6xl mx-auto">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
