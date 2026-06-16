import type { Trip } from '../../types';
import { formatDate, isUpcoming, tripDuration } from '../../utils/dates';
import { getDestinationImageUrl } from '../../utils/storage';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { useApp } from '../../context/AppContext';

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
}

export function TripCard({ trip, onClick }: TripCardProps) {
  const { getTripPreparationProgress } = useApp();
  const progress = getTripPreparationProgress(trip.id);
  const upcoming = isUpcoming(trip.endDate);

  return (
    <Card hoverable className="trip-card animate-in" onClick={onClick}>
      <div
        className="trip-card__banner"
        style={{ backgroundImage: `url(${getDestinationImageUrl(trip.destination)})` }}
      >
        <span className={`trip-card__badge ${upcoming ? 'trip-card__badge--upcoming' : 'trip-card__badge--completed'}`}>
          {upcoming ? 'Upcoming' : 'Completed'}
        </span>
      </div>
      <div className="trip-card__body">
        <h3 className="trip-card__name">{trip.name}</h3>
        <p className="trip-card__destination">📍 {trip.destination}</p>
        <p className="trip-card__dates">
          {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
        </p>
        <p className="trip-card__meta">
          {tripDuration(trip.startDate, trip.endDate)} days · ${trip.estimatedBudget.toLocaleString()}
        </p>
        {upcoming && (
          <ProgressBar
            value={progress}
            label="Preparation"
            size="sm"
            color={progress >= 80 ? 'success' : 'primary'}
          />
        )}
      </div>
    </Card>
  );
}
