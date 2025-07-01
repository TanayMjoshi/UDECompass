import { CampusEvent } from '../types/Events';

// Mock events data - in a real app, this would come from the UDE events API
const mockEvents: CampusEvent[] = [
  {
    id: '1',
    title: 'International Student Welcome Day',
    description: 'Join us for a warm welcome to UDE! Meet fellow international students, learn about campus resources, and enjoy cultural activities.',
    date: new Date(2025, 0, 25), // January 25, 2025
    time: '14:00 - 18:00',
    location: 'Student Center, Main Hall',
    category: 'international',
    organizer: 'International Office',
    registrationRequired: true,
    registrationUrl: 'https://www.uni-due.de/international/registration',
    isOnline: false,
    maxParticipants: 200,
    currentParticipants: 145,
    tags: ['welcome', 'networking', 'cultural'],
    targetAudience: ['international students', 'new students'],
    language: 'both'
  },
  {
    id: '2',
    title: 'Digital Library Workshop',
    description: 'Learn how to effectively use our digital library resources, databases, and research tools.',
    date: new Date(2025, 0, 28),
    time: '10:00 - 12:00',
    location: 'Central Library, Computer Lab',
    category: 'academic',
    organizer: 'Library Services',
    registrationRequired: true,
    isOnline: false,
    maxParticipants: 30,
    currentParticipants: 18,
    tags: ['research', 'digital literacy', 'academic skills'],
    targetAudience: ['all students', 'researchers'],
    language: 'en'
  },
  {
    id: '3',
    title: 'Campus Food Festival',
    description: 'Taste international cuisines from around the world! Student organizations present their traditional foods.',
    date: new Date(2025, 0, 30),
    time: '11:00 - 16:00',
    location: 'Cafeteria Outdoor Area',
    category: 'cultural',
    organizer: 'Student Organizations',
    registrationRequired: false,
    isOnline: false,
    tags: ['food', 'culture', 'international', 'community'],
    targetAudience: ['all students', 'staff', 'visitors'],
    language: 'both'
  },
  {
    id: '4',
    title: 'Career Fair 2025',
    description: 'Meet potential employers, learn about internship opportunities, and network with industry professionals.',
    date: new Date(2025, 1, 5), // February 5, 2025
    time: '09:00 - 17:00',
    location: 'Student Center, Exhibition Hall',
    category: 'academic',
    organizer: 'Career Services',
    registrationRequired: true,
    registrationUrl: 'https://www.uni-due.de/career/fair2025',
    isOnline: false,
    maxParticipants: 500,
    currentParticipants: 320,
    tags: ['career', 'networking', 'jobs', 'internships'],
    targetAudience: ['students', 'graduates'],
    language: 'both'
  },
  {
    id: '5',
    title: 'Virtual Study Abroad Information Session',
    description: 'Learn about exchange programs, application processes, and hear from students who studied abroad.',
    date: new Date(2025, 1, 8),
    time: '15:00 - 16:30',
    location: 'Online via Zoom',
    category: 'international',
    organizer: 'International Office',
    registrationRequired: true,
    isOnline: true,
    maxParticipants: 100,
    currentParticipants: 67,
    tags: ['study abroad', 'exchange', 'international'],
    targetAudience: ['undergraduate students', 'graduate students'],
    language: 'en'
  },
  {
    id: '6',
    title: 'Campus Sports Tournament',
    description: 'Join the inter-faculty sports competition! Football, basketball, volleyball, and more.',
    date: new Date(2025, 1, 12),
    time: '13:00 - 18:00',
    location: 'Sports Complex',
    category: 'sports',
    organizer: 'Sports Department',
    registrationRequired: true,
    isOnline: false,
    maxParticipants: 150,
    currentParticipants: 89,
    tags: ['sports', 'competition', 'team building'],
    targetAudience: ['all students'],
    language: 'both'
  },
  {
    id: '7',
    title: 'Research Methodology Seminar',
    description: 'Advanced seminar on quantitative and qualitative research methods for graduate students.',
    date: new Date(2025, 1, 15),
    time: '14:00 - 17:00',
    location: 'Academic Building, Room 301',
    category: 'academic',
    organizer: 'Graduate School',
    registrationRequired: true,
    isOnline: false,
    maxParticipants: 25,
    currentParticipants: 12,
    tags: ['research', 'methodology', 'graduate'],
    targetAudience: ['graduate students', 'PhD candidates'],
    language: 'en'
  },
  {
    id: '8',
    title: 'International Coffee Hour',
    description: 'Weekly meetup for international and local students to practice languages and make friends.',
    date: new Date(2025, 1, 18),
    time: '16:00 - 18:00',
    location: 'Student Center, Lounge',
    category: 'social',
    organizer: 'International Student Association',
    registrationRequired: false,
    isOnline: false,
    tags: ['social', 'language exchange', 'networking'],
    targetAudience: ['international students', 'local students'],
    language: 'both',
    recurrence: {
      type: 'weekly',
      endDate: new Date(2025, 5, 30)
    }
  },
  {
    id: '9',
    title: 'Art Exhibition Opening: "Perspectives"',
    description: 'Opening ceremony for the student art exhibition featuring works from various cultural backgrounds.',
    date: new Date(2025, 1, 20),
    time: '18:00 - 21:00',
    location: 'Cultural Center, Gallery',
    category: 'cultural',
    organizer: 'Art Department',
    registrationRequired: false,
    isOnline: false,
    tags: ['art', 'exhibition', 'culture', 'creativity'],
    targetAudience: ['all students', 'staff', 'public'],
    language: 'both'
  },
  {
    id: '10',
    title: 'Entrepreneurship Workshop',
    description: 'Learn the basics of starting your own business, from idea validation to funding strategies.',
    date: new Date(2025, 1, 22),
    time: '10:00 - 15:00',
    location: 'Innovation Hub, Workshop Room',
    category: 'academic',
    organizer: 'Entrepreneurship Center',
    registrationRequired: true,
    registrationUrl: 'https://www.uni-due.de/entrepreneurship/workshop',
    isOnline: false,
    maxParticipants: 40,
    currentParticipants: 28,
    tags: ['entrepreneurship', 'business', 'startup'],
    targetAudience: ['all students', 'alumni'],
    language: 'en'
  }
];

