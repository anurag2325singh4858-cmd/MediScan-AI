import React from 'react';
import './WorkflowsSection.css';

export const WorkflowsSection: React.FC = () => {
  return (
    <section className="workflows-section" id="workflows" aria-label="Two Imaging Workflows">
      <div className="container workflows-section__container">
        
        {/* Section Header */}
        <div className="workflows-section__header">
          <h2 className="workflows-section__title">
            Available <span className="workflows-section__title-accent">Screening Workflows</span>
          </h2>
        </div>

        {/* Side-by-Side Large Visual Cards */}
        <div className="workflows-section__grid">
          
          {/* Card 1: Tuberculosis Screening */}
          <div className="workflow-card workflow-card--tb">
            {/* Left: Glowing Blue Lung Illustration */}
            <div className="workflow-card__graphic-side" aria-hidden="true">
              <svg className="workflow-card__graphic-svg" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Trachea & Main Bronchi */}
                <path d="M 80 15 L 80 50 M 80 50 L 55 75 M 80 50 L 105 75" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                {/* Left Lung */}
                <path
                  d="M 40 45 C 60 35, 75 48, 75 80 C 75 115, 60 135, 35 130 C 18 125, 18 75, 40 45 Z"
                  fill="url(#tbLungGrad)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                {/* Right Lung */}
                <path
                  d="M 120 45 C 100 35, 85 48, 85 80 C 85 115, 100 135, 125 130 C 142 125, 142 75, 120 45 Z"
                  fill="url(#tbLungGrad)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                {/* Branching Bronchioles */}
                <path d="M 50 65 Q 65 75 60 90 M 42 85 Q 55 95 50 110" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 110 65 Q 95 75 100 90 M 118 85 Q 105 95 110 110" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
                
                <defs>
                  <linearGradient id="tbLungGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Right: Title & 3-Step Flow */}
            <div className="workflow-card__content-side">
              <h3 className="workflow-card__title">Tuberculosis Screening</h3>

              <div className="workflow-pipeline" role="list">
                {/* Step 1 */}
                <div className="workflow-pipeline__step" role="listitem">
                  <div className="workflow-pipeline__thumb">
                    <img src="/assets/example-chest-xray.png" alt="" className="workflow-pipeline__thumb-img" />
                  </div>
                  <span className="workflow-pipeline__label">Chest X-ray</span>
                </div>

                <span className="workflow-pipeline__arrow workflow-pipeline__arrow--tb" aria-hidden="true">→</span>

                {/* Step 2 */}
                <div className="workflow-pipeline__step" role="listitem">
                  <div className="workflow-pipeline__icon-box workflow-pipeline__icon-box--tb">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                  <span className="workflow-pipeline__label">Image Processing</span>
                </div>

                <span className="workflow-pipeline__arrow workflow-pipeline__arrow--tb" aria-hidden="true">→</span>

                {/* Step 3 */}
                <div className="workflow-pipeline__step" role="listitem">
                  <div className="workflow-pipeline__icon-box workflow-pipeline__icon-box--tb">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <span className="workflow-pipeline__label">Structured Results</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Diabetic Retinopathy Screening */}
          <div className="workflow-card workflow-card--dr">
            {/* Left: Glowing Orange Retina Illustration */}
            <div className="workflow-card__graphic-side" aria-hidden="true">
              <svg className="workflow-card__graphic-svg" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Retinal Fundus Disc */}
                <circle cx="80" cy="80" r="62" fill="url(#drFundusGrad)" stroke="#ea580c" strokeWidth="2.5" />
                {/* Optic Disc */}
                <circle cx="56" cy="80" r="16" fill="#f97316" fillOpacity="0.4" stroke="#fed7aa" strokeWidth="1.8" />
                <circle cx="56" cy="80" r="8" fill="#fff7ed" />
                {/* Macula */}
                <circle cx="102" cy="82" r="12" fill="#7c2d12" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="102" cy="82" r="3" fill="#ea580c" />
                {/* Branching Vascular Arcades */}
                <path d="M 56 64 C 62 45, 95 42, 115 55 M 56 96 C 65 118, 98 120, 118 108" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 75 48 Q 90 38 105 40 M 80 114 Q 95 125 110 120" stroke="#fed7aa" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                
                <defs>
                  <linearGradient id="drFundusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ea580c" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#9a3412" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Right: Title & 3-Step Flow */}
            <div className="workflow-card__content-side">
              <h3 className="workflow-card__title">Diabetic Retinopathy Screening</h3>

              <div className="workflow-pipeline" role="list">
                {/* Step 1 */}
                <div className="workflow-pipeline__step" role="listitem">
                  <div className="workflow-pipeline__thumb workflow-pipeline__thumb--dr">
                    <img src="/assets/example-retinal-fundus.png" alt="" className="workflow-pipeline__thumb-img" />
                  </div>
                  <span className="workflow-pipeline__label">Retinal Fundus</span>
                </div>

                <span className="workflow-pipeline__arrow workflow-pipeline__arrow--dr" aria-hidden="true">→</span>

                {/* Step 2 */}
                <div className="workflow-pipeline__step" role="listitem">
                  <div className="workflow-pipeline__icon-box workflow-pipeline__icon-box--dr">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                  <span className="workflow-pipeline__label">Image Processing</span>
                </div>

                <span className="workflow-pipeline__arrow workflow-pipeline__arrow--dr" aria-hidden="true">→</span>

                {/* Step 3 */}
                <div className="workflow-pipeline__step" role="listitem">
                  <div className="workflow-pipeline__icon-box workflow-pipeline__icon-box--dr">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <span className="workflow-pipeline__label">Structured Results</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WorkflowsSection;
