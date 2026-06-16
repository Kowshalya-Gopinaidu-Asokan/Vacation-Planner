import { useApp } from '../../context/AppContext';
import { daysUntil, formatDate, formatShortDate } from '../../utils/dates';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { ProgressBar } from '../common/ProgressBar';
import { TripCard } from '../trips/TripCard';

interface DashboardProps {
  onNavigateTrips: () => void;
  onSelectTrip: (id: string) => void;
}

export function Dashboard({ onNavigateTrips, onSelectTrip }: DashboardProps) {
  const {
    data,
    upcomingTrips,
    totalBudget,
    getNextTrip,
    getTripPreparationProgress,
    loadSampleData,
  } = useApp();

  const nextTrip = getNextTrip();
  const daysToNext = nextTrip ? daysUntil(nextTrip.startDate) : null;

  if (data.trips.length === 0) {
    return (
      <div className="page">
        <div className="page__header">
          <div>
            <h1 className="page__title">Welcome, Traveler!</h1>
            <p className="page__subtitle">Your vacation planning hub awaits</p>
          </div>
        </div>
        <EmptyState
          icon="🌍"
          title="Start planning your next adventure"
          description="Create trips, build itineraries, pack smart, and track your budget — all in one place."
          action={
            <div className="empty-state__actions">
              <Button onClick={onNavigateTrips}>Create Your First Trip</Button>
              <Button variant="secondary" onClick={loadSampleData}>
                Explore with Sample Data
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="page dashboard">
      <div className="page__header">
        <div>
          <h1 className="page__title">Dashboard</h1>
          <p className="page__subtitle">Your vacation overview at a glance</p>
        </div>
      </div>

      <div className="stat-grid">
        <Card className="stat-card stat-card--primary animate-in">
          <span className="stat-card__icon" aria-hidden="true">
            🗓️
          </span>
          <div>
            <p className="stat-card__label">Total Trips</p>
            <p className="stat-card__value">{data.trips.length}</p>
          </div>
        </Card>
        <Card className="stat-card stat-card--accent animate-in">
          <span className="stat-card__icon" aria-hidden="true">
            ✈️
          </span>
          <div>
            <p className="stat-card__label">Upcoming</p>
            <p className="stat-card__value">{upcomingTrips.length}</p>
          </div>
        </Card>
        <Card className="stat-card stat-card--success animate-in">
          <span className="stat-card__icon" aria-hidden="true">
            💵
          </span>
          <div>
            <p className="stat-card__label">Total Budget</p>
            <p className="stat-card__value">${totalBudget.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {nextTrip && daysToNext !== null && daysToNext >= 0 && (
        <Card className="countdown-card animate-in">
          <div className="countdown-card__content">
            <div>
              <p className="countdown-card__label">Next Adventure</p>
              <h2 className="countdown-card__trip">{nextTrip.name}</h2>
              <p className="countdown-card__destination">{nextTrip.destination}</p>
              <p className="countdown-card__date">Departs {formatDate(nextTrip.startDate)}</p>
            </div>
            <div className="countdown-card__timer">
              <span className="countdown-card__days">{daysToNext}</span>
              <span className="countdown-card__unit">
                {daysToNext === 1 ? 'day' : 'days'} to go
              </span>
            </div>
          </div>
          <ProgressBar
            value={getTripPreparationProgress(nextTrip.id)}
            label="Trip preparation"
            color="success"
          />
          <Button variant="secondary" size="sm" onClick={() => onSelectTrip(nextTrip.id)}>
            View Trip Details
          </Button>
        </Card>
      )}

      <section className="dashboard__section">
        <div className="section-header">
          <h2>Upcoming Trips</h2>
          <Button variant="ghost" size="sm" onClick={onNavigateTrips}>
            View All →
          </Button>
        </div>

        {upcomingTrips.length === 0 ? (
          <Card>
            <p className="muted">No upcoming trips. Time to plan your next getaway!</p>
          </Card>
        ) : (
          <div className="trip-grid trip-grid--compact">
            {upcomingTrips.slice(0, 3).map((trip) => (
              <TripCard key={trip.id} trip={trip} onClick={() => onSelectTrip(trip.id)} />
            ))}
          </div>
        )}
      </section>

      <section className="dashboard__section">
        <h2>Quick Timeline</h2>
        <Card className="timeline">
          {sortTimeline(data.trips).map((trip) => (
            <div key={trip.id} className="timeline__item animate-in">
              <div className="timeline__dot" />
              <div className="timeline__content">
                <strong>{trip.name}</strong>
                <span>
                  {formatShortDate(trip.startDate)} — {formatShortDate(trip.endDate)}
                </span>
              </div>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}

function sortTimeline<T extends { startDate: string }>(trips: T[]): T[] {
  return [...trips].sort((a, b) => a.startDate.localeCompare(b.startDate));
}
