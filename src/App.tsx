import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TripOverviewView } from './components/TripOverviewView';
import { ItineraryView } from './components/ItineraryView';
import { BudgetView } from './components/BudgetView';
import { GroupView } from './components/GroupView';
import { MapView } from './components/MapView';
import { ExploreView } from './components/ExploreView';
import { MyTripsView } from './components/MyTripsView';
import { SettingsView } from './components/SettingsView';
import { CreateTripWizard } from './components/CreateTripWizard';
import { AIReplanModal } from './components/AIReplanModal';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { NavTab, Trip, Activity } from './types';
import {
  loadTrips,
  saveTrips,
  loadActiveTripId,
  saveActiveTripId,
  resetToInitialData,
} from './utils/storage';

export default function App() {
  const [trips, setTrips] = useState<Trip[]>(() => loadTrips());
  const [activeTripId, setActiveTripId] = useState<string>(() => loadActiveTripId());
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [currency, setCurrency] = useState<string>('RM');

  // Modal states
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState<boolean>(false);
  const [wizardPrefillDest, setWizardPrefillDest] = useState<string>('');
  const [wizardPrefillCountry, setWizardPrefillCountry] = useState<string>('');

  const [isReplanModalOpen, setIsReplanModalOpen] = useState<boolean>(false);
  const [replanReason, setReplanReason] = useState<string>('Bad weather');
  const [replanDayNumber, setReplanDayNumber] = useState<number>(1);

  // Sync active trip
  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];

  // Save trips on changes
  useEffect(() => {
    saveTrips(trips);
  }, [trips]);

  useEffect(() => {
    saveActiveTripId(activeTripId);
  }, [activeTripId]);

  useEffect(() => {
    if (activeTrip && activeTrip.currency) {
      setCurrency(activeTrip.currency);
    }
  }, [activeTripId]);

  // Trip operations
  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };

  const handleCreateTrip = (newTrip: Trip) => {
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripId(newTrip.id);
    setCurrentTab('overview');
  };

  const handleDeleteTrip = (tripId: string) => {
    const updated = trips.filter((t) => t.id !== tripId);
    setTrips(updated);
    if (activeTripId === tripId && updated.length > 0) {
      setActiveTripId(updated[0].id);
    }
  };

  const handleSelectTrip = (tripId: string) => {
    setActiveTripId(tripId);
  };

  const handleCurrencyChange = (newCurr: string) => {
    setCurrency(newCurr);
    if (activeTrip) {
      handleUpdateTrip({ ...activeTrip, currency: newCurr });
    }
  };

  const handleResetData = () => {
    const freshTrips = resetToInitialData();
    setTrips(freshTrips);
    setActiveTripId(freshTrips[0].id);
    setCurrentTab('dashboard');
  };

  const handleOpenReplan = (reason: string = 'Bad weather', dayNumber: number = 1) => {
    setReplanReason(reason);
    setReplanDayNumber(dayNumber);
    setIsReplanModalOpen(true);
  };

  const handleApplyReplan = (dayNumber: number, newActivities: Activity[], explanation: string) => {
    if (!activeTrip) return;

    const updatedItinerary = activeTrip.itinerary.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: newActivities,
        };
      }
      return day;
    });

    const newNotification = {
      id: `notif-${Date.now()}`,
      type: 'timing' as const,
      title: 'Day Itinerary Re-planned',
      message: `AI successfully updated Day ${dayNumber} schedule: "${explanation}"`,
      timestamp: 'Just now',
      read: false,
    };

    handleUpdateTrip({
      ...activeTrip,
      itinerary: updatedItinerary,
      notifications: [newNotification, ...activeTrip.notifications],
    });
  };

  const handleAddActivityToCurrentDay = (activity: Activity) => {
    if (!activeTrip) return;
    const targetDay = activeTrip.itinerary[0];
    if (!targetDay) return;

    const updatedActivities = [...targetDay.activities, activity];
    const updatedItinerary = activeTrip.itinerary.map((d, idx) =>
      idx === 0 ? { ...d, activities: updatedActivities } : d
    );

    handleUpdateTrip({
      ...activeTrip,
      itinerary: updatedItinerary,
    });
  };

  const handleStartPlanningDestination = (destName: string, country: string) => {
    setWizardPrefillDest(destName);
    setWizardPrefillCountry(country);
    setIsCreateWizardOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unreadNotificationCount={
          activeTrip ? activeTrip.notifications.filter((n) => !n.read).length : 0
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Universal Top Header */}
        <Header
          activeTrip={activeTrip}
          trips={trips}
          onSelectTrip={handleSelectTrip}
          onOpenCreateTrip={() => {
            setWizardPrefillDest('');
            setWizardPrefillCountry('');
            setIsCreateWizardOpen(true);
          }}
          onOpenReplanModal={handleOpenReplan}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
        />

        {/* Dynamic Viewport Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              activeTrip={activeTrip}
              trips={trips}
              onSelectTrip={handleSelectTrip}
              onNavigateTab={setCurrentTab}
              onOpenCreateWizard={() => {
                setWizardPrefillDest('');
                setWizardPrefillCountry('');
                setIsCreateWizardOpen(true);
              }}
              onOpenReplanModal={handleOpenReplan}
            />
          )}

          {currentTab === 'overview' && activeTrip && (
            <TripOverviewView
              trip={activeTrip}
              onNavigateTab={setCurrentTab}
              onOpenReplanModal={handleOpenReplan}
            />
          )}

          {currentTab === 'itinerary' && activeTrip && (
            <ItineraryView
              trip={activeTrip}
              onUpdateTrip={handleUpdateTrip}
              onOpenReplanModal={handleOpenReplan}
            />
          )}

          {currentTab === 'budget' && activeTrip && (
            <BudgetView trip={activeTrip} onUpdateTrip={handleUpdateTrip} />
          )}

          {currentTab === 'group' && activeTrip && (
            <GroupView trip={activeTrip} onUpdateTrip={handleUpdateTrip} />
          )}

          {currentTab === 'map' && activeTrip && (
            <MapView
              trip={activeTrip}
              onOpenReplanModal={() => handleOpenReplan('Bad weather', 1)}
            />
          )}

          {currentTab === 'explore' && (
            <ExploreView
              onStartPlanningDestination={handleStartPlanningDestination}
              currency={currency}
            />
          )}

          {currentTab === 'trips' && (
            <MyTripsView
              trips={trips}
              activeTripId={activeTripId}
              onSelectTrip={handleSelectTrip}
              onOpenCreateWizard={() => {
                setWizardPrefillDest('');
                setWizardPrefillCountry('');
                setIsCreateWizardOpen(true);
              }}
              onDeleteTrip={handleDeleteTrip}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              currentCurrency={currency}
              onCurrencyChange={handleCurrencyChange}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Floating Smart Travel Concierge Assistant */}
      {activeTrip && (
        <AIAssistantWidget
          trip={activeTrip}
          onAddActivityToCurrentDay={handleAddActivityToCurrentDay}
          onOpenReplanModal={() => handleOpenReplan('Bad weather', 1)}
        />
      )}

      {/* Multi-Step Create Trip Wizard Modal */}
      <CreateTripWizard
        isOpen={isCreateWizardOpen}
        onClose={() => setIsCreateWizardOpen(false)}
        onTripCreated={handleCreateTrip}
        initialDestination={wizardPrefillDest}
        initialCountry={wizardPrefillCountry}
        defaultCurrency={currency}
      />

      {/* AI Re-plan My Day Modal */}
      {activeTrip && (
        <AIReplanModal
          isOpen={isReplanModalOpen}
          onClose={() => setIsReplanModalOpen(false)}
          trip={activeTrip}
          initialReason={replanReason}
          initialDayNumber={replanDayNumber}
          onApplyReplan={handleApplyReplan}
        />
      )}
    </div>
  );
}
