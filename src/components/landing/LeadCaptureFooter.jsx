import React, { useState } from 'react';
import { Plane, Mail, Send, CheckCircle, Shield, Globe, Phone, Clock, ArrowRight, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../../services/dbService';

export const LeadCaptureFooter = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);

    try {
      await dbService.createLead({
        firstName: 'VIP Newsletter',
        lastName: 'Subscriber',
        email: email.trim(),
        phone: '+1 (800) 555-0100',
        nationality: 'International',
        preferredLanguage: 'English',
        serviceId: 'first_class',
        status: 'New',
        source: 'Landing Page VIP Fare Alerts Newsletter',
        notes: 'Subscribed to VIP Private Fare Alerts & Confidential First Class Deals from Landing Page Footer.'
      });
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  return (
    <footer className="bg-slate-50 text-slate-900 pt-20 pb-12 border-t border-slate-200 relative overflow-hidden">
      
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* LEAD CAPTURE NEWSLETTER CARD WITH WHITE GLASS */}
        <div className="relative rounded-3xl p-8 sm:p-12 bg-white/90 backdrop-blur-2xl border border-slate-200 shadow-xl mb-20 overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* TEXT (COL 7) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                VIP Private Fare Alerts
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
                Subscribe for Confidential <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-indigo-600">First Class Deals</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Get instant notifications on unadvertised private jet empty legs, first-class suite price drops, and luxury boutique hotel vouchers.
              </p>
            </div>

            {/* FORM (COL 5) */}
            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold">Subscribed Successfully!</h4>
                    <p className="text-xs text-emerald-700">You will receive exclusive VIP fare alerts in your inbox.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      placeholder="Enter your executive email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-indigo-600/20"
                  >
                    <span>Get Fare Alerts</span>
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER LINKS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-200">
          
          {/* BRAND COL (COL 2) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => navigate('/landing')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/30">
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
            <p className="text-xs text-slate-600 max-w-sm mb-6 leading-relaxed">
              Premier luxury aviation marketplace for first class suite bookings, private jet charters, and 24/7 dedicated VIP air concierge.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors shadow-sm">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors shadow-sm">
                <Phone className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors shadow-sm">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors shadow-sm">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* COL 1: LUXURY CABINS */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 mb-4">
              Luxury Cabins
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li><a href="#cabin-showcase" className="hover:text-indigo-600 transition-colors">First Class Suites</a></li>
              <li><a href="#cabin-showcase" className="hover:text-indigo-600 transition-colors">Emirates Gamechanger</a></li>
              <li><a href="#cabin-showcase" className="hover:text-indigo-600 transition-colors">Singapore Airlines Suite</a></li>
              <li><a href="#cabin-showcase" className="hover:text-indigo-600 transition-colors">Qatar Airways Qsuite</a></li>
              <li><a href="#cabin-showcase" className="hover:text-indigo-600 transition-colors">Private Jet Charters</a></li>
            </ul>
          </div>

          {/* COL 2: TOP ROUTES */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 mb-4">
              Popular Routes
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li><a href="#popular-destinations" className="hover:text-indigo-600 transition-colors">New York (JFK) ✈️ London (LHR)</a></li>
              <li><a href="#popular-destinations" className="hover:text-indigo-600 transition-colors">Dubai (DXB) ✈️ Paris (CDG)</a></li>
              <li><a href="#popular-destinations" className="hover:text-indigo-600 transition-colors">Tokyo (HND) ✈️ Los Angeles (LAX)</a></li>
              <li><a href="#popular-destinations" className="hover:text-indigo-600 transition-colors">London (LHR) ✈️ Maldives (MLE)</a></li>
              <li><a href="#popular-destinations" className="hover:text-indigo-600 transition-colors">Sydney (SYD) ✈️ Singapore (SIN)</a></li>
            </ul>
          </div>

          {/* COL 3: CRM PORTAL ACCESS */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 mb-4">
              Agent & Staff Portal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li><button onClick={() => navigate('/login')} className="hover:text-amber-600 transition-colors">Staff Login</button></li>

              <li><button onClick={() => navigate('/public/intake')} className="hover:text-amber-600 transition-colors">Public Lead Registration</button></li>
              <li><button onClick={() => navigate('/super_admin/dashboard')} className="hover:text-amber-600 transition-colors">Super Admin Desk</button></li>
              <li><button onClick={() => navigate('/agent/dashboard')} className="hover:text-amber-600 transition-colors">Agent Sales Desk</button></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Wow My Flight Luxury Aviation. All rights reserved. Sabre GDS Accredited Agency.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Terms of VIP Service</a>
            <a href="#" className="hover:text-slate-800 transition-colors">GDS Guarantee</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
