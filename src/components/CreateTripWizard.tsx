import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Compass,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Send,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Trip, TravelStyle, CompanionType } from '../types';
import { generateTripItinerary } from '../utils/aiService';
import { POPULAR_DESTINATIONS } from '../data/initialData';

interface CreateTripWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (newTrip: Trip) => void;
  initialDestination?: string;
  initialCountry?: string;
  defaultCurrency: string;
}

export const CreateTripWizard: React.FC<CreateTripWizardProps> = ({
  isOpen,
  onClose,
  onTripCreated,
  initialDestination = '',
  initialCountry = '',
  defaultCurrency = 'RM',
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [destination, setDestination] = useState(initialDestination || 'Tokyo');
  const [country, setCountry] = useState(initialCountry || 'Japan');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80'
  );

  const [startDate, setStartDate] = useState('2026-09-12');
  const [endDate, setEndDate] = useState('2026-09-18');

  const [companion, setCompanion] = useState<CompanionType>('Friends');
  const [inviteEmails, setInviteEmails] = useState<string[]>(['sarah.t@example.com', 'adam.k@example.com']);
  const [emailInput, setEmailInput] = useState('');

  const [budgetType, setBudgetType] = useState<'total' | 'per_person'>('total');
  const [budgetAmount, setBudgetAmount] = useState<number>(5000);
  const [currency, setCurrency] = useState(defaultCurrency);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Food',
    'Culture',
    'Photography',
    'Shopping',
  ]);

  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Balanced');

  // Step 7 Generation Animation State
  const [generationStepIndex, setGenerationStepIndex] = useState(0);
  const generationSteps = [
    'Analyzing destination geography & opening hours...',
    'Matching group dining & sightseeing preferences...',
    'Calculating optimal walking & transit connections...',
    'Balancing daily budget allocation...',
    'Polishing your personalized day-by-day itinerary...',
  ];

  if (!isOpen) return null;

  // Compute duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  const totalCalculatedBudget =
    budgetType === 'total' ? budgetAmount : budgetAmount * (companion === 'Just me' ? 1 : 4);

  const interestOptions = [
    { label: 'Food', emoji: '🍜' },
    { label: 'Shopping', emoji: '🛍️' },
    { label: 'Nature', emoji: '🌴' },
    { label: 'Beaches', emoji: '🏖️' },
    { label: 'Adventure', emoji: '🧗' },
    { label: 'History', emoji: '🏛️' },
    { label: 'Culture', emoji: '⛩️' },
    { label: 'Nightlife', emoji: '🍸' },
    { label: 'Photography', emoji: '📷' },
    { label: 'Relaxation', emoji: '💆' },
    { label: 'Sports', emoji: '⚽' },
    { label: 'Family', emoji: '👨‍👩‍👦' },
    { label: 'Luxury', emoji: '✨' },
    { label: 'Budget travel', emoji: '🎒' },
  ];

  const travelStyles: { type: TravelStyle; title: string; desc: string }[] = [
    { type: 'Relaxed', title: 'Relaxed', desc: '1–2 activities per day, plenty of downtime & café lounging.' },
    { type: 'Balanced', title: 'Balanced', desc: 'Well-spaced highlights, leisurely meals, and moderate steps.' },
    { type: 'Packed', title: 'Packed', desc: 'See everything possible from sunrise to late night.' },
    { type: 'Luxury', title: 'Luxury', desc: 'High-end dining, rooftop cocktail vistas, and private transit.' },
    { type: 'Budget', title: 'Budget', desc: 'Free cultural sights, public transit, and delicious street food.' },
    { type: 'Adventure', title: 'Adventure', desc: 'Outdoor thrills, active hiking, and vibrant local excursions.' },
  ];

  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddEmail = () => {
    if (emailInput.trim() && !inviteEmails.includes(emailInput.trim())) {
      setInviteEmails([...inviteEmails, emailInput.trim()]);
      setEmailInput('');
    }
  };

  const handleStartGeneration = () => {
    setCurrentStep(7);

    // Animate through generation steps
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx < generationSteps.length) {
        setGenerationStepIndex(currentIdx);
      } else {
        clearInterval(interval);
        // Build new trip object
        const generatedItinerary = generateTripItinerary(
          destination,
          startDate,
          endDate,
          totalCalculatedBudget,
          currency,
          selectedInterests,
          travelStyle
        );

        const newTrip: Trip = {
          id: `trip-${Date.now()}`,
          name: `${destination} ${travelStyle === 'Adventure' ? 'Expedition' : 'Adventure'}`,
          destination,
          country,
          coverImage,
          startDate,
          endDate,
          durationDays,
          companionType: companion,
          travellerCount: companion === 'Just me' ? 1 : inviteEmails.length + 1,
          status: 'upcoming',
          totalBudget: totalCalculatedBudget,
          currency,
          interests: selectedInterests,
          travelStyle,
          weatherForecast: {
            condition: 'Clear and pleasant',
            temperature: '25°C',
          },
          aiNotes: [
            `Optimized for ${travelStyle} travel style and ${selectedInterests.join(', ')}.`,
            'Public transportation passes have been calculated for maximum convenience.',
          ],
          members: [
            {
              id: 'user-current',
              name: 'You',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              role: 'Organizer',
              isCurrentUser: true,
              email: 'you@travelplanner.app',
              likes: selectedInterests,
              dislikes: [],
            },
            ...inviteEmails.map((email, idx) => ({
              id: `invited-${idx + 1}`,
              name: email.split('@')[0],
              avatar: `https://images.unsplash.com/photo-${1500000000000 + idx * 10000}?auto=format&fit=crop&w=200&q=80`,
              role: 'Member' as const,
              email,
              likes: [selectedInterests[idx % selectedInterests.length] || 'Food'],
              dislikes: [],
            })),
          ],
          itinerary: generatedItinerary,
          expenses: [],
          polls: [
            {
              id: `poll-${Date.now()}`,
              question: `Top choice for Day 1 Evening in ${destination}?`,
              status: 'active',
              options: [
                {
                  id: 'opt-1',
                  title: 'Local Night Market Food Tour',
                  votes: ['user-current'],
                  suggestedBy: 'AI Assistant',
                  icon: '🍜',
                },
                {
                  id: 'opt-2',
                  title: 'Skyline Observation Deck Sunset',
                  votes: [],
                  suggestedBy: 'AI Assistant',
                  icon: '🗼',
                },
              ],
            },
          ],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              type: 'timing',
              title: 'Itinerary Ready!',
              message: `AI has completed organizing your ${durationDays}-day trip to ${destination}.`,
              timestamp: 'Just now',
              read: false,
            },
          ],
        };

        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore
        }

        onTripCreated(newTrip);
        onClose();
      }
    }, 700);
  };

  return (
    <div
      id="create-trip-wizard-overlay"
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 animate-in fade-in overflow-y-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto animate-in zoom-in-95 flex flex-col">
        {/* Wizard Header with Step Progress */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
              Step {currentStep} of 6
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {currentStep === 1 && 'Where do you want to go?'}
              {currentStep === 2 && 'When is your trip?'}
              {currentStep === 3 && "Who's travelling with you?"}
              {currentStep === 4 && "What's your trip budget?"}
              {currentStep === 5 && 'Select your travel interests'}
              {currentStep === 6 && 'Choose your travel style'}
              {currentStep === 7 && 'Generating your dream itinerary...'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(Math.min(currentStep, 6) / 6) * 100}%` }}
          />
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-5">
          {/* STEP 1: WHERE? */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Destination or City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Search city, island, or country..."
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Popular Suggestions
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => {
                        setDestination(dest.name);
                        setCountry(dest.country);
                        setCoverImage(dest.image);
                      }}
                      className={`group relative h-28 rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                        destination === dest.name
                          ? 'border-blue-600 ring-2 ring-blue-600/30'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <span className="text-xs font-bold block">{dest.name}</span>
                        <span className="text-[10px] text-slate-300">{dest.country}</span>
                      </div>
                      {destination === dest.name && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: WHEN? */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Automatic Duration Box */}
              <div className="bg-blue-50 border border-blue-200/70 rounded-2xl p-4 flex items-center justify-between text-blue-950">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      Calculated Duration
                    </span>
                    <h4 className="text-base font-extrabold">{durationDays} Days / {Math.max(1, durationDays - 1)} Nights</h4>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-white px-3 py-1 rounded-full shadow-2xs">
                  {durationDays} Daily Itineraries
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: WHO'S GOING? */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Trip Companions
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(['Just me', 'Friends', 'Family', 'Couple', 'Custom group'] as CompanionType[]).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setCompanion(type)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                          companion === type
                            ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-600/20 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              {companion !== 'Just me' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Invite Group Members (Email or Username)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. friend@example.com"
                      className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={handleAddEmail}
                      className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* List of invited members */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {inviteEmails.map((email) => (
                      <span
                        key={email}
                        className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center gap-1.5"
                      >
                        <span>{email}</span>
                        <button
                          onClick={() => setInviteEmails(inviteEmails.filter((e) => e !== email))}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: BUDGET */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setBudgetType('total')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      budgetType === 'total' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Total Budget
                  </button>
                  <button
                    onClick={() => setBudgetType('per_person')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      budgetType === 'per_person' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Per Person
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">Currency:</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg px-2 py-1"
                  >
                    <option value="RM">RM (MYR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="¥">¥ (JPY)</option>
                    <option value="£">£ (GBP)</option>
                  </select>
                </div>
              </div>

              {/* Budget Display & Slider */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Trip Target
                </span>
                <div className="text-4xl font-extrabold text-slate-900">
                  {currency} {budgetAmount.toLocaleString()}
                  <span className="text-sm font-medium text-slate-400 ml-1">
                    {budgetType === 'per_person' ? '/ person' : 'total'}
                  </span>
                </div>

                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="250"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>{currency} 500 (Budget)</span>
                  <span>{currency} 10,000</span>
                  <span>{currency} 20,000+ (Luxury)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: INTERESTS */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <span className="text-xs text-slate-500 block">
                Select everything you and your group want to experience:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {interestOptions.map((item) => {
                  const isSelected = selectedInterests.includes(item.label);
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleToggleInterest(item.label)}
                      className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 text-blue-800 ring-1 ring-blue-600/30'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.emoji}</span>
                        <span>{item.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: TRAVEL STYLE */}
          {currentStep === 6 && (
            <div className="space-y-3">
              <span className="text-xs text-slate-500 block">
                What pace and atmosphere do you prefer?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {travelStyles.map((item) => {
                  const isSelected = travelStyle === item.type;
                  return (
                    <div
                      key={item.type}
                      onClick={() => setTravelStyle(item.type)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: GENERATING ITINERARY ANIMATION */}
          {currentStep === 7 && (
            <div className="py-12 px-6 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Creating your perfect trip to {destination}...
                </h3>
                <p className="text-xs text-blue-600 font-semibold mt-2 animate-fade-in">
                  {generationSteps[generationStepIndex]}
                </p>
              </div>

              <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Destination:</span>
                  <span className="font-bold text-slate-800">{destination}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Duration:</span>
                  <span className="font-bold text-slate-800">{durationDays} days</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Budget:</span>
                  <span className="font-bold text-slate-800">
                    {currency} {totalCalculatedBudget.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        {currentStep < 7 && (
          <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleStartGeneration}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Itinerary</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
