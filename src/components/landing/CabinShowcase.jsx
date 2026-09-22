import React, { useState } from 'react';
import { Sparkles, Check, Armchair, Utensils, Wifi, Wine, Shield, Eye, ConciergeBell, Luggage, Coffee, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CABIN_CLASSES = [
  {
    id: 'first',
    name: 'First Residence',
    category: 'In-Flight Luxury',
    subtitle: 'Enclosed Private Suites with Double Bed & Personal Butler',
    priceRatio: 'Ultimate Luxury',
    image: '/images/first_residence_suite.jpg',
    videoUrl: null,
    badgeText: 'Cabin Suite',
    badgeIcon: Armchair,
    bottomBadges: [
      { icon: Utensils, label: 'Michelin Dining & Fine Wines' },
      { icon: Wifi, label: 'Unlimited Starlink Wi-Fi' }
    ],
    features: [
      'Fully enclosed sliding privacy doors with ambient mood lighting',
      'Flat double-bed with custom Italian leather mattress & silk bedding',
      'Michelin-starred multi-course dining menu & vintage wine pairing',
      'Personal wardrobe, vanity counter & BVLGARI luxury amenity kit',
      'Unlimited high-speed Starlink Wi-Fi & 32-inch 4K OLED display',
      'Chauffeur-driven luxury Mercedes-Maybach airport transfers'
    ]
  },
  {
    id: 'concierge',
    name: 'Airport VIP Concierge',
    category: 'Airport Ground Service',
    subtitle: 'Fast-Track Passport Escort, Buggy Ride & Dedicated Luggage Porter',
    priceRatio: 'Airport Exclusive',
    image: '/images/airport_vip_concierge.jpg',
    videoUrl: null,
    badgeText: 'Meet & Assist',
    badgeIcon: ConciergeBell,
    bottomBadges: [
      { icon: Shield, label: 'Priority Fast-Track Immigration' },
      { icon: Luggage, label: 'Dedicated Luggage Porter' }
    ],
    features: [
      'Personal concierge agent greeting at airport curb or flight arrival gate',
      'Priority fast-track passport control & diplomatic security queue bypass',
      'Private electric terminal buggy transfer directly to departure gate',
      'Dedicated baggage porter for seamless check-in & luggage handling',
      'Private VIP tarmac chauffeur escort directly to aircraft boarding stairs',
      'Seamless transit assist & express customs clearing at 250+ global airports'
    ]
  },
  {
    id: 'lounge',
    name: 'VIP Airport Lounge',
    category: 'Airport Ground Service',
    subtitle: 'A La Carte Dining, Private Rest Suites, Spa & Sommelier Bar',
    priceRatio: 'Premium Relaxation',
    image: '/images/airport_vip_lounge.jpg',
    videoUrl: null,
    badgeText: 'Airport VIP',
    badgeIcon: Coffee,
    bottomBadges: [
      { icon: Wine, label: 'Sommelier Wine & Dining Bar' },
      { icon: Sparkles, label: 'Complimentary Spa & Shower Suites' }
    ],
    features: [
      'A la carte dining menu, live sushi station & open bar with premium spirits',
      'Private shower suites with plush luxury towels & bath amenities',
      'Complimentary 30-minute pre-flight neck & shoulder spa massage',
      'Soundproof executive nap pods & private high-speed workstation booths',
      'Flight monitoring concierge with direct lounge-to-gate priority boarding',
      'Quiet relaxation zones, wireless phone chargers & high-speed Wi-Fi'
    ]
  },
  {
    id: 'business',
    name: 'Business Suite',
    category: 'In-Flight Luxury',
    subtitle: '1-2-1 Direct Aisle Access & 180° Lie-Flat Massage Seats',
    priceRatio: 'Executive Preferred',
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
    videoUrl: null,
    badgeText: 'Business Cabin',
    badgeIcon: Armchair,
    bottomBadges: [
      { icon: Armchair, label: '180° Lie-Flat Massage Seat' },
      { icon: Wifi, label: 'In-Flight Workspace & Power' }
    ],
    features: [
      '180-degree lie-flat ergonomic seat with built-in massage controls',
      'Direct aisle access for all suite occupants with privacy partitions',
      'Dine anytime on-demand menu featuring chef-curated regional meals',
      'Noise-canceling Bose headsets & 18-inch HD touchscreen monitor',
      'Priority check-in desks & access to global airline business lounges',
      'Fast-track security pass & priority baggage tagging upon arrival'
    ]
  },
  {
    id: 'private',
    name: 'Private Jet Charter',
    category: 'Private Aviation',
    subtitle: 'Bespoke Point-to-Point Gulfstream & Bombardier Aviation',
    priceRatio: 'VIP Charter',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    videoUrl: null,
    badgeText: 'Private Jet',
    badgeIcon: Shield,
    bottomBadges: [
      { icon: Shield, label: 'Zero Public Lines & Private FBO' },
      { icon: Utensils, label: 'Custom Catering & Vintage Champagne' }
    ],
    features: [
      'Depart within 2 hours notice from private FBO terminal facilities',
      'Zero public TSA lines — private customs clearing & immediate boarding',
      'Bespoke catering menu, vintage champagne bar & pet-friendly cabins',
      'Direct flight access to over 3,000 regional & private airports globally',
      'Dedicated private flight captain, stewardess & valet service',
      'Customized flight schedule tailored 100% to your itinerary'
    ]
  }
];

export const CabinShowcase = () => {
  const [activeTab, setActiveTab] = useState(CABIN_CLASSES[0]);
  const [preview360, setPreview360] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="cabin-showcase" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden border-y border-slate-200">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Unmatched Aviation & Airport VIP Services
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Explore Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900">Luxury Cabins & Airport Concierge</span>
          </h2>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            Switch between luxury suite cabins and airport ground services to preview private residence beds, VIP meet & assist, lounge dining, and fast-track clearance.
          </p>
        </div>

        {/* TABS SWITCHER */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {CABIN_CLASSES.map((cabin) => {
            const Icon = cabin.badgeIcon;
            return (
              <button
                key={cabin.id}
                onClick={() => {
                  setActiveTab(cabin);
                  setPreview360(false);
                }}
                className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 ${
                  activeTab.id === cabin.id
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-md shadow-indigo-500/30 scale-105 border border-indigo-400 font-black'
                    : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cabin.name}
              </button>
            );
          })}
        </div>

        {/* ACTIVE TAB DISPLAY AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
          
          {/* LEFT CONTENT DETAILS (COL 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black uppercase tracking-wider inline-block">
                  {activeTab.priceRatio}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase">
                  {activeTab.category}
                </span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">{activeTab.name}</h3>
              <p className="text-xs text-indigo-700 font-semibold mb-6 leading-relaxed">{activeTab.subtitle}</p>

              {/* AMENITY FEATURES LIST */}
              <div className="space-y-3 mb-8">
                {activeTab.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setPreview360(!preview360)}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4 text-amber-600" />
                <span>{preview360 ? 'Standard View' : 'Interactive 360° View'}</span>
              </button>
              <button
                onClick={() => {
                  const searchEl = document.getElementById('search-widget');
                  if (searchEl) searchEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform shadow-md"
              >
                Book {activeTab.name}
              </button>
            </div>
          </div>

          {/* RIGHT MEDIA DISPLAY (COL 7) */}
          <div className="lg:col-span-7 relative h-80 sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 group shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id + (preview360 ? '-360' : '')}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full relative cursor-pointer"
                onClick={() => setModalOpen(true)}
              >
                <img
                  src={activeTab.image}
                  alt={activeTab.name}
                  className={`w-full h-full object-cover transition-transform duration-1000 ${preview360 ? 'scale-110 filter brightness-105 contrast-105' : 'group-hover:scale-105'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                {preview360 && (
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase animate-pulse shadow-md flex items-center gap-2">
                    <span>🔄 Interactive Panorama View Active</span>
                  </div>
                )}

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200 text-xs text-slate-800 font-bold flex items-center gap-1.5 shadow-sm">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Click to Expand</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 text-slate-900 shadow-md">
                  {activeTab.bottomBadges.map((bBadge, bIdx) => {
                    const BIcon = bBadge.icon;
                    return (
                      <div key={bIdx} className="flex items-center gap-2.5">
                        <BIcon className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-slate-800">{bBadge.label}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE & DETAILS MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center overflow-y-auto pt-20 sm:pt-24 pb-12"
            onClick={() => setModalOpen(false)}
          >
            <div 
              className="relative max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-72 md:h-[480px]">
                  <img
                    src={activeTab.image}
                    alt={activeTab.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                      {activeTab.priceRatio}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-3 mb-2">{activeTab.name}</h3>
                    <p className="text-xs text-amber-300 font-semibold mb-6">{activeTab.subtitle}</p>

                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Included Features & Services</h4>
                    <div className="space-y-2.5 mb-6">
                      {activeTab.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 font-medium">
                          <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setModalOpen(false);
                      const searchEl = document.getElementById('search-widget');
                      if (searchEl) searchEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:opacity-95 transition-opacity"
                  >
                    Book {activeTab.name} Flight & Airport Package
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

