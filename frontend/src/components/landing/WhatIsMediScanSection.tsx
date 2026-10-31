import React from 'react';
import './WhatIsMediScanSection.css';

export const WhatIsMediScanSection: React.FC = () => {
  return (
    <section id="what-is-mediscan" className="what-is-section" aria-label="What is MediScan AI">
      <div className="container what-is-section__container">
        <div className="what-is-card">
          {/* Left Column: Heading & Descriptive Copy */}
          <div className="what-is-card__content">
            <h2 className="what-is-card__title">
              What is <span className="what-is-card__brand-highlight">MediScan AI?</span>
            </h2>
            <p className="what-is-card__description">
              A platform that organizes medical-image screening into structured, easy-to-follow workflows, from image upload to clear, structured results.
            </p>
          </div>

          {/* Right Column: Visual Graphic (Upload -> Workstation -> Structured Findings) */}
          <div className="what-is-card__visual" aria-hidden="true">
            {/* Ambient background glow */}
            <div className="what-is-card__glow" />

            {/* Floating Upload Node */}
            <div className="what-is-node what-is-node--upload">
              <div className="what-is-node__icon-wrap">
                <svg className="what-is-node__icon" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m8 16 4-4 4 4" />
                </svg>
              </div>
            </div>

            {/* Dashed connector line to workstation */}
            <svg className="what-is-connector what-is-connector--left" viewBox="0 0 100 60" fill="none">
              <path d="M 10 30 Q 55 10 90 30" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 4" />
            </svg>

            {/* Central Workstation / Device Graphic */}
            <div className="what-is-workstation">
              {/* Header Bar */}
              <div className="what-is-workstation__header">
                <div className="what-is-workstation__dots">
                  <span className="what-is-workstation__dot" />
                  <span className="what-is-workstation__dot" />
                  <span className="what-is-workstation__dot" />
                </div>
                <div className="what-is-workstation__bar" />
              </div>

              {/* Workstation Body */}
              <div className="what-is-workstation__body">
                {/* Left Mini Sidebar */}
                <div className="what-is-workstation__sidebar">
                  <div className="what-is-workstation__thumb-active" />
                  <div className="what-is-workstation__thumb" />
                  <div className="what-is-workstation__thumb" />
                </div>

                {/* Main Screening Viewport */}
                <div className="what-is-workstation__screen">
                  <img
                    src="/assets/example-chest-xray.png"
                    alt=""
                    className="what-is-workstation__img"
                  />
                  <div className="what-is-workstation__overlay-reticle" />
                </div>
              </div>
            </div>

            {/* Dashed connector line to findings */}
            <svg className="what-is-connector what-is-connector--right" viewBox="0 0 100 60" fill="none">
              <path d="M 10 30 Q 55 50 90 30" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 4" />
            </svg>

            {/* Floating Structured Results / Report Node */}
            <div className="what-is-node what-is-node--results">
              <div className="what-is-node__doc">
                <svg className="what-is-node__doc-icon" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <div className="what-is-node__badge-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsMediScanSection;
