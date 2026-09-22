// Cabin classes for flight bookings
export const SERVICES = [
  { id: 'economy', name: 'Economy Class', category: 'Economy', basePrice: 500 },
  { id: 'premium_eco', name: 'Premium Economy', category: 'Economy', basePrice: 900 },
  { id: 'business', name: 'Business Class', category: 'Business', basePrice: 3500 },
  { id: 'first', name: 'First Class', category: 'First', basePrice: 8000 },
  { id: 'charter', name: 'Private Charter', category: 'Charter', basePrice: 25000 },
];

export const CABIN_CLASSES = [
  { id: 'economy', name: 'Economy', code: 'Y', multiplier: 1.0 },
  { id: 'premium_eco', name: 'Premium Economy', code: 'W', multiplier: 1.5 },
  { id: 'business', name: 'Business Class', code: 'J', multiplier: 2.5 },
  { id: 'first', name: 'First Class', code: 'F', multiplier: 4.0 },
];

export const TRAVEL_ADDONS = [
  { id: 'seat_upgrade', name: 'Seat Upgrade', description: 'Extra legroom / Exit row' },
  { id: 'extra_baggage_23', name: 'Extra Baggage 23kg', description: '23kg add-on' },
  { id: 'extra_baggage_32', name: 'Extra Baggage 32kg', description: '32kg add-on' },
  { id: 'travel_insurance', name: 'Travel Insurance', description: 'Comprehensive coverage' },
  { id: 'airport_transfer', name: 'Airport Transfer', description: 'Private car service' },
  { id: 'hotel', name: 'Hotel', description: 'Partner hotel booking' },
  { id: 'priority_checkin', name: 'Priority Check-in & Boarding' },
  { id: 'lounge_access', name: 'Airport Lounge Access' },
  { id: 'fast_track', name: 'Fast Track Security' },
  { id: 'travel_sim', name: 'International Travel SIM' },
];

export const POPULAR_ROUTES = [
  { id: 'r1', origin: 'JFK', destination: 'LHR', originCity: 'New York', destCity: 'London' },
  { id: 'r2', origin: 'DEL', destination: 'LHR', originCity: 'Delhi', destCity: 'London' },
  { id: 'r3', origin: 'DXB', destination: 'JFK', originCity: 'Dubai', destCity: 'New York' },
  { id: 'r4', origin: 'DEL', destination: 'DXB', originCity: 'Delhi', destCity: 'Dubai' },
  { id: 'r5', origin: 'LHR', destination: 'CDG', originCity: 'London', destCity: 'Paris' },
  { id: 'r6', origin: 'JFK', destination: 'DXB', originCity: 'New York', destCity: 'Dubai' },
  { id: 'r7', origin: 'BOM', destination: 'LHR', originCity: 'Mumbai', destCity: 'London' },
  { id: 'r8', origin: 'SIN', destination: 'LHR', originCity: 'Singapore', destCity: 'London' },
];

export const AIRLINES = [
  { code: 'AA', name: 'American Airlines' },
  { code: 'BA', name: 'British Airways' },
  { code: 'AI', name: 'Air India' },
  { code: 'EK', name: 'Emirates' },
  { code: 'QR', name: 'Qatar Airways' },
  { code: 'EY', name: 'Etihad Airways' },
  { code: 'SQ', name: 'Singapore Airlines' },
  { code: 'LH', name: 'Lufthansa' },
  { code: 'AF', name: 'Air France' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'DL', name: 'Delta Airlines' },
  { code: 'TK', name: 'Turkish Airlines' },
];

export const LEAD_LABELS = [
  { id: 'hot_lead', name: 'Hot Lead', emoji: '\uD83D\uDD25', color: '#FF6B35' },
  { id: 'vip', name: 'VIP', emoji: '\uD83C\uDDFA\uD83C\uDDF8', color: '#2563EB' },
  { id: 'price_sensitive', name: 'Price Sensitive', emoji: '\uD83D\uDCB2', color: '#6B7280' },
  { id: 'corporate', name: 'Corporate', emoji: '\uD83C\uDFE2', color: '#7C3AED' },
  { id: 'urgent', name: 'Urgent', emoji: '\uD83D\uDEA8', color: '#DC2626' },
];

export const BOOKING_STATUSES = [
  'Quoted', 'Confirmed', 'PNR Created',
  'Payment Received', 'Ticketed', 'Dispatched',
  'Completed', 'Cancelled', 'Refunded'
];

export const TICKETING_STATUSES = [
  'Pending Ticketing',
  'Pending Payment',
  'Payment Confirmed',
  'Ready to Issue',
  'Ticketing in Progress',
  'Ticketed',
  'Failed',
  'Manual Review'
];

export const PAYMENT_STATUSES = [
  'Payment Pending',
  'Payment Processing',
  'Payment Successful',
  'Payment Failed',
  'Payment Cancelled',
  'Partially Paid',
  'Refund Pending',
  'Refunded',
  'Partially Refunded',
  'Chargeback'
];

export const LEAD_STATUSES = [
  'New', 'Contacted', 'Qualified',
  'Quote Sent', 'Negotiating', 'Won',
  'Lost', 'Wasted'
];

export const DOCUMENT_TYPES = [
  'Passport', 'E-Ticket PDF', 'Official Itinerary',
  'Travel Insurance', 'Visa Copy', 'Hotel Voucher',
  'E-Sign Authorization'
];

export const PACKAGES = [
  {
    id: 'flight_only',
    name: 'Flight Only',
    description: 'Best airfare found from our GDS system with competitive markup pricing.',
    includes: [
      'GDS Fare Search (Sabre/Amadeus)',
      'Best Price Guarantee',
      'E-Ticket Issuance',
      'Official Itinerary PDF',
      'PNR Flight Tracking',
      'Schedule Change Alerts',
      'Email & WhatsApp Notifications',
    ]
  },
  {
    id: 'full_package',
    name: 'Full Travel Package',
    description: 'Complete end-to-end travel arrangement including flights, hotel, and transfers.',
    includes: [
      'All Flight Only features',
      'Hotel Booking (Partner Hotels)',
      'Airport Transfer (Private Car)',
      'Travel Insurance',
      'Priority Check-in Assistance',
      'Airport Lounge Access',
      'Dedicated Travel Consultant',
    ]
  }
];

export const RELOCATION_SERVICES = [
  { id: 'travel_insurance', name: 'Comprehensive Travel Insurance' },
  { id: 'airport_transfer', name: 'Airport Transfer Service' },
  { id: 'hotel_booking', name: 'Hotel Booking Assistance' },
  { id: 'visa_assistance', name: 'Destination Visa Assistance' },
  { id: 'forex', name: 'Foreign Exchange Guidance' },
  { id: 'sim_card', name: 'International SIM Card' },
  { id: 'lounge', name: 'Airport Lounge Access' },
  { id: 'fast_track', name: 'Fast Track Security Pass' },
  { id: 'chauffeur', name: 'Chauffeur / Limo Service' },
  { id: 'concierge', name: 'Destination Concierge Service' },
];

