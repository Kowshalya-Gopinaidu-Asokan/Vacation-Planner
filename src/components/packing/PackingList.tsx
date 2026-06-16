import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validatePackingItem } from '../../utils/validation';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { ProgressBar } from '../common/ProgressBar';

interface PackingListProps {
  tripId: string;
}

export function PackingList({ tripId }: PackingListProps) {
  const { getTripPacking, getPackingProgress, addPackingItem, togglePackingItem, deletePackingItem } =
    useApp();
  const items = getTripPacking(tripId);
  const progress = getPackingProgress(tripId);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePackingItem(name);
    if (!result.valid) {
      setError(result.errors.name ?? 'Invalid item');
      return;
    }

    addPackingItem({ tripId, name: name.trim(), packed: false });
    setName('');
    setError('');
  };

  return (
    <div className="packing animate-in">
      <Card className="packing__header">
        <div className="packing__header-top">
          <h3>Packing List</h3>
          <span className="packing__count">
            {items.filter((i) => i.packed).length} / {items.length} packed
          </span>
        </div>
        <ProgressBar
          value={progress}
          label="Packing progress"
          color={progress === 100 ? 'success' : progress > 50 ? 'primary' : 'warning'}
        />
      </Card>

      <Card>
        <form className="packing__form" onSubmit={handleAdd} noValidate>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add packing item..."
            className={error ? 'input--error' : ''}
            aria-label="New packing item"
          />
          <Button type="submit">Add</Button>
        </form>
        {error && <span className="form__error">{error}</span>}
      </Card>

      {items.length === 0 ? (
        <EmptyState
          icon="🧳"
          title="Nothing to pack yet"
          description="Add items to your packing list and check them off as you go."
        />
      ) : (
        <ul className="packing__list">
          {items.map((item) => (
            <li
              key={item.id}
              className={`packing-item animate-in ${item.packed ? 'packing-item--packed' : ''}`}
            >
              <label className="packing-item__label">
                <input
                  type="checkbox"
                  checked={item.packed}
                  onChange={() => togglePackingItem(item.id)}
                />
                <span className="packing-item__name">{item.name}</span>
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deletePackingItem(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                ✕
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
