'use client';

import { FormEvent, useState } from 'react';
import { validateHabitName } from '@/lib/validators';

type HabitFormProps = {
  onSave: (name: string, description: string, frequency: 'daily') => void;
  onCancel: () => void;
  initial?: { name: string; description: string };
};

export default function HabitForm({ onSave, onCancel, initial }: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    onSave(validation.value, description.trim(), 'daily');
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="habit-name" className="text-sm font-medium">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Drink water"
          required
          className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="habit-description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={2}
          className="border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-foreground"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="habit-frequency" className="text-sm font-medium">
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value="daily"
          disabled
          className="border rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button
          data-testid="habit-save-button"
          type="submit"
          className="flex-1 bg-foreground text-background rounded px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border rounded px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
