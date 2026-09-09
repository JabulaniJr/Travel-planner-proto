import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Globe,
  Sliders,
  RotateCcw,
  Check,
  User,
  Shield,
  Smartphone,
} from 'lucide-react';
import { Trip } from '../types';

interface SettingsViewProps {
  currentCurrency: string;
  onCurrencyChange: (currency: string) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentCurrency,
  onCurrencyChange,
  onResetData,
}) => {
  const [userName, setUserName] = useState('Alex Wong');
  const [userEmail, setUserEmail] = useState('alex.wong@example.com');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [flightAlerts, setFlightAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [groupPollAlerts, setGroupPollAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div id="settings-view-container" className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">App & Account Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure currency formats, unit preferences, smart travel notifications, and profile.
          </p>
        </div>

        {isSaved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <Check className="w-3.5 h-3.5" />
            <span>Preferences Saved</span>
          </span>
        )}
      </div>

      {/* Profile Information */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Travel Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Regional & Currency Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Regional & Display Formats</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Preferred Currency
            </label>
            <select
              value={currentCurrency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
            >
              <option value="RM">RM — Malaysian Ringgit (MYR)</option>
              <option value="$">$ — US Dollar (USD)</option>
              <option value="€">€ — Euro (EUR)</option>
              <option value="¥">¥ — Japanese Yen (JPY)</option>
              <option value="£">£ — British Pound (GBP)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Measurement Units
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUnitSystem('metric')}
                className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  unitSystem === 'metric'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600/20'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                Metric (°C, km, m)
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem('imperial')}
                className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  unitSystem === 'imperial'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600/20'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                Imperial (°F, miles)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Alerts & Notification Toggles */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Bell className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Live Trip Alerts & AI Pushes</h3>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Flight & Gate Updates</span>
              <span className="text-slate-500">
                Receive notifications when flight schedule or boarding gate changes.
              </span>
            </div>
            <input
              type="checkbox"
              checked={flightAlerts}
              onChange={(e) => setFlightAlerts(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Severe Weather & Rain Warnings</span>
              <span className="text-slate-500">
                Trigger AI Re-plan suggestions when outdoor forecasts turn wet or windy.
              </span>
            </div>
            <input
              type="checkbox"
              checked={weatherAlerts}
              onChange={(e) => setWeatherAlerts(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Budget Threshold Alerts</span>
              <span className="text-slate-500">
                Notify when spending reaches 80% and 100% of category allowance.
              </span>
            </div>
            <input
              type="checkbox"
              checked={budgetAlerts}
              onChange={(e) => setBudgetAlerts(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Group Poll & Voting Updates</span>
              <span className="text-slate-500">
                Alert when companions suggest or vote on group activities.
              </span>
            </div>
            <input
              type="checkbox"
              checked={groupPollAlerts}
              onChange={(e) => setGroupPollAlerts(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Demo Controls & Data Reset */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Reset Application Demo Data
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Clear customized itineraries and restore initial Tokyo & Bali demo trips.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all data back to the demo trips?')) {
              onResetData();
              alert('Trip planner restored to pristine demo state!');
            }
          }}
          className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-red-600 text-xs font-bold flex items-center gap-2 shadow-2xs cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Defaults</span>
        </button>
      </div>
    </div>
  );
};
