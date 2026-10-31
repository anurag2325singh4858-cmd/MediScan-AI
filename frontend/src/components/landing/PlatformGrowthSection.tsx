import React from 'react';
import './PlatformGrowthSection.css';

export const PlatformGrowthSection: React.FC = () => {
  return (
    <section id="growth" className="growth-section" aria-label="A Platform Designed to Grow">
      <div className="container growth-section__container">
        <div className="growth-card">
          {/* Left Column: Heading & Descriptive Copy */}
          <div className="growth-card__content">
            <h2 className="growth-card__title">
              A Platform <span className="growth-card__title-accent">Designed to Grow</span>
            </h2>
            <p className="growth-card__description">
              Starting with chest X-ray and retinal fundus workflows, MediScan AI is designed to accommodate additional medical imaging applications over time.
            </p>
          </div>

          {/* Right Column: Workflow Modality Badges (Current vs. Future) */}
          <div className="growth-card__modalities" aria-label="Screening Modality Status">
            {/* Group 1: Currently Implemented Workflows */}
            <div className="growth-card__group growth-card__group--current">
              {/* Chest X-ray */}
              <div className="growth-modality-badge growth-modality-badge--tb">
                <div className="growth-modality-badge__icon-wrap growth-modality-badge__icon-wrap--tb">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3v18m0-18C10 3 6 4 4 8c-2 4-1 9 1 12 1.5 2.25 4 2 7-1m0-19c2 0 6 1 8 5 2 4 1 9-1 12-1.5 2.25-4 2-7-1" />
                  </svg>
                </div>
                <div className="growth-modality-badge__info">
                  <span className="growth-modality-badge__name">Chest X-ray</span>
                  <span className="growth-modality-badge__status growth-modality-badge__status--tb">(Current)</span>
                </div>
              </div>

              {/* Retinal Fundus */}
              <div className="growth-modality-badge growth-modality-badge--dr">
                <div className="growth-modality-badge__icon-wrap growth-modality-badge__icon-wrap--dr">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                  </svg>
                </div>
                <div className="growth-modality-badge__info">
                  <span className="growth-modality-badge__name">Retinal Fundus</span>
                  <span className="growth-modality-badge__status growth-modality-badge__status--dr">(Current)</span>
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="growth-card__divider" aria-hidden="true" />

            {/* Group 2: Future Possibilities */}
            <div className="growth-card__group growth-card__group--future">
              {/* Brain Scan */}
              <div className="growth-modality-badge growth-modality-badge--future">
                <div className="growth-modality-badge__icon-wrap growth-modality-badge__icon-wrap--future">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04" />
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04" />
                  </svg>
                </div>
                <div className="growth-modality-badge__info">
                  <span className="growth-modality-badge__name">Brain Scan</span>
                  <span className="growth-modality-badge__status growth-modality-badge__status--future">(Future)</span>
                </div>
              </div>

              {/* Bone X-ray */}
              <div className="growth-modality-badge growth-modality-badge--future">
                <div className="growth-modality-badge__icon-wrap growth-modality-badge__icon-wrap--future">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3" />
                    <path d="M19 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <div className="growth-modality-badge__info">
                  <span className="growth-modality-badge__name">Bone X-ray</span>
                  <span className="growth-modality-badge__status growth-modality-badge__status--future">(Future)</span>
                </div>
              </div>

              {/* More */}
              <div className="growth-modality-badge growth-modality-badge--future">
                <div className="growth-modality-badge__icon-wrap growth-modality-badge__icon-wrap--future">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <div className="growth-modality-badge__info">
                  <span className="growth-modality-badge__name">More</span>
                  <span className="growth-modality-badge__status growth-modality-badge__status--future">(Future)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformGrowthSection;
