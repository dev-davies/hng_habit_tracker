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
      className="flex w-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="habit-name" className="text-sm font-medium text-slate-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Drink water"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        />
        {error && <p className="mt-1 text-sm text-red-600" role="alert">{error}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="habit-description" className="text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={2}
          className="resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="habit-frequency" className="text-sm font-medium text-slate-700">
          Frequency
        </label>
        <div className="relative">
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            value="daily"
            disabled
            aria-describedby="habit-frequency-help"
            className="w-full cursor-not-allowed appearance-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 pr-20 text-sm font-medium text-slate-700 opacity-100"
          >
            <option value="daily">Daily</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold uppercase tracking-wide text-orange-600">
            Locked
          </span>
        </div>
        <p id="habit-frequency-help" className="text-xs text-slate-500">
          Daily is the default frequency for every habit.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          data-testid="habit-save-button"
          type="submit"
          className="flex-1 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
