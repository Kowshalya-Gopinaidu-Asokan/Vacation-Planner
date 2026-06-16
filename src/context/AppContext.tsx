import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { sampleData } from '../data/sampleData';
import type {
  AppData,
  AppSettings,
  Expense,
  ExpenseCategory,
  ItineraryItem,
  PackingItem,
  Trip,
  TripFilter,
} from '../types';
import { generateId } from '../utils/id';
import {
  isCompleted,
  isUpcoming,
  sortTripsByStartDate,
} from '../utils/dates';
import { loadData, loadSettings, saveData, saveSettings } from '../utils/storage';

interface AppContextValue {
  loading: boolean;
  data: AppData;
  settings: AppSettings;
  searchQuery: string;
  tripFilter: TripFilter;
  selectedTripId: string | null;
  setSearchQuery: (query: string) => void;
  setTripFilter: (filter: TripFilter) => void;
  setSelectedTripId: (id: string | null) => void;
  toggleTheme: () => void;
  loadSampleData: () => void;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  addItineraryItem: (item: Omit<ItineraryItem, 'id'>) => void;
  updateItineraryItem: (item: ItineraryItem) => void;
  deleteItineraryItem: (id: string) => void;
  addPackingItem: (item: Omit<PackingItem, 'id'>) => void;
  togglePackingItem: (id: string) => void;
  deletePackingItem: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  filteredTrips: Trip[];
  upcomingTrips: Trip[];
  totalBudget: number;
  getTripExpenses: (tripId: string) => Expense[];
  getTripItinerary: (tripId: string) => ItineraryItem[];
  getTripPacking: (tripId: string) => PackingItem[];
  getPackingProgress: (tripId: string) => number;
  getTripPreparationProgress: (tripId: string) => number;
  getNextTrip: () => Trip | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AppData>({ trips: [], itineraryItems: [], packingItems: [], expenses: [] });
  const [settings, setSettings] = useState<AppSettings>({ theme: 'light' });
  const [searchQuery, setSearchQuery] = useState('');
  const [tripFilter, setTripFilter] = useState<TripFilter>('all');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadData();
    const storedSettings = loadSettings();
    setData(stored);
    setSettings(storedSettings);
    document.documentElement.setAttribute('data-theme', storedSettings.theme);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveData(data);
    }
  }, [data, loading]);

  useEffect(() => {
    if (!loading) {
      saveSettings(settings);
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settings, loading]);

  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  }, []);

  const loadSampleData = useCallback(() => {
    setData(sampleData);
  }, []);

  const addTrip = useCallback((trip: Omit<Trip, 'id'>) => {
    setData((prev) => ({
      ...prev,
      trips: [...prev.trips, { ...trip, id: generateId() }],
    }));
  }, []);

  const updateTrip = useCallback((trip: Trip) => {
    setData((prev) => ({
      ...prev,
      trips: prev.trips.map((t) => (t.id === trip.id ? trip : t)),
    }));
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setData((prev) => ({
      trips: prev.trips.filter((t) => t.id !== id),
      itineraryItems: prev.itineraryItems.filter((i) => i.tripId !== id),
      packingItems: prev.packingItems.filter((p) => p.tripId !== id),
      expenses: prev.expenses.filter((e) => e.tripId !== id),
    }));
    setSelectedTripId((current) => (current === id ? null : current));
  }, []);

  const addItineraryItem = useCallback((item: Omit<ItineraryItem, 'id'>) => {
    setData((prev) => ({
      ...prev,
      itineraryItems: [...prev.itineraryItems, { ...item, id: generateId() }],
    }));
  }, []);

  const updateItineraryItem = useCallback((item: ItineraryItem) => {
    setData((prev) => ({
      ...prev,
      itineraryItems: prev.itineraryItems.map((i) => (i.id === item.id ? item : i)),
    }));
  }, []);

  const deleteItineraryItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      itineraryItems: prev.itineraryItems.filter((i) => i.id !== id),
    }));
  }, []);

  const addPackingItem = useCallback((item: Omit<PackingItem, 'id'>) => {
    setData((prev) => ({
      ...prev,
      packingItems: [...prev.packingItems, { ...item, id: generateId(), packed: false }],
    }));
  }, []);

  const togglePackingItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      packingItems: prev.packingItems.map((p) =>
        p.id === id ? { ...p, packed: !p.packed } : p,
      ),
    }));
  }, []);

  const deletePackingItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      packingItems: prev.packingItems.filter((p) => p.id !== id),
    }));
  }, []);

  const addExpense = useCallback(
    (expense: Omit<Expense, 'id'>) => {
      setData((prev) => ({
        ...prev,
        expenses: [...prev.expenses, { ...expense, id: generateId() }],
      }));
    },
    [],
  );

  const deleteExpense = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  }, []);

  const filteredTrips = useMemo(() => {
    let trips = data.trips;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      trips = trips.filter(
        (t) =>
          t.destination.toLowerCase().includes(query) ||
          t.name.toLowerCase().includes(query),
      );
    }

    if (tripFilter === 'upcoming') {
      trips = trips.filter((t) => isUpcoming(t.endDate));
    } else if (tripFilter === 'completed') {
      trips = trips.filter((t) => isCompleted(t.endDate));
    }

    return sortTripsByStartDate(trips);
  }, [data.trips, searchQuery, tripFilter]);

  const upcomingTrips = useMemo(
    () => sortTripsByStartDate(data.trips.filter((t) => isUpcoming(t.endDate))),
    [data.trips],
  );

  const totalBudget = useMemo(
    () => data.trips.reduce((sum, t) => sum + t.estimatedBudget, 0),
    [data.trips],
  );

  const getTripExpenses = useCallback(
    (tripId: string) => data.expenses.filter((e) => e.tripId === tripId),
    [data.expenses],
  );

  const getTripItinerary = useCallback(
    (tripId: string) =>
      [...data.itineraryItems.filter((i) => i.tripId === tripId)].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
      }),
    [data.itineraryItems],
  );

  const getTripPacking = useCallback(
    (tripId: string) => data.packingItems.filter((p) => p.tripId === tripId),
    [data.packingItems],
  );

  const getPackingProgress = useCallback(
    (tripId: string) => {
      const items = data.packingItems.filter((p) => p.tripId === tripId);
      if (items.length === 0) return 0;
      return Math.round((items.filter((p) => p.packed).length / items.length) * 100);
    },
    [data.packingItems],
  );

  const getTripPreparationProgress = useCallback(
    (tripId: string) => {
      const packing = getPackingProgress(tripId);
      const itinerary = getTripItinerary(tripId);
      const expenses = getTripExpenses(tripId);
      const trip = data.trips.find((t) => t.id === tripId);

      let score = 0;
      if (packing > 0) score += packing * 0.4;
      if (itinerary.length > 0) score += 30;
      if (expenses.length > 0) score += 30;
      if (trip && trip.notes.trim()) score += 10;

      return Math.min(100, Math.round(score));
    },
    [data.trips, getPackingProgress, getTripItinerary, getTripExpenses],
  );

  const getNextTrip = useCallback((): Trip | null => {
    const future = data.trips
      .filter((t) => isUpcoming(t.startDate))
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
    return future[0] ?? null;
  }, [data.trips]);

  const value: AppContextValue = {
    loading,
    data,
    settings,
    searchQuery,
    tripFilter,
    selectedTripId,
    setSearchQuery,
    setTripFilter,
    setSelectedTripId,
    toggleTheme,
    loadSampleData,
    addTrip,
    updateTrip,
    deleteTrip,
    addItineraryItem,
    updateItineraryItem,
    deleteItineraryItem,
    addPackingItem,
    togglePackingItem,
    deletePackingItem,
    addExpense,
    deleteExpense,
    filteredTrips,
    upcomingTrips,
    totalBudget,
    getTripExpenses,
    getTripItinerary,
    getTripPacking,
    getPackingProgress,
    getTripPreparationProgress,
    getNextTrip,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}

export type { ExpenseCategory };
