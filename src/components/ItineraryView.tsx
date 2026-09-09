import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Navigation,
  CheckCircle2,
  DollarSign,
  Coffee,
  Landmark,
  Utensils,
  Camera,
  ShoppingBag,
  Trees,
  Compass,
  Bed,
  Map as MapIcon,
  X,
  RefreshCw,
} from 'lucide-react';
import { Trip, Activity, DayItinerary } from '../types';

interface ItineraryViewProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
  onOpenReplanModal: (cause?: string, dayNumber?: number) => void;
  onNavigateTab: (tab: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  onUpdateTrip,
  onOpenReplanModal,
  onNavigateTab,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [editingActivity, setEditingActivity] = useState<{
    dayNumber: number;
    activity: Activity;
  } | null>(null);
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  // Form states for new/edited activity
  const [actTitle, setActTitle] = useState('');
  const [actTime, setActTime] = useState('10:00 AM');
  const [actCategory, setActCategory] = useState<Activity['category']>('Culture');
  const [actLocation, setActLocation] = useState('');
  const [actCost, setActCost] = useState(50);
  const [actDesc, setActDesc] = useState('');

  const currentDay = trip.itinerary[selectedDayIndex] || trip.itinerary[0];

  const getCategoryIcon = (cat: Activity['category']) => {
    switch (cat) {
      case 'Food':
        return <Utensils className="w-4 h-4 text-orange-500" />;
      case 'Culture':
        return <Landmark className="w-4 h-4 text-blue-500" />;
      case 'Photography':
        return <Camera className="w-4 h-4 text-purple-500" />;
      case 'Shopping':
        return <ShoppingBag className="w-4 h-4 text-pink-500" />;
      case 'Nature':
        return <Trees className="w-4 h-4 text-emerald-500" />;
      case 'Hotel':
        return <Bed className="w-4 h-4 text-indigo-500" />;
      default:
        return <Compass className="w-4 h-4 text-teal-500" />;
    }
  };

  const handleMoveActivity = (index: number, direction: 'up' | 'down') => {
    if (!currentDay) return;
    const newActs = [...currentDay.activities];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newActs.length) return;

    // Swap
    const temp = newActs[index];
    newActs[index] = newActs[targetIndex];
    newActs[targetIndex] = temp;

    const updatedItinerary = trip.itinerary.map((d) =>
      d.dayNumber === currentDay.dayNumber ? { ...d, activities: newActs } : d
    );
    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
  };

  const handleDeleteActivity = (actId: string) => {
    if (!currentDay) return;
    const newActs = currentDay.activities.filter((a) => a.id !== actId);
    const updatedItinerary = trip.itinerary.map((d) =>
      d.dayNumber === currentDay.dayNumber
        ? {
            ...d,
            activities: newActs,
            estimatedDailySpending: newActs.reduce((sum, a) => sum + a.cost, 0),
          }
        : d
    );
    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
  };

  const handleOpenEdit = (act: Activity) => {
    setEditingActivity({ dayNumber: currentDay.dayNumber, activity: act });
    setActTitle(act.title);
    setActTime(act.time);
    setActCategory(act.category);
    setActLocation(act.location);
    setActCost(act.cost);
    setActDesc(act.description);
  };

  const handleSaveActivity = () => {
    if (!currentDay || !actTitle.trim()) return;

    if (editingActivity) {
      const updatedActs = currentDay.activities.map((a) =>
        a.id === editingActivity.activity.id
          ? {
              ...a,
              title: actTitle,
              time: actTime,
              category: actCategory,
              location: actLocation,
              cost: Number(actCost),
              costDisplay: `${trip.currency}${actCost}`,
              description: actDesc,
            }
          : a
      );
      const updatedItinerary = trip.itinerary.map((d) =>
        d.dayNumber === currentDay.dayNumber
          ? {
              ...d,
              activities: updatedActs,
              estimatedDailySpending: updatedActs.reduce((sum, a) => sum + a.cost, 0),
            }
          : d
      );
      onUpdateTrip({ ...trip, itinerary: updatedItinerary });
      setEditingActivity(null);
    } else {
      // New activity
      const newAct: Activity = {
        id: `custom-act-${Date.now()}`,
        title: actTitle,
        time: actTime,
        category: actCategory,
        location: actLocation || `${trip.destination} Center`,
        cost: Number(actCost),
        costDisplay: `${trip.currency}${actCost}`,
        description: actDesc || 'Custom scheduled activity',
        durationMinutes: 60,
        bookingStatus: 'Planned',
        lat: 35.6895 + (Math.random() - 0.5) * 0.03,
        lng: 139.6917 + (Math.random() - 0.5) * 0.03,
      };

      const newActs = [...currentDay.activities, newAct];
      const updatedItinerary = trip.itinerary.map((d) =>
        d.dayNumber === currentDay.dayNumber
          ? {
              ...d,
              activities: newActs,
              estimatedDailySpending: newActs.reduce((sum, a) => sum + a.cost, 0),
            }
          : d
      );
      onUpdateTrip({ ...trip, itinerary: updatedItinerary });
      setIsAddingActivity(false);
    }

    // reset fields
    setActTitle('');
    setActLocation('');
    setActDesc('');
  };

  return (
    <div id="itinerary-view" className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Header & Re-plan CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Trip Itinerary Schedule</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
              {trip.itinerary.length} Days Planned
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Full visual timeline with costs, locations, transit times, and instant AI re-planning.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="itinerary-map-toggle-btn"
            onClick={() => onNavigateTab('map')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MapIcon className="w-4 h-4 text-slate-600" />
            <span>Map View</span>
          </button>

          <button
            id="itinerary-add-act-btn"
            onClick={() => {
              setEditingActivity(null);
              setActTitle('');
              setActLocation('');
              setActDesc('');
              setIsAddingActivity(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>

          {/* Prominent Re-plan my day button */}
          <button
            id="itinerary-replan-day-btn"
            onClick={() => onOpenReplanModal('Bad weather', currentDay?.dayNumber || 1)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
            title="AI Re-plan will adjust this day if weather, closures, or fatigue happen"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>✨ Re-plan my day</span>
          </button>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {trip.itinerary.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={day.dayNumber}
              id={`day-tab-btn-${day.dayNumber}`}
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex flex-col items-start ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>Day {day.dayNumber}</span>
                <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  • {day.date.slice(5)}
                </span>
              </div>
              <span
                className={`text-[11px] font-normal truncate max-w-[130px] ${
                  isSelected ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {day.theme}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Day Meta Card */}
      {currentDay && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{currentDay.title}</h3>
              <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                {currentDay.theme}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Date: <span className="font-semibold text-slate-700">{currentDay.date}</span> •{' '}
              {currentDay.activities.length} planned stops
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                Estimated Daily Spending
              </span>
              <span className="text-base font-extrabold text-slate-900">
                {trip.currency} {currentDay.estimatedDailySpending || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 8. Day Timeline Activities List */}
      {currentDay && currentDay.activities.length > 0 ? (
        <div className="space-y-4">
          {currentDay.activities.map((activity, index) => {
            const isLast = index === currentDay.activities.length - 1;

            return (
              <div key={activity.id} className="relative">
                {/* Activity Card */}
                <div
                  id={`activity-card-${activity.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  {/* Left: Time + Icon + Details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Time Pill */}
                    <div className="shrink-0 w-20 text-center sm:text-left">
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {activity.time}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {activity.durationMinutes} mins
                      </span>
                    </div>

                    {/* Category Icon */}
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {getCategoryIcon(activity.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {activity.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                          {activity.category}
                        </span>
                        {activity.bookingStatus && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              activity.bookingStatus === 'Confirmed'
                                ? 'bg-green-50 text-green-700'
                                : activity.bookingStatus === 'Reserved'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {activity.bookingStatus}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {activity.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[200px]">{activity.location}</span>
                        </span>
                        <span className="font-semibold text-slate-700">
                          {activity.costDisplay || `${trip.currency} ${activity.cost}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Reorder, Edit, Delete */}
                  <div className="flex items-center gap-1 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleMoveActivity(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveActivity(index, 'down')}
                      disabled={isLast}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(activity)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                      title="Edit activity"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Delete activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Transit Connection Badge between steps */}
                {!isLast && (
                  <div className="py-2.5 px-6 flex items-center gap-3 text-xs text-slate-500">
                    <div className="w-0.5 h-6 bg-slate-200 ml-4" />
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                      <Navigation className="w-3 h-3 text-teal-600" />
                      <span>
                        {activity.transitToNext?.duration || '12 min transit'}
                        {activity.transitToNext?.distance ? ` (${activity.transitToNext.distance})` : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800">No activities on this day yet</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Add an activity manually or let AI generate an optimized day schedule.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsAddingActivity(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              Add Activity
            </button>
            <button
              onClick={() => onOpenReplanModal('Attraction closed', currentDay?.dayNumber || 1)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Auto-Plan Day</span>
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Activity Modal */}
      {(isAddingActivity || editingActivity) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
              </h3>
              <button
                onClick={() => {
                  setEditingActivity(null);
                  setIsAddingActivity(false);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  placeholder="e.g. Senso-ji Temple Visit"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={actTime}
                    onChange={(e) => setActTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={actCategory}
                    onChange={(e) => setActCategory(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Culture">Culture</option>
                    <option value="Food">Food</option>
                    <option value="Nature">Nature</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Photography">Photography</option>
                    <option value="Hotel">Hotel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={actLocation}
                    onChange={(e) => setActLocation(e.target.value)}
                    placeholder="e.g. Asakusa, Tokyo"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Cost ({trip.currency})
                  </label>
                  <input
                    type="number"
                    value={actCost}
                    onChange={(e) => setActCost(Number(e.target.value))}
                    placeholder="0"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Description & Tips
                </label>
                <textarea
                  rows={3}
                  value={actDesc}
                  onChange={(e) => setActDesc(e.target.value)}
                  placeholder="Short note or reservation details..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setEditingActivity(null);
                  setIsAddingActivity(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveActivity}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                Save Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
