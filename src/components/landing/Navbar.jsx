import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Compass, Award, Shield, PhoneCall, Globe, Menu, X, ArrowRight, User } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState('USD ($)');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 py-3 shadow-md shadow-slate-200/50'
          : 'bg-gradient-to-b from-white/90 via-white/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <div
            onClick={() => navigate('/landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900 font-sans">
                  WOW MY FLIGHT
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black tracking-widest text-amber-700 uppercase bg-amber-100 border border-amber-300 rounded-md">
                  LUXURY
                </span>
              </div>
              <p className="text-[10px] text-indigo-700 tracking-widest uppercase font-extrabold">
                Travel Agency CRM & Flight Engine
              </p>
            </div>
          </div>

          {/* DESKTOP NAV LINKS (CLEAN WHITE GLASS PILL) */}
          <nav className="hidden lg:flex items-center gap-8 bg-slate-100/80 backdrop-blur-md border border-slate-200/80 px-6 py-2.5 rounded-full shadow-sm">
            <button
              onClick={() => scrollToSection('search-widget')}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Book Flights
            </button>
            <button
              onClick={() => scrollToSection('popular-destinations')}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Destinations
            </button>
            <button
              onClick={() => scrollToSection('cabin-showcase')}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Cabins
            </button>
            <button
              onClick={() => scrollToSection('live-routes')}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Live Map
            </button>
            <button
              onClick={() => scrollToSection('social-proof')}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Reviews
            </button>
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="hidden sm:flex items-center gap-4">
            
            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100/90 border border-slate-200 px-3 py-1.5 rounded-xl">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="USD ($)" className="bg-white text-slate-900">USD ($)</option>
                <option value="EUR (€)" className="bg-white text-slate-900">EUR (€)</option>
                <option value="GBP (£)" className="bg-white text-slate-900">GBP (£)</option>
                <option value="AED (د.إ)" className="bg-white text-slate-900">AED (د.إ)</option>
              </select>
            </div>

            {/* Login Button */}
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 flex items-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              CRM Sign In
            </button>

            {/* CTA Button */}
            <button
              onClick={() => scrollToSection('search-widget')}
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-500/30 hover:shadow-indigo-600/40 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Reserve Flight</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 px-4 pt-4 pb-6 bg-white/95 backdrop-blur-2xl border-b border-slate-200 flex flex-col gap-4 shadow-xl">
          <button
            onClick={() => scrollToSection('search-widget')}
            className="text-left font-bold text-sm text-slate-800 hover:text-indigo-600 py-2 border-b border-slate-100"
          >
            ✈️ Book Flights
          </button>
          <button
            onClick={() => scrollToSection('popular-destinations')}
            className="text-left font-bold text-sm text-slate-800 hover:text-indigo-600 py-2 border-b border-slate-100"
          >
            🌍 Popular Destinations
          </button>
          <button
            onClick={() => scrollToSection('cabin-showcase')}
            className="text-left font-bold text-sm text-slate-800 hover:text-indigo-600 py-2 border-b border-slate-100"
          >
            🛋️ Luxury Cabin Classes
          </button>
          <button
            onClick={() => scrollToSection('live-routes')}
            className="text-left font-bold text-sm text-slate-800 hover:text-indigo-600 py-2 border-b border-slate-100"
          >
            🗺️ Live Global Routes
          </button>
          <button
            onClick={() => scrollToSection('social-proof')}
            className="text-left font-bold text-sm text-slate-800 hover:text-indigo-600 py-2 border-b border-slate-100"
          >
            ⭐ VIP Reviews
          </button>
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-slate-800 hover:text-indigo-600 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-indigo-600" />
              Sign In to CRM
            </button>
            <button
              onClick={() => scrollToSection('search-widget')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-xs"
            >
              Reserve Flight
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
