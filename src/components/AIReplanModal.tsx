import React, { useState } from 'react';
import {
  Sparkles,
  CloudRain,
  Plane,
  AlertCircle,
  Clock,
  BatteryCharging,
  DollarSign,
  Lock,
  Utensils,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeftRight,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Trip, Activity } from '../types';
import { generateReplanSuggestion, ReplanResult } from '../utils/aiService';

interface AIReplanModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  initialReason?: string;
  initialDayNumber?: number;
  onApplyReplan: (dayNumber: number, newActivities: Activity[], explanation: string) => void;
}

export const AIReplanModal: React.FC<AIReplanModalProps> = ({
  isOpen,
  onClose,
  trip,
  initialReason = 'Bad weather',
  initialDayNumber = 1,
  onApplyReplan,
}) => {
  const [selectedReason, setSelectedReason] = useState(initialReason);
  const [selectedDay, setSelectedDay] = useState(initialDayNumber);
  const [isGenerating, setIsGenerating] = useState(false);
  const [replanResult, setReplanResult] = useState<ReplanResult | null>(() =>
    generateReplanSuggestion(trip, initialDayNumber, initialReason)
  );
  const [showingAlternative, setShowingAlternative] = useState(false);

  if (!isOpen) return null;

  const disruptionCauses = [
    { id: 'Bad weather', label: '🌧️ Bad weather', icon: CloudRain, desc: 'Heavy rain, typhoons, or heatwave' },
    { id: 'Flight delayed', label: '✈️ Flight delayed', icon: Plane, desc: 'Late arrival or airport hold-ups' },
    { id: 'Feeling tired', label: '😴 Feeling tired', icon: BatteryCharging, desc: 'Pacing too fast, need rest or foot spa' },
    { id: 'Budget exceeded', label: '💸 Budget exceeded', icon: DollarSign, desc: 'Cut down expenses for remainder of trip' },
    { id: 'Attraction closed', label: '🔒 Attraction closed', icon: Lock, desc: 'Maintenance, holidays, or fully booked' },
    { id: 'Restaurant unavailable', label: '🍽️ Restaurant full', icon: Utensils, desc: 'No tables or long queues' },
    { id: 'Activity cancelled', label: '🛑 Activity cancelled', icon: AlertCircle, desc: 'Tour or operator cancelled booking' },
    { id: 'Running late', label: '⏰ Running late', icon: Clock, desc: 'Missed train or delayed morning start' },
  ];

  const handleSelectReason = (reasonId: string) => {
    setSelectedReason(reasonId);
    setIsGenerating(true);
    setTimeout(() => {
      const res = generateReplanSuggestion(trip, selectedDay, reasonId);
      setReplanResult(res);
      setShowingAlternative(false);
      setIsGenerating(false);
    }, 600);
  };

  const handleApply = () => {
    if (!replanResult) return;
    const activitiesToApply =
      showingAlternative && replanResult.alternativeOption
        ? replanResult.alternativeOption.activities
        : replanResult.modifiedActivities;

    onApplyReplan(selectedDay, activitiesToApply, replanResult.suggestionTitle);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    onClose();
  };

  return (
    <div
      id="ai-replan-modal-overlay"
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 animate-in fade-in overflow-y-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-[#0F172A] p-5 sm:p-6 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                AI Re-plan My Day
              </h3>
              <p className="text-slate-300 text-xs mt-0.5">
                Plans changed? Select the disruption below and let AI reorganize your day.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Select Disruption Type */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              1. What happened?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {disruptionCauses.map((cause) => {
                const isSelected = selectedReason === cause.id;
                return (
                  <button
                    key={cause.id}
                    id={`disruption-btn-${cause.id.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => handleSelectReason(cause.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] font-bold shadow-xs ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="truncate">{cause.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Day Selector */}
          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="font-semibold">Applying to Itinerary Day:</span>
            <select
              value={selectedDay}
              onChange={(e) => {
                const d = Number(e.target.value);
                setSelectedDay(d);
                setReplanResult(generateReplanSuggestion(trip, d, selectedReason));
              }}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-800 focus:ring-1 focus:ring-[#2563EB] focus:outline-none"
            >
              {trip.itinerary.map((d) => (
                <option key={d.dayNumber} value={d.dayNumber}>
                  Day {d.dayNumber} ({d.date.slice(5)})
                </option>
              ))}
            </select>
          </div>

          {/* AI Generation State or Output */}
          {isGenerating ? (
            <div className="p-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-800">
                AI is re-optimizing your timeline...
              </p>
              <p className="text-[11px] text-slate-500">
                Evaluating indoor venues, opening hours, and transport connections.
              </p>
            </div>
          ) : replanResult ? (
            <div className="space-y-4">
              {/* AI Disruption Analysis Card */}
              <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>{replanResult.cause}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {replanResult.explanation}
                </p>
              </div>

              {/* AI Proposed Solution */}
              <div className="bg-white border-2 border-blue-500/30 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#2563EB]">
                    <Sparkles className="w-3 h-3 text-[#2563EB]" />
                    AI Suggestion
                  </span>
                  {replanResult.alternativeOption && (
                    <button
                      onClick={() => setShowingAlternative(!showingAlternative)}
                      className="text-xs font-semibold text-[#14B8A6] hover:text-teal-700 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>{showingAlternative ? 'Show Primary Plan' : 'See Alternatives'}</span>
                    </button>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-bold text-[#0F172A] leading-tight">
                  {showingAlternative && replanResult.alternativeOption
                    ? replanResult.alternativeOption.title
                    : replanResult.suggestionTitle}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {showingAlternative && replanResult.alternativeOption
                    ? replanResult.alternativeOption.summary
                    : replanResult.summary}
                </p>

                {/* Timeline Snapshot of changes */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Updated Day Schedule Preview:
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {(showingAlternative && replanResult.alternativeOption
                      ? replanResult.alternativeOption.activities
                      : replanResult.modifiedActivities
                    ).map((act, i) => (
                      <div
                        key={act.id || i}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 w-16">{act.time}</span>
                          <span className="text-slate-900 font-medium truncate max-w-[240px]">
                            {act.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-semibold">
                          {act.costDisplay || `${trip.currency}${act.cost}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="replan-apply-btn"
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