export const getCampusEvents = async (): Promise<CampusEvent[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Sort events by date
  return mockEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getEventsByCategory = async (category: string): Promise<CampusEvent[]> => {
  const events = await getCampusEvents();
  return events.filter(event => event.category === category);
};

export const getUpcomingEvents = async (limit: number = 5): Promise<CampusEvent[]> => {
  const events = await getCampusEvents();
  const now = new Date();
  
  return events
    .filter(event => event.date >= now)
    .slice(0, limit);
};

export const getEventById = async (id: string): Promise<CampusEvent | null> => {
  const events = await getCampusEvents();
  return events.find(event => event.id === id) || null;
};

export const searchEvents = async (query: string): Promise<CampusEvent[]> => {
  const events = await getCampusEvents();
  const lowerQuery = query.toLowerCase();
  
  return events.filter(event => 
    event.title.toLowerCase().includes(lowerQuery) ||
    event.description.toLowerCase().includes(lowerQuery) ||
    event.location.toLowerCase().includes(lowerQuery) ||
    event.organizer.toLowerCase().includes(lowerQuery) ||
    event.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getEventsByDateRange = async (startDate: Date, endDate: Date): Promise<CampusEvent[]> => {
  const events = await getCampusEvents();
  
  return events.filter(event => 
    event.date >= startDate && event.date <= endDate
  );
};

export const registerForEvent = async (eventId: string, userId: string): Promise<{ success: boolean; message: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const event = await getEventById(eventId);
  if (!event) {
    return { success: false, message: 'Event not found' };
  }
  
  if (!event.registrationRequired) {
    return { success: false, message: 'Registration not required for this event' };
  }
  
  if (event.maxParticipants && event.currentParticipants && event.currentParticipants >= event.maxParticipants) {
    return { success: false, message: 'Event is full' };
  }
  
  // In a real implementation, this would update the database
  if (event.currentParticipants !== undefined) {
    event.currentParticipants += 1;
  }
  
  return { success: true, message: 'Successfully registered for event' };
};