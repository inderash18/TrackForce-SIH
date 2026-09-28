import React from 'react';
import { Clock } from 'lucide-react';

export const AppPromotionSection: React.FC = () => {
  return (
    <section id="media-section" className="paimana-app-promo-section" aria-label="PAIMANA Mobile App Promotion">
      <div className="paimana-section-container">
        <div className="paimana-app-promo-card">
          {/* Left: Smartphone Mockup Artwork */}
          <div className="paimana-phone-mockup-wrapper" aria-hidden="true">
            <div className="paimana-phone-frame">
              <div className="paimana-phone-notch" />
              <div className="paimana-phone-screen">
                <div className="paimana-phone-app-header">
                  <div className="phone-brand">
                    <span className="phone-p">P</span>
                    <span>PAIMANA Mobile</span>
                  </div>
                  <span className="phone-badge">Live</span>
                </div>
                <div className="paimana-phone-widget">
                  <span className="widget-label">Central Sector Projects</span>
                  <div className="widget-number">1,981</div>
                  <div className="widget-bar">
                    <div className="bar-fill" style={{ width: '68%' }} />
                  </div>
                </div>
                <div className="paimana-phone-mini-cards">
                  <div className="mini-card green">
                    <span>On Track</span>
                    <strong>1,184</strong>
                  </div>
                  <div className="mini-card orange">
                    <span>Under Watch</span>
                    <strong>613</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Short Announcement */}
          <div className="paimana-app-promo-text">
            <div className="paimana-coming-soon-badge">
              <Clock size={12} /> Coming Soon
            </div>
            <h3 className="paimana-app-promo-title">
              PAIMANA Mobile Intelligence on Google Play & iOS
            </h3>
            <p className="paimana-app-promo-desc">
              Discover your new favorite spaces and real-time infrastructure surveillance on your mobile device. Instant milestone alerts, geolocated project tracking, and executive flash dossiers.
            </p>
            <div className="paimana-app-promo-credit">
              Designed & Developed by <strong>National e-Governance Division (NeGD)</strong> & <strong>IPMD, MoSPI</strong>
            </div>
          </div>

          {/* Right: Store Badges (Honest Coming Soon / Availability State) */}
          <div className="paimana-app-store-badges">
            {/* Google Play Badge */}
            <div className="paimana-store-badge-card" title="PAIMANA on Google Play (Coming Soon)">
              <div className="badge-icon-play">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.6 2.4C3.4 2.7 3.2 3.2 3.2 3.8V20.2C3.2 20.8 3.4 21.3 3.6 21.6L12.7 12L3.6 2.4Z" fill="#2196F3"/>
                  <path d="M16.4 8.3L12.7 12L16.4 15.7L19.4 14C20.3 13.5 20.3 12.5 19.4 12L16.4 8.3Z" fill="#FFC107"/>
                  <path d="M3.6 21.6L12.7 12L16.4 15.7L4.7 22.3C4.3 22.5 3.9 22.1 3.6 21.6Z" fill="#4CAF50"/>
                  <path d="M16.4 8.3L12.7 12L3.6 2.4C3.9 1.9 4.3 1.5 4.7 1.7L16.4 8.3Z" fill="#F44336"/>
                </svg>
              </div>
              <div className="badge-text">
                <span className="badge-sub">GET IT ON</span>
                <span className="badge-main">Google Play</span>
                <span className="badge-tag">Coming Soon</span>
              </div>
            </div>

            {/* Apple App Store Badge */}
            <div className="paimana-store-badge-card" title="PAIMANA on Apple App Store (Coming Soon)">
              <div className="badge-icon-apple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.46 8.88 17.65 9.94 17.67 12.16C17.7 14.81 19.98 15.7 20.08 15.74C20.05 15.84 19.71 17.03 18.71 19.5ZM15.03 4.54C15.68 3.75 16.12 2.65 16 1.55C15.05 1.59 13.91 2.19 13.23 2.98C12.63 3.68 12.11 4.8 12.25 5.88C13.31 5.96 14.38 5.33 15.03 4.54Z"/>
                </svg>
              </div>
              <div className="badge-text">
                <span className="badge-sub">Download on the</span>
                <span className="badge-main">App Store</span>
                <span className="badge-tag">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
