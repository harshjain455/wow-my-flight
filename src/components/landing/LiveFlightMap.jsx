import React, { useState, useEffect } from 'react';
import { Plane, Radio, Globe, Compass, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const LIVE_ROUTES = [
  { from: 'JFK (New York)', to: 'LHR (London)', status: 'In Air', flight: 'WMF 101', progress: '68%', altitude: '38,000 FT', speed: '560 MPH' },
  { from: 'DXB (Dubai)', to: 'SIN (Singapore)', status: 'Boarding', flight: 'WMF 704', progress: '12%', altitude: 'Ground', speed: '0 MPH' },
  { from: 'HND (Tokyo)', to: 'LAX (Los Angeles)', status: 'Cruising', flight: 'WMF 888', progress: '45%', altitude: '41,000 FT', speed: '610 MPH' },
  { from: 'CDG (Paris)', to: 'DXB (Dubai)', status: 'Approaching', flight: 'WMF 302', progress: '92%', altitude: '12,000 FT', speed: '280 MPH' }
];

export const LiveFlightMap = () => {
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveRouteIndex((prev) => (prev + 1) % LIVE_ROUTES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const activeRoute = LIVE_ROUTES[activeRouteIndex];

  return (
    <section id="live-routes" className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
              Live Radar Telemetry Feed
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Real-Time Global <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900">Flight Route Network</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600 font-mono font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> 142 Aircrafts Live</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Sabre GDS Synced</span>
          </div>
        </div>

        {/* MAP CONTAINER & OVERLAY INFO */}
        <div className="relative rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-10 shadow-xl overflow-hidden min-h-[460px] flex flex-col justify-between">
          
          {/* SVG WORLD MAP STYLIZED BACKGROUND */}
          <div className="absolute inset-0 z-0 opacity-15 flex items-center justify-center pointer-events-none overflow-hidden">
            <svg className="w-full h-full text-indigo-900" viewBox="0 0 1000 500" fill="currentColor">
              {/* World outline dots */}
              <circle cx="200" cy="180" r="2" />
              <circle cx="250" cy="200" r="2.5" />
              <circle cx="300" cy="150" r="2" />
              <circle cx="480" cy="160" r="3" />
              <circle cx="520" cy="180" r="2.5" />
              <circle cx="700" cy="220" r="2.5" />
              <circle cx="780" cy="260" r="2" />
              <circle cx="850" cy="320" r="2.5" />
            </svg>
          </div>

          {/* GLOWING ANIMATED SVG FLIGHT PATHS */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1000 500">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#D97706" stopOpacity="1" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.9" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* CURVED FLIGHT PATH 1 (JFK to LHR) */}
              <path
                d="M 220,180 Q 360,90 500,160"
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="3"
                strokeDasharray="6 6"
                filter="url(#glow)"
                className="animate-pulse"
              />

              {/* CURVED FLIGHT PATH 2 (LHR to DXB) */}
              <path
                d="M 500,160 Q 580,240 660,220"
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="3"
                strokeDasharray="4 4"
                filter="url(#glow)"
              />

              {/* CURVED FLIGHT PATH 3 (DXB to HND) */}
              <path
                d="M 660,220 Q 750,150 840,200"
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="3"
                filter="url(#glow)"
              />

              {/* HUB NODES */}
              {[
                { cx: 220, cy: 180, label: 'JFK' },
                { cx: 500, cy: 160, label: 'LHR' },
                { cx: 660, cy: 220, label: 'DXB' },
                { cx: 840, cy: 200, label: 'HND' }
              ].map((node, i) => (
                <g key={i}>
                  <circle cx={node.cx} cy={node.cy} r="6" fill="#D97706" className="animate-ping opacity-75" />
                  <circle cx={node.cx} cy={node.cy} r="4" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={node.cx} y={node.cy - 12} fill="#0F172A" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* TOP CONTROLS & LIVE STATS BAR */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <Plane className="w-5 h-5 -rotate-45" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Active Telemetry</span>
                <span className="text-sm font-black text-slate-900 font-mono">{activeRoute.flight}: {activeRoute.from} ✈️ {activeRoute.to}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-700 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Status</span>
                <span className="font-extrabold text-emerald-600">{activeRoute.status}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Altitude</span>
                <span className="font-extrabold text-amber-700">{activeRoute.altitude}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Airspeed</span>
                <span className="font-extrabold text-indigo-700">{activeRoute.speed}</span>
              </div>
            </div>
          </div>

          {/* BOTTOM LIVE CAROUSEL TILES */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {LIVE_ROUTES.map((route, idx) => (
              <div
                key={idx}
                onClick={() => setActiveRouteIndex(idx)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  activeRouteIndex === idx
                    ? 'bg-indigo-50 border-indigo-300 shadow-md scale-105'
                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black font-mono text-slate-900">{route.flight}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    route.status === 'In Air' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {route.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">{route.from} → {route.to}</p>
                
                {/* PROGRESS BAR */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: route.progress }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
