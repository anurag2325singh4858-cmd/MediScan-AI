import React, { useState, useEffect } from 'react';
import './DRProcessingPage.css';
import { LandingHeader } from '../landing/LandingHeader';
import { formatFileSize } from '../upload/uploadValidation';

export interface DRProcessingPageProps {
  file: File | null;
  onBack: () => void;
  onProcessingComplete?: () => void;
  onBackToLanding?: () => void;
  onNavigate?: (section: 'home' | 'screening' | 'how-it-works') => void;
}

interface ProcessingStep {
  id: string;
  label: string;
  detail: string;
}

const DR_PROCESSING_STEPS: ProcessingStep[] = [
  {
    id: 'received',
    label: 'Image received',
    detail: 'Retinal fundus image transferred to processing queue',
  },
  {
    id: 'validation',
    label: 'File validation',
    detail: 'Client-side format and file headers verified',
  },
  {
    id: 'technical_checks',
    label: 'Technical image checks',
    detail: 'Macular field, illumination uniformity, and resolution scanned',
  },
  {
    id: 'preparing_demo',
    label: 'Preparing screening results',
    detail: 'Generating structured screening findings and anatomical annotations',
  },
];

export const DRProcessingPage: React.FC<DRProcessingPageProps> = ({
  file,
  onBack,
  onProcessingComplete,
  onBackToLanding,
  onNavigate,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(15);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [sampleLoaded, setSampleLoaded] = useState<boolean>(false);

  // Manage ephemeral object URL for the image preview
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (sampleLoaded) {
      setPreviewUrl('/assets/example-retinal-fundus.png');
    } else {
      setPreviewUrl(null);
    }
  }, [file, sampleLoaded]);

  // Deterministic, stepped processing sequence
  useEffect(() => {
    // Only run if an image source is available
    if (!file && !sampleLoaded) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Complete immediately for reduced motion
      setActiveStepIndex(DR_PROCESSING_STEPS.length);
      setProgressPercent(100);
      setIsFinished(true);
      return;
    }

    // Responsive stepped processing timeline (1.5s total duration)
    const timer1 = setTimeout(() => {
      setActiveStepIndex(1);
      setProgressPercent(40);
    }, 350);

    const timer2 = setTimeout(() => {
      setActiveStepIndex(2);
      setProgressPercent(75);
    }, 750);

    const timer3 = setTimeout(() => {
      setActiveStepIndex(3);
      setProgressPercent(90);
    }, 1150);

    const timer4 = setTimeout(() => {
      setActiveStepIndex(DR_PROCESSING_STEPS.length);
      setProgressPercent(100);
      setIsFinished(true);
      if (onProcessingComplete) {
        onProcessingComplete();
      }
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [file, sampleLoaded, onProcessingComplete]);

  const handleLoadSample = () => {
    setSampleLoaded(true);
    setActiveStepIndex(0);
    setProgressPercent(15);
    setIsFinished(false);
  };

  return (
    <div className="dr-proc-page">
      {/* Header with active screening state and full navigation capabilities */}
      <LandingHeader
        variant="minimal"
        activeSection="screening"
        onLogoClick={onBackToLanding || onBack}
        onNavigate={onNavigate}
      />

      {/* Background Decorative Retinal Graphics (Warm Coral/Orange Theme) */}
      <div className="dr-proc-bg-decor dr-proc-bg-decor--left" aria-hidden="true">
        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="dr-proc-bg-svg">
          <circle cx="80" cy="250" r="180" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="5 5" />
          <circle cx="80" cy="250" r="120" stroke="#EA580C" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="80" cy="250" r="60" stroke="#EA580C" strokeWidth="1.5" />
          <circle cx="80" cy="250" r="24" stroke="#EA580C" strokeWidth="2" />
          <path
            d="M80 190 C90 140, 130 110, 190 90 M190 90 C220 80, 260 75, 310 70 M190 90 C210 120, 250 140, 300 155"
            stroke="#EA580C"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M80 310 C95 360, 140 390, 200 410 M200 410 C240 425, 280 435, 330 440 M200 410 C225 380, 270 365, 320 350"
            stroke="#EA580C"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M104 250 C160 250, 220 240, 290 220 M220 240 C250 270, 300 290, 350 305"
            stroke="#EA580C"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="dr-proc-bg-decor dr-proc-bg-decor--right" aria-hidden="true">
        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="dr-proc-bg-svg">
          <circle cx="320" cy="250" r="190" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="320" cy="250" r="130" stroke="#EA580C" strokeWidth="1.2" />
          <circle cx="320" cy="250" r="70" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="320" cy="250" r="28" stroke="#EA580C" strokeWidth="2" />
          <path
            d="M320 180 C300 130, 250 100, 180 80 M180 80 C140 70, 90 65, 40 60 M180 80 C150 115, 110 135, 60 150"
            stroke="#EA580C"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M320 320 C305 370, 255 400, 190 420 M190 420 C150 435, 100 445, 50 450 M190 420 C160 390, 120 370, 70 355"
            stroke="#EA580C"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M292 250 C230 250, 170 260, 100 280 M170 260 C140 230, 90 210, 40 195"
            stroke="#EA580C"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <main className="dr-proc-content">
        <div className="container dr-proc-container">
          {/* Centered Title & Workflow Badge Matching Reference */}
          <div className="dr-proc-heading-group">
            <h1 className="dr-proc-title">Preparing Your Result</h1>
            <div className="dr-proc-workflow-badge">
              <span className="dr-proc-workflow-icon" aria-hidden="true">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer Almond Eye Shape in Orange */}
                  <path
                    d="M 6 32 C 14 18, 23 11, 32 11 C 41 11, 50 18, 58 32 C 50 46, 41 53, 32 53 C 23 53, 14 46, 6 32 Z"
                    fill="#EA580C"
                  />
                  {/* Inner White Sclera Ring */}
                  <circle cx="32" cy="32" r="13" fill="#FFFFFF" />
                  {/* Iris & Pupil in Orange */}
                  <circle cx="32" cy="32" r="7.5" fill="#EA580C" />
                  {/* Pupil Center / Reflection */}
                  <circle cx="33.8" cy="30.2" r="2.2" fill="#FFFFFF" />
                </svg>
              </span>
              <span className="dr-proc-workflow-text">
                Diabetic Retinopathy Screening — Fundus Image
              </span>
            </div>
          </div>

          {/* Missing Image Recovery Fallback */}
          {!file && !sampleLoaded ? (
            <div className="dr-proc-recovery-card" role="alert">
              <div className="dr-proc-recovery-icon" aria-hidden="true">⚠️</div>
              <h2 className="dr-proc-recovery-title">No Retinal Image Selected for Processing</h2>
              <p className="dr-proc-recovery-desc">
                To run the diabetic retinopathy screening demonstration, please select a valid retinal fundus photograph from the upload page.
              </p>
              <div className="dr-proc-recovery-actions">
                <button
                  type="button"
                  className="dr-proc-recovery-btn dr-proc-recovery-btn--primary"
                  onClick={onBack}
                >
                  ← Return to Upload Page
                </button>
                <button
                  type="button"
                  className="dr-proc-recovery-btn dr-proc-recovery-btn--secondary"
                  onClick={handleLoadSample}
                >
                  Use Demonstration Sample
                </button>
              </div>
            </div>
          ) : (
            /* Main Two-Column Layout: Fundus Image Preview (Left) & Stepper (Right) */
            <div className="dr-proc-grid">
              {/* Left Column: Image Card with Orange Scanning Effect */}
              <div className="dr-proc-card dr-proc-card--preview">
                <div className="dr-proc-frame">
                  {previewUrl ? (
                    <div className="dr-proc-img-wrapper">
                      <img
                        src={previewUrl}
                        alt="Retinal fundus image currently undergoing technical screening validation"
                        className="dr-proc-img"
                      />

                      {/* Animated Orange Scanning Laser Bar */}
                      {!isFinished && (
                        <div className="dr-proc-scanner-bar" aria-hidden="true" />
                      )}

                      {/* Subtle Vignette Overlay */}
                      <div className="dr-proc-vignette" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="dr-proc-placeholder">Loading image preview...</div>
                  )}
                </div>

                {/* File Metadata Info Pill */}
                {file && (
                  <div className="dr-proc-file-meta">
                    <span className="dr-proc-file-name" title={file.name}>
                      {file.name}
                    </span>
                    <span className="dr-proc-file-dot">•</span>
                    <span className="dr-proc-file-size">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Processing Stepper Timeline (Orange DR Theme) */}
              <div className="dr-proc-card dr-proc-card--timeline">
                <div className="dr-proc-stepper" role="region" aria-label="Processing Progress">
                  {DR_PROCESSING_STEPS.map((step, index) => {
                    const isCompleted = index < activeStepIndex;
                    const isActive = index === activeStepIndex && !isFinished;
                    const isPending = index > activeStepIndex;

                    return (
                      <div
                        key={step.id}
                        className={`dr-proc-step ${
                          isCompleted ? 'dr-proc-step--completed' : ''
                        } ${isActive ? 'dr-proc-step--active' : ''} ${
                          isPending ? 'dr-proc-step--pending' : ''
                        }`}
                      >
                        <div className="dr-proc-step-indicator-col">
                          <div className="dr-proc-step-badge" aria-hidden="true">
                            {isCompleted ? (
                              /* Solid Orange Checkmark Circle */
                              <svg
                                className="dr-proc-step-check-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#FFFFFF"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : isActive ? (
                              /* Pulsing Concentric Active Orange Circle */
                              <div className="dr-proc-step-pulse-ring">
                                <span className="dr-proc-step-pulse-dot" />
                              </div>
                            ) : (
                              /* Pending State Circle */
                              <div className="dr-proc-step-pending-dot" />
                            )}
                          </div>

                          {/* Connecting Line Between Steps */}
                          {index < DR_PROCESSING_STEPS.length - 1 && (
                            <div
                              className={`dr-proc-step-line ${
                                isCompleted ? 'dr-proc-step-line--completed' : ''
                              }`}
                            />
                          )}
                        </div>

                        <div className="dr-proc-step-content">
                          <span className="dr-proc-step-title">{step.label}</span>
                          {isActive && (
                            <span className="dr-proc-step-detail">{step.detail}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress Bar & Status Summary */}
                <div className="dr-proc-progress-box">
                  <div className="dr-proc-progress-header">
                    <span className="dr-proc-progress-label">
                      {isFinished ? 'Technical Preparation Complete' : 'Validating fundus image...'}
                    </span>
                    <span className="dr-proc-progress-number">{progressPercent}%</span>
                  </div>
                  <div
                    className="dr-proc-progress-track"
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="dr-proc-progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Demonstration Completion Callout (Safe Integration Point) */}
                  {isFinished && (
                    <div className="dr-proc-ready-callout" role="status">
                      <div className="dr-proc-ready-header">
                        <span className="dr-proc-ready-icon" aria-hidden="true">✓</span>
                        <span className="dr-proc-ready-title">Technical Checks Passed</span>
                      </div>
                      <p className="dr-proc-ready-text">
                        The retinal fundus image is ready for future module (Simulated Findings & Annotation Overlay).
                        No clinical diagnosis is generated in this stage.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="dr-proc-actions-bar">
            <button
              type="button"
              className="dr-proc-back-btn"
              onClick={onBack}
              aria-label="Back to Diabetic Retinopathy Image Upload"
            >
              <span aria-hidden="true">←</span>
              <span>Back</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DRProcessingPage;
