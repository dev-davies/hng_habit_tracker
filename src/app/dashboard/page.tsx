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

  const session = getSession();

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
      className="min-h-screen bg-slate-50"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col px-4 py-8">
        <header className="mb-8 flex w-full items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My Habits</h1>
            <p className="mt-1 text-sm text-slate-500">Stay consistent one day at a time.</p>
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
            className="flex w-full flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
          >
            <div className="max-w-md">
              <p className="text-lg font-medium text-slate-700">No habits yet</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create your first habit to start building a steady routine.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-3">
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
