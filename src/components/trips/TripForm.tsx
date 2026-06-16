import { useState } from 'react';
import type { Trip } from '../../types';
import { validateTrip } from '../../utils/validation';
import { Button } from '../common/Button';

interface TripFormProps {
  initial?: Trip;
  onSubmit: (data: Omit<Trip, 'id'>) => void;
  onCancel: () => void;
}

export function TripForm({ initial, onSubmit, onCancel }: TripFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [destination, setDestination] = useState(initial?.destination ?? '');
  const [startDate, setStartDate] = useState(initial?.startDate ?? '');
  const [endDate, setEndDate] = useState(initial?.endDate ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [estimatedBudget, setEstimatedBudget] = useState(
    initial?.estimatedBudget?.toString() ?? '',
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateTrip({ name, destination, startDate, endDate, estimatedBudget });
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    onSubmit({
      name: name.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      notes: notes.trim(),
      estimatedBudget: parseFloat(estimatedBudget),
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__group">
        <label htmlFor="trip-name">Trip Name</label>
        <input
          id="trip-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Summer in Paris"
          className={errors.name ? 'input--error' : ''}
        />
        {errors.name && <span className="form__error">{errors.name}</span>}
      </div>

      <div className="form__group">
        <label htmlFor="trip-destination">Destination</label>
        <input
          id="trip-destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Paris, France"
          className={errors.destination ? 'input--error' : ''}
        />
        {errors.destination && <span className="form__error">{errors.destination}</span>}
      </div>

      <div className="form__row">
        <div className="form__group">
          <label htmlFor="trip-start">Start Date</label>
          <input
            id="trip-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={errors.startDate ? 'input--error' : ''}
          />
          {errors.startDate && <span className="form__error">{errors.startDate}</span>}
        </div>

        <div className="form__group">
          <label htmlFor="trip-end">End Date</label>
          <input
            id="trip-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={errors.endDate ? 'input--error' : ''}
          />
          {errors.endDate && <span className="form__error">{errors.endDate}</span>}
        </div>
      </div>

      <div className="form__group">
        <label htmlFor="trip-budget">Estimated Budget ($)</label>
        <input
          id="trip-budget"
          type="number"
          min="0"
          step="0.01"
          value={estimatedBudget}
          onChange={(e) => setEstimatedBudget(e.target.value)}
          placeholder="3000"
          className={errors.estimatedBudget ? 'input--error' : ''}
        />
        {errors.estimatedBudget && (
          <span className="form__error">{errors.estimatedBudget}</span>
        )}
      </div>

      <div className="form__group">
        <label htmlFor="trip-notes">Notes</label>
        <textarea
          id="trip-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Things to remember, must-see spots..."
          rows={3}
        />
      </div>

      <div className="form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initial ? 'Save Changes' : 'Create Trip'}</Button>
      </div>
    </form>
  );
}
