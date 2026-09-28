import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useApp } from '../../context/AppContext';
const HERO_SLIDES = [
    {
        id: 1,
        image: '/images/hero_expressway.jpg',
        alt: 'Modern multi-lane National Highway and Expressway corridor in India',
        tag: 'National Highways & Expressways',
        sector: 'Road Transport & Highways',
        title: 'Central Sector Infrastructure Projects Costing Rs. 150 crore & above',
        subtitle: 'Comprehensive milestone monitoring, physical progress tracking, and proactive bottleneck resolution across 840+ national highway packages.'
    },
    {
        id: 2,
        image: '/images/hero_railway.jpg',
        alt: 'High-speed Dedicated Freight Corridor and electric rail network in India',
        tag: 'Railways & Dedicated Freight Corridors',
        sector: 'Ministry of Railways',
        title: 'Central Sector Infrastructure Projects Costing Rs. 150 crore & above',
        subtitle: 'Integrated surveillance of high-density rail links, bridge superstructures, and metro rail expansion corridors.'
    },
    {
        id: 3,
        image: '/images/hero_port.jpg',
        alt: 'Modern deep-water container terminal and maritime port logistics facility',
        tag: 'Sagarmala & Mega Deep-Water Ports',
        sector: 'Ports, Shipping & Waterways',
        title: 'Central Sector Infrastructure Projects Costing Rs. 150 crore & above',
        subtitle: 'Port modernization, coastal connectivity projects, and multi-modal logistics hub development.'
    },
    {
        id: 4,
        image: '/images/hero_solar.jpg',
        alt: 'Ultra mega solar power park and clean renewable energy transmission grid',
        tag: 'Clean Energy & Green Hydrogen Infrastructure',
        sector: 'Power & Renewable Energy',
        title: 'Central Sector Infrastructure Projects Costing Rs. 150 crore & above',
        subtitle: 'Accelerating green grid integration, thermal capacity expansion, and high-voltage transmission lines.'
    }
];
export const HeroCarousel = () => {
    const { navigateTo } = useApp();
    const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState({});
    const timerRef = useRef(null);
    useEffect(() => {
        if (isPlaying && !isHovered && !prefersReducedMotion) {
            timerRef.current = window.setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
            }, 5500);
        }
        return () => {
            if (timerRef.current)
                clearInterval(timerRef.current);
        };
    }, [isPlaying, isHovered, prefersReducedMotion]);
    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    };
    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    };
    const handleSlideSelect = (idx) => {
        setCurrentIndex(idx);
    };
    const togglePlay = () => {
        setIsPlaying((prev) => !prev);
    };
    const currentSlide = HERO_SLIDES[currentIndex];
    return (<section className="paimana-hero-root" aria-label="Infrastructure Photographic Showcase Carousel" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onFocus={() => setIsHovered(true)} onBlur={() => setIsHovered(false)}>
      <div className="paimana-hero-container">
        {/* Slides Track */}
        <div className="paimana-hero-track">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const hasError = imageError[slide.id];
            return (<div key={slide.id} className={`paimana-hero-slide ${isActive ? 'active' : ''}`} aria-hidden={!isActive}>
                {/* Photographic Background */}
                {!hasError ? (<img src={slide.image} alt={slide.alt} className="paimana-hero-image" loading={idx === 0 ? 'eager' : 'lazy'} onError={() => {
                        setImageError((prev) => ({ ...prev, [slide.id]: true }));
                    }}/>) : (<div className="paimana-hero-fallback-bg">
                    <div className="paimana-hero-fallback-grid"></div>
                  </div>)}

                {/* Subtle dark gradient overlay */}
                <div className="paimana-hero-overlay" aria-hidden="true"/>
              </div>);
        })}
        </div>

        {/* Centered Translucent Dark Caption Container */}
        <div className="paimana-hero-caption-wrapper">
          <div className="paimana-hero-caption-box">
            <span className="paimana-hero-tag">
              {currentSlide.tag}
            </span>

            <h2 className="paimana-hero-heading">
              {currentSlide.title}
            </h2>

            <p className="paimana-hero-subtitle">
              {currentSlide.subtitle}
            </p>

            <div className="paimana-hero-actions">
              <button type="button" className="paimana-hero-btn-primary" onClick={() => navigateTo('dashboard')}>
                Explore Public Dashboard
              </button>
              <button type="button" className="paimana-hero-btn-secondary" onClick={() => navigateTo('projects')}>
                Browse Projects Inventory
              </button>
            </div>
          </div>
        </div>

        {/* Previous Navigation Button */}
        <button type="button" className="paimana-hero-nav-btn prev" onClick={handlePrev} aria-label="Previous Slide" title="Previous Slide">
          <ChevronLeft size={24}/>
        </button>

        {/* Next Navigation Button */}
        <button type="button" className="paimana-hero-nav-btn next" onClick={handleNext} aria-label="Next Slide" title="Next Slide">
          <ChevronRight size={24}/>
        </button>

        {/* Bottom Pagination Dots & Pause/Play Control */}
        <div className="paimana-hero-controls-bar">
          <div className="paimana-hero-dots" role="tablist" aria-label="Slide Selector">
            {HERO_SLIDES.map((slide, idx) => (<button key={slide.id} type="button" role="tab" aria-selected={idx === currentIndex} aria-label={`Go to slide ${idx + 1}: ${slide.tag}`} className={`paimana-hero-dot ${idx === currentIndex ? 'active' : ''}`} onClick={() => handleSlideSelect(idx)}/>))}
          </div>

          <button type="button" className="paimana-hero-playpause" onClick={togglePlay} aria-label={isPlaying ? 'Pause Autoplay' : 'Start Autoplay'} title={isPlaying ? 'Pause Slides' : 'Play Slides'}>
            {isPlaying ? <Pause size={13}/> : <Play size={13}/>}
          </button>
        </div>
      </div>
    </section>);
};
