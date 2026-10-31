import React from 'react';
import './PlatformOverviewSection.css';

export const PlatformOverviewSection: React.FC = () => {
  return (
    <section className="platform-overview" id="platform-overview" aria-label="Medical Imaging Platform Overview">
      {/* Decorative ambient background wave glow */}
      <div className="platform-overview__ambient" aria-hidden="true" />

      <div className="container platform-overview__container">
        
        {/* Section Header */}
        <div className="platform-overview__header">
          <h2 className="platform-overview__title">
            Medical Imaging. <span className="platform-overview__title-accent">Clearer Insights.</span>
          </h2>
          <p className="platform-overview__subtitle">
            Explore structured image-screening workflows, with room to expand to more medical imaging applications.
          </p>
        </div>

        {/* Central Explanatory Flow Composition */}
        <div className="platform-overview__flow" aria-hidden="true">
          
          {/* Left Branch: Chest X-ray Tile */}
          <div className="platform-overview__branch platform-overview__branch--tb">
            <div className="platform-overview__image-card platform-overview__image-card--tb">
              <img
                src="/assets/example-chest-xray.png"
                alt="Chest X-ray Radiograph"
                className="platform-overview__image"
              />
            </div>
            
            <div className="platform-overview__branch-info platform-overview__branch-info--tb">
              <div className="platform-overview__branch-icon platform-overview__branch-icon--tb">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18m0-18C10 3 6 4 4 8c-2 4-1 9 1 12 1.5 2.25 4 2 7-1m0-19c2 0 6 1 8 5 2 4 1 9-1 12-1.5 2.25-4 2-7-1" />
                </svg>
              </div>
              <div className="platform-overview__branch-text">
                <span className="platform-overview__branch-name">Chest X-ray</span>
                <span className="platform-overview__branch-sub">(TB Screening)</span>
              </div>
            </div>

            <div className="platform-overview__line platform-overview__line--tb">
              <span className="platform-overview__dot platform-overview__dot--tb" />
            </div>
          </div>

          {/* Central Core Hub Node */}
          <div className="platform-overview__hub">
            <div className="platform-overview__hub-logo">
              <svg viewBox="0 0 54 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hubLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E40AF" />
                    <stop offset="25%" stopColor="#0284C7" />
                    <stop offset="50%" stopColor="#38BDF8" />
                    <stop offset="75%" stopColor="#FB7185" />
                    <stop offset="100%" stopColor="#FF5A36" />
                  </linearGradient>
                </defs>
                <path
                  d="M 8 30 L 8 16 C 8 8, 12 5, 17 5 C 22 5, 24.5 18, 27 24 C 29.5 18, 32 5, 37 5 C 42 5, 46 8, 46 16 L 46 30"
                  stroke="url(#hubLogoGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="platform-overview__hub-title">
              <span className="platform-overview__hub-brand">MediScan </span>
              <span className="platform-overview__hub-ai">AI</span>
            </span>
          </div>

          {/* Right Branch: Retinal Fundus Tile */}
          <div className="platform-overview__branch platform-overview__branch--dr">
            <div className="platform-overview__line platform-overview__line--dr">
              <span className="platform-overview__dot platform-overview__dot--dr" />
            </div>

            <div className="platform-overview__branch-info platform-overview__branch-info--dr">
              <div className="platform-overview__branch-icon platform-overview__branch-icon--dr">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                </svg>
              </div>
              <div className="platform-overview__branch-text">
                <span className="platform-overview__branch-name">Retinal Fundus</span>
                <span className="platform-overview__branch-sub">(DR Screening)</span>
              </div>
            </div>

            <div className="platform-overview__image-card platform-overview__image-card--dr">
              <img
                src="/assets/example-retinal-fundus.png"
                alt="Retinal Fundus Photograph"
                className="platform-overview__image"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PlatformOverviewSection;
