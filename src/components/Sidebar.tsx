import React from 'react';
import {
  Compass,
  CalendarRange,
  PieChart,
  Users,
  MapPin,
  Briefcase,
  Sparkles,
  Settings,
  PlusCircle,
  Map,
  Plane,
} from 'lucide-react';
import { Trip } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeTrip: Trip | null;
  onOpenCreateWizard: () => void;
  trips: Trip[];
  onSelectTrip: (tripId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeTrip,
  onOpenCreateWizard,
  trips,
  onSelectTrip,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'overview', label: 'Trip Overview', icon: MapPin },
    { id: 'itinerary', label: 'Itinerary', icon: CalendarRange },
    { id: 'map', label: 'Map View', icon: Map },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'group', label: 'Group & Split', icon: Users },
    { id: 'trips', label: 'My Trips', icon: Briefcase },
    { id: 'explore', label: 'Explore', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside
        id="desktop-sidebar"
        className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 z-30 shrink-0 select-none p-6"
      >
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <button
            id="brand-logo-btn"
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-white -rotate-45" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-[#0F172A] block leading-tight">
                Traveler
              </span>
              <span className="text-[11px] text-[#14B8A6] font-medium tracking-wide">
                Natural Planning
              </span>
            </div>
          </button>
        </div>

        {/* Trip Switcher Capsule */}
        {activeTrip && (
          <div className="pb-4">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Active Trip
              </span>
              <select
                id="sidebar-trip-select"
                value={activeTrip.id}
                onChange={(e) => onSelectTrip(e.target.value)}
                className="w-full bg-white text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg p-1.5 focus:ring-2 focus:ring-[#2563EB] focus:outline-none cursor-pointer"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.destination} ({t.startDate.slice(5)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-50 text-[#2563EB] font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-[#0F172A]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-[#2563EB]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.id === 'itinerary' && activeTrip && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#2563EB]">
                    {activeTrip.itinerary.length}d
                  </span>
                )}
                {item.id === 'group' && activeTrip && activeTrip.travellerCount > 1 && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    {activeTrip.travellerCount}p
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Primary Action Button */}
        <div className="mt-auto pt-4">
          <button
            id="sidebar-create-trip-btn"
            onClick={onOpenCreateWizard}
            className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-transform cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Trip</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 py-1.5 flex items-center justify-around shadow-lg select-none"
      >
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium ${
            currentTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectTab('itinerary')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium ${
            currentTab === 'itinerary' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <CalendarRange className="w-5 h-5" />
          <span>Itinerary</span>
        </button>

        {/* Prominent Center Create Button */}
        <button
          onClick={onOpenCreateWizard}
          className="w-11 h-11 -mt-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95"
          title="Create Trip"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => onSelectTab('budget')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium ${
            currentTab === 'budget' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span>Budget</span>
        </button>

        <button
          onClick={() => onSelectTab('group')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium ${
            currentTab === 'group' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Group</span>
        </button>
      </nav>
    </>
  );
};
