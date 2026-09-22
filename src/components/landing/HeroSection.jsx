import React from 'react';
import { FlightSearch } from './FlightSearch';
import { Sparkles, Shield, Award, Star, Compass, Plane } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F8FAFC]">
      
      {/* HIGH VISIBILITY BACKGROUND AIRPORT VIDEO OVERLAY */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-105 contrast-105 opacity-75"
        >
          {/* Confirmed High Definition Airplane Landing & Flight Videos */}
          <source
            src="https://cdn.coverr.co/videos/coverr-airplane-landing-5178/1080p.mp4"
            type="video/mp4"
          />
          <source
            src="https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
          <source
            src="https://cdn.coverr.co/videos/coverr-plane-taking-off-5177/1080p.mp4"
            type="video/mp4"
          />
        </video>

        {/* ANIMATED AIRPORT RUNWAY & LANDING DESCENT GRAPHIC */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent pointer-events-none flex items-end justify-center overflow-hidden">
          {/* Glowing Runway Lights */}
          <div className="w-full max-w-4xl h-12 flex justify-between items-center px-8 opacity-40">
            <div className="flex gap-4">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            </div>
            <div className="h-0.5 flex-1 mx-8 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 border-b border-dashed border-indigo-400/50" />
            <div className="flex gap-4">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
          </div>
        </div>

        {/* LIGHT SOFT VIGNETTE MASK FOR WHITE THEME */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/55 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* ANIMATED GLIDING JET IN THE HERO SKY */}
      <motion.div
        initial={{ x: '-10%', y: 80, opacity: 0 }}
        animate={{ x: '110vw', y: 20, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 left-0 z-10 pointer-events-none text-indigo-600/80 drop-shadow-md"
      >
        <Plane className="w-12 h-12 rotate-[25deg]" />
      </motion.div>

      {/* HERO CONTENT HEADER */}
      <div className="relative z-10 max-w-5xl mx-auto text-center mb-12">
        
        {/* VIP BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-indigo-200 backdrop-blur-xl mb-6 shadow-md shadow-slate-200/50"
        >
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span className="text-xs font-extrabold tracking-widest text-indigo-900 uppercase">
            Ultra Luxury Aviation & Private Charters
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        </motion.div>

        {/* MAIN TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-none mb-6 font-sans drop-shadow-sm"
        >
          Elevate Your Journey to{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900">
            Unrivaled Heights
          </span>
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-xl text-slate-700 max-w-3xl mx-auto font-semibold leading-relaxed"
        >
          Experience bespoke First Class suites and private jet charters with instant GDS booking, dedicated 24/7 air concierge, and transparent luxury pricing.
        </motion.p>
      </div>

      {/* EMBEDDED FLOATING SEARCH ENGINE */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="w-full relative z-20"
      >
        <FlightSearch />
      </motion.div>

      {/* QUICK STATS CAROUSEL BELOW SEARCH */}
      <div className="relative z-10 max-w-5xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { label: 'Global Destinations', value: '500+ Hubs', icon: Compass },
          { label: '5-Star Partner Airlines', value: '85+ Carriers', icon: Award },
          { label: 'Client Satisfaction', value: '99.8% VIP', icon: Star },
          { label: 'Guaranteed Fare Price', value: '100% Best Rate', icon: Shield }
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 flex flex-col items-center justify-center group hover:bg-white transition-all shadow-sm hover:shadow-md"
          >
            <stat.icon className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-black text-slate-900 block">{stat.value}</span>
            <span className="text-xs text-slate-600 font-semibold">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
