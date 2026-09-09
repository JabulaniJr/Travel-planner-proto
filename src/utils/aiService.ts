import { Trip, DayItinerary, Activity, TravelStyle } from '../types';

export interface ReplanResult {
  cause: string;
  explanation: string;
  suggestionTitle: string;
  summary: string;
  modifiedActivities: Activity[];
  alternativeOption?: {
    title: string;
    summary: string;
    activities: Activity[];
  };
}

export function generateTripItinerary(
  destination: string,
  startDate: string,
  endDate: string,
  budget: number,
  currency: string,
  interests: string[],
  style: TravelStyle
): DayItinerary[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  const daysCount = Math.min(diffDays, 7); // up to 7 days demo

  const result: DayItinerary[] = [];

  const activityTemplates: Record<string, Array<{ title: string; desc: string; cat: any; cost: number; time: string }>> = {
    Food: [
      { title: 'Morning Artisan Bakery & Local Roast', desc: 'Indulge in freshly baked pastries and single-origin coffee.', cat: 'Food', cost: 35, time: '08:30 AM' },
      { title: 'Street Food Market Culinary Walking Tour', desc: 'Sample 5 local delicacies across bustling pedestrian lanes.', cat: 'Food', cost: 65, time: '12:30 PM' },
      { title: 'Chef’s Table Regional Dinner Experience', desc: 'Multi-course dinner featuring seasonal farm-to-table specialties.', cat: 'Food', cost: 110, time: '07:30 PM' },
    ],
    Culture: [
      { title: 'Historic Heritage Sanctuary & Shrine', desc: 'Explore monumental architecture and spiritual gardens with an audio guide.', cat: 'Culture', cost: 25, time: '10:00 AM' },
      { title: 'National Art & History Modern Gallery', desc: 'Immersive exhibits celebrating contemporary and classical masters.', cat: 'Culture', cost: 40, time: '02:30 PM' },
      { title: 'Traditional Evening Performance & Tea', desc: 'Cultural performance and traditional matcha ceremony.', cat: 'Culture', cost: 60, time: '06:00 PM' },
    ],
    Photography: [
      { title: 'Golden Hour Architectural Viewpoint', desc: 'Capture panoramic skyline vistas from the highest vantage point.', cat: 'Photography', cost: 45, time: '05:30 PM' },
      { title: 'Charming Historic Alleyways Walk', desc: 'Secret hidden cobblestone passages, retro storefronts and lanterns.', cat: 'Photography', cost: 0, time: '03:00 PM' },
    ],
    Shopping: [
      { title: 'Craft Artisan Bazaar & Flea Market', desc: 'Handcrafted textiles, local ceramics, and rare souvenirs.', cat: 'Shopping', cost: 80, time: '03:30 PM' },
      { title: 'Trendsetter District Concept Stores', desc: 'Flagship fashion boutiques and Japanese stationery treasures.', cat: 'Shopping', cost: 95, time: '11:00 AM' },
    ],
    Nature: [
      { title: 'Botanical Gardens & Bamboo Grove Walk', desc: 'A serene escape through lush greenery and koi ponds.', cat: 'Nature', cost: 15, time: '09:00 AM' },
      { title: 'Scenic River Cruise & Waterfront Promenade', desc: 'Gentle cruise along the waterways with cooling breezes.', cat: 'Nature', cost: 50, time: '04:00 PM' },
    ],
    Adventure: [
      { title: 'Panoramic High-Speed Cable Car Ride', desc: 'Ascend the peaks for sweeping horizon views.', cat: 'Adventure', cost: 55, time: '10:30 AM' },
      { title: 'Sunset Kayaking or Urban E-Bike Safari', desc: 'Active exploration through iconic waterfront landmarks.', cat: 'Adventure', cost: 75, time: '04:30 PM' },
    ],
  };

  const primaryInterests = interests.length > 0 ? interests : ['Food', 'Culture', 'Photography'];

  for (let i = 1; i <= daysCount; i++) {
    const dayDate = new Date(start);
    dayDate.setDate(dayDate.getDate() + (i - 1));
    const dateStr = dayDate.toISOString().split('T')[0];

    const currentThemeInterest = primaryInterests[(i - 1) % primaryInterests.length];
    const templates = activityTemplates[currentThemeInterest] || activityTemplates['Culture'];

    const acts: Activity[] = [
      {
        id: `gen-act-${i}-1`,
        time: '09:00 AM',
        title: `Breakfast & Café in ${destination}`,
        description: `Start Day ${i} at a highly rated neighborhood café known for local morning staples.`,
        category: 'Food',
        location: `${destination} Central Hub`,
        cost: Math.round(budget * 0.02),
        costDisplay: `${currency}${Math.round(budget * 0.02)}`,
        durationMinutes: 60,
        bookingStatus: 'Planned',
        transitToNext: { type: 'walk', duration: '12 min walk', distance: '850m' },
        lat: 35.6895 + (Math.random() - 0.5) * 0.04,
        lng: 139.6917 + (Math.random() - 0.5) * 0.04,
      },
      {
        id: `gen-act-${i}-2`,
        time: '10:30 AM',
        title: templates[0]?.title || `Iconic ${destination} Landmark Discovery`,
        description: templates[0]?.desc || `Must-visit highlight matching your ${currentThemeInterest} interest.`,
        category: templates[0]?.cat || 'Culture',
        location: `${destination} Historic Quarter`,
        cost: Math.round(budget * 0.035),
        costDisplay: `${currency}${Math.round(budget * 0.035)}`,
        durationMinutes: 90,
        bookingStatus: 'Planned',
        transitToNext: { type: 'train', duration: '15 min by train', distance: '2.5km' },
        lat: 35.6895 + (Math.random() - 0.5) * 0.04,
        lng: 139.6917 + (Math.random() - 0.5) * 0.04,
      },
      {
        id: `gen-act-${i}-3`,
        time: '01:00 PM',
        title: `Authentic Lunch & Local Specialties`,
        description: `Refuel with authentic ${destination} cuisine recommended by locals.`,
        category: 'Food',
        location: `${destination} Market Lane`,
        cost: Math.round(budget * 0.03),
        costDisplay: `${currency}${Math.round(budget * 0.03)}`,
        durationMinutes: 75,
        bookingStatus: 'Planned',
        transitToNext: { type: 'walk', duration: '8 min walk', distance: '600m' },
        lat: 35.6895 + (Math.random() - 0.5) * 0.04,
        lng: 139.6917 + (Math.random() - 0.5) * 0.04,
      },
      {
        id: `gen-act-${i}-4`,
        time: '03:00 PM',
        title: templates[1]?.title || `${currentThemeInterest} Exploration & Stroll`,
        description: templates[1]?.desc || `Immersive afternoon activity tailored to ${style.toLowerCase()} travel style.`,
        category: templates[1]?.cat || 'Adventure',
        location: `${destination} Cultural District`,
        cost: Math.round(budget * 0.025),
        costDisplay: `${currency}${Math.round(budget * 0.025)}`,
        durationMinutes: 100,
        bookingStatus: 'Planned',
        transitToNext: { type: 'drive', duration: '10 min drive', distance: '3km' },
        lat: 35.6895 + (Math.random() - 0.5) * 0.04,
        lng: 139.6917 + (Math.random() - 0.5) * 0.04,
      },
      {
        id: `gen-act-${i}-5`,
        time: '07:00 PM',
        title: `Evening Skyline Dinner & Stroll`,
        description: `Wrap up the day with a relaxed dinner and illuminated city views.`,
        category: 'Food',
        location: `${destination} Downtown`,
        cost: Math.round(budget * 0.045),
        costDisplay: `${currency}${Math.round(budget * 0.045)}`,
        durationMinutes: 120,
        bookingStatus: 'Planned',
        lat: 35.6895 + (Math.random() - 0.5) * 0.04,
        lng: 139.6917 + (Math.random() - 0.5) * 0.04,
      },
    ];

    const totalEst = acts.reduce((sum, a) => sum + a.cost, 0);

    result.push({
      dayNumber: i,
      date: dateStr,
      title: `Day ${i} — ${destination} Highlights & ${currentThemeInterest}`,
      theme: `${currentThemeInterest} & ${style} Pace`,
      estimatedDailySpending: totalEst,
      activities: acts,
    });
  }

  return result;
}

