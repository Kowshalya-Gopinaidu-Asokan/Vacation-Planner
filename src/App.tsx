import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout, type View } from './components/layout/Layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { Dashboard } from './components/dashboard/Dashboard';
import { TripList } from './components/trips/TripList';
import { TripDetail } from './components/trips/TripDetail';

function AppContent() {
  const { loading, selectedTripId, setSelectedTripId } = useApp();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const handleNavigate = (view: View) => {
    if (view !== 'trip-detail') {
      setSelectedTripId(null);
    }
    setCurrentView(view);
  };

  const handleSelectTrip = (id: string) => {
    setSelectedTripId(id);
    setCurrentView('trip-detail');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout currentView={currentView} onNavigate={handleNavigate}>
      {currentView === 'dashboard' && (
        <Dashboard
          onNavigateTrips={() => handleNavigate('trips')}
          onSelectTrip={handleSelectTrip}
        />
      )}
      {currentView === 'trips' && <TripList onSelectTrip={handleSelectTrip} />}
      {currentView === 'trip-detail' && selectedTripId && (
        <TripDetail tripId={selectedTripId} onBack={() => handleNavigate('trips')} />
      )}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
