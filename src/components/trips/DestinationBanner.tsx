import type { Trip } from '../../types';
import { getDestinationImageUrl } from '../../utils/storage';
import { formatDate, tripDuration } from '../../utils/dates';

interface DestinationBannerProps {
  trip: Trip;
}

export function DestinationBanner({ trip }: DestinationBannerProps) {
  return (
    <div
      className="destination-banner"
      style={{ backgroundImage: `url(${getDestinationImageUrl(trip.destination)})` }}
    >
      <div className="destination-banner__overlay">
        <h1 className="destination-banner__title">{trip.name}</h1>
        <p className="destination-banner__destination">{trip.destination}</p>
        <p className="destination-banner__dates">
          {formatDate(trip.startDate)} — {formatDate(trip.endDate)} ·{' '}
          {tripDuration(trip.startDate, trip.endDate)} days
        </p>
      </div>
    </div>
  );
}
