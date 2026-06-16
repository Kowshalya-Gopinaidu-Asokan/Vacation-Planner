import { useState } from 'react';
import type { ItineraryItem } from '../../types';
import { validateItinerary } from '../../utils/validation';
import { formatDate } from '../../utils/dates';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';

interface ItineraryPlannerProps {
  tripId: string;
}

export function ItineraryPlanner({ tripId }: ItineraryPlannerProps) {
  const { getTripItinerary, addItineraryItem, deleteItineraryItem, data } = useApp();
  const items = getTripItinerary(tripId);
  const trip = data.trips.find((t) => t.id === tripId);

  const [date, setDate] = useState('');
  const [activityName, setActivityName] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateItinerary({ date, activityName, time });
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    addItineraryItem({
      tripId,
      date,
      activityName: activityName.trim(),
      time,
      location: location.trim(),
      notes: notes.trim(),
    });

    setDate('');
    setActivityName('');
    setTime('');
    setLocation('');
    setNotes('');
    setErrors({});
  };

  const grouped = groupByDate(items);

  return (
    <div className="itinerary animate-in">
      <Card className="itinerary__form-card">
        <h3>Add Activity</h3>
        <form className="form form--inline" onSubmit={handleAdd} noValidate>
          <div className="form__row form__row--wrap">
            <div className="form__group">
              <label htmlFor="itin-date">Date</label>
              <input
                id="itin-date"
                type="date"
                value={date}
                min={trip?.startDate}
                max={trip?.endDate}
                onChange={(e) => setDate(e.target.value)}
                className={errors.date ? 'input--error' : ''}
              />
              {errors.date && <span className="form__error">{errors.date}</span>}
            </div>
            <div className="form__group form__group--grow">
              <label htmlFor="itin-activity">Activity</label>
              <input
                id="itin-activity"
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="Museum visit"
                className={errors.activityName ? 'input--error' : ''}
              />
              {errors.activityName && (
                <span className="form__error">{errors.activityName}</span>
              )}
            </div>
            <div className="form__group">
              <label htmlFor="itin-time">Time</label>
              <input
                id="itin-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={errors.time ? 'input--error' : ''}
              />
              {errors.time && <span className="form__error">{errors.time}</span>}
            </div>
          </div>
          <div className="form__row form__row--wrap">
            <div className="form__group form__group--grow">
              <label htmlFor="itin-location">Location</label>
              <input
                id="itin-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Downtown"
              />
            </div>
            <div className="form__group form__group--grow">
              <label htmlFor="itin-notes">Notes</label>
              <input
                id="itin-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
              />
            </div>
          </div>
          <Button type="submit">Add Activity</Button>
        </form>
      </Card>

      {items.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No activities planned"
          description="Start building your daily itinerary by adding activities above."
        />
      ) : (
        <div className="itinerary__list">
          {Object.entries(grouped).map(([day, dayItems]) => (
            <div key={day} className="itinerary-day animate-in">
              <h4 className="itinerary-day__date">{formatDate(day)}</h4>
              {dayItems.map((item) => (
                <ItineraryItemCard
                  key={item.id}
                  item={item}
                  onDelete={() => deleteItineraryItem(item.id)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ItineraryItemCard({
  item,
  onDelete,
}: {
  item: ItineraryItem;
  onDelete: () => void;
}) {
  return (
    <Card className="itinerary-item">
      <div className="itinerary-item__time">{item.time}</div>
      <div className="itinerary-item__body">
        <h4>{item.activityName}</h4>
        {item.location && <p className="itinerary-item__location">📍 {item.location}</p>}
        {item.notes && <p className="itinerary-item__notes">{item.notes}</p>}
      </div>
      <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Remove activity">
        ✕
      </Button>
    </Card>
  );
}

function groupByDate(items: ItineraryItem[]): Record<string, ItineraryItem[]> {
  return items.reduce<Record<string, ItineraryItem[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});
}