export function generateReplanSuggestion(
  trip: Trip,
  dayNumber: number,
  reason: string
): ReplanResult {
  const currentDay = trip.itinerary.find((d) => d.dayNumber === dayNumber) || trip.itinerary[0];
  const acts = currentDay ? [...currentDay.activities] : [];

  switch (reason) {
    case 'Bad weather':
      return {
        cause: 'Heavy Rain Forecast (2:00 PM – 5:30 PM)',
        explanation: 'Outdoor walking around Sumida Park and waterfront will have downpours and low visibility.',
        suggestionTitle: 'Swap Outdoor Walk for Tokyo National Museum & Indoor Arcade',
        summary: 'Move the outdoor river walk to tomorrow afternoon. Today, visit the covered Tokyo National Museum and modern indoor arts complex.',
        modifiedActivities: acts.map((act) => {
          if (act.title.includes('Explore Asakusa') || act.title.includes('River Walk') || act.title.includes('Stroll')) {
            return {
              ...act,
              title: 'Tokyo National Museum (Indoor Art & Artifacts)',
              description: 'Stay completely dry while admiring Japan’s finest samurai armor, kimono textiles, and zen art.',
              category: 'Culture',
              location: '13-9 Uenokoen, Taito City',
              cost: 40,
              costDisplay: '¥1,000',
              transitToNext: { type: 'train', duration: '12 min by train' },
            };
          }
          return act;
        }),
        alternativeOption: {
          title: 'Indoor TeamLab Borderless + Mori Art Museum',
          summary: 'Keep the entire afternoon inside Roppongi Hills covered complex.',
          activities: acts.map((act) => {
            if (act.title.includes('Asakusa') || act.category === 'Photography') {
              return {
                ...act,
                title: 'Mori Art Museum & Indoor Roppongi City View',
                description: 'Panoramic glass observation deck protected from rain and wind.',
                category: 'Culture',
                location: 'Roppongi Hills Mori Tower 53F',
                cost: 65,
                costDisplay: '¥2,000',
              };
            }
            return act;
          }),
        },
      };

    case 'Flight delayed':
      return {
        cause: 'Flight JL724 Delayed by 2 Hours',
        explanation: 'Arrival shifted to 3:45 PM. Morning activities cannot be attended in person.',
        suggestionTitle: 'Compress Morning Activities & Smooth Evening Arrival',
        summary: 'We shifted check-in forward, postponed Senso-ji to Day 4, and prioritized a hassle-free hotel arrival with an izakaya dinner right downstairs.',
        modifiedActivities: acts
          .filter((a) => !a.time.includes('9:00 AM') && !a.time.includes('10:30 AM'))
          .concat([
            {
              id: 'replan-arrival-relax',
              time: '04:30 PM',
              title: 'Express Skyliner to Shinjuku & Hotel Check-in',
              description: 'Quick check-in, unpack luggage, and refresh with complimentary green tea.',
              category: 'Hotel',
              location: 'Shinjuku Granbell Hotel',
              cost: 65,
              costDisplay: 'RM65 pass',
              durationMinutes: 60,
              bookingStatus: 'Confirmed',
            },
          ])
          .sort((a, b) => a.time.localeCompare(b.time)),
      };

    case 'Budget exceeded':
      return {
        cause: 'Food & Activities Approaching Alert Threshold',
        explanation: "Current spending is 12% higher than planned. Group requested cost-saving adjustments.",
        suggestionTitle: 'Swap Premium Dinner for Iconic Michelin Bib-Gourmand Ramen',
        summary: 'Replaced high-cost banquet dinner with delicious award-winning local ramen and self-guided city walking routes, saving RM115 per person.',
        modifiedActivities: acts.map((act) => {
          if (act.title.includes('Dinner') || act.cost > 60) {
            return {
              ...act,
              title: 'Michelin Bib-Gourmand Soba & Gyoza',
              description: 'Crispy pan-fried dumplings and handmade soba loved by local food critics for unbeatable value.',
              cost: 30,
              costDisplay: '¥1,000 (Saved RM55)',
            };
          }
          return act;
        }),
      };

    case 'Feeling tired':
      return {
        cause: 'Group Energy Low / Jetlag Recovery',
        explanation: 'Pacing was too fast with 14,000 steps logged. Group needs rest.',
        suggestionTitle: 'Relaxed Pacing: Onsen Foot Spa & Leisurely Café Afternoon',
        summary: 'Eliminated fast transit hopping. Added a soothing foot onsen café and delayed evening dinner by 90 minutes.',
        modifiedActivities: acts
          .filter((a) => !a.title.includes('Observation Deck') && !a.title.includes('Skytree'))
          .concat([
            {
              id: 'replan-rest-spa',
              time: '03:30 PM',
              title: 'Therapeutic Onsen Foot Bath & Herbal Tea',
              description: 'Submerge tired feet in natural cedar mineral water while sipping calming hojicha.',
              category: 'Relaxation',
              location: 'Momi no Yu Footbath Café, Ueno',
              cost: 35,
              costDisplay: '¥1,100',
              durationMinutes: 90,
              bookingStatus: 'Planned',
            },
          ]),
      };

    default:
      return {
        cause: `${reason} reported`,
        explanation: 'AI detected an unexpected disruption to your planned timeline.',
        suggestionTitle: 'Optimized Real-Time Schedule Adjustment',
        summary: 'Re-ordered stops to avoid peak crowd lines and minimize transit friction.',
        modifiedActivities: [...acts].reverse(),
      };
  }
}