export const AGENTS = [
  {
    id: 'c1',
    name: 'Sofia Rodriguez',
    email: 'sofia.r@wowmyflight.com',
    password: 'password123',
    phone: '+971 50 123 4567',
    role: 'consultant',
    languages: ['Spanish', 'English'],
    nationalities: ['Spanish', 'Mexican'],
    casesCount: 18,
    conversionRate: 68,
    revenueGenerated: 138650,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    bio: 'Senior Flight Sales Executive with 5+ years expertise in Business & First Class bookings. Specializes in US-UK and India-UK routes.',
    department: 'Sales',
    specializedRoutes: ['US-UK', 'India-UK', 'Middle East-Europe'],
    gdsSkills: [],
    joiningDate: '2024-03-12',
  },
  {
    id: 'c2',
    name: 'Lucas Gomez',
    email: 'lucas.g@wowmyflight.com',
    password: 'password123',
    phone: '+971 50 987 6543',
    role: 'operations',
    languages: ['Spanish', 'English', 'Arabic'],
    nationalities: ['Spanish', 'Lebanese'],
    casesCount: 14,
    conversionRate: 55,
    revenueGenerated: 95000,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    bio: 'Operations Manager overseeing flight operations workflow, PNR tracking and agent coordination. Fluent in Arabic, Spanish, and English.',
    department: 'Operations',
    specializedRoutes: ['Middle East-Europe', 'Asia-Pacific'],
    gdsSkills: ['Sabre'],
    joiningDate: '2024-08-20',
  },
  {
    id: 'c3',
    name: 'Amir Hassan',
    email: 'amir.h@wowmyflight.com',
    password: 'password123',
    phone: '+971 50 955 4142',
    role: 'admin',
    languages: ['Arabic', 'English'],
    nationalities: ['Emirati', 'Egyptian'],
    casesCount: 8,
    conversionRate: 85,
    revenueGenerated: 185000,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'General Manager at WOW MY FLIGHT. Oversees flight booking teams, client relations, and operational management across all departments.',
    department: 'Management',
    specializedRoutes: [],
    gdsSkills: [],
    joiningDate: '2022-01-10',
  },
  {
    id: 'c4',
    name: 'Elena Rostova',
    email: 'elena.r@wowmyflight.com',
    password: 'password123',
    phone: '+971 50 555 7788',
    role: 'marketing',
    languages: ['Russian', 'English', 'Spanish'],
    nationalities: ['Russian'],
    casesCount: 12,
    conversionRate: 60,
    revenueGenerated: 45000,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    bio: 'Marketing Manager driving flight deal campaigns, social media, and lead generation across Google, Facebook, and WhatsApp channels.',
    department: 'Marketing',
    specializedRoutes: [],
    gdsSkills: [],
    joiningDate: '2023-05-15',
  },
  {
    id: 'c5',
    name: 'David Vance',
    email: 'david.v@wowmyflight.com',
    password: 'password123',
    phone: '+971 50 333 4455',
    role: 'finance',
    languages: ['English', 'Spanish'],
    nationalities: ['British', 'American'],
    casesCount: 15,
    conversionRate: 72,
    revenueGenerated: 29800,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    bio: 'Finance Manager handling payment processing, chargeback risk management, refunds, and financial reporting for all bookings.',
    department: 'Finance',
    specializedRoutes: [],
    gdsSkills: [],
    joiningDate: '2023-02-18',
  }
];

