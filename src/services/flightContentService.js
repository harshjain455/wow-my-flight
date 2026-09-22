/**
 * Flight Content Service & Supplier Adapter Architecture
 * 
 * Decouples the CRM from direct GDS / Consolidator API dependencies.
 * 
 * Architecture:
 *   CRM Application
 *        ↓
 *   Flight Content Service (Aggregator & Normalizer)
 *        ↓
 *   Supplier Adapter Manager
 *    ├── Consolidator A Adapter (e.g. Mystifly B2B API)
 *    ├── Consolidator B Adapter (e.g. Mondee / Picasso Travel)
 *    ├── GDS Adapter (Amadeus / Sabre / Travelport GDS)
 *    └── NDC Supplier Adapter (Air India NDC / Emirates Direct Connect)
 */

export const INITIAL_SUPPLIER_ADAPTERS = [
  {
    id: 'ADAPTER-CONS-A',
    name: 'Consolidator A (Mystifly B2B)',
    type: 'Consolidator',
    protocol: 'REST / JSON API',
    endpoint: 'https://api.mystifly.com/v2/flight/search',
    status: 'Active',
    latency: '120ms',
    uptime: '99.9%',
    authType: 'OAuth 2.0 / Bearer',
    supportedCabins: ['Economy', 'Premium Economy', 'Business', 'First Class'],
    features: ['Net Fare Rules', 'Instant Ticket Issuance', 'B2B Fare Markup'],
    lastPing: '2026-08-20T12:00:00Z',
    description: 'Global flight content consolidator specializing in wholesale B2B fares.'
  },
  {
    id: 'ADAPTER-CONS-B',
    name: 'Consolidator B (Mondee Travel)',
    type: 'Consolidator',
    protocol: 'REST / JSON API',
    endpoint: 'https://api.mondee.com/v1/flights/avail',
    status: 'Active',
    latency: '145ms',
    uptime: '99.8%',
    authType: 'API Key + Secret',
    supportedCabins: ['Economy', 'Business'],
    features: ['Private Negotiated Fares', 'Tour Operator Tariffs'],
    lastPing: '2026-08-20T12:05:00Z',
    description: 'Americas and transatlantic flight content consolidator aggregator.'
  },
  {
    id: 'ADAPTER-GDS',
    name: 'GDS Adapter (Amadeus & Sabre GDS)',
    type: 'GDS Gateway',
    protocol: 'SOAP / XML / EDIFACT',
    endpoint: 'https://nodeD3.production.amadeus.com/1ASLWM',
    status: 'Active',
    latency: '95ms',
    uptime: '99.99%',
    authType: 'Session Token / WSS Security',
    supportedCabins: ['Economy', 'Premium Economy', 'Business', 'First Class'],
    features: ['Live PNR Build', 'Seat Maps', 'Interline Agreements', 'GDS Queue Sync'],
    lastPing: '2026-08-20T12:10:00Z',
    description: 'Core legacy GDS gateway for published, IT, and CAT35 private fares.'
  },
  {
    id: 'ADAPTER-NDC',
    name: 'NDC Supplier Adapter (Air India & Emirates Direct)',
    type: 'NDC Direct Connect',
    protocol: 'IATA NDC 21.3 XML',
    endpoint: 'https://ndc.airindia.in/ndc/v213/AirShopping',
    status: 'Active',
    latency: '110ms',
    uptime: '99.95%',
    authType: 'Digital Signature + Certificate',
    supportedCabins: ['Economy', 'Business', 'First Class'],
    features: ['Ancillary Dynamic Pricing', 'Free Seat Selection', 'Zero GDS Surcharge'],
    lastPing: '2026-08-20T12:12:00Z',
    description: 'Direct NDC connect API bypassing legacy GDS distribution fees.'
  }
];

class FlightContentService {
  constructor() {
    this.adapters = this.loadAdapters();
  }

  loadAdapters() {
    try {
      const saved = localStorage.getItem('crm_supplier_adapters');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load supplier adapters from localStorage:', e);
    }
    return INITIAL_SUPPLIER_ADAPTERS;
  }

