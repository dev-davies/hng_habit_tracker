'use client';

import { FormEvent, useState } from 'react';

type HabitFormProps = {
  onSave: (name: string, description: string, frequency: 'daily') => void;
  onCancel: () => void;
  initial?: { name: string; description: string };
};

export default function HabitForm({ onSave, onCancel, initial }: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError('Habit name is required');
      return;
    }

    setError('');
    onSave(name.trim(), description.trim(), 'daily');
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="flex w-full max-w-lg mx-auto flex-col gap-5 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(249,115,22,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(249,115,22,0.1)] transition-all"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="habit-name" className="text-sm font-semibold text-stone-700 dark:text-stone-300 ml-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Drink water"
          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl px-4 py-4 outline-none transition-all placeholder:text-stone-400 font-medium text-stone-900 dark:text-stone-50"
          aria-invalid={!!error}
          aria-describedby={error ? "habit-name-error" : undefined}
        />
        {error && <p id="habit-name-error" aria-live="polite" className="mt-1 text-sm font-medium text-red-600 dark:text-red-400" role="alert">{error}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="habit-description" className="text-sm font-semibold text-stone-700 dark:text-stone-300 ml-1">
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={2}
          className="w-full resize-none bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl px-4 py-4 outline-none transition-all placeholder:text-stone-400 font-medium text-stone-900 dark:text-stone-50"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="habit-frequency" className="text-sm font-semibold text-stone-700 dark:text-stone-300 ml-1">
          Frequency
        </label>
        <div className="relative">
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            value="daily"
            disabled
            aria-describedby="habit-frequency-help"
            className="w-full cursor-not-allowed appearance-none bg-stone-100 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-4 text-stone-500 dark:text-stone-500 font-medium opacity-80"
          >
            <option value="daily">Daily</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-extrabold uppercase tracking-widest text-orange-600">
            Locked
          </span>
        </div>
        <p id="habit-frequency-help" className="text-xs font-medium text-stone-500 dark:text-stone-400 ml-1">
          Daily is the default frequency for every habit.
        </p>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          data-testid="habit-save-button"
          type="submit"
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-4 py-4 font-bold text-lg tracking-wide transition-all active:scale-95 shadow-md flex justify-center items-center"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-2xl px-4 py-4 font-bold text-lg tracking-wide transition-all active:scale-95 flex justify-center items-center border border-stone-200 dark:border-stone-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
