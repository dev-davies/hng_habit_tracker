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
      className="min-h-screen flex flex-col items-center px-4 py-6 max-w-lg mx-auto"
    >
      <header className="w-full flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold">My Habits</h1>
        <button
          data-testid="auth-logout-button"
          onClick={handleLogout}
          className="text-sm px-3 py-1.5 rounded border font-medium focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
        >
          Logout
        </button>
      </header>

      {(showForm || editingHabit) ? (
        <div className="w-full mb-6">
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
          className="w-full mb-6 bg-foreground text-background rounded px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
        >
          + New Habit
        </button>
      )}

      {habits.length === 0 && !showForm ? (
        <div
          data-testid="empty-state"
          className="w-full text-center py-12 text-gray-400"
        >
          <p className="text-lg mb-2">No habits yet</p>
          <p className="text-sm">Create your first habit to get started.</p>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3">
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
  );
}
