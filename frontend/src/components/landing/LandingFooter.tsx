import React from 'react';
import './LandingFooter.css';
import { MLogo } from '../common';

export interface LandingFooterProps {
  onNavigateScreening?: () => void;
  onNavigateHome?: () => void;
  onNavigateHowItWorks?: () => void;
  onSelectWorkflow?: (workflow: 'tb' | 'dr') => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onNavigateScreening,
  onNavigateHome,
  onNavigateHowItWorks,
  onSelectWorkflow,
}) => {
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScreeningClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateScreening) {
      onNavigateScreening();
    }
  };

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateHowItWorks) {
      onNavigateHowItWorks();
    } else {
      const el = document.getElementById('workflows') || document.getElementById('pipeline');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="landing-footer" aria-label="Landing Page Footer">
      <div className="container landing-footer__container">
        
        {/* Main 4-Column Horizontal Layout */}
        <div className="landing-footer__main">
          
          {/* Column 1: Brand Logo & Mission */}
          <div className="landing-footer__col landing-footer__col--brand">
            <div className="landing-footer__brand" onClick={handleHomeClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleHomeClick(e as unknown as React.MouseEvent); }}>
              <MLogo size="md" className="landing-footer__m-logo" />
              <span className="landing-footer__brand-text">
                <span className="landing-footer__brand-name">MediScan </span>
                <span className="landing-footer__brand-ai">AI</span>
              </span>
            </div>
            <p className="landing-footer__tagline">
              Medical image screening for structured and clear insights.
            </p>
          </div>

          <div className="landing-footer__divider" aria-hidden="true" />

          {/* Column 2: Navigation Links */}
          <div className="landing-footer__col landing-footer__col--nav">
            <button type="button" className="landing-footer__link" onClick={handleHomeClick}>
              Home
            </button>
            <button type="button" className="landing-footer__link" onClick={handleScreeningClick}>
              Screening
            </button>
            <button type="button" className="landing-footer__link" onClick={handleHowItWorksClick}>
              How it works
            </button>
          </div>

          <div className="landing-footer__divider" aria-hidden="true" />

          {/* Column 3: Screening Workflows */}
          <div className="landing-footer__col landing-footer__col--workflows">
            <button
              type="button"
              className="landing-footer__wf-link"
              onClick={() => {
                if (onSelectWorkflow) onSelectWorkflow('tb');
                else if (onNavigateScreening) onNavigateScreening();
              }}
            >
              <svg className="landing-footer__wf-icon landing-footer__wf-icon--tb" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v18m0-18C10 3 6 4 4 8c-2 4-1 9 1 12 1.5 2.25 4 2 7-1m0-19c2 0 6 1 8 5 2 4 1 9-1 12-1.5 2.25-4 2-7-1" />
              </svg>
              <span>TB Screening</span>
            </button>

            <button
              type="button"
              className="landing-footer__wf-link"
              onClick={() => {
                if (onSelectWorkflow) onSelectWorkflow('dr');
                else if (onNavigateScreening) onNavigateScreening();
              }}
            >
              <svg className="landing-footer__wf-icon landing-footer__wf-icon--dr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
              </svg>
              <span>DR Screening</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;
