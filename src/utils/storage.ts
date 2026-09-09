import { Trip, Activity, DayItinerary, Expense, GroupPoll } from '../types';
import { INITIAL_TRIPS } from '../data/initialData';

const TRIPS_STORAGE_KEY = 'travel_planner_trips_v1';
const ACTIVE_TRIP_ID_KEY = 'travel_planner_active_trip_id_v1';
const USER_CURRENCY_KEY = 'travel_planner_currency_v1';

export function getStoredTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(TRIPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(INITIAL_TRIPS));
      return INITIAL_TRIPS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(INITIAL_TRIPS));
      return INITIAL_TRIPS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load trips from storage:', err);
    return INITIAL_TRIPS;
  }
}

export function saveTrips(trips: Trip[]): void {
  try {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  } catch (err) {
    console.error('Failed to save trips to storage:', err);
  }
}

export function getActiveTripId(trips: Trip[]): string {
  const stored = localStorage.getItem(ACTIVE_TRIP_ID_KEY);
  if (stored && trips.some((t) => t.id === stored)) {
    return stored;
  }
  return trips[0]?.id || '';
}

export function setActiveTripId(id: string): void {
  localStorage.setItem(ACTIVE_TRIP_ID_KEY, id);
}

export function getPreferredCurrency(): string {
  return localStorage.getItem(USER_CURRENCY_KEY) || 'RM';
}

export function setPreferredCurrency(curr: string): void {
  localStorage.setItem(USER_CURRENCY_KEY, curr);
}

export function resetDemoData(): Trip[] {
  localStorage.removeItem(TRIPS_STORAGE_KEY);
  localStorage.removeItem(ACTIVE_TRIP_ID_KEY);
  return INITIAL_TRIPS;
}

export const loadTrips = getStoredTrips;
export const loadActiveTripId = () => getActiveTripId(getStoredTrips());
export const saveActiveTripId = setActiveTripId;
export const resetToInitialData = resetDemoData;
