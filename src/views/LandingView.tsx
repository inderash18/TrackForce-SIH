import React, { useState } from 'react';
import { PaimanaHeader } from '../components/paimana/PaimanaHeader';
import { HeroCarousel } from '../components/paimana/HeroCarousel';
import { SectorSummariesSection } from '../components/paimana/SectorSummariesSection';
import { HighValueProjectsShowcase } from '../components/paimana/HighValueProjectsShowcase';
import { WhatsNewSection } from '../components/paimana/WhatsNewSection';
import { PaimanaFooter } from '../components/paimana/PaimanaFooter';

export const LandingView: React.FC = () => {
  const [fontSizeAdjustment, setFontSizeAdjustment] = useState<number>(0);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  return (
    <div
      className={`paimana-portal-wrapper ${isHighContrast ? 'high-contrast-mode' : ''}`}
      style={{
        fontSize: fontSizeAdjustment !== 0 ? `calc(14px + ${fontSizeAdjustment}px)` : undefined
      }}
    >
      {/* 3-Layer Government Header */}
      <PaimanaHeader
        fontSizeAdjustment={fontSizeAdjustment}
        setFontSizeAdjustment={setFontSizeAdjustment}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
      />

      {/* Main Page Content Landmark */}
      <main id="main-content" tabIndex={-1}>
        {/* Full-Width Infrastructure Photographic Hero Carousel */}
        <HeroCarousel />

        {/* Macro Infrastructure Metrics & Sector Summary Cards */}
        <SectorSummariesSection />

        {/* Pale Blue High-Value Project Showcase (3-card grid / carousel) */}
        <HighValueProjectsShowcase />

        {/* What's New & Monthly Flash Reports Publications */}
        <WhatsNewSection />
      </main>

      {/* Institutional Footer */}
      <PaimanaFooter />
    </div>
  );
};
