import React from 'react';
import {
  Sparkles,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Plane,
  Coffee,
  Landmark,
  Utensils,
  Camera,
  Compass,
} from 'lucide-react';
import { Trip, Activity } from '../types';

interface DashboardViewProps {
  trips: Trip[];
  activeTrip: Trip | null;
  onSelectTrip: (tripId: string) => void;
  onOpenCreateWizard: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenReplanModal: (cause?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  trips,
  activeTrip,
  onSelectTrip,
  onOpenCreateWizard,
  onNavigateTab,
  onOpenReplanModal,
}) => {
  // Calculate days to departure
  const getCountdown = (startDateStr: string) => {
    const today = new Date('2026-09-06');
    const tripStart = new Date(startDateStr);
    const diffTime = tripStart.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays} days to go`;
    if (diffDays === 0) return 'Starts today!';
    return 'In progress / recent';
  };

  const trip = activeTrip || trips[0];
  const spent = trip ? trip.expenses.reduce((acc, curr) => acc + curr.amount, 0) : 0;
  const total = trip ? trip.totalBudget : 5000;
  const remaining = Math.max(0, total - spent);
  const budgetPercent = Math.min(100, Math.round((spent / total) * 100));
  const avgDaily = trip && trip.durationDays > 0 ? Math.round(spent / trip.durationDays) : 245;

  const dayOne = trip?.itinerary[0];
  const dayOneActivities: Activity[] = dayOne?.activities || [];

  const getActivityIcon = (cat: string) => {
    switch (cat) {
      case 'Food':
        return <Utensils className="w-5 h-5 text-orange-400" />;
      case 'Culture':
        return <Plane className="w-5 h-5 text-white" />;
      case 'Photography':
        return <Camera className="w-5 h-5 text-[#14B8A6]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#14B8A6]" />;
    }
  };

  return (
    <div id="dashboard-view" className="space-y-8 pb-12 max-w-7xl mx-auto text-[#0F172A]">
      {/* Top Header Section from Design */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
            Plan less. Travel more.
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Welcome back, Alex! Your {trip ? `${trip.destination} adventure` : 'journey'} starts in{' '}
            {trip ? getCountdown(trip.startDate) : '12 days'}.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-[#0F172A]">Alex Morgan</p>
            <p className="text-xs text-slate-400">Pro Plan</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Alex Morgan"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Disruption & Re-plan Announcement Banner if alert is active */}
      {trip && trip.notifications?.some((n) => !n.read && n.replanTrigger) && (
        <section
          id="disruption-banner"
          className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                Live Trip Notification
              </span>
              <p className="text-sm font-semibold text-[#0F172A] mt-0.5">
                Heavy rain expected tomorrow afternoon in {trip.destination}.
              </p>
              <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                Outdoor stops at Sumida Park may be affected. AI can auto-swap with indoor cultural venues.
              </p>
            </div>
          </div>
          <button
            id="banner-replan-btn"
            onClick={() => onOpenReplanModal('Bad weather')}
            className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>✨ Re-plan my day</span>
          </button>
        </section>
      )}

      {/* Main 2-Column Showcase Grid from Natural Tones Design */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8-Col Section */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Hero Card with Cover Image, Overlay, Badges & Travellers */}
          {trip && (
            <div className="relative group rounded-3xl overflow-hidden min-h-[260px] h-64 sm:h-72 shadow-xl bg-slate-900">
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10" />
              <img
                src={trip.coverImage}
                alt={trip.destination}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Bottom Details */}
              <div className="absolute bottom-6 left-6 sm:left-8 z-20 pr-6">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-semibold uppercase tracking-wider">
                    Upcoming Trip
                  </span>
                  <span className="px-3 py-1 bg-[#14B8A6] text-white rounded-full text-xs font-semibold">
                    {getCountdown(trip.startDate)}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
                  {trip.destination} Adventure
                </h2>

                <p className="text-white/80 text-xs sm:text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/80" />
                  <span>
                    {trip.startDate} – {trip.endDate} • {trip.travellerCount} Travellers
                  </span>
                </p>
              </div>

              {/* Top-Right Stacked Avatar Cluster */}
              <div className="absolute top-6 right-6 sm:right-8 z-20 flex gap-2">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400 overflow-hidden shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80"
                      alt="Traveller"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400 overflow-hidden shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80"
                      alt="Traveller"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400 overflow-hidden shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80"
                      alt="Traveller"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    +{Math.max(1, trip.travellerCount - 3)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Today's Itinerary — Day 1 Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-[#0F172A]">Today's Itinerary — Day 1</h3>
              <button
                onClick={() => onNavigateTab('itinerary')}
                className="text-sm font-semibold text-[#2563EB] hover:underline cursor-pointer"
              >
                View Full Schedule
              </button>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-4 flex-1 relative">
              <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-100" />

              {dayOneActivities.length > 0 ? (
                dayOneActivities.slice(0, 3).map((act, index) => {
                  const isFeatured = index === 1 || act.category === 'Culture';
                  return (
                    <div
                      key={act.id}
                      className={`flex gap-4 items-start relative z-10 ${
                        isFeatured
                          ? 'bg-[#F0FDFA] p-3 rounded-2xl border border-[#CCFBF1]'
                          : ''
                      }`}
                    >
                      <div
                        className={`w-14 text-right text-xs font-bold mt-1 ${
                          isFeatured ? 'text-[#14B8A6]' : 'text-slate-400'
                        }`}
                      >
                        {act.time.split(' ')[0]}
                      </div>

                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                          isFeatured
                            ? 'bg-[#14B8A6] text-white shadow-md'
                            : 'bg-white border-2 border-slate-100 shadow-sm'
                        }`}
                      >
                        {getActivityIcon(act.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-[#0F172A] text-sm leading-tight truncate">
                            {act.title}
                          </h4>
                          {isFeatured && (
                            <span className="px-2 py-0.5 bg-teal-200 text-teal-800 text-[10px] rounded uppercase font-bold tracking-tight">
                              Must See
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {act.location} • Est. {act.costDisplay || `¥${act.cost * 30}`}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No scheduled activities yet. Open Itinerary to add activities!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 4-Col Section */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Budget Status Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-[#0F172A]">Budget Status</h3>
              <span className="text-xs font-bold text-slate-400">{trip?.currency || 'RM'}</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 font-medium">
                    Spent: <span className="text-[#0F172A] font-semibold">{trip?.currency} {spent.toLocaleString()}</span>
                  </span>
                  <span className="text-slate-500 font-medium">
                    Total: <span className="text-[#0F172A] font-semibold">{trip?.currency} {total.toLocaleString()}</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                    style={{ width: `${budgetPercent}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                    Remaining
                  </p>
                  <p className="text-lg font-bold text-[#22C55E]">
                    {trip?.currency} {remaining.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                    Avg Daily
                  </p>
                  <p className="text-lg font-bold text-[#0F172A]">
                    {trip?.currency} {avgDaily.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <span className="text-xl">💡</span>
                <p className="text-xs text-amber-800 leading-relaxed">
                  <span className="font-bold">AI Insight:</span> You're spending 12% more on food.
                  Consider allocating {trip?.currency} 80 less per day to stay on track.
                </p>
              </div>
            </div>
          </div>

          {/* Deep Slate Smart Assistant Card with Orbs */}
          <div className="bg-[#0F172A] rounded-3xl p-6 shadow-xl text-white flex-1 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#2563EB]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-[#14B8A6]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center shadow-xs">
                  <span className="text-xs font-bold text-slate-900">✨</span>
                </div>
                <h3 className="font-bold text-lg text-white">Smart Assistant</h3>
              </div>

              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                "Heavy rain is expected this afternoon. Should I re-plan your outdoor activities?"
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => onOpenReplanModal('Bad weather')}
                  className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/50 active:bg-blue-600 transition-colors cursor-pointer text-white"
                >
                  ✨ Re-plan my afternoon
                </button>
                <button
                  onClick={() => onNavigateTab('itinerary')}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold border border-white/10 transition-colors cursor-pointer text-white"
                >
                  See Alternatives
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Group Match
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="absolute inset-0 transform -rotate-90 w-12 h-12" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          className="stroke-white/10"
                          strokeWidth="4"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          className="stroke-[#14B8A6]"
                          strokeWidth="4"
                          strokeDasharray="82, 100"
                        />
                      </svg>
                      <span className="text-[10px] font-bold text-white">82%</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Strong Preference Match</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Food • Culture • Photography</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Upcoming Trips Section */}
      <section id="upcoming-trips-section" className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">Your Upcoming Trips</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any trip to view itinerary, budget, and group split.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('trips')}
            className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({trips.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((t) => {
            const tSpent = t.expenses.reduce((acc, curr) => acc + curr.amount, 0);
            const tBudgetPercent = Math.min(100, Math.round((tSpent / t.totalBudget) * 100));
            const countdown = getCountdown(t.startDate);
            const isSelected = activeTrip?.id === t.id;

            return (
              <div
                key={t.id}
                id={`trip-card-${t.id}`}
                onClick={() => {
                  onSelectTrip(t.id);
                  onNavigateTab('overview');
                }}
                className={`group bg-white rounded-3xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-[#2563EB] ring-2 ring-blue-500/20'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Destination Image & Floating Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={t.coverImage}
                    alt={t.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs">
                      {countdown}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB] text-white">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg font-bold drop-shadow-sm leading-tight">
                      {t.destination}, {t.country}
                    </h3>
                    <p className="text-xs text-slate-200 flex items-center gap-2 mt-0.5">
                      <span>{t.name}</span>
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {t.startDate} – {t.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.travellerCount} travellers</span>
                    </div>
                  </div>

                  {/* Budget Progress Bar */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Budget Progress</span>
                      <span className="font-semibold text-slate-800">
                        {t.currency} {tSpent.toLocaleString()} / {t.currency}{' '}
                        {t.totalBudget.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
                        style={{ width: `${tBudgetPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer CTAs */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">
                      {t.itinerary.length} days scheduled
                    </span>
                    <span className="text-xs font-semibold text-[#2563EB] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Open Plan <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Access Trip Modules */}
      {trip && (
        <section id="active-trip-quick-hub" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Quick Highlights for {trip.name}
            </h2>
            <button
              onClick={() => onNavigateTab('overview')}
              className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Trip Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Itinerary Quick Card */}
            <div
              onClick={() => onNavigateTab('itinerary')}
              className="bg-white p-5 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Itinerary Schedule</h4>
              <p className="text-xs text-slate-500 mt-1">
                {trip.itinerary.length} days planned with timelines & maps.
              </p>
              <div className="mt-3 text-xs font-semibold text-[#2563EB] flex items-center gap-1">
                <span>View Timeline</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Budget Quick Card */}
            <div
              onClick={() => onNavigateTab('budget')}
              className="bg-white p-5 rounded-3xl border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#14B8A6] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Budget & Spending</h4>
              <p className="text-xs text-slate-500 mt-1">
                {trip.currency} {remaining.toLocaleString()} remaining.
              </p>
              <div className="mt-3 text-xs font-semibold text-[#14B8A6] flex items-center gap-1">
                <span>Track Expenses</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Group Match Quick Card */}
            <div
              onClick={() => onNavigateTab('group')}
              className="bg-white p-5 rounded-3xl border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#0F172A]">Group Preferences</h4>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  82% Match
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {trip.members.length} members sharing votes & splits.
              </p>
              <div className="mt-3 text-xs font-semibold text-purple-600 flex items-center gap-1">
                <span>Manage Group</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* AI Re-plan Quick Card */}
            <div
              onClick={() => onOpenReplanModal('Bad weather')}
              className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-3xl border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">AI Re-plan Day</h4>
              <p className="text-xs text-amber-800 mt-1">
                Delays or rain? Auto-adjust schedule in 1 click.
              </p>
              <div className="mt-3 text-xs font-bold text-amber-800 flex items-center gap-1">
                <span>Launch Re-plan</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

