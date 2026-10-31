import React, { useState, useEffect } from 'react';
import './TBProcessingPage.css';
import { LandingHeader } from '../landing/LandingHeader';
import { formatFileSize } from '../upload/uploadValidation';

export interface TBProcessingPageProps {
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

const PROCESSING_STEPS: ProcessingStep[] = [
  {
    id: 'received',
    label: 'Image received',
    detail: 'Chest radiograph transferred to processing queue',
  },
  {
    id: 'validation',
    label: 'File validation',
    detail: 'Client-side format and file headers verified',
  },
  {
    id: 'technical_checks',
    label: 'Technical image checks',
    detail: 'Aspect ratio, contrast uniformity, and pixel integrity scanned',
  },
  {
    id: 'preparing_demo',
    label: 'Preparing demonstration',
    detail: 'Staging simulated screening workflow for demonstration',
  },
];

export const TBProcessingPage: React.FC<TBProcessingPageProps> = ({
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
      setPreviewUrl('/assets/example-chest-xray.png?v=2');
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
      setActiveStepIndex(PROCESSING_STEPS.length);
      setProgressPercent(100);
      setIsFinished(true);
      return;
    }

    // Step 0 -> Step 1 (File validation) after 1.2s
    const timer1 = setTimeout(() => {
      setActiveStepIndex(1);
      setProgressPercent(40);
    }, 1200);

    // Step 1 -> Step 2 (Technical image checks) after 2.8s
    const timer2 = setTimeout(() => {
      setActiveStepIndex(2);
      setProgressPercent(75);
    }, 2800);

    // Step 2 -> Step 3 (Preparing demonstration) after 4.4s
    const timer3 = setTimeout(() => {
      setActiveStepIndex(3);
      setProgressPercent(90);
    }, 4400);

    // Complete all steps after 5.6s
    const timer4 = setTimeout(() => {
      setActiveStepIndex(PROCESSING_STEPS.length);
      setProgressPercent(100);
      setIsFinished(true);
      if (onProcessingComplete) {
        onProcessingComplete();
      }
    }, 5600);

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
    <div className="tb-proc-page">
      {/* Header with active screening state and full navigation capabilities */}
      <LandingHeader
        variant="minimal"
        activeSection="screening"
        onLogoClick={onBackToLanding || onBack}
        onNavigate={onNavigate}
      />

      {/* Background Decorative Pulmonary Graphics */}
      <div className="tb-proc-bg-decor tb-proc-bg-decor--left" aria-hidden="true">
        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="tb-proc-bg-svg">
          <path
            d="M200 40v360M185 70c-25-15-70-5-85 45s-10 110 20 160c25 40 65 30 65 10M215 70c25-15 70-5 85 45s10 110-20 160c-25 40-65 30-65 10"
            stroke="#0284C7"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M200 90l-35 30m35-15l35 30m-35 15l-45 35m45-20l45 35m-45 15l-50 40m50-25l50 40"
            stroke="#0284C7"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <div className="tb-proc-bg-decor tb-proc-bg-decor--right" aria-hidden="true">
        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="tb-proc-bg-svg">
          <circle cx="280" cy="240" r="140" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="5 5" />
          <circle cx="280" cy="240" r="90" stroke="#0284C7" strokeWidth="1" />
          <path d="M280 180c-30-40-70-50-120-45M280 300c-30 40-70 50-120 45" stroke="#0284C7" strokeWidth="1.2" />
        </svg>
      </div>

      <main className="tb-proc-content">
        <div className="container tb-proc-container">
          {/* Centered Title & Workflow Badge Matching Reference */}
          <div className="tb-proc-heading-group">
            <h1 className="tb-proc-title">Preparing Your Result</h1>
            <div className="tb-proc-workflow-badge">
              <span className="tb-proc-workflow-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.5 5.5 C10.5 5.5, 7.5 6, 5.5 8.5 C3.5 11.5, 3 17, 4.5 20.5 C6.5 23, 10 22, 10.5 19.5 C11 17, 10.5 9, 10.5 5.5 Z"
                    fill="#0284C7"
                  />
                  <path
                    d="M13.5 5.5 C13.5 5.5, 16.5 6, 18.5 8.5 C20.5 11.5, 21 17, 19.5 20.5 C17.5 23, 14 22, 13.5 19.5 C13 17, 13.5 9, 13.5 5.5 Z"
                    fill="#0284C7"
                  />
                </svg>
              </span>
              <span className="tb-proc-workflow-text">Tuberculosis Screening — Chest X-ray</span>
            </div>
          </div>

          {/* Missing Image Recovery Fallback */}
          {!file && !sampleLoaded ? (
            <div className="tb-proc-recovery-card" role="alert">
              <div className="tb-proc-recovery-icon" aria-hidden="true">⚠️</div>
              <h2 className="tb-proc-recovery-title">No Radiograph Selected for Processing</h2>
              <p className="tb-proc-recovery-desc">
                To run the tuberculosis screening demonstration, please select a valid chest X-ray image from the upload page.
              </p>
              <div className="tb-proc-recovery-actions">
                <button
                  type="button"
                  className="tb-proc-recovery-btn tb-proc-recovery-btn--primary"
                  onClick={onBack}
                >
                  ← Return to Upload Page
                </button>
                <button
                  type="button"
                  className="tb-proc-recovery-btn tb-proc-recovery-btn--secondary"
                  onClick={handleLoadSample}
                >
                  Use Demonstration Sample
                </button>
              </div>
            </div>
          ) : (
            /* Main Two-Column Layout: Image Preview (Left) & Stepper (Right) */
            <div className="tb-proc-grid">
              {/* Left Column: Image Card with Scanning Effect */}
              <div className="tb-proc-card tb-proc-card--preview">
                <div className="tb-proc-frame">
                  {previewUrl ? (
                    <div className="tb-proc-img-wrapper">
                      <img
                        src={previewUrl}
                        alt="Chest X-ray currently undergoing technical screening validation"
                        className="tb-proc-img"
                      />

                      {/* Anatomical Orientation Marker (R) Matching Medical Radiographs */}
                      <span className="tb-proc-orientation-marker" aria-hidden="true">
                        R
                      </span>

                      {/* Animated Blue Scanning Laser Bar */}
                      {!isFinished && (
                        <div className="tb-proc-scanner-bar" aria-hidden="true" />
                      )}

                      {/* Subtle Vignette Overlay */}
                      <div className="tb-proc-vignette" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="tb-proc-placeholder">Loading image preview...</div>
                  )}
                </div>

                {/* File Metadata Info Pill */}
                {file && (
                  <div className="tb-proc-file-meta">
                    <span className="tb-proc-file-name" title={file.name}>
                      {file.name}
                    </span>
                    <span className="tb-proc-file-dot">•</span>
                    <span className="tb-proc-file-size">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Processing Stepper Timeline */}
              <div className="tb-proc-card tb-proc-card--timeline">
                <div className="tb-proc-stepper" role="region" aria-label="Processing Progress">
                  {PROCESSING_STEPS.map((step, index) => {
                    const isCompleted = index < activeStepIndex;
                    const isActive = index === activeStepIndex && !isFinished;
                    const isPending = index > activeStepIndex;

                    return (
                      <div
                        key={step.id}
                        className={`tb-proc-step ${
                          isCompleted ? 'tb-proc-step--completed' : ''
                        } ${isActive ? 'tb-proc-step--active' : ''} ${
                          isPending ? 'tb-proc-step--pending' : ''
                        }`}
                      >
                        <div className="tb-proc-step-indicator-col">
                          <div className="tb-proc-step-badge" aria-hidden="true">
                            {isCompleted ? (
                              /* Solid Blue Checkmark Circle */
                              <svg
                                className="tb-proc-step-check-icon"
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
                              /* Pulsing Concentric Active Circle */
                              <div className="tb-proc-step-pulse-ring">
                                <span className="tb-proc-step-pulse-dot" />
                              </div>
                            ) : (
                              /* Pending State Circle */
                              <div className="tb-proc-step-pending-dot" />
                            )}
                          </div>

                          {/* Connecting Line Between Steps */}
                          {index < PROCESSING_STEPS.length - 1 && (
                            <div
                              className={`tb-proc-step-line ${
                                isCompleted ? 'tb-proc-step-line--completed' : ''
                              }`}
                            />
                          )}
                        </div>

                        <div className="tb-proc-step-content">
                          <span className="tb-proc-step-title">{step.label}</span>
                          {isActive && (
                            <span className="tb-proc-step-detail">{step.detail}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress Bar & Status Summary */}
                <div className="tb-proc-progress-box">
                  <div className="tb-proc-progress-header">
                    <span className="tb-proc-progress-label">
                      {isFinished ? 'Technical Preparation Complete' : 'Validating radiograph...'}
                    </span>
                    <span className="tb-proc-progress-number">{progressPercent}%</span>
                  </div>
                  <div
                    className="tb-proc-progress-track"
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="tb-proc-progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Demonstration Completion Callout (Safe Integration Point) */}
                  {isFinished && (
                    <div className="tb-proc-ready-callout" role="status">
                      <div className="tb-proc-ready-header">
                        <span className="tb-proc-ready-icon" aria-hidden="true">✓</span>
                        <span className="tb-proc-ready-title">Technical Checks Passed</span>
                      </div>
                      <p className="tb-proc-ready-text">
                        The radiograph is ready for Module 7 (Simulated Findings & Annotation Overlay).
                        No clinical diagnosis is generated in this stage.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="tb-proc-actions-bar">
            <button
              type="button"
              className="tb-proc-back-btn"
              onClick={onBack}
              aria-label="Back to Tuberculosis Image Upload"
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

export default TBProcessingPage;
