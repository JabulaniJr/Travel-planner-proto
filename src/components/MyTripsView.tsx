import React, { useState } from 'react';
import {
  Calendar,
  Users,
  PlusCircle,
  ArrowRight,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';
import { Trip } from '../types';

interface MyTripsViewProps {
  trips: Trip[];
  activeTripId: string;
  onSelectTrip: (tripId: string) => void;
  onOpenCreateWizard: () => void;
  onDeleteTrip: (tripId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  trips,
  activeTripId,
  onSelectTrip,
  onOpenCreateWizard,
  onDeleteTrip,
  onNavigateTab,
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredTrips = trips.filter((t) => {
    if (filter === 'upcoming') return t.status === 'upcoming';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div id="my-trips-view" className="space-y-8 pb-12 max-w-7xl mx-auto">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Trips</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your personal travel plans, past itineraries, and active group journeys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              All ({trips.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'upcoming' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'completed' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Completed
            </button>
          </div>

          <button
            onClick={onOpenCreateWizard}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ New Trip</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => {
          const isActive = trip.id === activeTripId;
          const spent = trip.expenses.reduce((s, e) => s + e.amount, 0);

          return (
            <div
              key={trip.id}
              className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-lg flex flex-col justify-between ${
                isActive
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={trip.coverImage}
                  alt={trip.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-800 backdrop-blur-xs">
                    {trip.status}
                  </span>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                      Selected
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-xl font-bold drop-shadow-sm leading-tight">
                    {trip.name}
                  </h3>
                  <p className="text-xs text-slate-200 mt-0.5">
                    {trip.destination}, {trip.country}
                  </p>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Dates</span>
                    </span>
                    <span className="font-semibold text-slate-800">
                      {trip.startDate} – {trip.endDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                      <span>Travellers</span>
                    </span>
                    <span className="font-semibold text-slate-800">
                      {trip.travellerCount} people ({trip.companionType})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Budget</span>
                    <span className="font-semibold text-slate-800">
                      {trip.currency} {spent.toLocaleString()} / {trip.currency}{' '}
                      {trip.totalBudget.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onSelectTrip(trip.id);
                      onNavigateTab('overview');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>Open Trip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {trips.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${trip.name}?`)) {
                          onDeleteTrip(trip.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
