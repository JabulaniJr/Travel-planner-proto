import React from 'react';
import {
  Calendar,
  Wallet,
  Users,
  CloudSun,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { Trip, Activity } from '../types';

interface TripOverviewViewProps {
  trip: Trip;
  onNavigateTab: (tab: string) => void;
  onOpenReplanModal: (cause?: string) => void;
}

export const TripOverviewView: React.FC<TripOverviewViewProps> = ({
  trip,
  onNavigateTab,
  onOpenReplanModal,
}) => {
  const totalSpent = trip.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = trip.totalBudget - totalSpent;
  const budgetPercentage = Math.min(100, Math.round((totalSpent / trip.totalBudget) * 100));

  const todayDay = trip.itinerary[0]; // Day 1 as today's plan

  return (
    <div id="trip-overview-view" className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[200px] flex flex-col justify-end p-6 sm:p-8 shadow-md">
        <img
          src={trip.coverImage}
          alt={trip.destination}
          className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-semibold backdrop-blur-xs mb-2">
              <span>{trip.country}</span>
              <span>•</span>
              <span>{trip.travelStyle} Style</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {trip.name}
            </h1>
            <p className="text-slate-300 text-sm mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" />
                {trip.startDate} – {trip.endDate} ({trip.durationDays} days)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-400" />
                {trip.travellerCount} travellers
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenReplanModal('Bad weather')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>✨ Re-plan Day</span>
            </button>
            <button
              onClick={() => onNavigateTab('itinerary')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>View Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 17. Four Important Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Itinerary */}
        <div
          id="overview-card-itinerary"
          onClick={() => onNavigateTab('itinerary')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              📅 Itinerary
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {trip.itinerary.length} days planned
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {todayDay ? `${todayDay.activities.length} activities scheduled today` : 'Ready to plan'}
          </p>
          <div className="mt-3 text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Explore days</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Budget */}
        <div
          id="overview-card-budget"
          onClick={() => onNavigateTab('budget')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              💰 Budget
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {trip.currency} {totalSpent.toLocaleString()}
            <span className="text-xs font-medium text-slate-400 ml-1">
              / {trip.currency} {trip.totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2">
            <div
              className={`h-full rounded-full ${
                budgetPercentage > 90 ? 'bg-amber-500' : 'bg-teal-500'
              }`}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
          <div className="mt-2 text-xs font-semibold text-teal-600 flex items-center justify-between">
            <span>{trip.currency} {remainingBudget.toLocaleString()} left</span>
            <span className="flex items-center gap-0.5">
              Breakdown <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Group */}
        <div
          id="overview-card-group"
          onClick={() => onNavigateTab('group')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              👥 Group
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {trip.travellerCount} travellers
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex -space-x-2 overflow-hidden">
              {trip.members.map((m) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.name}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full">
              82% match
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold text-purple-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Votes & Expense Split</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: Conditions / Weather */}
        <div
          id="overview-card-conditions"
          onClick={() => onOpenReplanModal('Bad weather')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              🌤️ Conditions
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CloudSun className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {trip.weatherForecast?.temperature || '24°C'}
          </div>
          <p className="text-xs text-amber-700 font-medium mt-1 line-clamp-1">
            ⚠️ Rain expected tomorrow afternoon
          </p>
          <div className="mt-3 text-xs font-semibold text-amber-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Re-plan for rain</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Plan (Left) & AI Recommendations + Important Updates (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Plan Timeline Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Today's Plan</h3>
              <p className="text-xs text-slate-500">
                {todayDay?.title || 'Day 1 Schedule'} • {todayDay?.activities?.length || 0}{' '}
                activities scheduled
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('itinerary')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Itinerary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs divide-y divide-slate-100">
            {todayDay?.activities?.slice(0, 4).map((activity, index) => (
              <div key={activity.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-4">
                {/* Time Indicator */}
                <div className="w-20 shrink-0 text-right">
                  <span className="text-xs font-bold text-slate-800 block">{activity.time}</span>
                  <span className="text-[11px] text-slate-400 block">{activity.durationMinutes}m</span>
                </div>

                {/* Vertical Step Line & Bullet */}
                <div className="relative flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100 mt-1 shrink-0" />
                  {index < 3 && <div className="w-0.5 flex-1 bg-slate-200 mt-1 min-h-[30px]" />}
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {activity.title}
                    </h4>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg shrink-0">
                      {activity.costDisplay || `${trip.currency}${activity.cost}`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {activity.description}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{activity.location}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick link to interactive Map */}
          <div
            onClick={() => onNavigateTab('map')}
            className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200/60 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Interactive Route Map for Today
                </h4>
                <p className="text-[11px] text-slate-500">
                  Explore pins, walking routes, and Tokyo metro transit times.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
              Open Map <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Right Column: AI Recommendations & Important Updates */}
        <div className="space-y-6">
          {/* AI Recommendations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>AI Recommendations</span>
            </div>

            <ul className="space-y-2.5">
              {trip.aiNotes?.map((note, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2"
                >
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Updates / Live Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Important Updates
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {trip.notifications.length} notices
              </span>
            </div>

            <div className="space-y-2.5">
              {trip.notifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{notif.title}</span>
                    <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  {notif.replanTrigger && (
                    <button
                      onClick={() => onOpenReplanModal(notif.replanTrigger)}
                      className="mt-2 text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>✨ Re-plan for this update</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
