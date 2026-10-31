import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LandingHeader } from '../landing/LandingHeader';
import { getWorkflow } from '../../services/workflowRegistry';
import { analyzeImage, ApiError } from '../../services/analysisApi';
import { ScreeningResultResponse, FindingItem } from '../../types/results';
import './DRResultsPage.css';

export interface DRResultsPageProps {
  file: File | null;
  onBack: () => void;
  onNewScreening: () => void;
  initialResult?: ScreeningResultResponse | null;
  onBackToLanding?: () => void;
  onNavigate?: (section: 'home' | 'screening' | 'how-it-works') => void;
}

interface CategoryStyle {
  color: string;
  bg: string;
  border: string;
  label: string;
}

const getCategoryStyle = (category?: 'reference' | 'inspection' | 'highlighted'): CategoryStyle => {
  switch (category) {
    case 'highlighted':
      return {
        color: '#ea580c', // DR Coral / Orange
        bg: 'rgba(234, 88, 12, 0.16)',
        border: '#ea580c',
        label: 'Vascular Landmark',
      };
    case 'inspection':
      return {
        color: '#0284c7', // Cyan / Blue for fovea / macula
        bg: 'rgba(2, 132, 199, 0.16)',
        border: '#0284c7',
        label: 'Macular Center',
      };
    case 'reference':
    default:
      return {
        color: '#10b981', // Green for anatomical disc / quadrant
        bg: 'rgba(16, 185, 129, 0.16)',
        border: '#10b981',
        label: 'Anatomical Reference',
      };
  }
};

