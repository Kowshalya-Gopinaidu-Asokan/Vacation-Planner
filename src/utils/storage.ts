import type { AppData, AppSettings } from '../types';

const DATA_KEY = 'vacation-planner-data';
const SETTINGS_KEY = 'vacation-planner-settings';

export const defaultData: AppData = {
  trips: [],
  itineraryItems: [],
  packingItems: [],
  expenses: [],
};

export const defaultSettings: AppSettings = {
  theme: 'light',
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw) as AppData;
    return {
      trips: parsed.trips ?? [],
      itineraryItems: parsed.itineraryItems ?? [],
      packingItems: parsed.packingItems ?? [],
      expenses: parsed.expenses ?? [],
    };
  } catch {
    return defaultData;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

const TRAVEL_IMAGES = [
  'photo-1488646953014-85cb44e25828',
  'photo-1469854523086-cc02afe5c88f',
  'photo-1501785888041-af3ef285b470',
  'photo-1476514525535-07fb3b4d5ee1',
  'photo-1506924958477-0b28d0776424',
  'photo-1528127269322-539801943592',
  'photo-1530789253808-905859662ae2',
  'photo-1504150558240-0b4fd8946624',
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDestinationImageUrl(destination: string): string {
  const index = hashString(destination.toLowerCase()) % TRAVEL_IMAGES.length;
  const photoId = TRAVEL_IMAGES[index];
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&q=80`;
}
