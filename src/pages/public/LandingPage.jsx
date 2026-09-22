import React from 'react';
import { Navbar } from '../../components/landing/Navbar';
import { HeroSection } from '../../components/landing/HeroSection';
import { PopularDestinations } from '../../components/landing/PopularDestinations';
import { CabinShowcase } from '../../components/landing/CabinShowcase';
import { LiveFlightMap } from '../../components/landing/LiveFlightMap';
import { SocialProof } from '../../components/landing/SocialProof';
import { LeadCaptureFooter } from '../../components/landing/LeadCaptureFooter';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-600 selection:text-white overflow-x-hidden">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION WITH VIDEO & SEARCH ENGINE */}
      <HeroSection />

      {/* POPULAR DESTINATIONS GRID */}
      <PopularDestinations />

      {/* CABIN CLASS SHOWCASE */}
      <CabinShowcase />

      {/* LIVE ROUTE TELEMETRY MAP */}
      <LiveFlightMap />

      {/* SOCIAL PROOF & AIRLINE MARQUEE */}
      <SocialProof />

      {/* LEAD CAPTURE & FOOTER */}
      <LeadCaptureFooter />
    </div>
  );
};

export default LandingPage;
