import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import { DestinationBanner } from './DestinationBanner';
import { TripForm } from './TripForm';
import { ItineraryPlanner } from '../itinerary/ItineraryPlanner';
import { PackingList } from '../packing/PackingList';
import { BudgetTracker } from '../budget/BudgetTracker';

type TripTab = 'overview' | 'itinerary' | 'packing' | 'budget';

interface TripDetailProps {
  tripId: string;
  onBack: () => void;
}

const TABS: { id: TripTab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '📋' },
  { id: 'itinerary', label: 'Itinerary', icon: '📅' },
  { id: 'packing', label: 'Packing', icon: '🧳' },
  { id: 'budget', label: 'Budget', icon: '💰' },
];

export function TripDetail({ tripId, onBack }: TripDetailProps) {
  const {
    data,
    updateTrip,
    deleteTrip,
    getTripPreparationProgress,
    getPackingProgress,
    getTripItinerary,
    getTripExpenses,
  } = useApp();
  const [activeTab, setActiveTab] = useState<TripTab>('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const trip = data.trips.find((t) => t.id === tripId);

  if (!trip) {
    return (
      <div className="page">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Trips
        </Button>
        <p>Trip not found.</p>
      </div>
    );
  }

  const prepProgress = getTripPreparationProgress(tripId);
  const packingProgress = getPackingProgress(tripId);
  const itineraryCount = getTripItinerary(tripId).length;
  const expenseTotal = getTripExpenses(tripId).reduce((s, e) => s + e.amount, 0);

  return (
    <div className="page trip-detail">
      <Button variant="ghost" className="back-btn" onClick={onBack}>
        ← Back to Trips
      </Button>

      <DestinationBanner trip={trip} />

      <div className="trip-detail__tabs" role="tablist" aria-label="Trip sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`trip-tab ${activeTab === tab.id ? 'trip-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span aria-hidden="true">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div className="trip-detail__content">
        {activeTab === 'overview' && (
          <div className="overview animate-in">
            <div className="overview__grid">
              <Card>
                <h3>Preparation Progress</h3>
                <ProgressBar
                  value={prepProgress}
                  label="Overall readiness"
                  color={prepProgress >= 80 ? 'success' : 'primary'}
                />
              </Card>
              <Card>
                <h3>Quick Stats</h3>
                <ul className="stats-list">
                  <li>
                    <span>Itinerary items</span>
                    <strong>{itineraryCount}</strong>
                  </li>
                  <li>
                    <span>Packing progress</span>
                    <strong>{packingProgress}%</strong>
                  </li>
                  <li>
                    <span>Planned expenses</span>
                    <strong>${expenseTotal.toLocaleString()}</strong>
                  </li>
                  <li>
                    <span>Estimated budget</span>
                    <strong>${trip.estimatedBudget.toLocaleString()}</strong>
                  </li>
                </ul>
              </Card>
            </div>

            {trip.notes && (
              <Card className="overview__notes">
                <h3>Notes</h3>
                <p>{trip.notes}</p>
              </Card>
            )}

            <div className="overview__actions">
              <Button onClick={() => setShowEditModal(true)}>Edit Trip</Button>
              <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                Delete Trip
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'itinerary' && <ItineraryPlanner tripId={tripId} />}
        {activeTab === 'packing' && <PackingList tripId={tripId} />}
        {activeTab === 'budget' && <BudgetTracker tripId={tripId} />}
      </div>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Trip">
        <TripForm
          initial={trip}
          onSubmit={(tripData) => {
            updateTrip({ ...tripData, id: trip.id });
            setShowEditModal(false);
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Trip"
        size="sm"
      >
        <p className="confirm-text">
          Are you sure you want to delete <strong>{trip.name}</strong>? This will also remove all
          itinerary, packing, and budget data for this trip.
        </p>
        <div className="form__actions">
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteTrip(trip.id);
              onBack();
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
