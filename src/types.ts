export type TravelStyle = 'Relaxed' | 'Balanced' | 'Packed' | 'Luxury' | 'Budget' | 'Adventure';

export type CompanionType = 'Just me' | 'Friends' | 'Family' | 'Couple' | 'Custom group';

export type NavTab =
  | 'dashboard'
  | 'overview'
  | 'itinerary'
  | 'budget'
  | 'group'
  | 'map'
  | 'explore'
  | 'trips'
  | 'settings';

export interface LocationPoint {
  name: string;
  lat: number;
  lng: number;
  address?: string;
  category: 'hotel' | 'restaurant' | 'attraction' | 'activity' | 'transport';
}

export interface Activity {
  id: string;
  time: string; // e.g. "09:00 AM"
  title: string;
  description: string;
  category: 'Culture' | 'Food' | 'Nature' | 'Shopping' | 'Adventure' | 'Relaxation' | 'Transport' | 'Hotel' | 'Photography';
  location: string;
  cost: number; // in current trip currency
  costDisplay?: string; // e.g. "¥1,500" or "RM50"
  durationMinutes: number;
  transitToNext?: {
    type: 'walk' | 'drive' | 'train';
    duration: string; // e.g. "12 min walk"
    distance?: string; // e.g. "800m"
  };
  notes?: string;
  bookingStatus?: 'Confirmed' | 'Reserved' | 'Planned' | 'Optional';
  lat?: number;
  lng?: number;
  imageUrl?: string;
}

export interface DayItinerary {
  dayNumber: number;
  date: string; // ISO date string e.g. "2026-09-12"
  title: string; // e.g. "Tokyo Adventure: Asakusa & Skytree"
  theme: string;
  activities: Activity[];
  estimatedDailySpending: number;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'Organizer' | 'Co-planner' | 'Member';
  isCurrentUser?: boolean;
  likes: string[];
  dislikes: string[];
  email: string;
}

export interface PollOption {
  id: string;
  title: string;
  votes: string[]; // member IDs who voted
  suggestedBy: string;
  category?: string;
  icon?: string;
  estimatedCost?: number;
}

export interface GroupPoll {
  id: string;
  question: string;
  description?: string;
  deadline?: string;
  options: PollOption[];
  status: 'active' | 'closed';
}

export interface ExpenseSplitItem {
  memberId: string;
  amount: number;
  isPaid: boolean;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: 'Flights' | 'Accommodation' | 'Food' | 'Transport' | 'Activities' | 'Shopping' | 'Other';
  paidByMemberId: string;
  date: string;
  splitBetween: string[]; // member IDs
  splits: ExpenseSplitItem[];
  receiptUrl?: string;
}

export interface Settlement {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  isSettled: boolean;
}

export interface TripNotification {
  id: string;
  type: 'alert' | 'weather' | 'budget' | 'timing' | 'flight';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  replanTrigger?: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  country: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  companionType: CompanionType;
  travellerCount: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'draft';
  totalBudget: number;
  currency: string; // e.g. 'RM', 'USD', 'EUR', 'JPY'
  interests: string[];
  travelStyle: TravelStyle;
  members: GroupMember[];
  itinerary: DayItinerary[];
  expenses: Expense[];
  polls: GroupPoll[];
  notifications: TripNotification[];
  weatherForecast?: {
    condition: string;
    temperature: string;
    forecastAlert?: string;
  };
  aiNotes?: string[];
}

export interface DestinationIdea {
  id: string;
  name: string;
  country: string;
  image: string;
  averageDailyCost: number;
  currency: string;
  bestTimeToVisit: string;
  tags: string[];
  rating: number;
  description: string;
  popularActivities: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionable?: {
    type: 'replan' | 'add_activity' | 'view_budget' | 'view_group';
    payload?: any;
    label: string;
  };
}
