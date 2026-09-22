import React, { useState } from 'react';
import { Plane, Star, MapPin, ArrowUpRight, Sparkles, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DESTINATIONS = [
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    airport: 'CDG',
    price: '$2,450',
    originalPrice: '$3,200',
    rating: 4.9,
    reviews: '1.2k',
    tag: 'Popular First Class',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    desc: 'Fly to the City of Light with private chauffeur transfers and Michelin dining onboard.'
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    airport: 'DXB',
    price: '$2,890',
    originalPrice: '$3,800',
    rating: 5.0,
    reviews: '2.8k',
    tag: 'Ultra Luxury Suite',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    desc: 'Experience 7-star hospitality with Emirates First Suite private enclosed cabin suites.'
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    airport: 'HND',
    price: '$3,150',
    originalPrice: '$4,100',
    rating: 4.95,
    reviews: '950',
    tag: 'Best Jet Deal',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    desc: 'Non-stop Tokyo flights with ANA The Suite, featuring 43-inch 4K personal monitors.'
  },
  {
    id: 'newyork',
    city: 'New York',
    country: 'United States',
    airport: 'JFK',
    price: '$1,980',
    originalPrice: '$2,600',
    rating: 4.88,
    reviews: '3.4k',
    tag: 'Transatlantic Special',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    desc: 'Fly in style to Manhattan with British Airways First Dining Lounge access at LHR.'
  },
  {
    id: 'maldives',
    city: 'Maldives',
    country: 'Indian Ocean',
    airport: 'MLE',
    price: '$3,400',
    originalPrice: '$4,500',
    rating: 4.99,
    reviews: '890',
    tag: 'Seaplane Included',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    desc: 'Overwater luxury private charter transfers directly from Male hub to your resort.'
  },
  {
    id: 'santorini',
    city: 'Santorini',
    country: 'Greece',
    airport: 'JTR',
    price: '$2,250',
    originalPrice: '$2,900',
    rating: 4.92,
    reviews: '1.5k',
    tag: 'Romantic Getaway',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    desc: 'Direct Mediterranean VIP flight connections with fast-track airport security.'
  }
];

export const PopularDestinations = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookNow = (item) => {
    setSelectedDestination(item);
  };

  const handleConfirmBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedDestination(null);
    }, 2500);
  };

  return (
    <section id="popular-destinations" className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      
      {/* AMBIENT BACKGROUND LIGHTING */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Curated Luxury Escapes
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Top Trending <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900">First Class Deals</span>
            </h2>
          </div>
          <p className="text-slate-600 text-sm max-w-md font-medium">
            Handpicked iconic destinations with exclusive GDS fares, complimentary airport lounge passes, and luxury transfers.
          </p>
        </div>

        {/* DESTINATIONS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-md hover:shadow-xl hover:border-indigo-300 transition-all duration-500 flex flex-col"
            >
              {/* IMAGE CONTAINER WITH ZOOM EFFECT */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.city}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

                {/* TAG BADGE */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-amber-800 text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* RATING BADGE */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-bold shadow-sm">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{item.rating}</span>
                </div>

                {/* PRICE BADGE SLIDING UP */}
                <div className="absolute bottom-4 right-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm shadow-md flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-800 line-through mr-1">
                      {item.originalPrice}
                    </span>
                    <span>{item.price}</span>
                  </div>
                </div>
              </div>

              {/* CARD BODY */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{item.country} ({item.airport})</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {item.city}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleBookNow(item)}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-700 hover:text-white border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <span>Reserve Flight Deal</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* QUICK BOOKING MODAL */}
      <AnimatePresence>
        {selectedDestination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          >
            <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl">
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              {bookingSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Flight Deal Reserved!</h3>
                  <p className="text-xs text-slate-600 mb-4">
                    Your flight to {selectedDestination.city} ({selectedDestination.airport}) is held at {selectedDestination.price}. Our VIP Air Concierge will contact you within 5 minutes.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <img
                      src={selectedDestination.image}
                      alt={selectedDestination.city}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-xs text-amber-700 font-bold uppercase tracking-wider">
                        {selectedDestination.tag}
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        Book Flight to {selectedDestination.city}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedDestination.country} | Fare: {selectedDestination.price}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6 text-xs text-slate-700">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                      <span>Cabin Class:</span>
                      <span className="font-bold text-slate-900">First Class Suite</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                      <span>Baggage Allowance:</span>
                      <span className="font-bold text-slate-900">3x 32kg + Lounge Pass</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                      <span>Cancelation Policy:</span>
                      <span className="font-bold text-emerald-600">100% Refundable</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmBooking}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-amber-500/20"
                  >
                    Confirm & Lock Fare ({selectedDestination.price})
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
