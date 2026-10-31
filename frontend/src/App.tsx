import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { Button, Badge, Card } from './components/common';
import {
  LandingHeader,
  Hero,
  WhatIsMediScanSection,
  PlatformGrowthSection,
  HowItWorksSection,
  LandingFooter,
} from './components/landing';
import { ScreeningSelectionPage } from './components/selection';
import { TBUploadPage, DRUploadPage } from './components/upload';
import { TBProcessingPage, DRProcessingPage } from './components/processing';
import { TBResultsPage, DRResultsPage } from './components/results';

interface HealthResponse {
  status: string;
  service: string;
  version: string;
  environment: string;
}

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showHealthModal, setShowHealthModal] = useState<boolean>(false);
  const [ctaFeedback, setCtaFeedback] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<'landing' | 'selection' | 'tb-upload' | 'dr-upload' | 'tb-processing' | 'dr-processing' | 'tb-results' | 'dr-results'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#dr-results') {
        return 'dr-results';
      }
      if (window.location.hash === '#tb-results') {
        return 'tb-results';
      }
      if (window.location.hash === '#tb-processing') {
        return 'tb-processing';
      }
      if (window.location.hash === '#dr-processing') {
        return 'dr-processing';
      }
      if (window.location.hash === '#tb-upload') {
        return 'tb-upload';
      }
      if (window.location.hash === '#dr-upload') {
        return 'dr-upload';
      }
      if (window.location.hash === '#select-screening') {
        return 'selection';
      }
    }
    return 'landing';
  });
  const [selectedWorkflow, setSelectedWorkflow] = useState<'tb' | 'dr' | null>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#dr-results') return 'dr';
      if (window.location.hash === '#tb-results') return 'tb';
      if (window.location.hash === '#tb-processing') return 'tb';
      if (window.location.hash === '#dr-processing') return 'dr';
      if (window.location.hash === '#tb-upload') return 'tb';
      if (window.location.hash === '#dr-upload') return 'dr';
    }
    return null;
  });
  const [tbFile, setTbFile] = useState<File | null>(null);
  const [drFile, setDrFile] = useState<File | null>(null);

  const [activeSection, setActiveSection] = useState<'home' | 'screening' | 'how-it-works'>('home');

  // Smart Get Started Transition: Mutually exclusive hero CTA vs floating CTA
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const [isHeroCtaVisible, setIsHeroCtaVisible] = useState<boolean>(true);

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1'
      ? 'http://127.0.0.1:8000'
      : 'http://localhost:8000');

  // Handle browser Back / Forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        if (event.state.workflow) {
          setSelectedWorkflow(event.state.workflow);
        }
        if (event.state.view === 'landing') {
          setActiveSection('home');
        } else {
          setActiveSection('screening');
        }
      } else {
        if (window.location.hash === '#dr-results') {
          setCurrentView('dr-results');
          setSelectedWorkflow('dr');
          setActiveSection('screening');
        } else if (window.location.hash === '#tb-results') {
          setCurrentView('tb-results');
          setSelectedWorkflow('tb');
          setActiveSection('screening');
        } else if (window.location.hash === '#tb-processing') {
          setCurrentView('tb-processing');
          setSelectedWorkflow('tb');
          setActiveSection('screening');
        } else if (window.location.hash === '#dr-processing') {
          setCurrentView('dr-processing');
          setSelectedWorkflow('dr');
          setActiveSection('screening');
        } else if (window.location.hash === '#tb-upload') {
          setCurrentView('tb-upload');
          setSelectedWorkflow('tb');
          setActiveSection('screening');
        } else if (window.location.hash === '#dr-upload') {
          setCurrentView('dr-upload');
          setSelectedWorkflow('dr');
          setActiveSection('screening');
        } else if (window.location.hash === '#select-screening') {
          setCurrentView('selection');
          setActiveSection('screening');
        } else {
          setCurrentView('landing');
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (currentView !== 'landing') return;

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const secondSectionEl = document.getElementById('what-is-mediscan') || document.getElementById('how-it-works');

      if (secondSectionEl) {
        const rect = secondSectionEl.getBoundingClientRect();
        // Shift active indicator to 'how-it-works' when scrolled into second page of flow
        if (rect.top <= window.innerHeight * 0.55 || scrollY > 260) {
          setActiveSection('how-it-works');
          return;
        }
      } else if (scrollY > 260) {
        setActiveSection('how-it-works');
        return;
      }

      setActiveSection('home');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Global navigation handler shared across landing and internal pages
  const handleGlobalNavigate = (section: 'home' | 'screening' | 'how-it-works') => {
    if (section === 'screening') {
      handleOpenSelection();
    } else if (section === 'home') {
      handleBackToLanding();
    } else if (section === 'how-it-works') {
      if (currentView !== 'landing') {
        setCurrentView('landing');
        if (typeof window !== 'undefined') {
          window.history.pushState({ view: 'landing' }, '', window.location.pathname);
        }
      }
      setActiveSection('how-it-works');
      setTimeout(() => {
        const el = document.getElementById('how-it-works') || document.getElementById('workflows') || document.getElementById('pipeline');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, currentView === 'landing' ? 0 : 80);
    }
  };

  // Smart CTA visibility observer: ensures hero CTA and floating CTA never show simultaneously
  useEffect(() => {
    if (currentView !== 'landing') return;

    const target = heroCtaRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsHeroCtaVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.15,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [currentView]);

  const handleOpenSelection = (workflow?: 'tb' | 'dr') => {
    if (workflow) {
      setSelectedWorkflow(workflow);
    }
    setCurrentView('selection');
    setActiveSection('screening');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'selection', workflow }, '', '#select-screening');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setActiveSection('home');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'landing' }, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectWorkflow = (workflow: 'tb' | 'dr') => {
    setSelectedWorkflow(workflow);
    if (workflow === 'tb') {
      setDrFile(null); // Isolate state: clear opposite workflow file
      setCurrentView('tb-upload');
      if (typeof window !== 'undefined') {
        window.history.pushState({ view: 'tb-upload', workflow: 'tb' }, '', '#tb-upload');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (workflow === 'dr') {
      setTbFile(null); // Isolate state: clear opposite workflow file
      setCurrentView('dr-upload');
      if (typeof window !== 'undefined') {
        window.history.pushState({ view: 'dr-upload', workflow: 'dr' }, '', '#dr-upload');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBackToSelection = () => {
    setTbFile(null);
    setDrFile(null);
    setSelectedWorkflow(null);
    setCurrentView('selection');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'selection' }, '', '#select-screening');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContinueTBUpload = (file: File) => {
    setTbFile(file);
    setCurrentView('tb-processing');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'tb-processing', workflow: 'tb' }, '', '#tb-processing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackFromTBProcessing = () => {
    setCurrentView('tb-upload');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'tb-upload', workflow: 'tb' }, '', '#tb-upload');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCompleteTBProcessing = () => {
    setCurrentView('tb-results');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'tb-results', workflow: 'tb' }, '', '#tb-results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackFromTBResults = () => {
    setCurrentView('tb-processing');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'tb-processing', workflow: 'tb' }, '', '#tb-processing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetTBWorkflow = () => {
    setTbFile(null);
    setSelectedWorkflow(null);
    setCurrentView('selection');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'selection' }, '', '#select-screening');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContinueDROpload = (file: File) => {
    setDrFile(file);
    setCurrentView('dr-processing');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'dr-processing', workflow: 'dr' }, '', '#dr-processing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackFromDRProcessing = () => {
    setCurrentView('dr-upload');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'dr-upload', workflow: 'dr' }, '', '#dr-upload');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCompleteDRProcessing = () => {
    setCurrentView('dr-results');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'dr-results', workflow: 'dr' }, '', '#dr-results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackFromDRResults = () => {
    setCurrentView('dr-processing');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'dr-processing', workflow: 'dr' }, '', '#dr-processing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetDRWorkflow = () => {
    setDrFile(null);
    setSelectedWorkflow(null);
    setCurrentView('selection');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'selection' }, '', '#select-screening');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: HealthResponse = await response.json();
      setHealth(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to connect to backend';
      setError(message);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, [apiUrl]);

  return (
    <div className="landing-layout">
      {currentView === 'landing' && (
        <>
          {/* Top Header Matching Approved Reference (Translucent pill navbar) */}
          <LandingHeader
            variant="full"
            activeSection={activeSection}
            onNavigate={handleGlobalNavigate}
            onLogoClick={handleBackToLanding}
          />

          {/* Main Landing Sections: Continuous vertical scroll experience */}
          <main className="landing-main">
            {/* 1. Hero Section (Preserved Unchanged with Smart CTA Transition) */}
            <Hero
              onGetStarted={() => handleOpenSelection()}
              ctaRef={heroCtaRef}
              isCtaHidden={!isHeroCtaVisible}
            />

            {/* 2. What Is MediScan AI? (Organizes medical-image screening into structured workflows) */}
            <WhatIsMediScanSection />

            {/* 3. Future-Expandable Screening Applications: A Platform Designed to Grow */}
            <PlatformGrowthSection />

            {/* 4. How It Works: Simple, clear 4-step visual */}
            <HowItWorksSection />
          </main>

          {/* 10. Footer: 4 columns, light blue-gray theme, dividers, copyright */}
          <LandingFooter
            onNavigateHome={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveSection('home');
            }}
            onNavigateScreening={() => handleOpenSelection()}
            onNavigateHowItWorks={() => {
              setActiveSection('how-it-works');
              const el = document.getElementById('how-it-works') || document.getElementById('workflows') || document.getElementById('pipeline');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onSelectWorkflow={(workflow) => handleSelectWorkflow(workflow)}
          />

          {/* Floating Get Started CTA Button (Only Clickable Control on Scroll, Mutually Exclusive with Hero CTA) */}
          <button
            type="button"
            className={`landing-floating-cta ${!isHeroCtaVisible ? 'landing-floating-cta--visible' : ''}`}
            onClick={() => handleOpenSelection()}
            aria-label="Get Started with Screening"
            tabIndex={!isHeroCtaVisible ? 0 : -1}
            aria-hidden={isHeroCtaVisible}
          >
            <span>Get Started</span>
            <span className="landing-floating-cta__arrow" aria-hidden="true">→</span>
          </button>
        </>
      )}

      {currentView === 'selection' && (
        /* Flow 2.1: Screening Type Selection Page */
        <ScreeningSelectionPage
          selectedWorkflow={selectedWorkflow}
          onSelectWorkflow={handleSelectWorkflow}
          onBackToLanding={handleBackToLanding}
          onNavigate={handleGlobalNavigate}
        />
      )}

      {currentView === 'tb-upload' && (
        /* Flow 2.2 Step 1: Tuberculosis Image Upload Page */
        <TBUploadPage
          initialFile={tbFile}
          onBack={handleBackToSelection}
          onContinue={handleContinueTBUpload}
          onBackToLanding={handleBackToLanding}
          onNavigate={handleGlobalNavigate}
        />
      )}

      {currentView === 'tb-processing' && (
        /* Flow 2.2 Step 2: Tuberculosis Processing Page */
        <TBProcessingPage
          file={tbFile}
          onBack={handleBackFromTBProcessing}
          onProcessingComplete={handleCompleteTBProcessing}
          onBackToLanding={handleBackToLanding}
          onNavigate={handleGlobalNavigate}
        />
      )}

      {currentView === 'tb-results' && (
        /* Flow 2.2 Step 3: Tuberculosis Results Page */
        <TBResultsPage
          file={tbFile}
          onBack={handleBackFromTBResults}
          onNewScreening={handleResetTBWorkflow}
          onBackToLanding={handleBackToLanding}
          onNavigate={handleGlobalNavigate}
        />
      )}

      {currentView === 'dr-upload' && (
        /* Flow 2.3 Step 1: Diabetic Retinopathy Image Upload Page */
        <DRUploadPage
          initialFile={drFile}
          onBack={handleBackToSelection}
          onContinue={handleContinueDROpload}
          onBackToLanding={handleBackToLanding}
          onNavigate={handleGlobalNavigate}
        />
      )}

      {currentView === 'dr-processing' && (
        /* Flow 2.3 Step 2: Diabetic Retinopathy Processing Page */
        <DRProcessingPage
          file={drFile}
          onBack={handleBackFromDRProcessing}
          onProcessingComplete={handleCompleteDRProcessing}
          onBackToLanding={handleBackToLanding}
          onNavigate={handleGlobalNavigate}
        />
      )}

      {currentView === 'dr-results' && (
        /* Flow 2.3 Step 3: Diabetic Retinopathy Results Page */
        <DRResultsPage
          file={drFile}
          onBack={handleBackFromDRResults}
          onNewScreening={handleResetDRWorkflow}
          onBackToLanding={handleBackToLanding}
          onNavigate={handleGlobalNavigate}
        />
      )}

      {/* CTA Integration Toast / Feedback */}
      {ctaFeedback && (
        <aside className="hero-feedback-toast" role="status" aria-live="polite">
          <div className="hero-feedback-toast__content">
            <span className="hero-feedback-toast__icon" aria-hidden="true">✓</span>
            <span>{ctaFeedback}</span>
            <button
              type="button"
              className="hero-feedback-toast__close"
              onClick={() => setCtaFeedback(null)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </aside>
      )}

      {/* Accessible System Status Modal (Preserving Module 1 Verification) */}
      {showHealthModal && (
        <div
          className="system-modal-backdrop"
          onClick={() => setShowHealthModal(false)}
          role="presentation"
        >
          <div
            className="system-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="system-modal-title"
          >
            <Card
              padding="lg"
              header={
                <div className="system-modal__header">
                  <h2 id="system-modal-title">System Status (Module 1 Foundation)</h2>
                  <button
                    type="button"
                    className="system-modal__close-btn"
                    onClick={() => setShowHealthModal(false)}
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
              }
            >
              <div className="status-section">
                {loading && (
                  <Badge variant="tb" dot className="status-badge checking">
                    Checking backend status...
                  </Badge>
                )}
                {!loading && error && (
                  <div>
                    <Badge variant="error" dot className="status-badge disconnected">
                      Backend Disconnected
                    </Badge>
                    <p style={{ color: 'var(--color-error)', margin: '0.5rem 0' }}>{error}</p>
                  </div>
                )}
                {!loading && health && (
                  <div>
                    <Badge variant="success" dot className="status-badge connected">
                      Backend Operational
                    </Badge>
                    <div className="info-grid">
                      <span className="info-label">Service:</span>
                      <span className="info-value">{health.service}</span>
                      <span className="info-label">Version:</span>
                      <span className="info-value">{health.version}</span>
                      <span className="info-label">Environment:</span>
                      <span className="info-value">{health.environment}</span>
                      <span className="info-label">Status:</span>
                      <span className="info-value">{health.status}</span>
                    </div>
                  </div>
                )}

                <div className="action-bar">
                  <Button
                    workflow="tb"
                    size="sm"
                    isLoading={loading}
                    onClick={checkHealth}
                  >
                    Re-check Backend Health
                  </Button>
                </div>
              </div>

              <div className="info-grid" style={{ marginTop: '1.5rem' }}>
                <span className="info-label">Configured API:</span>
                <span className="info-value">{apiUrl}</span>
                <span className="info-label">Active Workflows:</span>
                <span className="info-value">Tuberculosis (TB) & Diabetic Retinopathy (DR) [Simulated]</span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
