import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { Modal } from '../common/Modal';
import { TripCard } from './TripCard';
import { TripForm } from './TripForm';
import type { TripFilter } from '../../types';

interface TripListProps {
  onSelectTrip: (id: string) => void;
}

const FILTERS: { value: TripFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

export function TripList({ onSelectTrip }: TripListProps) {
  const {
    filteredTrips,
    searchQuery,
    setSearchQuery,
    tripFilter,
    setTripFilter,
    addTrip,
    loadSampleData,
    data,
  } = useApp();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">My Trips</h1>
          <p className="page__subtitle">Plan, organize, and track your vacations</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ New Trip</Button>
      </div>

      <Card className="filters-bar">
        <div className="search-box">
          <span className="search-box__icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            placeholder="Search by destination or trip name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search trips"
          />
        </div>
        <div className="filter-tabs" role="tablist" aria-label="Filter trips">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={tripFilter === f.value}
              className={`filter-tab ${tripFilter === f.value ? 'filter-tab--active' : ''}`}
              onClick={() => setTripFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {filteredTrips.length === 0 ? (
        <EmptyState
          icon="🗺️"
          title={data.trips.length === 0 ? 'No trips yet' : 'No matching trips'}
          description={
            data.trips.length === 0
              ? 'Create your first vacation plan or load sample data to explore the app.'
              : 'Try adjusting your search or filter to find trips.'
          }
          action={
            data.trips.length === 0 ? (
              <div className="empty-state__actions">
                <Button onClick={() => setShowModal(true)}>Create Trip</Button>
                <Button variant="secondary" onClick={loadSampleData}>
                  Load Sample Data
                </Button>
              </div>
            ) : undefined
          }
        />
      ) : (
        <div className="trip-grid">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onClick={() => onSelectTrip(trip.id)} />
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Trip"
        size="md"
      >
        <TripForm
          onSubmit={(tripData) => {
            addTrip(tripData);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}
