import React from 'react';
import { Star, ShieldCheck, Quote, Award, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AIRLINE_LOGOS = [
  { name: 'Emirates', hub: 'Dubai (DXB)', code: 'EK' },
  { name: 'Singapore Airlines', hub: 'Singapore (SIN)', code: 'SQ' },
  { name: 'Qatar Airways', hub: 'Doha (DOH)', code: 'QR' },
  { name: 'Etihad Airways', hub: 'Abu Dhabi (AUH)', code: 'EY' },
  { name: 'Cathay Pacific', hub: 'Hong Kong (HKG)', code: 'CX' },
  { name: 'Lufthansa First', hub: 'Frankfurt (FRA)', code: 'LH' },
  { name: 'Air France La Première', hub: 'Paris (CDG)', code: 'AF' },
  { name: 'ANA All Nippon', hub: 'Tokyo (HND)', code: 'NH' }
];

const REVIEWS = [
  {
    id: 1,
    name: 'Sir Richard Sterling',
    role: 'Managing Director, Horizon Global',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    verified: 'Verified First Class Passenger',
    quote: 'Booking our Gulfstream G650 charter through WowMyFlight was effortless. The dedicated concierge arranged airport transfers and fast-track clearance in under 10 minutes.'
  },
  {
    id: 2,
    name: 'Elena Rostova',
    role: 'Creative Director, Luxury Brand House',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    verified: 'Emirates First Suite VIP',
    quote: 'The GDS fare lock feature saved us over $1,400 on Paris-to-Tokyo First Class suites. Exceptional customer service and 100% transparent pricing.'
  },
  {
    id: 3,
    name: 'Marcus Vance',
    role: 'Tech Founder & Investor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    verified: 'Singapore Airlines Suite VIP',
    quote: 'I fly transatlantic monthly. WowMyFlight has become my exclusive portal for private jet empty legs and first-class suite reservations. Unmatched experience.'
  }
];

export const SocialProof = () => {
  return (
    <section id="social-proof" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden border-b border-slate-200">
      
      {/* GLOW DECORATION */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* AIRLINE LOGOS MARQUEE HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-amber-700 block mb-2">
            Global Airline Alliances & GDS Partners
          </span>
          <h3 className="text-lg font-bold text-slate-700">
            Direct Inventory Access to 85+ 5-Star International Carriers
          </h3>
        </div>

        {/* INFINITE MARQUEE RUNNER */}
        <div className="relative w-full overflow-hidden mb-20 py-4 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-slate-50 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-slate-50 after:to-transparent">
          <div className="flex w-max gap-8 animate-marquee">
            {[...AIRLINE_LOGOS, ...AIRLINE_LOGOS].map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 transition-colors shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center border border-indigo-200 font-mono">
                  {logo.code}
                </div>
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block">{logo.name}</span>
                  <span className="text-[10px] text-slate-500 font-semibold block">{logo.hub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REVIEWS HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            99.8% VIP Client Satisfaction
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Trusted by World-Class <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900">Travelers & Executives</span>
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            Read verified reviews from CEOs, luxury travelers, and private jet charter clients.
          </p>
        </div>

        {/* REVIEWS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between hover:border-indigo-400 transition-all shadow-md hover:shadow-xl group"
            >
              <div>
                {/* RATING STARS */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-indigo-200 mb-4 group-hover:text-indigo-400 transition-colors" />

                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-8 italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{rev.name}</h4>
                  <p className="text-[11px] text-indigo-700 font-semibold mb-0.5">{rev.role}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                    <CheckCircle className="w-3 h-3" />
                    {rev.verified}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
