import React, { useState, useEffect, useRef } from 'react';
import './LandingHeader.css';
import { MLogo } from '../common';

export interface LandingHeaderProps {
  variant?: 'full' | 'minimal';
  activeSection?: 'home' | 'screening' | 'how-it-works';
  onNavigate?: (section: 'home' | 'screening' | 'how-it-works') => void;
  onLogoClick?: () => void;
  backendStatus?: 'connected' | 'disconnected' | 'checking';
  onStatusClick?: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  variant = 'full',
  activeSection = 'home',
  onNavigate,
  onLogoClick,
}) => {
  const isMinimal = variant === 'minimal';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);

  const isScreeningRoute = typeof window !== 'undefined' && (
    window.location.hash.includes('upload') ||
    window.location.hash.includes('processing') ||
    window.location.hash.includes('results') ||
    window.location.hash.includes('select-screening') ||
    isMinimal
  );

  const currentActive = activeSection !== undefined ? activeSection : (isScreeningRoute ? 'screening' : 'home');

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        mobileToggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Close mobile menu on click outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        mobileToggleRef.current &&
        !mobileToggleRef.current.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onLogoClick) {
      onLogoClick();
    } else if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new PopStateEvent('popstate', { state: { view: 'landing' } }));
    }
  };

  const handleNavClick = (
    e: React.MouseEvent,
    section: 'home' | 'screening' | 'how-it-works'
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(section);
      return;
    }

    if (section === 'home') {
      if (onLogoClick) {
        onLogoClick();
      } else {
        window.location.hash = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.dispatchEvent(new PopStateEvent('popstate', { state: { view: 'landing' } }));
      }
    } else if (section === 'screening') {
      window.location.hash = '#select-screening';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new PopStateEvent('popstate', { state: { view: 'selection' } }));
    } else if (section === 'how-it-works') {
      const scrollToWorkflow = () => {
        const el = document.getElementById('how-it-works') || document.getElementById('workflows') || document.getElementById('pipeline');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      };

      if (isScreeningRoute) {
        if (onLogoClick) onLogoClick();
        window.location.hash = '';
        window.dispatchEvent(new PopStateEvent('popstate', { state: { view: 'landing' } }));
        setTimeout(scrollToWorkflow, 120);
      } else {
        scrollToWorkflow();
      }
    }
  };

  return (
    <header className={`landing-header ${isMinimal ? 'landing-header--minimal' : ''}`}>
      <div className="container landing-header__inner">
        {/* Brand Identity: [M logo] MediScan AI */}
        <div
          className="landing-header__brand"
          onClick={handleBrandClick}
          role="button"
          tabIndex={0}
          aria-label="MediScan AI Home"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBrandClick(e as unknown as React.MouseEvent);
            }
          }}
        >
          <MLogo size="md" className="landing-header__m-logo" />
          <span className="landing-header__brand-text">
            <span className="landing-header__brand-name">MediScan</span>
            <span className="landing-header__brand-ai">AI</span>
          </span>
          <span className="landing-header__plus sr-only">+</span>
        </div>

        {/* Vertical divider on desktop */}
        <span className="landing-header__divider" aria-hidden="true">|</span>

        {/* Desktop Navigation Items with Icons stacked above labels */}
        <nav className="landing-header__nav landing-header__nav--desktop" aria-label="Main Navigation">
          <button
            type="button"
            className={`landing-header__nav-btn ${currentActive === 'home' ? 'landing-header__nav-btn--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'home')}
          >
            <svg
              className="landing-header__nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 9.5L12 3l9 6.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20V9.5z" />
              <polyline points="9 21 9 12 15 12 15 21" />
            </svg>
            <span className="landing-header__nav-label">Home</span>
            {currentActive === 'home' && (
              <span className="landing-header__nav-indicator" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className={`landing-header__nav-btn ${currentActive === 'screening' ? 'landing-header__nav-btn--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'screening')}
          >
            <svg
              className="landing-header__nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="landing-header__nav-label">Screening</span>
            {currentActive === 'screening' && (
              <span className="landing-header__nav-indicator" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className={`landing-header__nav-btn ${currentActive === 'how-it-works' ? 'landing-header__nav-btn--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'how-it-works')}
          >
            <svg
              className="landing-header__nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="5" r="2.5" />
              <circle cx="6" cy="19" r="2.5" />
              <circle cx="18" cy="19" r="2.5" />
              <line x1="12" y1="7.5" x2="6" y2="16.5" />
              <line x1="12" y1="7.5" x2="18" y2="16.5" />
              <line x1="8.5" y1="19" x2="15.5" y2="19" />
            </svg>
            <span className="landing-header__nav-label">How it works</span>
            {currentActive === 'how-it-works' && (
              <span className="landing-header__nav-indicator" aria-hidden="true" />
            )}
          </button>
        </nav>

        {/* Right spacer for symmetrical centering on desktop */}
        <div className="landing-header__spacer" aria-hidden="true" />

        {/* Mobile Navigation Toggle (Visible on screens < 768px) */}
        <button
          ref={mobileToggleRef}
          type="button"
          className={`landing-header__mobile-toggle ${isMobileMenuOpen ? 'landing-header__mobile-toggle--open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="landing-mobile-menu"
        >
          <span className="landing-header__hamburger-bar" />
          <span className="landing-header__hamburger-bar" />
          <span className="landing-header__hamburger-bar" />
        </button>
      </div>

      {/* Mobile Floating Dropdown Menu */}
      {isMobileMenuOpen && (
        <nav
          id="landing-mobile-menu"
          ref={mobileMenuRef}
          className="landing-header__mobile-menu"
          aria-label="Mobile Navigation Menu"
        >
          <button
            type="button"
            className={`landing-header__mobile-nav-btn ${currentActive === 'home' ? 'landing-header__mobile-nav-btn--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'home')}
          >
            <svg
              className="landing-header__nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 9.5L12 3l9 6.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20V9.5z" />
              <polyline points="9 21 9 12 15 12 15 21" />
            </svg>
            <span className="landing-header__mobile-nav-label">Home</span>
            {currentActive === 'home' && (
              <span className="landing-header__mobile-active-dot" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className={`landing-header__mobile-nav-btn ${currentActive === 'screening' ? 'landing-header__mobile-nav-btn--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'screening')}
          >
            <svg
              className="landing-header__nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="landing-header__mobile-nav-label">Screening</span>
            {currentActive === 'screening' && (
              <span className="landing-header__mobile-active-dot" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className={`landing-header__mobile-nav-btn ${currentActive === 'how-it-works' ? 'landing-header__mobile-nav-btn--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'how-it-works')}
          >
            <svg
              className="landing-header__nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="5" r="2.5" />
              <circle cx="6" cy="19" r="2.5" />
              <circle cx="18" cy="19" r="2.5" />
              <line x1="12" y1="7.5" x2="6" y2="16.5" />
              <line x1="12" y1="7.5" x2="18" y2="16.5" />
              <line x1="8.5" y1="19" x2="15.5" y2="19" />
            </svg>
            <span className="landing-header__mobile-nav-label">How it works</span>
            {currentActive === 'how-it-works' && (
              <span className="landing-header__mobile-active-dot" aria-hidden="true" />
            )}
          </button>
        </nav>
      )}
    </header>
  );
};

export default LandingHeader;
