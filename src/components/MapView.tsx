import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Car,
  Footprints,
  Train,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Trip, Activity } from '../types';

interface MapViewProps {
  trip: Trip;
  onSelectActivity?: (activity: Activity) => void;
  onOpenReplanModal: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ trip, onOpenReplanModal }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [activePinId, setActivePinId] = useState<string | null>(null);

  const currentDay = trip.itinerary[selectedDayIdx] || trip.itinerary[0];
  const activities = currentDay?.activities || [];

  // Relative coordinates scaled to visual map canvas (SVG viewBox 0 0 800 500)
  // We'll compute or map coordinates into a scenic stylized map
  const mapLocations = activities.map((act, idx) => {
    // Generate organic distinct layout positions across the map
    const defaultCoords = [
      { x: 220, y: 150, type: 'Breakfast' },
      { x: 320, y: 170, type: 'Attraction' },
      { x: 360, y: 240, type: 'Lunch' },
      { x: 440, y: 220, type: 'Exploration' },
      { x: 570, y: 180, type: 'Skytree' },
      { x: 620, y: 260, type: 'Dinner' },
    ];
    const pos = defaultCoords[idx % defaultCoords.length];
    return {
      ...act,
      mapX: pos.x,
      mapY: pos.y,
      stepNumber: idx + 1,
    };
  });

  const selectedActivity = mapLocations.find((a) => a.id === activePinId) || mapLocations[0];

  return (
    <div id="map-view-container" className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Interactive Location Map</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
              {trip.destination}, {trip.country}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized route paths with walking, train, and taxi transit times between stops.
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {trip.itinerary.map((d, idx) => (
            <button
              key={d.dayNumber}
              onClick={() => {
                setSelectedDayIdx(idx);
                setActivePinId(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedDayIdx === idx
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Day {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Visual Canvas + Sidebar Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Stylized Interactive SVG Map Viewport (2 Cols on desktop) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative min-h-[460px] flex flex-col">
          {/* Map Controls Floating Header */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-semibold shadow-md pointer-events-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>
                {currentDay?.title || 'Route Overview'} ({activities.length} Stops)
              </span>
            </div>

            <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 text-white text-xs shadow-md pointer-events-auto flex items-center gap-1">
              <button
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenReplanModal}
                className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1"
                title="Re-plan map routes"
              >
                <Sparkles className="w-3 h-3" />
                <span>Re-route</span>
              </button>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative w-full flex-1 flex items-center justify-center p-4 select-none">
            <svg
              viewBox="0 0 800 500"
              className="w-full h-full max-h-[520px] rounded-2xl drop-shadow-2xl"
              style={{ background: '#0F172A' }}
            >
              {/* Background Grid Pattern */}
              <defs>
                <pattern
                  id="map-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="1"
                  />
                </pattern>
                {/* Linear gradient for route lines */}
                <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#14B8A6" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>

              <rect width="800" height="500" fill="url(#map-grid)" />

              {/* Waterway (Sumida River / Tokyo Bay representation) */}
              <path
                d="M 480 0 C 470 120, 520 220, 480 340 C 450 420, 530 470, 600 500 L 800 500 L 800 0 Z"
                fill="#1E3A8A"
                fillOpacity="0.3"
              />
              <path
                d="M 480 0 C 470 120, 520 220, 480 340 C 450 420, 530 470, 600 500"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="6"
                strokeOpacity="0.4"
              />
              <text x="540" y="80" fill="#60A5FA" fontSize="11" opacity="0.6" fontWeight="bold">
                Sumida River
              </text>
              <text x="680" y="460" fill="#60A5FA" fontSize="11" opacity="0.6" fontWeight="bold">
                Tokyo Bay Port
              </text>

              {/* District Labels */}
              <text x="220" y="100" fill="#64748B" fontSize="12" fontWeight="600" opacity="0.5">
                ASAKUSA HISTORIC DISTRICT
              </text>
              <text x="560" y="140" fill="#64748B" fontSize="12" fontWeight="600" opacity="0.5">
                SUMIDA / SKYTREE WARD
              </text>
              <text x="140" y="420" fill="#64748B" fontSize="12" fontWeight="600" opacity="0.5">
                GINZA & CHUO DISTRICT
              </text>

              {/* Connective Route Paths Between Stops */}
              {mapLocations.map((loc, i) => {
                if (i === mapLocations.length - 1) return null;
                const nextLoc = mapLocations[i + 1];
                const midX = (loc.mapX + nextLoc.mapX) / 2;
                const midY = (loc.mapY + nextLoc.mapY) / 2 - 20;

                return (
                  <g key={`route-${i}`}>
                    {/* Shadow line */}
                    <path
                      d={`M ${loc.mapX} ${loc.mapY} Q ${midX} ${midY} ${nextLoc.mapX} ${nextLoc.mapY}`}
                      fill="none"
                      stroke="#0F172A"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {/* Animated Dashed Transit Path */}
                    <path
                      d={`M ${loc.mapX} ${loc.mapY} Q ${midX} ${midY} ${nextLoc.mapX} ${nextLoc.mapY}`}
                      fill="none"
                      stroke="url(#route-gradient)"
                      strokeWidth="3.5"
                      strokeDasharray="6,6"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />

                    {/* Transit Info Pill overlay along route */}
                    <g transform={`translate(${midX - 45}, ${midY - 12})`}>
                      <rect
                        width="90"
                        height="24"
                        rx="12"
                        fill="#1E293B"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      <text
                        x="45"
                        y="15"
                        fill="#E2E8F0"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {loc.transitToNext?.duration || '12 min walk'}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Numbered Pins for each stop */}
              {mapLocations.map((loc) => {
                const isActive = loc.id === activePinId || (!activePinId && loc.stepNumber === 1);

                return (
                  <g
                    key={loc.id}
                    transform={`translate(${loc.mapX}, ${loc.mapY})`}
                    onClick={() => setActivePinId(loc.id)}
                    className="cursor-pointer group"
                  >
                    {/* Ping ring if active */}
                    {isActive && (
                      <circle
                        r="24"
                        fill="#3B82F6"
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* Pin Drop Shadow */}
                    <ellipse cx="0" cy="18" rx="10" ry="4" fill="#000000" opacity="0.4" />

                    {/* Pin Circle */}
                    <circle
                      r={isActive ? 17 : 14}
                      fill={isActive ? '#2563EB' : '#1E293B'}
                      stroke={isActive ? '#60A5FA' : '#94A3B8'}
                      strokeWidth={isActive ? '3' : '2'}
                      className="transition-all"
                    />

                    {/* Number text */}
                    <text
                      x="0"
                      y="5"
                      fill="#FFFFFF"
                      fontSize={isActive ? '12' : '11'}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {loc.stepNumber}
                    </text>

                    {/* Hover tooltip label */}
                    <g transform="translate(0, -26)" className="opacity-90">
                      <rect
                        x="-55"
                        y="-12"
                        width="110"
                        height="20"
                        rx="6"
                        fill="#0F172A"
                        fillOpacity="0.9"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="2"
                        fill="#F8FAFC"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {loc.title.slice(0, 16)}..
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Transit Legend */}
          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Footprints className="w-3.5 h-3.5 text-blue-400" />
                <span>🚶 Walking</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Train className="w-3.5 h-3.5 text-teal-400" />
                <span>🚇 Metro Train</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>🚕 Taxi / Drive</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Click any numbered marker on the map to inspect details.
            </span>
          </div>
        </div>

        {/* Right Details Panel: Inspected Stop Info & Route Sequence */}
        <div className="space-y-4">
          {/* Selected Pin Focus Card */}
          {selectedActivity && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                  Stop #{selectedActivity.stepNumber}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {selectedActivity.time}
                </span>
              </div>

              {selectedActivity.imageUrl && (
                <div className="h-32 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={selectedActivity.imageUrl}
                    alt={selectedActivity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h4 className="text-base font-bold text-slate-900 leading-tight">
                  {selectedActivity.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedActivity.location}</span>
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedActivity.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Cost:</span>
                <span className="font-bold text-slate-900">
                  {selectedActivity.costDisplay || `${trip.currency}${selectedActivity.cost}`}
                </span>
              </div>
            </div>
          )}

          {/* Sequential Waypoint List for Day */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Day {currentDay?.dayNumber} Waypoints
            </h4>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {mapLocations.map((loc) => {
                const isCurrent = loc.id === (activePinId || mapLocations[0]?.id);
                return (
                  <div
                    key={loc.id}
                    onClick={() => setActivePinId(loc.id)}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                        : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {loc.stepNumber}
                      </span>
                      <span className="truncate">{loc.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 ml-2">{loc.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
