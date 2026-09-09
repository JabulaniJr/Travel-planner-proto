import React, { useState } from 'react';
import { Search, Sparkles, Star, MapPin, Calendar, ArrowRight, DollarSign } from 'lucide-react';
import { DestinationIdea } from '../types';
import { POPULAR_DESTINATIONS } from '../data/initialData';

interface ExploreViewProps {
  onStartPlanningDestination: (destName: string, country: string) => void;
  currency: string;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onStartPlanningDestination,
  currency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const filterTags = ['All', 'Culture', 'Food', 'Beaches', 'Nature', 'Romance', 'Budget'];

  const filteredDestinations = POPULAR_DESTINATIONS.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag =
      selectedTag === 'All' ||
      dest.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  return (
    <div id="explore-view-container" className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Search Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Inspiring Destinations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Where do you want to explore next?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse top-rated destinations with estimated daily budgets, seasonal windows, and curated activities.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Tokyo, Bali, Paris, Rome, Bangkok, street food, beaches..."
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 14. Destination Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            id={`dest-card-${dest.id}`}
            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Destination Photo & Floating Badges */}
            <div className="relative h-56 w-full overflow-hidden bg-slate-100">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

              {/* Price Badge */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-slate-900 text-xs font-bold shadow-xs">
                From {currency}{dest.averageDailyCost}/day
              </div>

              {/* Rating */}
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full text-white text-[11px] font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{dest.rating}</span>
              </div>

              {/* Bottom Overlay Title */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-xl font-black drop-shadow-sm leading-tight">
                  {dest.name}, {dest.country}
                </h3>
                <p className="text-xs text-slate-200 mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-300" />
                  <span>Best time: {dest.bestTimeToVisit}</span>
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {dest.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {dest.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Popular Activities Chips */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Top Highlights:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dest.popularActivities.map((act) => (
                    <span
                      key={act}
                      className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              {/* Plan Trip Here CTA */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => onStartPlanningDestination(dest.name, dest.country)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Plan Trip to {dest.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