export interface SmartAssistantResult {
  text: string;
  reply?: string;
  suggestedActivity?: Activity;
  action?: {
    type: string;
    label: string;
    payload?: any;
  };
}

export function getSmartAssistantReply(query: string, trip: Trip): SmartAssistantResult {
  const q = query.toLowerCase();

  if (q.includes('ramen') || q.includes('halal')) {
    const ramenAct: Activity = {
      id: `act-ramen-${Date.now()}`,
      time: '01:00 PM',
      title: 'Halal Ramen Ouka (Shinjuku Gyoen)',
      description: 'Halal-certified sea bream broth ramen with grilled chicken skewers and vegan options.',
      category: 'Food',
      location: '1-11-7 Shinjuku, Shinjuku City, Tokyo',
      cost: 45,
      costDisplay: '¥1,500',
      durationMinutes: 45,
      bookingStatus: 'Planned',
    };
    return {
      text: `🍜 **Halal Ramen Ouka** near Shinjuku Gyoen is our top recommendation!\n\n• **Broth:** Rich sea bream (tai) dashi infused with yuzu citrus.\n• **Certification:** Certified Halal, prayer mat available.\n• **Price:** ~¥1,500 per bowl.\n• **Distance:** 8 mins walk from Shinjuku-sanchome Station.`,
      reply: `🍜 **Halal Ramen Ouka** near Shinjuku Gyoen is our top recommendation!\n\n• **Broth:** Rich sea bream (tai) dashi infused with yuzu citrus.\n• **Certification:** Certified Halal, prayer mat available.\n• **Price:** ~¥1,500 per bowl.\n• **Distance:** 8 mins walk from Shinjuku-sanchome Station.`,
      suggestedActivity: ramenAct,
      action: {
        type: 'add_activity',
        label: 'Add Halal Ramen Ouka to Day 1',
        payload: ramenAct,
      },
    };
  }

  if (q.includes('haneda') || q.includes('airport') || q.includes('cheapest')) {
    return {
      text: `🚅 **Cheapest Route to Haneda Airport:**\n\n1. Take the **JR Yamanote Line** from Tokyo Station to Hamamatsucho Station (6 mins, ¥170).\n2. Transfer to the **Tokyo Monorail Airport Rapid** directly to Haneda Terminal 3 (13 mins, ¥500).\n\n• **Total Cost:** ¥670 (~RM21) per person.\n• **Total Time:** ~25 minutes.\n*(Tip: Covered 100% by the JR Pass if you activated one!)*`,
      reply: `🚅 **Cheapest Route to Haneda Airport:**\n\n1. Take the **JR Yamanote Line** from Tokyo Station to Hamamatsucho Station (6 mins, ¥170).\n2. Transfer to the **Tokyo Monorail Airport Rapid** directly to Haneda Terminal 3 (13 mins, ¥500).\n\n• **Total Cost:** ¥670 (~RM21) per person.\n• **Total Time:** ~25 minutes.\n*(Tip: Covered 100% by the JR Pass if you activated one!)*`,
    };
  }

  if (q.includes('pack') || q.includes('september')) {
    return {
      text: `🎒 **Packing Guide for Tokyo in September:**\n\n• **Weather:** Warm daytime (~26°C–28°C), cooler evenings (~20°C). Occasional late-summer rain.\n• **Clothing:** Lightweight breathable shirts, comfortable walking sneakers (you'll average 15,000+ steps/day).\n• **Essentials:** Compact umbrella or light rain shell, portable phone power bank (for Suica transit taps and Google Maps), slip-on shoes for temple visits.`,
      reply: `🎒 **Packing Guide for Tokyo in September:**\n\n• **Weather:** Warm daytime (~26°C–28°C), cooler evenings (~20°C). Occasional late-summer rain.\n• **Clothing:** Lightweight breathable shirts, comfortable walking sneakers (you'll average 15,000+ steps/day).\n• **Essentials:** Compact umbrella or light rain shell, portable phone power bank (for Suica transit taps and Google Maps), slip-on shoes for temple visits.`,
    };
  }

  if (q.includes('fit') || q.includes('activity before dinner') || q.includes('free time')) {
    const teaAct: Activity = {
      id: `act-tea-${Date.now()}`,
      time: '04:30 PM',
      title: 'Traditional Matcha Ceremony at Hama-rikyu Garden',
      description: 'Sip whisked ceremonial grade matcha overlooking the historic tidal pond before dinner.',
      category: 'Relaxation',
      location: 'Hama-rikyu Gardens, Chuo City',
      cost: 30,
      costDisplay: '¥850',
      durationMinutes: 45,
      bookingStatus: 'Planned',
    };
    return {
      text: `Yes! You have a 1 hour 45 minute buffer between your afternoon temple visit and dinner. A calming matcha tea break at Hama-rikyu Gardens or a stroll through Kappabashi Kitchenware Town fits seamlessly into your timeline.`,
      reply: `Yes! You have a 1 hour 45 minute buffer between your afternoon temple visit and dinner. A calming matcha tea break at Hama-rikyu Gardens or a stroll through Kappabashi Kitchenware Town fits seamlessly into your timeline.`,
      suggestedActivity: teaAct,
      action: {
        type: 'add_activity',
        label: 'Add Matcha Ceremony (4:30 PM)',
        payload: teaAct,
      },
    };
  }

  if (q.includes('rain') || q.includes('weather')) {
    return {
      text: `Tomorrow afternoon (Day 2) has a 75% chance of heavy showers around 2:00 PM. I recommend swapping outdoor Sumida Park with the indoor Tokyo National Museum or TeamLab Planets, which are 100% weather-protected!`,
      reply: `Tomorrow afternoon (Day 2) has a 75% chance of heavy showers around 2:00 PM. I recommend swapping outdoor Sumida Park with the indoor Tokyo National Museum or TeamLab Planets, which are 100% weather-protected!`,
      action: {
        type: 'replan',
        label: '✨ Re-plan for Bad Weather',
        payload: { reason: 'Bad weather', dayNumber: 1 },
      },
    };
  }

  if (q.includes('budget') || q.includes('cheaper') || q.includes('cost') || q.includes('money')) {
    const remaining = trip.totalBudget - trip.expenses.reduce((s, e) => s + e.amount, 0);
    return {
      text: `You have spent ${trip.currency} ${trip.expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()} out of ${trip.currency} ${trip.totalBudget.toLocaleString()} (${trip.currency} ${remaining.toLocaleString()} remaining). You are spending slightly faster on Food. If you swap 1 dinner with casual ramen or depachika bento, you'll save ~${trip.currency} 80/day!`,
      reply: `You have spent ${trip.currency} ${trip.expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()} out of ${trip.currency} ${trip.totalBudget.toLocaleString()} (${trip.currency} ${remaining.toLocaleString()} remaining). You are spending slightly faster on Food. If you swap 1 dinner with casual ramen or depachika bento, you'll save ~${trip.currency} 80/day!`,
      action: {
        type: 'view_budget',
        label: 'Open Budget Dashboard',
      },
    };
  }

  return {
    text: `Based on your Tokyo trip schedule for ${trip.travellerCount} travellers: Day 1 covers historic Asakusa and Tokyo Skytree. Everything is on track! I can help re-plan for weather, find nearby food, calculate group splits, or add custom activities. How would you like to proceed?`,
    reply: `Based on your Tokyo trip schedule for ${trip.travellerCount} travellers: Day 1 covers historic Asakusa and Tokyo Skytree. Everything is on track! I can help re-plan for weather, find nearby food, calculate group splits, or add custom activities. How would you like to proceed?`,
  };
}

