import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, Users, RefreshCw, Search, Sparkles, Check, ChevronDown, ShieldCheck, Clock, MapPin, X, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '../../services/dbService';

const AIRPORTS = [
  { code: 'JFK', city: 'New York', country: 'United States', name: 'John F. Kennedy Intl' },
  { code: 'LHR', city: 'London', country: 'United Kingdom', name: 'Heathrow Airport' },
  { code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', name: 'Dubai Intl Airport' },
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Charles de Gaulle' },
  { code: 'HND', city: 'Tokyo', country: 'Japan', name: 'Haneda Airport' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Changi Airport' },
  { code: 'LAX', city: 'Los Angeles', country: 'United States', name: 'Los Angeles Intl' },
  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Kingsford Smith' },
  { code: 'DEL', city: 'New Delhi', country: 'India', name: 'Indira Gandhi Intl' },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji Maharaj Intl' },
  { code: 'BLR', city: 'Bengaluru', country: 'India', name: 'Kempegowda Intl' },
  { code: 'MAA', city: 'Chennai', country: 'India', name: 'Chennai Intl' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad Intl Airport' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', name: 'Frankfurt Airport' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', name: 'Schiphol Airport' },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland', name: 'Zurich Airport' },
  { code: 'SFO', city: 'San Francisco', country: 'United States', name: 'San Francisco Intl' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', name: 'Suvarnabhumi Airport' }
];

export const FlightSearch = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('round-trip');
  const [origin, setOrigin] = useState(AIRPORTS[0]);
  const [destination, setDestination] = useState(AIRPORTS[1]);
  
  const [originQuery, setOriginQuery] = useState('New York (JFK)');
  const [destinationQuery, setDestinationQuery] = useState('London (LHR)');
  
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const [depDate, setDepDate] = useState('2026-10-15');
  const [retDate, setRetDate] = useState('2026-10-22');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('First Class Suite');
  const [isSwapRotating, setIsSwapRotating] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  // Lead Form States
  const [selectedFlight, setSelectedFlight] = useState({
    airline: 'Emirates First Class',
    flight: 'EK 201',
    price: '$2,850'
  });
  const [leadForm, setLeadForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.firstName || !leadForm.email || !leadForm.phone) {
      alert('Please fill in your Name, Email Address, and Phone Number to receive your quotation.');
      return;
    }
    setIsSubmittingLead(true);
    try {
      const createdLead = await dbService.createLead({
        firstName: leadForm.firstName.trim(),
        lastName: leadForm.lastName.trim() || 'Traveler',
        email: leadForm.email.trim(),
        phone: leadForm.phone.trim(),
        nationality: 'International',
        preferredLanguage: 'English',
        serviceId: cabinClass.toLowerCase().includes('first') ? 'first_class' : 'business_class',
        status: 'New',
        source: 'Landing Page Search Engine Widget',
        destinationCountry: destination.country,
        notes: `Flight Booking Request:\n- Route: ${origin.city} (${origin.code}) ✈️ ${destination.city} (${destination.code})\n- Dates: Dep ${depDate}${tripType === 'round-trip' ? ` | Ret ${retDate}` : ''}\n- Passengers: ${passengers} (${cabinClass})\n- Selected Flight: ${selectedFlight ? `${selectedFlight.airline} (${selectedFlight.flight}) - ${selectedFlight.price}` : 'General Inquiry'}\n- Special Requests: ${leadForm.notes || 'None'}`
      });

      setSubmittedLead(createdLead);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleSwap = () => {
    setIsSwapRotating(true);
    setTimeout(() => setIsSwapRotating(false), 500);
    const tempOrigin = origin;
    const tempQuery = originQuery;
    
    setOrigin(destination);
    setOriginQuery(destinationQuery);
    
    setDestination(tempOrigin);
    setDestinationQuery(tempQuery);
  };

  const filterAirports = (query) => {
    if (!query) return AIRPORTS;
    const q = query.toLowerCase();
    return AIRPORTS.filter(a =>
      a.city.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setSearchResultsOpen(true);
    }, 1200);
  };

  return (
    <div id="search-widget" className="relative w-full max-w-5xl mx-auto z-30">
      
      {/* WHITE GLASS CONTAINER WITH CRISP CONTRAST */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-visible">
        
        {/* SUBTLE AMBIENT GLOW */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* TRIP TYPE TABS */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {['round-trip', 'one-way', 'multi-city'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTripType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  tripType === type
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* PASSENGERS & CABIN DROPDOWN PREVIEW */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPassengerModal(!showPassengerModal)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/70 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>{passengers} Guest{passengers > 1 ? 's' : ''}, {cabinClass}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* PASSENGER & CABIN MODAL */}
            {showPassengerModal && (
              <div className="absolute right-0 mt-2 w-72 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Passengers</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-slate-900">{passengers}</span>
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.min(9, passengers + 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Cabin Class</span>
                  {['First Class Suite', 'Business Class', 'Premium Economy', 'Private Jet Charter'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCabinClass(c);
                        setShowPassengerModal(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        cabinClass === c ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{c}</span>
                      {cabinClass === c && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* INPUT FIELDS FORM GRID */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* ORIGIN & DESTINATION PAIR (COL 5) */}
          <div className="lg:col-span-5 relative grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 overflow-visible">
            
            {/* ORIGIN TYPABLE AUTOCOMPLETE */}
            <div className="relative p-3 bg-white rounded-xl hover:bg-indigo-50/50 transition-colors border border-slate-100">
              <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3 text-amber-600" />
                From / Origin
              </label>
              <input
                type="text"
                value={originQuery}
                onFocus={() => {
                  setShowOriginDropdown(true);
                  setShowDestDropdown(false);
                }}
                onChange={(e) => {
                  setOriginQuery(e.target.value);
                  setShowOriginDropdown(true);
                }}
                placeholder="Type city or airport..."
                className="w-full bg-transparent text-slate-900 font-extrabold text-sm focus:outline-none placeholder-slate-400"
              />
              <p className="text-[11px] text-slate-500 truncate">{origin.name || 'Search Airport'}</p>

              {/* ORIGIN AUTOCOMPLETE DROPDOWN */}
              {showOriginDropdown && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto p-2">
                  <div className="text-[10px] font-bold uppercase text-slate-400 px-3 py-1">Suggested Airports</div>
                  {filterAirports(originQuery).length > 0 ? (
                    filterAirports(originQuery).map(a => (
                      <button
                        key={a.code}
                        type="button"
                        onClick={() => {
                          setOrigin(a);
                          setOriginQuery(`${a.city} (${a.code})`);
                          setShowOriginDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-black text-slate-900 group-hover:text-indigo-600">
                            {a.city} ({a.code})
                          </div>
                          <div className="text-[10px] text-slate-500">{a.name}, {a.country}</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-bold group-hover:bg-indigo-600 group-hover:text-white">
                          {a.code}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-500 italic">No airport match found</div>
                  )}
                </div>
              )}
            </div>

            {/* SWAP BUTTON */}
            <button
              type="button"
              onClick={handleSwap}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all border-2 border-white"
            >
              <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${isSwapRotating ? 'rotate-180' : ''}`} />
            </button>

            {/* DESTINATION TYPABLE AUTOCOMPLETE */}
            <div className="relative p-3 bg-white rounded-xl hover:bg-indigo-50/50 transition-colors border border-slate-100">
              <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3 text-amber-600" />
                To / Destination
              </label>
              <input
                type="text"
                value={destinationQuery}
                onFocus={() => {
                  setShowDestDropdown(true);
                  setShowOriginDropdown(false);
                }}
                onChange={(e) => {
                  setDestinationQuery(e.target.value);
                  setShowDestDropdown(true);
                }}
                placeholder="Type city or airport..."
                className="w-full bg-transparent text-slate-900 font-extrabold text-sm focus:outline-none placeholder-slate-400"
              />
              <p className="text-[11px] text-slate-500 truncate">{destination.name || 'Search Airport'}</p>

              {/* DESTINATION AUTOCOMPLETE DROPDOWN */}
              {showDestDropdown && (
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto p-2">
                  <div className="text-[10px] font-bold uppercase text-slate-400 px-3 py-1">Suggested Airports</div>
                  {filterAirports(destinationQuery).length > 0 ? (
                    filterAirports(destinationQuery).map(a => (
                      <button
                        key={a.code}
                        type="button"
                        onClick={() => {
                          setDestination(a);
                          setDestinationQuery(`${a.city} (${a.code})`);
                          setShowDestDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-black text-slate-900 group-hover:text-indigo-600">
                            {a.city} ({a.code})
                          </div>
                          <div className="text-[10px] text-slate-500">{a.name}, {a.country}</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-bold group-hover:bg-indigo-600 group-hover:text-white">
                          {a.code}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-500 italic">No airport match found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DATES PAIR (COL 4) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <div className="p-3 bg-white rounded-xl hover:bg-indigo-50/50 transition-colors border border-slate-100">
              <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-amber-600" />
                Departure Date
              </label>
              <input
                type="date"
                value={depDate}
                onChange={(e) => setDepDate(e.target.value)}
                className="w-full bg-transparent text-slate-900 font-bold text-xs focus:outline-none cursor-pointer"
              />
            </div>

            <div className={`p-3 bg-white rounded-xl hover:bg-indigo-50/50 transition-colors border border-slate-100 ${tripType === 'one-way' ? 'opacity-40 pointer-events-none' : ''}`}>
              <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-amber-600" />
                Return Date
              </label>
              <input
                type="date"
                value={retDate}
                onChange={(e) => setRetDate(e.target.value)}
                disabled={tripType === 'one-way'}
                className="w-full bg-transparent text-slate-900 font-bold text-xs focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* CTA SEARCH BUTTON (COL 3) */}
          <div className="lg:col-span-3">
            <button
              type="submit"
              disabled={isSearching}
              className="relative group w-full h-[76px] rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden cursor-pointer"
            >
              {/* SHIMMER EFFECT */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              {isSearching ? (
                <div className="flex items-center gap-2 text-slate-950">
                  <Plane className="w-5 h-5 animate-bounce text-slate-950" />
                  <span>Searching GDS...</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10 font-extrabold text-base">Find Luxury Flights</span>
                  <Plane className="w-5 h-5 text-slate-950 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-1 group-hover:rotate-12" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* TRUST BADGES ROW */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-slate-600 text-xs gap-4 font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed Lowest First Class & Jet Rates</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>24/7 Dedicated VIP Air Concierge</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>100% Flexible Cancelation & Instant Voucher</span>
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS & LEAD CAPTURE MODAL */}
      <AnimatePresence>
        {searchResultsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto pt-20 sm:pt-24 pb-12"
          >
            <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl overflow-hidden my-auto max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => {
                  setSubmittedLead(null);
                  setSearchResultsOpen(false);
                }}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* SUCCESS VIEW IF LEAD SUBMITTED */}
              {submittedLead ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">
                    🎉 Booking Inquiry Pushed to CRM!
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Your flight request has been created and assigned to our Travel Expert team.
                  </p>

                  <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-6 text-xs space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <span className="font-bold text-slate-500">Lead Reference ID:</span>
                      <span className="font-black font-mono text-indigo-700 text-sm">{submittedLead.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-500">Passenger Name:</span>
                      <span className="font-bold text-slate-900">{submittedLead.firstName} {submittedLead.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-500">Route Requested:</span>
                      <span className="font-bold text-indigo-600">{origin.code} ✈️ {destination.code} ({depDate})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-500">Cabin & Passengers:</span>
                      <span className="font-bold text-slate-900">{passengers} Pax | {cabinClass}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                      <span className="font-bold text-slate-500">Assigned Consultant:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Auto-Assigned (System)</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setSubmittedLead(null);
                        setSearchResultsOpen(false);
                        navigate('/');
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform"
                    >
                      Back to Homepage
                    </button>
                    <button
                      onClick={() => {
                        setSubmittedLead(null);
                        setSearchResultsOpen(false);
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* LEAD FORM & FLIGHT SELECTION VIEW */
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                      <Plane className="w-6 h-6 -rotate-45" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-slate-900">
                          {origin.city} ({origin.code}) ✈️ {destination.city} ({destination.code})
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-[10px] uppercase border border-indigo-200">
                          {tripType.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Date: {depDate} {tripType === 'round-trip' ? ` → ${retDate}` : ''} | {passengers} Pax ({cabinClass})
                      </p>
                    </div>
                  </div>

                  {/* FLIGHT OPTIONS CHOOSER */}
                  <div className="mb-6">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
                      1. Choose Preferred Airline & Fare
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { airline: 'Emirates First Class', flight: 'EK 201', time: '08:30 → 14:45', price: '$2,850', badge: 'Best Rated' },
                        { airline: 'Singapore Airlines Suite', flight: 'SQ 012', time: '11:15 → 17:50', price: '$3,100', badge: 'Ultra Luxury' },
                        { airline: 'Qatar Airways QSuite', flight: 'QR 702', time: '19:40 → 02:10+1', price: '$2,690', badge: 'Best Value' }
                      ].map((item) => {
                        const isSelected = selectedFlight?.flight === item.flight;
                        return (
                          <div
                            key={item.flight}
                            onClick={() => setSelectedFlight(item)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-indigo-50/70 border-indigo-600 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-black text-slate-900">{item.airline}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono mb-2">{item.flight} • {item.time}</p>
                            <span className="text-sm font-black text-amber-600">{item.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CUSTOMER CONTACT & LEAD CAPTURE FORM */}
                  <form onSubmit={handleLeadSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      2. Enter Passenger Contact Details (Pushed directly to CRM)
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">First Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul"
                          value={leadForm.firstName}
                          onChange={(e) => setLeadForm({ ...leadForm, firstName: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Last Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Sharma"
                          value={leadForm.lastName}
                          onChange={(e) => setLeadForm({ ...leadForm, lastName: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="rahul.sharma@example.com"
                          value={leadForm.email}
                          onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone / WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={leadForm.phone}
                          onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Special Requests / Seat Preference (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Window seat, Vegan meal, Chauffeur transfer needed..."
                        value={leadForm.notes}
                        onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-4">
                      <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                        🔒 Confidential GDS Pricing & VIP Air Concierge Assignment
                      </span>
                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
                      >
                        {isSubmittingLead ? (
                          <span>Pushing Lead to CRM...</span>
                        ) : (
                          <>
                            <span>Generate Booking Lead & Push to CRM</span>
                            <Send className="w-4 h-4 text-white" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
