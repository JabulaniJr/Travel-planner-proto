import React, { useState } from 'react';
import { Bell, Sparkles, AlertTriangle, CloudRain, Clock, Plane, CheckCircle2, ChevronDown } from 'lucide-react';
import { Trip, TripNotification } from '../types';

interface HeaderProps {
  activeTrip: Trip | null;
  onOpenReplanModal: (cause?: string) => void;
  onOpenAssistant: () => void;
  currency: string;
  onChangeCurrency: (c: string) => void;
  onMarkNotificationRead: (notifId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTrip,
  onOpenReplanModal,
  onOpenAssistant,
  currency,
  onChangeCurrency,
  onMarkNotificationRead,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = activeTrip?.notifications?.filter((n) => !n.read).length || 0;

  const getNotifIcon = (type: TripNotification['type']) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-4 h-4 text-amber-500" />;
      case 'weather':
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      case 'budget':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-teal-500" />;
    }
  };

  return (
    <header
      id="app-header"
      className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 sticky top-0 z-20 flex items-center justify-between shadow-xs"
    >
      {/* Left: Active Trip Title & Info */}
      <div className="flex items-center gap-3">
        {activeTrip ? (
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold text-[#0F172A] leading-none">
                {activeTrip.name}
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#2563EB] border border-blue-100">
                {activeTrip.destination}, {activeTrip.country}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>
                {activeTrip.startDate} – {activeTrip.endDate}
              </span>
              <span>•</span>
              <span className="font-medium text-[#0F172A]">
                {activeTrip.travellerCount} {activeTrip.travellerCount > 1 ? 'travellers' : 'traveller'}
              </span>
              <span>•</span>
              <span className="text-[#14B8A6] font-medium">{activeTrip.travelStyle} style</span>
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-base md:text-lg font-bold text-[#0F172A] leading-none">
              Traveler
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Plan less. Travel more.</p>
          </div>
        )}
      </div>

      {/* Right: Actions, Re-plan CTA, Currency & Notifications */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Re-plan Quick Button if Active Trip */}
        {activeTrip && (
          <button
            id="header-replan-quick-btn"
            onClick={() => onOpenReplanModal('Bad weather')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Re-plan today's itinerary if weather, delays, or closures occur"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>✨ Re-plan Day</span>
          </button>
        )}

        {/* Currency Switcher */}
        <div className="relative">
          <select
            id="currency-selector"
            value={currency}
            onChange={(e) => onChangeCurrency(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-[#0F172A] text-xs font-semibold rounded-lg px-2 py-1.5 pr-6 appearance-none focus:outline-none focus:ring-1 focus:ring-[#2563EB] cursor-pointer"
          >
            <option value="RM">RM (MYR)</option>
            <option value="$">$ (USD)</option>
            <option value="€">€ (EUR)</option>
            <option value="¥">¥ (JPY)</option>
            <option value="£">£ (GBP)</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            id="notification-bell-btn"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 relative cursor-pointer transition-colors"
            title="Notifications & Disruptions"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifMenu && (
            <div
              id="notifications-flyout"
              className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Live Trip Alerts & Changes
                </span>
                <span className="text-[11px] text-slate-400">
                  {unreadCount} unread
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-1">
                {activeTrip?.notifications && activeTrip.notifications.length > 0 ? (
                  activeTrip.notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 transition-colors rounded-xl ${
                        notif.read ? 'opacity-70 bg-transparent' : 'bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 p-1.5 rounded-lg bg-white shadow-2xs">
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-[#0F172A]">
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-slate-400">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>

                          {notif.replanTrigger && (
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setShowNotifMenu(false);
                                  onOpenReplanModal(notif.replanTrigger);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Re-plan now</span>
                              </button>
                              {!notif.read && (
                                <button
                                  onClick={() => onMarkNotificationRead(notif.id)}
                                  className="text-[11px] text-slate-500 hover:text-slate-800"
                                >
                                  Dismiss
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No active trip alerts. Everything is smooth!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* AI Travel Assistant Header Trigger */}
        <button
          id="header-open-assistant-btn"
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-200 cursor-pointer active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Travel AI</span>
        </button>
      </div>
    </header>
  );
};