  saveAdapters() {
    try {
      localStorage.setItem('crm_supplier_adapters', JSON.stringify(this.adapters));
    } catch (e) {
      console.error('Failed to save supplier adapters to localStorage:', e);
    }
  }

  getAdapters() {
    return [...this.adapters];
  }

  getActiveAdapters() {
    return this.adapters.filter(a => a.status === 'Active');
  }

  toggleAdapterStatus(id, newStatus) {
    this.adapters = this.adapters.map(a =>
      a.id === id ? { ...a, status: newStatus, lastPing: new Date().toISOString() } : a
    );
    this.saveAdapters();
    return this.getAdapters();
  }

  async pingAdapter(id) {
    const adapter = this.adapters.find(a => a.id === id);
    if (!adapter) return { success: false, message: 'Adapter not found' };

    // Simulate network round-trip ping latency
    const pingTime = Math.floor(80 + Math.random() * 70);
    const updated = {
      ...adapter,
      latency: `${pingTime}ms`,
      lastPing: new Date().toISOString(),
      status: 'Active'
    };

    this.adapters = this.adapters.map(a => a.id === id ? updated : a);
    this.saveAdapters();

    return {
      success: true,
      adapterId: id,
      name: adapter.name,
      latency: `${pingTime}ms`,
      timestamp: updated.lastPing
    };
  }

  registerAdapter(newAdapterData) {
    const newId = `ADAPTER-SUP-${Math.floor(100 + Math.random() * 900)}`;
    const fullAdapter = {
      id: newId,
      name: newAdapterData.name || 'New Supplier Adapter',
      type: newAdapterData.type || 'Consolidator',
      protocol: newAdapterData.protocol || 'REST / JSON API',
      endpoint: newAdapterData.endpoint || 'https://api.supplier.com/v1/search',
      status: newAdapterData.status || 'Active',
      latency: '115ms',
      uptime: '100%',
      authType: newAdapterData.authType || 'API Key',
      supportedCabins: newAdapterData.supportedCabins || ['Economy', 'Business'],
      features: newAdapterData.features || ['Search', 'Booking'],
      lastPing: new Date().toISOString(),
      description: newAdapterData.description || 'Custom added flight content supplier adapter.'
    };

    this.adapters.unshift(fullAdapter);
    this.saveAdapters();
    return fullAdapter;
  }