export const DRResultsPage: React.FC<DRResultsPageProps> = ({
  file,
  onBack,
  onNewScreening,
  initialResult = null,
  onBackToLanding,
  onNavigate,
}) => {
  const workflow = useMemo(() => getWorkflow('dr')!, []);

  // Ephemeral in-memory state only (zero persistent storage)
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ScreeningResultResponse | null>(initialResult);
  const [loading, setLoading] = useState<boolean>(!initialResult && !!file);
  const [error, setError] = useState<ApiError | null>(null);
  const [activeTab, setActiveTab] = useState<'original' | 'annotated'>('original');
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [pdfNotification, setPdfNotification] = useState<string | null>(null);
  const [isGuidanceOpen, setIsGuidanceOpen] = useState<boolean>(false);

  // Concurrency and race condition guards
  const activeRequestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up in-memory object URL and abort active requests on unmount or file change
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setImageObjectUrl(url);
      setResult(initialResult ?? null);
      setError(null);
      setSelectedFindingId(null);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImageObjectUrl('/assets/example-retinal-fundus.png');
      setResult(initialResult ?? null);
      setError(null);
      setSelectedFindingId(null);
    }
  }, [file, initialResult]);

  // Request analysis from backend API with request cancellation & race condition protection
  const fetchAnalysis = async (currentFile: File) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Track request ID to prevent stale asynchronous responses from overwriting newer uploads
    const currentRequestId = ++activeRequestIdRef.current;

    setLoading(true);
    setError(null);
    setResult(null); // Clear previous result immediately
    setSelectedFindingId(null);

    try {
      const data = await analyzeImage('dr', currentFile, controller.signal);

      // Discard response if a newer request has started
      if (currentRequestId === activeRequestIdRef.current) {
        setResult(data);
      }
    } catch (err: unknown) {
      if (controller.signal.aborted || currentRequestId !== activeRequestIdRef.current) {
        return;
      }
      setResult(null); // Ensure stale result is cleared on failure
      if (err instanceof ApiError) {
        if (err.code !== 'ABORTED') {
          setError(err);
        }
      } else {
        const message = err instanceof Error ? err.message : 'Failed to analyze retinal fundus photograph.';
        setError(new ApiError('CLIENT_ERROR', message, 0));
      }
    } finally {
      if (currentRequestId === activeRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (file && !initialResult) {
      fetchAnalysis(file);
    }
  }, [file, initialResult]);

  const handleRetry = () => {
    if (file) {
      fetchAnalysis(file);
    }
  };

  const handleDownloadClick = () => {
    setPdfNotification('Coming soon');
    setTimeout(() => {
      setPdfNotification(null);
    }, 4000);
  };

  const displayedFindings: FindingItem[] = useMemo(() => {
    return result?.findings ?? [];
  }, [result]);

  return (
    <div className="dr-results-page">
      {/* Header with active screening state and full navigation capabilities */}
      <LandingHeader
        variant="minimal"
        activeSection="screening"
        onLogoClick={onBackToLanding || onNewScreening}
        onNavigate={onNavigate}
      />

      {/* Background Decorative Retinal Circles (Coral/Orange Accent Theme) */}
      <div className="dr-results-bg-decor dr-results-bg-decor--left" aria-hidden="true">
        <svg viewBox="0 0 400 500" fill="none" className="dr-results-bg-svg">
          <circle cx="80" cy="250" r="180" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="5 5" />
          <circle cx="80" cy="250" r="120" stroke="#EA580C" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="80" cy="250" r="60" stroke="#EA580C" strokeWidth="1.5" />
          <circle cx="80" cy="250" r="24" stroke="#EA580C" strokeWidth="2" />
          <path d="M80 70v360M-100 250h360" stroke="#EA580C" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>
      <div className="dr-results-bg-decor dr-results-bg-decor--right" aria-hidden="true">
        <svg viewBox="0 0 400 500" fill="none" className="dr-results-bg-svg">
          <circle cx="320" cy="250" r="180" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="5 5" />
          <circle cx="320" cy="250" r="120" stroke="#EA580C" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="320" cy="250" r="60" stroke="#EA580C" strokeWidth="1.5" />
          <circle cx="320" cy="250" r="24" stroke="#EA580C" strokeWidth="2" />
          <path d="M320 70v360M140 250h360" stroke="#EA580C" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      <main className="dr-results-main" id="main-content">
        <div className="container dr-results-container">
          
          {/* 2. Header Title & Coral/Orange Workflow Capsule */}
          <div className="dr-results-header-block">
            <h1 className="dr-results-title">Screening Results</h1>
            
            <div className="dr-results-header-badges">
              <div className="dr-results-capsule" role="status">
                <span className="dr-results-capsule-icon" aria-hidden="true">
                  {/* Eye / Retinal Icon in Coral/Orange */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <span className="dr-results-capsule-text">
                  {workflow.displayName} &mdash; {workflow.subtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Error Banner with Retry */}
          {error && (
            <div className="dr-results-error-banner" role="alert">
              <div className="dr-results-error-content">
                <span className="dr-results-error-icon" aria-hidden="true">⚠</span>
                <div>
                  <p className="dr-results-error-title">Analysis Notice ({error.code})</p>
                  <p className="dr-results-error-msg">{error.message}</p>
                </div>
              </div>
              <button
                type="button"
                className="dr-results-retry-btn"
                onClick={handleRetry}
              >
                Retry Analysis
              </button>
            </div>
          )}

          {/* Loading State Overlay */}
          {loading && (
            <div className="dr-results-loading-card" role="status" aria-live="polite">
              <div className="dr-results-loading-spinner" />
              <p className="dr-results-loading-text">
                Analyzing retinal fundus photograph through educational simulation pipeline...
              </p>
            </div>
          )}

          {/* 3. Main Two-Column Content Grid */}
          {!loading && (
            <div className="dr-results-grid">
              
              {/* Left Column: Side-by-Side Images, Switcher Tabs, & Collapsible Guidance */}
              <div className="dr-results-visual-col">
                <div className="dr-results-images-pair">
                  
                  {/* Original Image Card */}
                  <div className={`dr-results-img-card ${activeTab === 'original' ? 'dr-results-img-card--active' : ''}`}>
                    <div className="dr-results-img-card-header">
                      <svg className="dr-results-card-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span className="dr-results-img-card-title">Original Image</span>
                    </div>

                    <div className="dr-results-img-viewport" data-coordinate-space="normalized">
                      <span className="dr-results-anatomical-marker" aria-hidden="true">Fundus (45°)</span>
                      {imageObjectUrl && (
                        <img
                          src={imageObjectUrl}
                          alt="Original Retinal Fundus Photograph"
                          className="dr-results-img"
                        />
                      )}
                    </div>
                  </div>

                  {/* Annotated Image Card */}
                  <div className={`dr-results-img-card ${activeTab === 'annotated' ? 'dr-results-img-card--active' : ''}`}>
                    <div className="dr-results-img-card-header">
                      <svg className="dr-results-card-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      <span className="dr-results-img-card-title">Annotated Image</span>
                    </div>

                    <div className="dr-results-img-viewport" data-coordinate-space="normalized">
                      <span className="dr-results-anatomical-marker" aria-hidden="true">Fundus (45°)</span>
                      {imageObjectUrl && (
                        <img
                          src={imageObjectUrl}
                          alt="Annotated Retinal Fundus Photograph"
                          className="dr-results-img"
                        />
                      )}

                      {/* Dynamic Retinal Landmark Overlays (Bounded in [0.0, 1.0]) */}
                      <div className="dr-results-annotation-layer" aria-hidden="true">
                        {displayedFindings.map((finding, idx) => {
                          if (!finding.coordinates) return null;
                          const { x_min, y_min, x_max, y_max } = finding.coordinates;
                          const left = `${Math.max(0, Math.min(1, x_min)) * 100}%`;
                          const top = `${Math.max(0, Math.min(1, y_min)) * 100}%`;
                          const width = `${Math.max(0, Math.min(1 - x_min, x_max - x_min)) * 100}%`;
                          const height = `${Math.max(0, Math.min(1 - y_min, y_max - y_min)) * 100}%`;
                          const isSelected = selectedFindingId === finding.id;
                          const style = getCategoryStyle(finding.category);

                          return (
                            <div
                              key={finding.id}
                              className={`dr-educational-overlay-zone ${isSelected ? 'dr-educational-overlay-zone--selected' : ''}`}
                              style={{
                                left,
                                top,
                                width,
                                height,
                                borderColor: style.border,
                                backgroundColor: style.bg,
                              }}
                              title={`${idx + 1}: ${finding.title}`}
                            >
                              <span
                                className="dr-educational-overlay-badge"
                                style={{ backgroundColor: style.color }}
                              >
                                {idx + 1}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {displayedFindings.length === 0 && (
                        <div className="dr-annotated-disclaimer-pill">
                          Baseline View &middot; No Overlay Markers Active
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Sub-image Switcher Tabs */}
                <div className="dr-results-tabs-row" role="tablist" aria-label="Retinal Fundus View Switcher">
                  <button
                    type="button"
                    role="tab"
                    id="tab-original"
                    aria-selected={activeTab === 'original'}
                    aria-controls="panel-original"
                    className={`dr-results-tab-btn ${activeTab === 'original' ? 'dr-results-tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('original')}
                  >
                    <div className="dr-results-tab-thumb" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                      </svg>
                    </div>
                    <span className="dr-results-tab-label">Original Image</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    id="tab-annotated"
                    aria-selected={activeTab === 'annotated'}
                    aria-controls="panel-annotated"
                    className={`dr-results-tab-btn ${activeTab === 'annotated' ? 'dr-results-tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('annotated')}
                  >
                    <div className="dr-results-tab-thumb" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                      </svg>
                    </div>
                    <span className="dr-results-tab-label">Annotated Image</span>
                  </button>
                </div>

                {/* Collapsible Medical Insights & Retinal Anatomy Card (Directly Below Images) */}
                <div className="dr-results-card dr-results-card--clinical-guidance">
                  <div
                    className="dr-results-card-header dr-clinical-guidance-header"
                    onClick={() => setIsGuidanceOpen(!isGuidanceOpen)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isGuidanceOpen}
                    aria-controls="dr-clinical-guidance-content"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsGuidanceOpen(!isGuidanceOpen);
                      }
                    }}
                  >
                    <div className="dr-clinical-guidance-header-left">
                      <svg className="dr-results-card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                      </svg>
                      <h2 className="dr-results-card-title">Medical Insights &amp; Retinal Anatomy</h2>
                    </div>

                    <div className="dr-clinical-guidance-toggle">
                      <span className="dr-toggle-label">{isGuidanceOpen ? 'Collapse' : 'Expand'}</span>
                      <span className={`dr-guidance-arrow ${isGuidanceOpen ? 'dr-guidance-arrow--open' : ''}`} aria-hidden="true">▾</span>
                    </div>
                  </div>

                  {isGuidanceOpen && (
                    <div id="dr-clinical-guidance-content" className="dr-clinical-guidance-content">
                      
                      {/* Section A: Diabetic Retinopathy Overview */}
                      <div className="dr-tech-medical-section">
                        <div className="dr-tech-medical-header-row">
                          <span className="dr-tech-medical-badge dr-tech-medical-badge--overview">Overview</span>
                          <h3 className="dr-tech-medical-heading">Diabetic Retinopathy Overview</h3>
                        </div>
                        <p className="dr-tech-medical-text">
                          Diabetic retinopathy is a microvascular complication of diabetes mellitus. Persistent hyperglycemia damages
                          the delicate endothelial cells and pericytes of retinal capillaries, leading to capillary occlusion, retinal
                          hypoxia, and breakdown of the blood-retinal barrier. This can manifest on fundus photography as microaneurysms,
                          intraretinal hemorrhages, hard exudates (lipid deposits), cotton-wool spots (nerve fiber layer infarcts), and in
                          advanced stages, proliferative neovascularization.
                        </p>
                      </div>

                      {/* Section B: Retinal Structures and Image Interpretation */}
                      <div className="dr-tech-medical-section">
                        <div className="dr-tech-medical-header-row">
                          <span className="dr-tech-medical-badge dr-tech-medical-badge--anatomy">Anatomy</span>
                          <h3 className="dr-tech-medical-heading">Retinal Structures &amp; Image Interpretation</h3>
                        </div>
                        <ul className="dr-tech-medical-list">
                          <li>
                            <strong>Optic Disc &amp; Neuroretinal Rim:</strong> The anatomical exit point for retinal ganglion cell axons and central retinal vessels. Used as the primary anatomical reference and baseline scale (disc diameters) for measuring lesion distances.
                          </li>
                          <li>
                            <strong>Macula &amp; Foveal Center:</strong> The central, pigment-rich region responsible for high-resolution visual acuity. Evaluating the foveal avascular zone (FAZ) is critical for identifying clinically significant macular edema (CSME).
                          </li>
                          <li>
                            <strong>Retinal Vascular Arcades:</strong> Major superior and inferior temporal vessels that delineate vascular perfusion territories and supply the macula and peripheral retina.
                          </li>
                          <li>
                            <strong>Retinal Quadrants:</strong> Standard four-quadrant division (superior temporal, superior nasal, inferior temporal, inferior nasal) used to classify DR severity by assessing lesion distribution.
                          </li>
                        </ul>
                      </div>

                      {/* Section C: Clinical Assessment and Follow-up */}
                      <div className="dr-tech-medical-section">
                        <div className="dr-tech-medical-header-row">
                          <span className="dr-tech-medical-badge dr-tech-medical-badge--clinical">Clinical Protocol</span>
                          <h3 className="dr-tech-medical-heading">Clinical Assessment &amp; Follow-up</h3>
                        </div>
                        <ul className="dr-tech-medical-list">
                          <li>
                            <strong>Dilated Eye Examination:</strong> Comprehensive stereoscopic biomicroscopy by an ophthalmologist or optometrist remains the gold standard for diagnostic confirmation.
                          </li>
                          <li>
                            <strong>Specialized Imaging:</strong> Optical Coherence Tomography (OCT) is utilized to measure retinal thickness and detect subclinical macular edema; Optical Coherence Tomography Angiography (OCTA) or fluorescein angiography evaluates capillary non-perfusion.
                          </li>
                          <li>
                            <strong>Systemic Glycemic Control:</strong> Multidisciplinary management focusing on HbA1c optimization, blood pressure control, and lipid management significantly slows retinopathy progression.
                          </li>
                          <li>
                            <strong>Specialist Interpretation:</strong> Clinical management and screening intervals are determined by certified eye care specialists based on comprehensive professional evaluation.
                          </li>
                        </ul>
                      </div>

                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Findings & Technical Summary */}
              <div className="dr-results-details-col">
                
                {/* 1. Findings Card */}
                <div className="dr-results-card dr-results-card--findings">
                  <div className="dr-results-card-header">
                    <svg className="dr-results-card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <h2 className="dr-results-card-title">Findings</h2>
                  </div>

                  {displayedFindings.length === 0 ? (
                    <div className="dr-results-findings-empty">
                      <svg className="dr-findings-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <p className="dr-findings-empty-title">No Findings Returned</p>
                      <p className="dr-findings-empty-desc">
                        No anatomical landmarks are active for this retinal fundus view.
                      </p>
                    </div>
                  ) : (
                    <div className="dr-results-findings-list" role="list">
                      {displayedFindings.map((finding, idx) => {
                        const isSelected = selectedFindingId === finding.id;
                        const style = getCategoryStyle(finding.category);

                        return (
                          <div
                            key={finding.id}
                            className={`dr-finding-item ${isSelected ? 'dr-finding-item--selected' : ''}`}
                            onClick={() => setSelectedFindingId(isSelected ? null : finding.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedFindingId(isSelected ? null : finding.id);
                              }
                            }}
                            aria-label={`Finding ${idx + 1}: ${finding.title}`}
                          >
                            <div
                              className="dr-finding-badge"
                              style={{ backgroundColor: style.color }}
                              aria-hidden="true"
                            >
                              {idx + 1}
                            </div>

                            <div
                              className="dr-finding-thumb"
                              style={{ borderColor: style.color }}
                              aria-hidden="true"
                            >
                              {imageObjectUrl && (
                                <img src={imageObjectUrl} alt="" className="dr-finding-thumb-img" />
                              )}
                            </div>

                            <div className="dr-finding-info">
                              <div className="dr-finding-header-row">
                                <h3 className="dr-finding-title">{finding.title}</h3>
                              </div>
                              <p className="dr-finding-desc">{finding.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Other Observations Card */}
                <div className="dr-results-card dr-results-card--observations">
                  <div className="dr-results-card-header">
                    <svg className="dr-results-card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <h2 className="dr-results-card-title">Other Observations</h2>
                  </div>

                  <div className="dr-results-obs-list">
                    <div className="dr-results-obs-row">
                      <div className="dr-results-obs-label-group">
                        <span className="dr-results-obs-icon dr-results-obs-icon--disc" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="9" />
                            <circle cx="12" cy="12" r="3" fill="currentColor" />
                          </svg>
                        </span>
                        <span className="dr-results-obs-name">Cup-to-Disc Ratio</span>
                      </div>
                      <span className="dr-results-obs-val">Appears normal.</span>
                    </div>

                    <div className="dr-results-obs-row">
                      <div className="dr-results-obs-label-group">
                        <span className="dr-results-obs-icon dr-results-obs-icon--clarity" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                          </svg>
                        </span>
                        <span className="dr-results-obs-name">Vitreous Clarity</span>
                      </div>
                      <span className="dr-results-obs-val">No significant opacity detected.</span>
                    </div>

                    <div className="dr-results-obs-row">
                      <div className="dr-results-obs-label-group">
                        <span className="dr-results-obs-icon dr-results-obs-icon--vessel" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V3M12 12v9" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="dr-results-obs-name">Vascular Caliber</span>
                      </div>
                      <span className="dr-results-obs-val">Vessels appear normal.</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Toast Notification (e.g. PDF disabled notice) */}
          {pdfNotification && (
            <aside className="dr-results-toast" role="status" aria-live="polite">
              <span className="dr-results-toast-icon" aria-hidden="true">ℹ</span>
              <span>{pdfNotification}</span>
            </aside>
          )}

          {/* 4. Bottom Navigation & Action Bar */}
          <div className="dr-results-actions-bar">
            <button
              type="button"
              className="dr-results-btn dr-results-btn--back"
              onClick={onBack}
              aria-label="Back to Previous View"
            >
              <span aria-hidden="true">&larr;</span>
              <span>Back</span>
            </button>

            <div className="dr-results-btn-group">
              <button
                type="button"
                className="dr-results-btn dr-results-btn--download"
                onClick={handleDownloadClick}
                aria-label="Download Clinical Summary Report (Available in Module 12)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download Report</span>
              </button>

              <button
                type="button"
                className="dr-results-btn dr-results-btn--new"
                onClick={onNewScreening}
                aria-label="Start New Screening Demonstration"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                <span>New Screening</span>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DRResultsPage;
