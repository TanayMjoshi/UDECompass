export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: 'academic' | 'international' | 'social' | 'cultural' | 'sports';
  organizer: string;
  registrationRequired: boolean;
  registrationUrl?: string;
  isOnline: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  tags?: string[];
  imageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  prerequisites?: string[];
  targetAudience?: string[];
  language?: 'en' | 'de' | 'both';
  cost?: {
    amount: number;
    currency: string;
    studentDiscount?: number;
  };
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
    exceptions?: Date[];
  };
}

export interface EventFilter {
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: string;
  registrationRequired?: boolean;
  isOnline?: boolean;
  searchQuery?: string;
}

export interface EventRegistration {
  eventId: string;
  userId: string;
  registrationDate: Date;
  status: 'registered' | 'waitlist' | 'cancelled';
  notes?: string;
}