export const MOCK_LEADS = [
  {
    id: 'LD1001',
    firstName: 'Amelia',
    lastName: 'Watson',
    email: 'amelia.w@example.com',
    phone: '+44 7911 123456',
    nationality: 'British',
    preferredLanguage: 'English',
    serviceId: 'business',
    applicantsCount: 1, // Main Passenger
    status: 'New Lead',
    origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Business',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c1',
    source: 'Google Ads',
    createdDate: '2026-06-17T09:30:00Z',
    qualificationData: {
      travelPurpose: 'Business Trip',
      budget: '$4,000',
      flexibility: '±3 Days'
    },
    notes: 'Inquired about Business Class to JFK. Prefers direct flight.',
    timeline: [
      { date: '2026-06-17T09:30:00Z', event: 'Lead Created via Google Ads form', user: 'System' },
      { date: '2026-06-17T09:31:00Z', event: 'Automated WhatsApp response sent', user: 'System' }
    ]
  },
  {
    id: 'LD1002',
    firstName: 'Tariq',
    lastName: 'Mahmood',
    email: 'tariq.m@example.com',
    phone: '+971 52 444 8899',
    nationality: 'Pakistani',
    preferredLanguage: 'Arabic',
    serviceId: 'business',
    applicantsCount: 3, // 3 passengers
    status: 'Under Consultation',
    origin: 'DXB',
    destination: 'CDG',
    travelDate: '2026-09-10',
    passengers: 3,
    cabinClass: 'Business',
    tripType: 'Round Trip',
    leadTemperature: 'WARM',
    priority: 'Medium',
    assignedConsultantId: 'c1',
    source: 'Facebook Ads',
    createdDate: '2026-06-16T11:20:00Z',
    qualificationData: {
      travelPurpose: 'Family Vacation',
      budget: '$12,000',
      flexibility: 'Fixed Dates'
    },
    notes: 'Family of 3 requesting Business Class flights DXB-CDG with seat preferences.',
    timeline: [
      { date: '2026-06-16T11:20:00Z', event: 'Lead Created', user: 'System' },
      { date: '2026-06-16T14:30:00Z', event: 'Assigned to Agent Lucas Gomez', user: 'System' },
      { date: '2026-06-17T10:00:00Z', event: 'Flight Request submitted to GDS Desk', user: 'Lucas Gomez' }
    ]
  },
  {
    id: 'LD1003',
    firstName: 'Chloe',
    lastName: 'Dupont',
    email: 'chloe.dupont@example.com',
    phone: '+33 6 1234 5678',
    nationality: 'French',
    preferredLanguage: 'English',
    serviceId: 'economy',
    applicantsCount: 1,
    status: 'Processing',
    origin: 'CDG',
    destination: 'MAD',
    travelDate: '2026-07-20',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'Round Trip',
    leadTemperature: 'COLD',
    priority: 'Low',
    assignedConsultantId: 'c1',
    source: 'Website Traffic',
    createdDate: '2026-06-15T15:40:00Z',
    qualificationData: {
      travelPurpose: 'Student Travel',
      budget: '$600',
      flexibility: 'Flexible'
    },
    notes: 'Economy round trip CDG to MAD. Student discount requested.',
    timeline: [
      { date: '2026-06-15T15:40:00Z', event: 'Lead Created via website form', user: 'System' },
      { date: '2026-06-16T09:00:00Z', event: 'Quote sent for Air France option', user: 'Elena Rostova' }
    ]
  },
  {
    id: 'LD1004',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'm.vance@example.com',
    phone: '+1 415 555 2671',
    nationality: 'American',
    preferredLanguage: 'English',
    serviceId: 'property',
    applicantsCount: 2,
    status: 'Waiting for Payment',
    origin: 'SFO',
    destination: 'AGP',
    travelDate: '2026-08-05',
    passengers: 2,
    cabinClass: 'First',
    tripType: 'Round Trip',
    leadTemperature: 'VIP',
    priority: 'High',
    assignedConsultantId: 'c5',
    source: 'Instagram Ads',
    createdDate: '2026-06-14T08:15:00Z',
    qualificationData: {
      budget: '€550,000',
      propertyLocation: 'Malaga'
    },
    notes: 'Wants Golden Visa. Selected Premium Package for main applicant + spouse. Waiting for deposit.',
    timeline: [
      { date: '2026-06-14T08:15:00Z', event: 'Lead Created', user: 'System' },
      { date: '2026-06-15T11:00:00Z', event: 'Consultation Completed. Selected Premium Package', user: 'David Vance' },
      { date: '2026-06-15T11:15:00Z', event: 'Invoice INV-2026-004 generated', user: 'Finance Bot' }
    ]
  },
  {
    id: 'LD1005',
    firstName: 'Ahmed',
    lastName: 'Al-Mansoori',
    email: 'ahmed.mansoori@example.ae',
    phone: '+971 50 777 1122',
    nationality: 'Emirati',
    preferredLanguage: 'Arabic',
    serviceId: 'self_employed',
    applicantsCount: 4,
    status: 'New Lead',
    origin: 'DXB',
    destination: 'BCN',
    travelDate: '2026-10-15',
    passengers: 4,
    cabinClass: 'Economy',
    tripType: 'Round Trip',
    leadTemperature: 'PRICE SENSITIVE',
    priority: 'Medium',
    assignedConsultantId: 'c3',
    source: 'WhatsApp Click Ads',
    createdDate: '2026-06-18T10:00:00Z',
    qualificationData: {
      businessSector: 'E-commerce logistics setup',
      investmentCapital: '€120,000'
    },
    notes: 'Very hot lead. High budget, wants business setup in Barcelona.',
    timeline: [
      { date: '2026-06-18T10:00:00Z', event: 'Lead created from WhatsApp Ads click', user: 'System' }
    ]
  },
  // Adding more mock leads to reach 20
  { id: 'LD1006', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '+1 555 123 4567', nationality: 'American', preferredLanguage: 'English', serviceId: 'dnv', applicantsCount: 1, status: 'Cold Lead', origin: 'JNB',
    destination: 'MAD',
    travelDate: '2026-11-01',
    passengers: 2,
    cabinClass: 'Business',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c5', source: 'Google Ads', createdDate: '2026-06-01T12:00:00Z', notes: 'No response to follow up emails.', timeline: [] },
  { id: 'LD1007', firstName: 'Maria', lastName: 'Ivanova', email: 'maria.i@example.ru', phone: '+7 901 222 3344', nationality: 'Russian', preferredLanguage: 'English', serviceId: 'nlv', applicantsCount: 2, status: 'Lost Lead', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c4', source: 'Facebook Ads', createdDate: '2026-05-20T10:30:00Z', notes: 'Denied. Insufficient passive income statement.', timeline: [] },
  { id: 'LD1008', firstName: 'Yuki', lastName: 'Tanaka', email: 'y.tanaka@example.jp', phone: '+81 90 9999 8888', nationality: 'Japanese', preferredLanguage: 'English', serviceId: 'study', applicantsCount: 1, status: 'New Lead', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c4', source: 'Website Traffic', createdDate: '2026-06-18T06:45:00Z', notes: 'Interested in Spanish language school visa.', timeline: [] },
  { id: 'LD1009', firstName: 'Fatima', lastName: 'Hassan', email: 'fatima.h@example.com', phone: '+971 52 333 4422', nationality: 'Egyptian', preferredLanguage: 'Arabic', serviceId: 'family', applicantsCount: 3, status: 'Under Consultation', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c2', source: 'WhatsApp Click Ads', createdDate: '2026-06-16T16:20:00Z', notes: 'Spouse of a Spanish resident. Wants family reunion assistance.', timeline: [] },
  { id: 'LD1010', firstName: 'William', lastName: 'Smith', email: 'w.smith@example.ca', phone: '+1 604 111 2222', nationality: 'Canadian', preferredLanguage: 'English', serviceId: 'dnv', applicantsCount: 1, status: 'Documents Pending', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c5', source: 'Organic Social Media Content', createdDate: '2026-06-10T14:00:00Z', notes: 'Needs FBI background check with Apostille.', timeline: [] },
  { id: 'LD1011', firstName: 'Rajesh', lastName: 'Kumar', email: 'r.kumar@example.in', phone: '+91 98765 43210', nationality: 'Indian', preferredLanguage: 'English', serviceId: 'self_employed', applicantsCount: 2, status: 'New Lead', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c2', source: 'Google Ads', createdDate: '2026-06-18T08:15:00Z', notes: 'Consultant entrepreneur establishing SaaS office in Valencia.', timeline: [] },
  { id: 'LD1012', firstName: 'Carlos', lastName: 'Silva', email: 'carlos.silva@example.br', phone: '+55 11 98888 7777', nationality: 'Brazilian', preferredLanguage: 'English', serviceId: 'property', applicantsCount: 1, status: 'Under Consultation', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c1', source: 'Instagram DM', createdDate: '2026-06-17T11:45:00Z', notes: 'Buying flat in Madrid for Golden Visa.', timeline: [] },
  { id: 'LD1013', firstName: 'Zara', lastName: 'Ali', email: 'zara.ali@example.ae', phone: '+971 56 123 7890', nationality: 'Jordanian', preferredLanguage: 'Arabic', serviceId: 'tourism', applicantsCount: 2, status: 'Waiting for Payment', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c2', source: 'Website Forms', createdDate: '2026-06-15T09:12:00Z', notes: 'Schengen tourism visa guidance. Straightforward profile, no packages needed.', timeline: [] },
  { id: 'LD1014', firstName: 'Oliver', lastName: 'Brown', email: 'oliver.brown@example.co.uk', phone: '+44 7711 445566', nationality: 'British', preferredLanguage: 'English', serviceId: 'dnv', applicantsCount: 3, status: 'New Lead', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c5', source: 'Google Ads', createdDate: '2026-06-18T11:00:00Z', notes: 'Applying for DNV with spouse and child.', timeline: [] },
  { id: 'LD1015', firstName: 'Sophia', lastName: 'Miller', email: 's.miller@example.com', phone: '+1 202 555 0192', nationality: 'American', preferredLanguage: 'English', serviceId: 'nlv', applicantsCount: 1, status: 'Under Process', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c1', source: 'TikTok Ads', createdDate: '2026-06-05T10:00:00Z', notes: 'NLV filed at consulate. Waiting for response.', timeline: [] },
  { id: 'LD1016', firstName: 'Hassan', lastName: 'El-Khoury', email: 'hassan.k@example.lb', phone: '+961 3 123 456', nationality: 'Lebanese', preferredLanguage: 'Arabic', serviceId: 'property', applicantsCount: 4, status: 'New Lead', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c3', source: 'Telegram', createdDate: '2026-06-18T05:30:00Z', notes: 'Family looking to relocate, buying a villa in Marbella.', timeline: [] },
  { id: 'LD1017', firstName: 'Li', lastName: 'Wei', email: 'li.wei@example.cn', phone: '+86 139 0101 2345', nationality: 'Chinese', preferredLanguage: 'English', serviceId: 'study', applicantsCount: 1, status: 'Documents Pending', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c4', source: 'WeChat', createdDate: '2026-06-12T13:45:00Z', notes: 'Awaiting Spanish language center payment receipt.', timeline: [] },
  { id: 'LD1018', firstName: 'Emma', lastName: 'Nielsen', email: 'emma.n@example.dk', phone: '+45 30 40 50 60', nationality: 'Danish', preferredLanguage: 'English', serviceId: 'dnv', applicantsCount: 1, status: 'Under Consultation', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c1', source: 'Website Traffic', createdDate: '2026-06-17T15:20:00Z', notes: 'Software contractor, fully remote. Pre-qualified.', timeline: [] },
  { id: 'LD1019', firstName: 'Zuri', lastName: 'Adebayor', email: 'zuri.ade@example.ng', phone: '+234 803 111 2222', nationality: 'Nigerian', preferredLanguage: 'English', serviceId: 'study', applicantsCount: 1, status: 'Cold Lead', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c4', source: 'Facebook Comments', createdDate: '2026-05-25T08:00:00Z', notes: 'Non-responsive to email scheduling.', timeline: [] },
  { id: 'LD1020', firstName: 'Nour', lastName: 'Dagher', email: 'nour.dagher@example.com', phone: '+971 54 443 2190', nationality: 'Syrian', preferredLanguage: 'Arabic', serviceId: 'family', applicantsCount: 2, status: 'Under Process', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c2', source: 'WhatsApp', createdDate: '2026-06-08T09:30:00Z', notes: 'Spouse residency renewal and child entry visa.', timeline: [] },
  { id: 'LD1021', firstName: 'Liam', lastName: "O'Connor", email: 'liam.oc@example.ie', phone: '+353 1 496 0123', nationality: 'Irish', preferredLanguage: 'English', serviceId: 'study', applicantsCount: 1, status: 'New Lead', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c4', source: 'WeChat', createdDate: '2026-06-19T10:00:00Z', notes: 'Undergraduate student applying for Spain Study Visa.', timeline: [] },
  { id: 'LD1022', firstName: 'Noah', lastName: 'Weber', email: 'noah.w@example.de', phone: '+49 89 2019 8273', nationality: 'German', preferredLanguage: 'English', serviceId: 'dnv', applicantsCount: 2, status: 'Under Consultation', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c5', source: 'Google Ads', createdDate: '2026-06-19T11:00:00Z', notes: 'Remote consultant, DNV eligibility review.', timeline: [] },
  { id: 'LD1023', firstName: 'Isabella', lastName: 'Rossi', email: 'isabella.rossi@example.it', phone: '+39 02 8812 3456', nationality: 'Italian', preferredLanguage: 'English', serviceId: 'family', applicantsCount: 3, status: 'Processing', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c1', source: 'Facebook Ads', createdDate: '2026-06-19T12:00:00Z', notes: 'Husband is Spanish citizen. Family reunion visa.', timeline: [] },
  { id: 'LD1024', firstName: 'Lucas', lastName: 'Dubois', email: 'lucas.d@example.fr', phone: '+33 1 4720 9811', nationality: 'French', preferredLanguage: 'English', serviceId: 'self_employed', applicantsCount: 1, status: 'New Lead', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c3', source: 'Website Forms', createdDate: '2026-06-19T13:00:00Z', notes: 'Autonomo registration in Barcelona.', timeline: [] },
  { id: 'LD1025', firstName: 'Emma', lastName: 'Novak', email: 'emma.n@example.pl', phone: '+48 22 555 0122', nationality: 'Polish', preferredLanguage: 'English', serviceId: 'nlv', applicantsCount: 1, status: 'Cold Lead', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c1', source: 'Instagram Ads', createdDate: '2026-06-19T14:00:00Z', notes: 'Passive income review.', timeline: [] },
  { id: 'LD1026', firstName: 'Sophia', lastName: 'Lindqvist', email: 'sophia.l@example.se', phone: '+46 8 123 4567', nationality: 'Swedish', preferredLanguage: 'English', serviceId: 'dnv', applicantsCount: 2, status: 'New Lead', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c5', source: 'WhatsApp', createdDate: '2026-06-19T15:00:00Z', notes: 'Tech company employee DNV.', timeline: [] },
  { id: 'LD1027', firstName: 'Alexander', lastName: 'Pavlov', email: 'alex.p@example.ru', phone: '+7 495 111 2233', nationality: 'Russian', preferredLanguage: 'English', serviceId: 'property', applicantsCount: 4, status: 'Under Consultation', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c4', source: 'Telegram', createdDate: '2026-06-19T16:00:00Z', notes: 'Golden Visa investment in Alicante.', timeline: [] },
  { id: 'LD1028', firstName: 'Daniel', lastName: 'Kim', email: 'daniel.k@example.kr', phone: '+82 2 999 8888', nationality: 'Korean', preferredLanguage: 'English', serviceId: 'study', applicantsCount: 1, status: 'Waiting for Payment', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c4', source: 'WeChat', createdDate: '2026-06-19T17:00:00Z', notes: 'Awaiting language school deposit confirmation.', timeline: [] },
  { id: 'LD1029', firstName: 'Gabriel', lastName: 'Martinez', email: 'gabriel.m@example.mx', phone: '+52 55 1234 5678', nationality: 'Mexican', preferredLanguage: 'Spanish', serviceId: 'self_employed', applicantsCount: 2, status: 'New Lead', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c1', source: 'Website Traffic', createdDate: '2026-06-19T18:00:00Z', notes: 'Wants to start a consultancy in Madrid.', timeline: [] },
  { id: 'LD1030', firstName: 'Mei', lastName: 'Chen', email: 'mei.chen@example.cn', phone: '+86 21 6666 8888', nationality: 'Chinese', preferredLanguage: 'English', serviceId: 'nlv', applicantsCount: 1, status: 'Under Process', origin: 'LHR',
    destination: 'JFK',
    travelDate: '2026-08-25',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way',
    leadTemperature: 'HOT',
    priority: 'High',
    assignedConsultantId: 'c1', source: 'WhatsApp Click Ads', createdDate: '2026-06-19T19:00:00Z', notes: 'NLV visa file submitted.', timeline: [] }
];

export const MOCK_CLIENTS = [
  {
    id: 'CL2001',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'm.vance@example.com',
    phone: '+1 415 555 2671',
    nationality: 'American',
    preferredLanguage: 'English',
    serviceId: 'property',
    packageId: 'premium',
    applicantsCount: 2,
    assignedConsultantId: 'c5',
    status: 'Waiting for Payment',
    visaStatus: 'Not Started',
    onboardingDate: '2026-06-15T11:00:00Z',
    profileSummary: 'Wants Spain Golden Visa for purchase of €550,000 property in Malaga. Enrolled in Premium Relocation package.'
  },
  {
    id: 'CL2002',
    firstName: 'Chloe',
    lastName: 'Dupont',
    email: 'chloe.dupont@example.com',
    phone: '+33 6 1234 5678',
    nationality: 'French',
    preferredLanguage: 'English',
    serviceId: 'study',
    packageId: 'full_process',
    applicantsCount: 1,
    assignedConsultantId: 'c4',
    status: 'Documents Pending',
    visaStatus: 'Document Preparation',
    onboardingDate: '2026-06-16T09:00:00Z',
    profileSummary: 'Study Visa applicant for Complutense University. Needs medical insurance certificate and bank statements translated.'
  },
  {
    id: 'CL2003',
    firstName: 'Sophia',
    lastName: 'Miller',
    email: 's.miller@example.com',
    phone: '+1 202 555 0192',
    nationality: 'American',
    preferredLanguage: 'English',
    serviceId: 'nlv',
    packageId: 'full_process',
    applicantsCount: 1,
    assignedConsultantId: 'c1',
    status: 'Under Process',
    visaStatus: 'Submitted - Pending Decision',
    onboardingDate: '2026-06-05T10:00:00Z',
    profileSummary: 'NLV filed at the Washington DC Consulate. All financial qualifications approved.'
  },
  {
    id: 'CL2004',
    firstName: 'Nour',
    lastName: 'Dagher',
    email: 'nour.dagher@example.com',
    phone: '+971 54 443 2190',
    nationality: 'Syrian',
    preferredLanguage: 'Arabic',
    serviceId: 'family',
    packageId: 'premium',
    applicantsCount: 2,
    assignedConsultantId: 'c2',
    status: 'Under Process',
    visaStatus: 'NIE / Local Registration',
    onboardingDate: '2026-06-08T09:30:00Z',
    profileSummary: 'Completed visa process, now in Spain undergoing NIE registration and finger print appointments in Madrid.'
  },
  {
    id: 'CL2005',
    firstName: 'David',
    lastName: 'Hume',
    email: 'd.hume@example.co.uk',
    phone: '+44 7888 123456',
    nationality: 'British',
    preferredLanguage: 'English',
    serviceId: 'dnv',
    packageId: 'premium',
    applicantsCount: 1,
    assignedConsultantId: 'c5',
    status: 'Completed',
    visaStatus: 'Visa Approved',
    onboardingDate: '2026-05-10T14:30:00Z',
    profileSummary: 'DNV approved. NIE card collected. Relocation successfully completed to Barcelona.'
  },
  {
    id: 'CL2006',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 's.jenkins@example.com',
    phone: '+1 312 555 9811',
    nationality: 'American',
    preferredLanguage: 'English',
    serviceId: 'dnv',
    packageId: 'full_process',
    applicantsCount: 1,
    assignedConsultantId: 'c5',
    status: 'Under Process',
    visaStatus: 'Document Review',
    onboardingDate: '2026-06-01T09:00:00Z',
    profileSummary: 'Digital Nomad applicant. Translating employment verification letters and checking social security coverage agreement.'
  },
  {
    id: 'CL2007',
    firstName: 'Tareq',
    lastName: 'Nasser',
    email: 'tareq.n@example.ae',
    phone: '+971 55 909 0101',
    nationality: 'Emirati',
    preferredLanguage: 'Arabic',
    serviceId: 'property',
    packageId: 'full_process',
    applicantsCount: 3,
    assignedConsultantId: 'c3',
    status: 'Under Process',
    visaStatus: 'Submitted - Pending Decision',
    onboardingDate: '2026-05-25T11:00:00Z',
    profileSummary: 'Residency application filed. Property purchased in Valencia. Waiting for Spanish Ministry response.'
  },
  {
    id: 'CL2008',
    firstName: 'Olga',
    lastName: 'Kuznetsova',
    email: 'olga.k@example.ru',
    phone: '+7 916 444 5566',
    nationality: 'Russian',
    preferredLanguage: 'English',
    serviceId: 'nlv',
    packageId: 'full_process',
    applicantsCount: 2,
    assignedConsultantId: 'c4',
    status: 'Documents Pending',
    visaStatus: 'Apostille & Translations',
    onboardingDate: '2026-06-11T13:00:00Z',
    profileSummary: 'Awaiting clean criminal record certificate apostilled in Moscow and medical report translation.'
  },
  {
    id: 'CL2009',
    firstName: 'Rohan',
    lastName: 'Mehta',
    email: 'rohan.m@example.com',
    phone: '+971 52 111 8888',
    nationality: 'Indian',
    preferredLanguage: 'English',
    serviceId: 'self_employed',
    packageId: 'premium',
    applicantsCount: 1,
    assignedConsultantId: 'c1',
    status: 'Waiting for Payment',
    visaStatus: 'Not Started',
    onboardingDate: '2026-06-17T16:00:00Z',
    profileSummary: 'SaaS founder relocation. Awaiting package deposit payment to start business plan drafting.'
  },
  {
    id: 'CL2010',
    firstName: 'Isabella',
    lastName: 'Gallo',
    email: 'isabella.g@example.com',
    phone: '+39 333 123 4567',
    nationality: 'Italian',
    preferredLanguage: 'English',
    serviceId: 'family',
    packageId: 'premium',
    applicantsCount: 2,
    assignedConsultantId: 'c2',
    status: 'Completed',
    visaStatus: 'Visa Rejected',
    onboardingDate: '2026-04-12T10:00:00Z',
    profileSummary: 'Spouse reunification application was rejected due to insufficient financial documentation.'
  },
  {
    id: 'CL2011',
    firstName: 'Liam',
    lastName: "O'Connor",
    email: 'liam.oc@example.ie',
    phone: '+353 1 496 0123',
    nationality: 'Irish',
    preferredLanguage: 'English',
    serviceId: 'study',
    packageId: 'full_process',
    applicantsCount: 1,
    assignedConsultantId: 'c4',
    status: 'Documents Pending',
    visaStatus: 'Document Preparation',
    onboardingDate: '2026-06-19T10:00:00Z',
    profileSummary: 'Study Visa case for Universidad Complutense de Madrid.'
  },
  {
    id: 'CL2012',
    firstName: 'Noah',
    lastName: 'Weber',
    email: 'noah.w@example.de',
    phone: '+49 89 2019 8273',
    nationality: 'German',
    preferredLanguage: 'English',
    serviceId: 'dnv',
    packageId: 'premium',
    applicantsCount: 2,
    assignedConsultantId: 'c5',
    status: 'Under Process',
    visaStatus: 'Document Review',
    onboardingDate: '2026-06-19T11:00:00Z',
    profileSummary: 'Remote developer DNV case. Awaiting German social security form.'
  },
  {
    id: 'CL2013',
    firstName: 'Isabella',
    lastName: 'Rossi',
    email: 'isabella.rossi@example.it',
    phone: '+39 02 8812 3456',
    nationality: 'Italian',
    preferredLanguage: 'English',
    serviceId: 'family',
    packageId: 'premium',
    applicantsCount: 3,
    assignedConsultantId: 'c1',
    status: 'Completed',
    visaStatus: 'Client Withdraw',
    onboardingDate: '2026-06-19T12:00:00Z',
    profileSummary: 'Family reunion process started but client chose to withdraw application.'
  },
  {
    id: 'CL2014',
    firstName: 'Lucas',
    lastName: 'Dubois',
    email: 'lucas.d@example.fr',
    phone: '+33 1 4720 9811',
    nationality: 'French',
    preferredLanguage: 'English',
    serviceId: 'self_employed',
    packageId: 'full_process',
    applicantsCount: 1,
    assignedConsultantId: 'c3',
    status: 'Under Process',
    visaStatus: 'Submitted - Pending Decision',
    onboardingDate: '2026-06-19T13:00:00Z',
    profileSummary: 'Autonomo registration submitted to immigration authorities.'
  },
  {
    id: 'CL2015',
    firstName: 'Sophia',
    lastName: 'Lindqvist',
    email: 'sophia.l@example.se',
    phone: '+46 8 123 4567',
    nationality: 'Swedish',
    preferredLanguage: 'English',
    serviceId: 'dnv',
    packageId: 'premium',
    applicantsCount: 2,
    assignedConsultantId: 'c5',
    status: 'Waiting for Payment',
    visaStatus: 'Not Started',
    onboardingDate: '2026-06-19T15:00:00Z',
    profileSummary: 'DNV package setup. Awaiting invoice payment.'
  },
  {
    id: 'CL2016',
    firstName: 'Alexander',
    lastName: 'Pavlov',
    email: 'alex.p@example.ru',
    phone: '+7 495 111 2233',
    nationality: 'Russian',
    preferredLanguage: 'English',
    serviceId: 'property',
    packageId: 'premium',
    applicantsCount: 4,
    assignedConsultantId: 'c4',
    status: 'Under Process',
    visaStatus: 'NIE / Local Registration',
    onboardingDate: '2026-06-19T16:00:00Z',
    profileSummary: 'Golden Visa. Purchase complete. Undertaking local registration in Alicante.'
  },
  {
    id: 'CL2017',
    firstName: 'Daniel',
    lastName: 'Kim',
    email: 'daniel.k@example.kr',
    phone: '+82 2 999 8888',
    nationality: 'Korean',
    preferredLanguage: 'English',
    serviceId: 'study',
    packageId: 'full_process',
    applicantsCount: 1,
    assignedConsultantId: 'c4',
    status: 'Documents Pending',
    visaStatus: 'Document Preparation',
    onboardingDate: '2026-06-19T17:00:00Z',
    profileSummary: 'Korean study visa applicant. Awaiting visa medical certificate translation.'
  },
  {
    id: 'CL2018',
    firstName: 'Gabriel',
    lastName: 'Martinez',
    email: 'gabriel.m@example.mx',
    phone: '+52 55 1234 5678',
    nationality: 'Mexican',
    preferredLanguage: 'Spanish',
    serviceId: 'self_employed',
    packageId: 'full_process',
    applicantsCount: 2,
    assignedConsultantId: 'c1',
    status: 'Completed',
    visaStatus: 'Refund Completed',
    onboardingDate: '2026-06-19T18:00:00Z',
    profileSummary: 'Autonomo setup package cancelled by client and 50% refund processed.'
  },
  {
    id: 'CL2019',
    firstName: 'Mei',
    lastName: 'Chen',
    email: 'mei.chen@example.cn',
    phone: '+86 21 6666 8888',
    nationality: 'Chinese',
    preferredLanguage: 'English',
    serviceId: 'nlv',
    packageId: 'full_process',
    applicantsCount: 1,
    assignedConsultantId: 'c1',
    status: 'Completed',
    visaStatus: 'Case Canceled',
    onboardingDate: '2026-06-19T19:00:00Z',
    profileSummary: 'NLV application cancelled due to change in client circumstances.'
  },
  {
    id: 'CL2020',
    firstName: 'Emma',
    lastName: 'Novak',
    email: 'emma.n@example.pl',
    phone: '+48 22 555 0122',
    nationality: 'Polish',
    preferredLanguage: 'English',
    serviceId: 'nlv',
    packageId: 'full_process',
    applicantsCount: 1,
    assignedConsultantId: 'c1',
    status: 'Under Process',
    visaStatus: 'Document Preparation',
    onboardingDate: '2026-06-19T14:00:00Z',
    profileSummary: 'Awaiting medical insurance and bank certificate translations.'
  }
];

export const MOCK_CONSULTATIONS = [
  {
    id: 'CS3001',
    leadId: 'LD1002',
    clientName: 'Tariq Mahmood',
    meetingDate: '2026-06-18',
    meetingTime: '15:00',
    durationMinutes: 45,
    assignedConsultantId: 'c2',
    status: 'Scheduled',
    meetingLink: 'https://zoom.us/j/987654321',
    notes: 'To discuss passive income certificates from UAE assets.',
    recordingUrl: '',
    outcome: null
  },
  {
    id: 'CS3002',
    leadId: 'LD1003',
    clientName: 'Chloe Dupont',
    meetingDate: '2026-06-16',
    meetingTime: '10:00',
    durationMinutes: 30,
    assignedConsultantId: 'c4',
    status: 'Completed',
    meetingLink: 'https://zoom.us/j/123456789',
    notes: 'Qualifies easily for Study Visa. Needs full processing support. Standard tuition verification is ready.',
    recordingUrl: 'https://storage.googleapis.com/aaa-consultancy-recordings/CS3002_recording.mp3',
    outcome: {
      clientRequestedService: 'Study Visa',
      aaaRecommendedService: 'Study Visa',
      notes: 'Recommended standard Full Process Package. Checked translation services requirements.'
    }
  },
  {
    id: 'CS3003',
    leadId: 'LD1004',
    clientName: 'Marcus Vance',
    meetingDate: '2026-06-15',
    meetingTime: '11:00',
    durationMinutes: 60,
    assignedConsultantId: 'c5',
    status: 'Completed',
    meetingLink: 'https://zoom.us/j/444555666',
    notes: 'Wants to buy €550,000 villa in Malaga. Needs residency + complete NIE, Spanish bank accounts, utilities, and tax registration assistance.',
    recordingUrl: 'https://storage.googleapis.com/aaa-consultancy-recordings/CS3003_recording.mp3',
    outcome: {
      clientRequestedService: 'Property Investment Guidance',
      aaaRecommendedService: 'Property Investment Guidance',
      notes: 'Strongly recommended the Premium Package to handle both the Golden Visa process and relocation tasks.'
    }
  },
  {
    id: 'CS3004',
    leadId: 'LD1006',
    clientName: 'John Doe',
    meetingDate: '2026-06-03',
    meetingTime: '14:00',
    durationMinutes: 30,
    assignedConsultantId: 'c5',
    status: 'Cancelled',
    meetingLink: 'https://zoom.us/j/111222333',
    notes: 'Client cancelled 1 hour before due to personal issues.',
    recordingUrl: '',
    outcome: null
  },
  {
    id: 'CS3005',
    leadId: 'LD1007',
    clientName: 'Maria Ivanova',
    meetingDate: '2026-05-19',
    meetingTime: '11:30',
    durationMinutes: 45,
    assignedConsultantId: 'c4',
    status: 'Completed',
    meetingLink: 'https://zoom.us/j/333444555',
    notes: 'Passive income details were unclear. Questionable source of dividends.',
    recordingUrl: 'https://storage.googleapis.com/aaa-consultancy-recordings/CS3005_recording.mp3',
    outcome: {
      clientRequestedService: 'Non-Lucrative Visa (NLV)',
      aaaRecommendedService: 'Non-Lucrative Visa (NLV)',
      notes: 'Warned client about high chance of consulate rejection unless dividend history is cleared. Client insisted on proceeding.'
    }
  },
  {
    id: 'CS3006',
    leadId: 'LD1012',
    clientName: 'Carlos Silva',
    meetingDate: '2026-06-18',
    meetingTime: '16:30',
    durationMinutes: 45,
    assignedConsultantId: 'c1',
    status: 'Scheduled',
    meetingLink: 'https://zoom.us/j/888999000',
    notes: 'Reviewing real estate investment options in Madrid and Golden Visa eligibility.',
    recordingUrl: '',
    outcome: null
  },
  {
    id: 'CS3007',
    leadId: 'LD1018',
    clientName: 'Emma Nielsen',
    meetingDate: '2026-06-18',
    meetingTime: '11:00',
    durationMinutes: 30,
    assignedConsultantId: 'c1',
    status: 'No Show',
    meetingLink: 'https://zoom.us/j/222333444',
    notes: 'Client did not log in. Tried calling, no answer. Triggered automatics rebook email notifications.',
    recordingUrl: '',
    outcome: null
  }
];

export const MOCK_PAYMENTS = [
  {
    id: 'INV-2026-001',
    clientId: 'CL2005',
    clientName: 'David Hume',
    serviceId: 'dnv',
    packageId: 'premium',
    amount: 2500, // base 2000 + relocation add-on
    discount: 500, // main applicant discount
    totalPaid: 2000,
    status: 'Paid',
    billingDate: '2026-05-11',
    dueDate: '2026-05-25',
    paymentMethod: 'Visa',
    transactionId: 'TXN-90218731'
  },
  {
    id: 'INV-2026-002',
    clientId: 'CL2003',
    clientName: 'Sophia Miller',
    serviceId: 'nlv',
    packageId: 'full_process',
    amount: 1800,
    discount: 0,
    totalPaid: 1800,
    status: 'Paid',
    billingDate: '2026-06-06',
    dueDate: '2026-06-20',
    paymentMethod: 'Mastercard',
    transactionId: 'TXN-48719812'
  },
  {
    id: 'INV-2026-003',
    clientId: 'CL2004',
    clientName: 'Nour Dagher',
    serviceId: 'family',
    packageId: 'premium',
    amount: 2200, // 1500 + 700 relocation
    discount: 750, // Premium package discount: 500 main + 250 dependent
    totalPaid: 1450,
    status: 'Paid',
    billingDate: '2026-06-09',
    dueDate: '2026-06-23',
    paymentMethod: 'Apple Pay',
    transactionId: 'TXN-77319022'
  },
  {
    id: 'INV-2026-004',
    clientId: 'CL2001',
    clientName: 'Marcus Vance',
    serviceId: 'property',
    packageId: 'premium',
    amount: 3700, // 3000 + 700 add-on
    discount: 750, // 500 main + 250 dependent
    totalPaid: 0,
    status: 'Pending',
    billingDate: '2026-06-15',
    dueDate: '2026-06-29',
    paymentMethod: '-',
    transactionId: '-'
  },
  {
    id: 'INV-2026-005',
    clientId: 'CL2002',
    clientName: 'Chloe Dupont',
    serviceId: 'study',
    packageId: 'full_process',
    amount: 1200,
    discount: 0,
    totalPaid: 0,
    status: 'Pending',
    billingDate: '2026-06-16',
    dueDate: '2026-06-30',
    paymentMethod: '-',
    transactionId: '-'
  },
  {
    id: 'INV-2026-006',
    clientId: 'CL2007',
    clientName: 'Tareq Nasser',
    serviceId: 'property',
    packageId: 'full_process',
    amount: 3000,
    discount: 0,
    totalPaid: 3000,
    status: 'Paid',
    billingDate: '2026-05-26',
    dueDate: '2026-06-09',
    paymentMethod: 'Tamara',
    transactionId: 'TXN-11228833'
  },
  {
    id: 'INV-2026-007',
    clientId: 'CL2008',
    clientName: 'Olga Kuznetsova',
    serviceId: 'nlv',
    packageId: 'full_process',
    amount: 1800,
    discount: 0,
    totalPaid: 1800,
    status: 'Paid',
    billingDate: '2026-06-11',
    dueDate: '2026-06-25',
    paymentMethod: 'Tabby',
    transactionId: 'TXN-49381022'
  },
  {
    id: 'INV-2026-008',
    clientId: 'CL2009',
    clientName: 'Rohan Mehta',
    serviceId: 'self_employed',
    packageId: 'premium',
    amount: 3200, // 2500 + 700 add-on
    discount: 500, // 500 main
    totalPaid: 0,
    status: 'Pending',
    billingDate: '2026-06-17',
    dueDate: '2026-07-01',
    paymentMethod: '-',
    transactionId: '-'
  },
  {
    id: 'INV-2026-009',
    clientId: 'CL2010',
    clientName: 'Isabella Gallo',
    serviceId: 'family',
    packageId: 'premium',
    amount: 2200,
    discount: 750, // 500 main + 250 dep
    totalPaid: 1450,
    status: 'Paid',
    billingDate: '2026-04-13',
    dueDate: '2026-04-27',
    paymentMethod: 'Google Pay',
    transactionId: 'TXN-90998822'
  },
  {
    id: 'INV-2026-010',
    clientId: 'CL2006',
    clientName: 'Sarah Jenkins',
    serviceId: 'dnv',
    packageId: 'full_process',
    amount: 2000,
    discount: 0,
    totalPaid: 0,
    status: 'Failed',
    billingDate: '2026-06-01',
    dueDate: '2026-06-15',
    paymentMethod: 'Visa',
    transactionId: 'TXN-FAILED-4819'
  }
];

export const MOCK_DOCUMENTS = [
  {
    id: 'DOC4001',
    clientId: 'CL2005',
    clientName: 'David Hume',
    category: 'Passport',
    fileName: 'david_hume_passport.pdf',
    fileSize: '2.4 MB',
    uploadedDate: '2026-05-12T10:00:00Z',
    status: 'Approved',
    comment: 'Valid until 2035. Crisp scanned copy.',
    fileUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800' // mockup preview
  },
  {
    id: 'DOC4002',
    clientId: 'CL2005',
    clientName: 'David Hume',
    category: 'Bank Statement',
    fileName: 'bank_statement_3months_hume.pdf',
    fileSize: '4.8 MB',
    uploadedDate: '2026-05-12T10:15:00Z',
    status: 'Approved',
    comment: 'Shows €35,000 balance matching criteria.',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800'
  },
  {
    id: 'DOC4003',
    clientId: 'CL2003',
    clientName: 'Sophia Miller',
    category: 'Employment Letter',
    fileName: 'us_company_remote_allowance.pdf',
    fileSize: '1.2 MB',
    uploadedDate: '2026-06-06T11:00:00Z',
    status: 'Approved',
    comment: 'Confirming remote work allowance in Spain and monthly salary €4,100.',
    fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800'
  },
  {
    id: 'DOC4004',
    clientId: 'CL2003',
    clientName: 'Sophia Miller',
    category: 'Passport',
    fileName: 'sophia_passport_scan.pdf',
    fileSize: '3.1 MB',
    uploadedDate: '2026-06-06T11:05:00Z',
    status: 'Approved',
    comment: 'Validated. Clean bio-page copy.',
    fileUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800'
  },
  {
    id: 'DOC4005',
    clientId: 'CL2002',
    clientName: 'Chloe Dupont',
    category: 'Education Documents',
    fileName: 'complutense_admission_letter.pdf',
    fileSize: '1.9 MB',
    uploadedDate: '2026-06-16T10:00:00Z',
    status: 'Approved',
    comment: 'Official university letter for Masters Program 2026/2027.',
    fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800'
  },
  {
    id: 'DOC4006',
    clientId: 'CL2002',
    clientName: 'Chloe Dupont',
    category: 'Passport',
    fileName: 'dupont_passport.pdf',
    fileSize: '2.2 MB',
    uploadedDate: '2026-06-16T10:05:00Z',
    status: 'Approved',
    comment: 'Valid EU Passport.',
    fileUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800'
  },
  {
    id: 'DOC4007',
    clientId: 'CL2002',
    clientName: 'Chloe Dupont',
    category: 'Bank Statement',
    fileName: 'french_bank_savings.pdf',
    fileSize: '1.5 MB',
    uploadedDate: '2026-06-17T09:00:00Z',
    status: 'Pending Review',
    comment: 'Needs verification if savings amount is sufficient for study duration.',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800'
  },
  {
    id: 'DOC4008',
    clientId: 'CL2004',
    clientName: 'Nour Dagher',
    category: 'Marriage Certificate',
    fileName: 'syrian_marriage_sworn_translation.pdf',
    fileSize: '3.4 MB',
    uploadedDate: '2026-06-09T14:00:00Z',
    status: 'Approved',
    comment: 'Sworn Spanish translation attached. Certified by Ministry.',
    fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800'
  },
  {
    id: 'DOC4009',
    clientId: 'CL2004',
    clientName: 'Nour Dagher',
    category: 'Passport',
    fileName: 'nour_passport.pdf',
    fileSize: '2.5 MB',
    uploadedDate: '2026-06-09T14:05:00Z',
    status: 'Approved',
    comment: 'Valid for 4 years.',
    fileUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800'
  },
  {
    id: 'DOC4010',
    clientId: 'CL2004',
    clientName: 'Nour Dagher',
    category: 'Others',
    fileName: 'madrid_empadronamiento_sheet.pdf',
    fileSize: '1.0 MB',
    uploadedDate: '2026-06-12T15:30:00Z',
    status: 'Pending Review',
    comment: 'Local registration sheet. Verify if address details match TIE application draft.',
    fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800'
  },
  // Additional documents to ensure at least 20
  { id: 'DOC4011', clientId: 'CL2001', clientName: 'Marcus Vance', category: 'Passport', fileName: 'marcus_passport.pdf', fileSize: '2.0 MB', uploadedDate: '2026-06-15T12:00:00Z', status: 'Approved', comment: 'Approved by David.', fileUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800' },
  { id: 'DOC4012', clientId: 'CL2001', clientName: 'Marcus Vance', category: 'Bank Statement', fileName: 'property_escrow_deposit.pdf', fileSize: '5.1 MB', uploadedDate: '2026-06-15T12:10:00Z', status: 'Pending Review', comment: 'Verifying escrow letter.', fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800' },
  { id: 'DOC4013', clientId: 'CL2007', clientName: 'Tareq Nasser', category: 'Passport', fileName: 'tareq_passport.pdf', fileSize: '2.3 MB', uploadedDate: '2026-05-25T11:30:00Z', status: 'Approved', comment: '', fileUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800' },
  { id: 'DOC4014', clientId: 'CL2007', clientName: 'Tareq Nasser', category: 'Marriage Certificate', fileName: 'emirati_marriage_cert.pdf', fileSize: '3.0 MB', uploadedDate: '2026-05-25T11:45:00Z', status: 'Approved', comment: '', fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800' },
  { id: 'DOC4015', clientId: 'CL2007', clientName: 'Tareq Nasser', category: 'Others', fileName: 'valencia_deed_draft.pdf', fileSize: '4.5 MB', uploadedDate: '2026-05-26T09:00:00Z', status: 'Approved', comment: 'Property registration deed verified.', fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800' },
  { id: 'DOC4016', clientId: 'CL2008', clientName: 'Olga Kuznetsova', category: 'Passport', fileName: 'olga_passport.pdf', fileSize: '2.1 MB', uploadedDate: '2026-06-11T13:30:00Z', status: 'Approved', comment: '', fileUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800' },
  { id: 'DOC4017', clientId: 'CL2008', clientName: 'Olga Kuznetsova', category: 'Bank Statement', fileName: 'rub_account_balance.pdf', fileSize: '3.3 MB', uploadedDate: '2026-06-11T13:45:00Z', status: 'Rejected', comment: 'Ruble statements must be translated and have equivalent EUR showing.', fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800' },
  { id: 'DOC4018', clientId: 'CL2008', clientName: 'Olga Kuznetsova', category: 'Employment Letter', fileName: 'work_retirement_proof.pdf', fileSize: '1.7 MB', uploadedDate: '2026-06-12T10:00:00Z', status: 'Approved', comment: '', fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800' },
  { id: 'DOC4019', clientId: 'CL2006', clientName: 'Sarah Jenkins', category: 'Passport', fileName: 'sarah_passport.pdf', fileSize: '2.2 MB', uploadedDate: '2026-06-01T09:30:00Z', status: 'Approved', comment: '', fileUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800' },
  { id: 'DOC4020', clientId: 'CL2006', clientName: 'Sarah Jenkins', category: 'Employment Letter', fileName: 'us_w2_and_contracts.pdf', fileSize: '3.9 MB', uploadedDate: '2026-06-01T10:00:00Z', status: 'Approved', comment: 'Satisfies remote employee income criteria.', fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800' },
  { id: 'DOC4021', clientId: 'CL2010', clientName: 'Isabella Gallo', category: 'Passport', fileName: 'isabella_passport.pdf', fileSize: '2.5 MB', uploadedDate: '2026-04-12T10:30:00Z', status: 'Approved', comment: '', fileUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800' }
];

export const EMAIL_TEMPLATES = [
  {
    id: 'et1',
    name: 'Appointment Confirmation',
    subject: 'Your Consultation with AAA Business Consultancy is Scheduled',
    body: `Dear {clientName},

Your Spain Visa & Residency consultation has been successfully booked.

Details:
- Date: {meetingDate}
- Time: {meetingTime}
- Meeting Link: {meetingLink}

Attached to this email, you will find our Spain Residency & Relocation Company Profile.

If you need to reschedule, please click here: {rescheduleLink}

Best Regards,
Client Relations Team
AAA Business Consultancy LLC
clients@aaabusinessconsultancy.com`
  },
  {
    id: 'et2',
    name: 'Consultation No-Show Follow Up',
    subject: 'We missed you! Reschedule your Spain Visa Consultation',
    body: `Dear {clientName},

We noticed you were unable to attend your scheduled Spain Visa & Residency Consultation on {meetingDate} at {meetingTime}.

We would love to help you build your future in Spain. Please click the link below to select a new date and time that works for you:

{bookingLink}

If you have any questions, feel free to reply directly to this email or contact us via WhatsApp.

Best Regards,
AAA Business Consultancy LLC`
  },
  {
    id: 'et3',
    name: 'Payment Remainder & Invoice',
    subject: 'Invoice {invoiceId} from AAA Business Consultancy LLC',
    body: `Dear {clientName},

Thank you for choosing AAA Business Consultancy LLC for your Spain Visa & Residency journey.

Please find attached Invoice {invoiceId} for your selected {packageName}.
Total Amount Due: {amount}

You can pay securely online via Apple Pay, Google Pay, or Visa/Mastercard using this link:
{paymentLink}

Please make the payment before {dueDate} to avoid any delays in document drafting.

Best Regards,
Finance Team
AAA Business Consultancy LLC`
  }
];

export const WHATSAPP_TEMPLATES = [
  {
    id: 'wt1',
    name: 'Welcome & Qualification Ask',
    body: `Greetings from AAA Business Consultancy LLC.
Thank you for contacting us regarding Spain Visa & Residency Services.

To help us guide you, please answer:
1. Which service would you like to apply for? (DNV, NLV, Self-Employed, Study, Family, Schengen)
2. How many applicants are included?

For further assistance, we will continue our conversation here.`
  },
  {
    id: 'wt2',
    name: 'Consultation Invite Link',
    body: `Congratulations! Based on your initial information, you are invited to book a FREE Assessment & Verification Consultation with one of our consultants.

Please use this booking link to select your preferred date and time:
{bookingLink}`
  },
  {
    id: 'wt3',
    name: 'Meeting 30m Reminder',
    body: `Friendly reminder: Your consultation with {consultantName} is starting in 30 minutes (at {meetingTime}).
Please confirm if you are ready to join:
[Confirm Attendance] [Reschedule]`
  }
];
export const ROLES = [
  { id: 'admin', name: 'Administrator', description: 'Full access to all CRM settings, deletion, reports, configuration, and data.' },
  { id: 'consultant', name: 'Consultant', description: 'Manage assigned leads/clients, view calendar scheduler, add notes, and upload/review client documents.' },
  { id: 'finance', name: 'Finance Staff', description: 'Full access to payment modules, invoices, revenue reports, and settings.' },
  { id: 'operations', name: 'Operations Staff', description: 'Oversee all leads and clients, document review pipeline, consultations, and consultant assignments.' }
];
export const NOTIFICATIONS = [
  { id: 'n1', title: 'New Lead Registered', message: 'Amelia Watson registered via Google Ads for Digital Nomad Visa.', type: 'lead', time: '5m ago', read: false },
  { id: 'n2', title: 'Payment Received', message: 'Invoice INV-2026-003 for Nour Dagher (€1,450) was paid.', type: 'payment', time: '1h ago', read: false },
  { id: 'n3', title: 'Document Uploaded', message: 'Chloe Dupont uploaded Bank Statement.', type: 'document', time: '2h ago', read: false },
  { id: 'n4', title: 'Meeting Confirmed', message: 'Tariq Mahmood confirmed attendance for today 3:00 PM.', type: 'meeting', time: '3h ago', read: true },
];

export const MOCK_FLIGHT_REQUESTS = [
  {
    id: 'FR1001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1 555 123 4567',
    origin: 'JFK',
    originCity: 'New York',
    destination: 'LHR',
    destinationCity: 'London',
    travelDate: '2026-08-25',
    returnDate: '2026-09-05',
    passengers: 2,
    adults: 2,
    children: 0,
    infants: 0,
    cabinClass: 'Economy',
    tripType: 'Round Trip',
    priority: 'High',
    status: 'QUOTE_PENDING',
    assignedAgentId: 'c1'
  },
  {
    id: 'FR1002',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.c@example.com',
    phone: '+1 555 987 6543',
    origin: 'LAX',
    originCity: 'Los Angeles',
    destination: 'DXB',
    destinationCity: 'Dubai',
    travelDate: '2026-10-12',
    returnDate: '2026-10-25',
    passengers: 1,
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'Business',
    tripType: 'Round Trip',
    priority: 'Normal',
    status: 'NEW',
    assignedAgentId: 'c2'
  }
];

export const MOCK_FLIGHT_OPTIONS = [
  {
    id: 'FLOPT1',
    requestId: 'FR1001',
    airline: 'British Airways',
    flightNumber: 'BA112',
    departure: '2026-08-25 18:30',
    arrival: '2026-08-26 06:30',
    duration: '7h 00m',
    stops: 'Non-stop',
    cabin: 'Economy',
    baggage: '1x 23kg',
    netFare: 850,
    taxes: 120,
    markup: 15,
    sellingPrice: 1115.5
  }
];

export const MOCK_QUOTES = [
  {
    id: 'QT2001',
    requestId: 'FR1001',
    customerName: 'John Smith',
    route: 'JFK - LHR',
    travelDate: '2026-08-25',
    sellingPrice: 1115.5,
    profit: 145.5,
    status: 'SENT',
    createdBy: 'c1',
    createdDate: '2026-06-18'
  }
];


export const MOCK_BOOKINGS = [
  {
    id: 'BK-10231',
    bookingId: 'BK-10231',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    customerPhone: '+1 555 123 4567',
    route: 'JFK → LHR',
    origin: 'JFK',
    destination: 'LHR',
    travelDate: '2026-08-25',
    returnDate: '2026-09-05',
    passengers: 2,
    cabinClass: 'Economy',
    tripType: 'Round Trip',
    pnr: 'ABC123',
    airline: 'British Airways',
    flightSegments: [
      { flightNo: 'BA112', origin: 'JFK', dest: 'LHR', dep: '2026-08-25 18:30', arr: '2026-08-26 06:30', seat: '12A' },
      { flightNo: 'BA113', origin: 'LHR', dest: 'JFK', dep: '2026-09-05 10:00', arr: '2026-09-05 13:00', seat: '14C' }
    ],
    netFare: 850,
    taxes: 120,
    serviceFee: 50,
    markup: 15,
    discount: 0,
    sellingPrice: 1173, // (850+120+50) = 1020 + (1020 * 0.15)
    profit: 203, // 50 + 153
    paymentStatus: 'PAID',
    bookingStatus: 'TICKETED',
    ticketStatus: 'ISSUED',
    eTicket: '125-9988776655',
    assignedAgent: 'c1',
    createdAt: '2026-06-20',
    timeline: [
      { date: '2026-06-18 10:00', event: 'Quote Accepted', user: 'System' },
      { date: '2026-06-18 10:15', event: 'Payment Link Sent', user: 'c1' },
      { date: '2026-06-19 14:30', event: 'Payment Received ($1173.00)', user: 'System' },
      { date: '2026-06-20 09:00', event: 'Ticket Issued', user: 'c1' }
    ]
  },
  {
    id: 'BK-10232',
    bookingId: 'BK-10232',
    customerName: 'Sarah Connor',
    customerEmail: 'sarah.c@example.com',
    customerPhone: '+1 555 987 6543',
    route: 'LAX → DXB',
    origin: 'LAX',
    destination: 'DXB',
    travelDate: '2026-10-12',
    returnDate: '2026-10-25',
    passengers: 1,
    cabinClass: 'Business',
    tripType: 'Round Trip',
    pnr: 'XYZ987',
    airline: 'Emirates',
    flightSegments: [
      { flightNo: 'EK216', origin: 'LAX', dest: 'DXB', dep: '2026-10-12 16:40', arr: '2026-10-13 19:30', seat: '4A' }
    ],
    netFare: 4200,
    taxes: 450,
    serviceFee: 100,
    markup: 10,
    discount: 0,
    sellingPrice: 5225,
    profit: 575,
    paymentStatus: 'PENDING',
    bookingStatus: 'QUOTE_ACCEPTED',
    ticketStatus: 'NOT_ISSUED',
    eTicket: '',
    assignedAgent: 'c2',
    createdAt: '2026-08-01',
    timeline: [
      { date: '2026-08-01 11:00', event: 'Quote Accepted', user: 'System' },
      { date: '2026-08-01 11:30', event: 'Booking Created & Payment Pending', user: 'c2' }
    ]
  }
];

export const MOCK_PAYMENTS_PHASE5 = [
  {
    id: 'PAY-1001',
    bookingId: 'BK-10231',
    customerName: 'John Smith',
    pnr: 'ABC123',
    amount: 1173,
    method: 'CARD',
    status: 'PAID',
    transactionId: 'TXN-2026-10482',
    date: '2026-06-19 14:30',
    assignedAgent: 'c1'
  },
  {
    id: 'PAY-1002',
    bookingId: 'BK-10232',
    customerName: 'Sarah Connor',
    pnr: 'XYZ987',
    amount: 5225,
    method: 'PAYMENT_LINK',
    status: 'PENDING',
    transactionId: '',
    date: '2026-08-01 11:30',
    assignedAgent: 'c2'
  }
];

export const MOCK_REFUNDS_PHASE5 = [
  {
    id: 'REF-5001',
    paymentId: 'PAY-1001',
    bookingId: 'BK-10231',
    customerName: 'John Smith',
    originalAmount: 1173,
    refundAmount: 500,
    reason: 'Flight Cancellation',
    status: 'PROCESSING',
    requestedDate: '2026-08-02 09:00',
    processedDate: ''
  }
];

export const MOCK_PAYMENT_LINKS_PHASE5 = [
  {
    id: 'LNK-8F29K2',
    bookingId: 'BK-10232',
    customerName: 'Sarah Connor',
    amount: 5225,
    token: 'AAA-PAY-8F29K2',
    status: 'ACTIVE',
    expiresAt: '2026-08-03 11:30',
    createdAt: '2026-08-02 11:30'
  }
];


// Truncate table data to 5 records for better UI visibility as requested
[
  MOCK_LEADS,
  MOCK_CLIENTS,
  MOCK_CONSULTATIONS,
  MOCK_PAYMENTS,
  MOCK_FLIGHT_REQUESTS,
  MOCK_QUOTES,
  MOCK_BOOKINGS,
  MOCK_PAYMENTS_PHASE5,
  MOCK_REFUNDS_PHASE5,
  MOCK_PAYMENT_LINKS_PHASE5,
  NOTIFICATIONS
].forEach(arr => {
  if (Array.isArray(arr) && arr.length > 5) {
    arr.length = 5;
  }
});
