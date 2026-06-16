export type ExpenseCategory =
  | 'flights'
  | 'accommodation'
  | 'food'
  | 'transportation'
  | 'activities'
  | 'other';

export type TripFilter = 'all' | 'upcoming' | 'completed';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes: string;
  estimatedBudget: number;
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  date: string;
  activityName: string;
  time: string;
  location: string;
  notes: string;
}

export interface PackingItem {
  id: string;
  tripId: string;
  name: string;
  packed: boolean;
}

export interface Expense {
  id: string;
  tripId: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
}

export interface AppData {
  trips: Trip[];
  itineraryItems: ItineraryItem[];
  packingItems: PackingItem[];
  expenses: Expense[];
}

export interface AppSettings {
  theme: 'light' | 'dark';
}

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'flights', label: 'Flights' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'food', label: 'Food' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'activities', label: 'Activities' },
  { value: 'other', label: 'Other' },
];