  /**
   * Search flights across all active supplier adapters concurrently.
   * Normalizes responses into a single standard CRM Flight Offer schema.
   */
  async searchFlightsAcrossAdapters(params = {}) {
    const {
      origin = 'DEL',
      destination = 'LHR',
      departDate = '2026-10-15',
      cabinClass = 'Business',
      passengers = 2,
      adapterFilter = 'All'
    } = params;

    const activeAdapters = this.adapters.filter(a => {
      if (a.status !== 'Active') return false;
      if (adapterFilter && adapterFilter !== 'All') {
        return a.id === adapterFilter || a.type.toLowerCase().includes(adapterFilter.toLowerCase());
      }
      return true;
    });

    // Simulated responses normalized from different supplier protocols
    const mockNormalizedOffers = [];

    activeAdapters.forEach((adapter, idx) => {
      if (adapter.id === 'ADAPTER-CONS-A') {
        mockNormalizedOffers.push({
          id: `OFFER-CONSA-${idx}-1`,
          supplierAdapterId: adapter.id,
          supplierName: 'Consolidator A (Mystifly)',
          supplierType: 'Consolidator B2B',
          airline: 'British Airways (BA)',
          flightNumber: 'BA-142',
          origin: origin,
          destination: destination,
          departure: `${origin} 09:15 AM (${departDate})`,
          arrival: `${destination} 02:30 PM (${departDate})`,
          depDateTime: `${departDate}T09:15`,
          arrDateTime: `${departDate}T14:30`,
          duration: '8h 45m',
          stops: 'Direct Non-Stop',
          cabinClass: cabinClass,
          fareFamily: 'Club World Flex',
          baggage: '2x 32kg Checked + 7kg Cabin',
          fareConditions: 'Refundable with $150 penalty; free date change up to 24h prior.',
          baseFare: 7000,
          taxes: 1500,
          supplierCost: 8500,
          protocolUsed: adapter.protocol,
          notes: 'Special Consolidator Net Fare with guaranteed seat release.'
        });
      } else if (adapter.id === 'ADAPTER-CONS-B') {
        mockNormalizedOffers.push({
          id: `OFFER-CONSB-${idx}-2`,
          supplierAdapterId: adapter.id,
          supplierName: 'Consolidator B (Mondee)',
          supplierType: 'Consolidator B2B',
          airline: 'Virgin Atlantic (VS)',
          flightNumber: 'VS-301',
          origin: origin,
          destination: destination,
          departure: `${origin} 01:20 PM (${departDate})`,
          arrival: `${destination} 06:45 PM (${departDate})`,
          depDateTime: `${departDate}T13:20`,
          arrDateTime: `${departDate}T18:45`,
          duration: '8h 55m',
          stops: 'Direct Non-Stop',
          cabinClass: cabinClass,
          fareFamily: 'Upper Class Flex',
          baggage: '2x 32kg Checked',
          fareConditions: 'Refundable with $180 fee; changes permitted.',
          baseFare: 7200,
          taxes: 1450,
          supplierCost: 8650,
          protocolUsed: adapter.protocol,
          notes: 'Private Mondee Tour Operator fare rate.'
        });
      } else if (adapter.id === 'ADAPTER-GDS') {
        mockNormalizedOffers.push({
          id: `OFFER-GDS-${idx}-3`,
          supplierAdapterId: adapter.id,
          supplierName: 'GDS Gateway (Amadeus)',
          supplierType: 'Legacy GDS Gateway',
          airline: 'Emirates (EK)',
          flightNumber: 'EK-511 / EK-003',
          origin: origin,
          destination: destination,
          departure: `${origin} 10:30 AM (${departDate})`,
          arrival: `${destination} 06:20 PM (${departDate})`,
          depDateTime: `${departDate}T10:30`,
          arrDateTime: `${departDate}T18:20`,
          duration: '11h 20m',
          stops: '1 Stop (DXB 1h 45m)',
          cabinClass: cabinClass,
          fareFamily: 'Business Saver Flex',
          baggage: '40kg Checked Allowance',
          fareConditions: 'Non-refundable; $250 date change fee.',
          baseFare: 6500,
          taxes: 1400,
          supplierCost: 7900,
          protocolUsed: adapter.protocol,
          notes: 'GDS Published Fare with instant PNR creation.'
        });
      } else if (adapter.id === 'ADAPTER-NDC') {
        mockNormalizedOffers.push({
          id: `OFFER-NDC-${idx}-4`,
          supplierAdapterId: adapter.id,
          supplierName: 'NDC Supplier (Air India Direct)',
          supplierType: 'IATA NDC Direct Connect',
          airline: 'Air India (AI)',
          flightNumber: 'AI-161',
          origin: origin,
          destination: destination,
          departure: `${origin} 02:45 AM (${departDate})`,
          arrival: `${destination} 07:30 AM (${departDate})`,
          depDateTime: `${departDate}T02:45`,
          arrDateTime: `${departDate}T07:30`,
          duration: '9h 15m',
          stops: 'Direct Non-Stop',
          cabinClass: cabinClass,
          fareFamily: 'Maharajah Flex NDC',
          baggage: '2x 32kg + 7kg Cabin',
          fareConditions: 'Refundable with $100 penalty; zero GDS surcharge.',
          baseFare: 6600,
          taxes: 1300,
          supplierCost: 7900,
          protocolUsed: adapter.protocol,
          notes: 'Direct NDC Connect offer with complimentary seat selection.'
        });
      }
    });

    return {
      query: { origin, destination, departDate, cabinClass, passengers },
      searchedAdaptersCount: activeAdapters.length,
      offersCount: mockNormalizedOffers.length,
      offers: mockNormalizedOffers
    };
  }
}

export const flightContentService = new FlightContentService();
