import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LandingHeader } from '../landing/LandingHeader';
import { getWorkflow } from '../../services/workflowRegistry';
import { analyzeImage, ApiError } from '../../services/analysisApi';
import { ScreeningResultResponse, FindingItem } from '../../types/results';
import './TBResultsPage.css';

export interface TBResultsPageProps {
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
        color: '#ef4444', // Red
        bg: 'rgba(239, 68, 68, 0.16)',
        border: '#ef4444',
        label: 'Suspected Infiltration / Lesion',
      };
    case 'inspection':
      return {
        color: '#f97316', // Orange
        bg: 'rgba(249, 115, 22, 0.16)',
        border: '#f97316',
        label: 'Consolidation / Parenchymal Focus',
      };
    case 'reference':
    default:
      return {
        color: '#10b981', // Green
        bg: 'rgba(16, 185, 129, 0.16)',
        border: '#10b981',
        label: 'Normal Anatomical Landmark',
      };
  }
};

export const TBResultsPage: React.FC<TBResultsPageProps> = ({
  file,
  onBack,
  onNewScreening,
  initialResult = null,
  onBackToLanding,
  onNavigate,
}) => {
  const workflow = useMemo(() => getWorkflow('tb')!, []);

  // In-memory state only (pure ephemeral state; zero persistent storage)
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
    // Abort previous in-flight request when file changes
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
      setImageObjectUrl('/assets/example-chest-xray.png');
      setResult(initialResult ?? null);
      setError(null);
      setSelectedFindingId(null);
    }
  }, [file, initialResult]);

  // Request analysis from backend API with request cancellation & race condition protection
  const fetchAnalysis = async (currentFile: File) => {
    // Cancel any prior pending request
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
      const data = await analyzeImage('tb', currentFile, controller.signal);

      // Discard response if a newer request has started
      if (currentRequestId === activeRequestIdRef.current) {
        setResult(data);
      }
    } catch (err: unknown) {
      // Discard if cancelled or superseded
      if (controller.signal.aborted || currentRequestId !== activeRequestIdRef.current) {
        return;
      }
      setResult(null); // Ensure stale result is cleared on failure
      if (err instanceof ApiError) {
        if (err.code !== 'ABORTED') {
          setError(err);
        }
      } else {
        const message = err instanceof Error ? err.message : 'Failed to analyze chest radiograph.';
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

  // Only display findings actually returned by the backend
  const displayedFindings: FindingItem[] = useMemo(() => {
    return result?.findings ?? [];
  }, [result]);

  return (
    <div className="tb-results-page">
      {/* Header with active screening state and full navigation capabilities */}
      <LandingHeader
        variant="minimal"
        activeSection="screening"
        onLogoClick={onBackToLanding || onNewScreening}
        onNavigate={onNavigate}
      />

      {/* Background Decorative Pulmonary Graphics */}
      <div className="tb-results-bg-decor tb-results-bg-decor--left" aria-hidden="true">
        <svg viewBox="0 0 400 500" fill="none" className="tb-results-bg-svg">
          <path
            d="M200 40v360M185 70c-25-15-70-5-85 45s-10 110 20 160c25 40 65 30 65 10M215 70c25-15 70-5 85 45s10 110-20 160c-25 40-65 30-65 10"
            stroke="#0284C7"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>
      </div>
      <div className="tb-results-bg-decor tb-results-bg-decor--right" aria-hidden="true">
        <svg viewBox="0 0 400 500" fill="none" className="tb-results-bg-svg">
          <path
            d="M200 40v360M215 70c25-15 70-5 85 45s10 110-20 160c-25 40-65 30-65 10M185 70c-25-15-70-5-85 45s-10 110 20 160c25 40 65 30 65 10"
            stroke="#0284C7"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      <main className="tb-results-main" id="main-content">
        <div className="container tb-results-container">
          
          {/* Header Title & Workflow Capsule */}
          <div className="tb-results-header-block">
            <h1 className="tb-results-title">Screening Results</h1>
            
            <div className="tb-results-header-badges">
              <div className="tb-results-capsule" role="status">
                <span className="tb-results-capsule-icon" aria-hidden="true">
                  {/* Blue Lung Icon */}
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v18m0-18C10 3 6 4 4 8c-2 4-1 9 1 12 1.5 2.25 4 2 7-1m0-19c2 0 6 1 8 5 2 4 1 9-1 12-1.5 2.25-4 2-7-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="tb-results-capsule-text">
                  {workflow.displayName} &mdash; {workflow.subtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Error Banner with Retry */}
          {error && (
            <div className="tb-results-error-banner" role="alert">
              <div className="tb-results-error-content">
                <span className="tb-results-error-icon" aria-hidden="true">⚠</span>
                <div>
                  <p className="tb-results-error-title">Analysis Notice ({error.code})</p>
                  <p className="tb-results-error-msg">{error.message}</p>
                </div>
              </div>
              <button
                type="button"
                className="tb-results-retry-btn"
                onClick={handleRetry}
              >
                Retry Analysis
              </button>
            </div>
          )}

          {/* Loading State Overlay */}
          {loading && (
            <div className="tb-results-loading-card" role="status" aria-live="polite">
              <div className="tb-results-loading-spinner" />
              <p className="tb-results-loading-text">
                Processing chest radiograph through educational simulation pipeline...
              </p>
            </div>
          )}

          {/* 3. Main Two-Column Content Grid */}
          {!loading && (
            <div className="tb-results-grid">
              
              {/* Left Column: Side-by-Side Images, Annotation Canvas & Legend */}
              <div className="tb-results-visual-col">
                <div className="tb-results-images-pair">
                  
                  {/* Original Image Card */}
                  <div className={`tb-results-img-card ${activeTab === 'original' ? 'tb-results-img-card--active' : ''}`}>
                    <div className="tb-results-img-card-header">
                      <svg className="tb-results-card-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span className="tb-results-img-card-title">Original Image</span>
                    </div>

                    <div className="tb-results-img-viewport" data-coordinate-space="normalized">
                      <span className="tb-results-anatomical-marker" aria-hidden="true">R</span>
                      {imageObjectUrl && (
                        <img
                          src={imageObjectUrl}
                          alt="Original Chest X-ray Radiograph"
                          className="tb-results-img"
                        />
                      )}
                    </div>
                  </div>

                  {/* Annotated Image Card */}
                  <div className={`tb-results-img-card ${activeTab === 'annotated' ? 'tb-results-img-card--active' : ''}`}>
                    <div className="tb-results-img-card-header">
                      <svg className="tb-results-card-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      <span className="tb-results-img-card-title">Annotated Image</span>
                    </div>

                    <div className="tb-results-img-viewport" data-coordinate-space="normalized">
                      <span className="tb-results-anatomical-marker" aria-hidden="true">R</span>
                      {imageObjectUrl && (
                        <img
                          src={imageObjectUrl}
                          alt="Annotated Chest X-ray Radiograph Demonstration"
                          className="tb-results-img"
                        />
                      )}

                      {/* Dynamic Educational Reference Landmark Overlays (Bounded in [0.0, 1.0]) */}
                      <div className="tb-results-annotation-layer" aria-hidden="true">
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
                              className={`tb-educational-overlay-zone ${isSelected ? 'tb-educational-overlay-zone--selected' : ''}`}
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
                                className="tb-educational-overlay-badge"
                                style={{ backgroundColor: style.color }}
                              >
                                {idx + 1}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Baseline View Notice (if empty) */}
                      {displayedFindings.length === 0 && (
                        <div className="tb-annotated-disclaimer-pill tb-annotated-disclaimer-pill--baseline">
                          Baseline View &middot; No Overlay Markers Active
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Sub-image Switcher Tabs */}
                <div className="tb-results-tabs-row" role="tablist" aria-label="Radiograph View Switcher">
                  <button
                    type="button"
                    role="tab"
                    id="tab-original"
                    aria-selected={activeTab === 'original'}
                    aria-controls="panel-original"
                    className={`tb-results-tab-btn ${activeTab === 'original' ? 'tb-results-tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('original')}
                  >
                    <div className="tb-results-tab-thumb" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3v18m0-18C10 3 6 4 4 8c-2 4-1 9 1 12 1.5 2.25 4 2 7-1m0-19c2 0 6 1 8 5 2 4 1 9-1 12-1.5 2.25-4 2-7-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="tb-results-tab-label">Original Image</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    id="tab-annotated"
                    aria-selected={activeTab === 'annotated'}
                    aria-controls="panel-annotated"
                    className={`tb-results-tab-btn ${activeTab === 'annotated' ? 'tb-results-tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('annotated')}
                  >
                    <div className="tb-results-tab-thumb" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3v18m0-18C10 3 6 4 4 8c-2 4-1 9 1 12 1.5 2.25 4 2 7-1m0-19c2 0 6 1 8 5 2 4 1 9-1 12-1.5 2.25-4 2-7-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="tb-results-tab-label">Annotated Image</span>
                  </button>
                </div>

                {/* 2. Medical Problem, Solution & Common Image Insights Card (Collapsible, Positioned below Original & Annotated Images) */}
                <div className="tb-results-card tb-results-card--clinical-guidance">
                  <div
                    className="tb-results-card-header tb-clinical-guidance-header"
                    onClick={() => setIsGuidanceOpen(!isGuidanceOpen)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isGuidanceOpen}
                    aria-controls="clinical-guidance-content"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsGuidanceOpen(!isGuidanceOpen);
                      }
                    }}
                  >
                    <div className="tb-clinical-guidance-header-left">
                      <svg className="tb-results-card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                      <h2 className="tb-results-card-title">Medical Problem, Solution &amp; Common Image Insights</h2>
                    </div>

                    <div className="tb-clinical-guidance-toggle">
                      <span className="tb-toggle-label">{isGuidanceOpen ? 'Collapse' : 'Expand'}</span>
                      <span className={`tb-guidance-arrow ${isGuidanceOpen ? 'tb-guidance-arrow--open' : ''}`} aria-hidden="true">▾</span>
                    </div>
                  </div>

                  {isGuidanceOpen && (
                    <div id="clinical-guidance-content" className="tb-clinical-guidance-content">
                      <div className="tb-tech-medical-section">
                        <div className="tb-tech-medical-header-row">
                          <span className="tb-tech-medical-badge tb-tech-medical-badge--problem">Medical Problem</span>
                          <h3 className="tb-tech-medical-heading">Primary Medical Problem (Tuberculosis)</h3>
                        </div>
                        <p className="tb-tech-medical-text">
                          Chest radiography screens for active pulmonary tuberculosis (PTB) by identifying upper-zone parenchymal
                          infiltrates, cavitations, nodular consolidations, and hilar adenopathy caused by <em>Mycobacterium tuberculosis</em>.
                          Upper lobes are predominantly affected due to high oxygen tension favoring mycobacterial growth.
                        </p>
                      </div>

                      <div className="tb-tech-medical-section">
                        <div className="tb-tech-medical-header-row">
                          <span className="tb-tech-medical-badge tb-tech-medical-badge--solution">Clinical Solutions</span>
                          <h3 className="tb-tech-medical-heading">Clinical Solutions &amp; Recommended Actions</h3>
                        </div>
                        <ul className="tb-tech-medical-list">
                          <li><strong>Rapid Molecular Assay:</strong> Sputum GeneXpert MTB/RIF (WHO-recommended first-line test for simultaneous TB detection and rifampicin resistance).</li>
                          <li><strong>Microbiological Confirmation:</strong> Sputum Acid-Fast Bacilli (AFB) smear microscopy across 2–3 consecutive mornings.</li>
                          <li><strong>Treatment Protocol:</strong> Pulmonologist evaluation for standard 6-month first-line anti-TB regimen (2 months HRZE intensive phase + 4 months HR continuation).</li>
                          <li><strong>Public Health:</strong> Airborne isolation precautions and household contact tracing.</li>
                        </ul>
                      </div>

                      <div className="tb-tech-medical-section">
                        <div className="tb-tech-medical-header-row">
                          <span className="tb-tech-medical-badge tb-tech-medical-badge--insights">Common Insights</span>
                          <h3 className="tb-tech-medical-heading">Common Information Obtainable from Frontal Chest X-Rays</h3>
                        </div>
                        <ul className="tb-tech-medical-list">
                          <li><strong>Lung Aeration &amp; Parenchyma:</strong> Identifies focal consolidations, interstitial reticular patterns, atelectasis, and emphysema.</li>
                          <li><strong>Pleural Spaces &amp; Sulci:</strong> Sharp costophrenic recesses rule out blunting from pleural effusion (&gt;150 mL fluid accumulation) or hemothorax.</li>
                          <li><strong>Cardiothoracic Ratio (CTR):</strong> Evaluates heart-to-thorax width ratio (normal &lt; 0.50) to screen for cardiomegaly or pericardial effusion.</li>
                          <li><strong>Mediastinum &amp; Trachea:</strong> Midline tracheal position verifies absence of tension pneumothorax or atelectatic shift.</li>
                          <li><strong>Thoracic Skeleton:</strong> Inspects ribs, clavicles, and spine for fractures, osteolytic lesions, or deformities.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Findings & Other Observations */}
              <div className="tb-results-details-col">
                
                {/* 1. Findings Card */}
                <div className="tb-results-card tb-results-card--findings">
                  <div className="tb-results-card-header">
                    <svg className="tb-results-card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <h2 className="tb-results-card-title">Findings</h2>
                  </div>

                  {displayedFindings.length === 0 ? (
                    <div className="tb-results-findings-empty">
                      <svg className="tb-findings-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <p className="tb-findings-empty-title">Baseline Presentation</p>
                      <p className="tb-findings-empty-desc">
                        Displaying an unannotated baseline radiograph for visual comparison.
                      </p>
                    </div>
                  ) : (
                    <div className="tb-results-findings-list" role="list">
                      {displayedFindings.map((finding, idx) => {
                        const isSelected = selectedFindingId === finding.id;
                        const style = getCategoryStyle(finding.category);

                        return (
                          <div
                            key={finding.id}
                            className={`tb-finding-item ${isSelected ? 'tb-finding-item--selected' : ''}`}
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
                              className="tb-finding-badge"
                              style={{ backgroundColor: style.color }}
                              aria-hidden="true"
                            >
                              {idx + 1}
                            </div>

                            <div
                              className="tb-finding-thumb"
                              style={{ borderColor: style.color }}
                              aria-hidden="true"
                            >
                              {imageObjectUrl && (
                                <img src={imageObjectUrl} alt="" className="tb-finding-thumb-img" />
                              )}
                            </div>

                            <div className="tb-finding-info">
                              <div className="tb-finding-header-row">
                                <h3 className="tb-finding-title">{finding.title}</h3>
                              </div>
                              <p className="tb-finding-desc">{finding.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Other Observations Card */}
                <div className="tb-results-card tb-results-card--observations">
                  <div className="tb-results-card-header">
                    <svg className="tb-results-card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <h2 className="tb-results-card-title">Other Observations</h2>
                  </div>

                  <div className="tb-results-obs-list">
                    <div className="tb-results-obs-row">
                      <div className="tb-results-obs-label-group">
                        <span className="tb-results-obs-icon tb-results-obs-icon--heart" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </span>
                        <span className="tb-results-obs-name">Heart Size</span>
                      </div>
                      <span className="tb-results-obs-val">Appears normal.</span>
                    </div>

                    <div className="tb-results-obs-row">
                      <div className="tb-results-obs-label-group">
                        <span className="tb-results-obs-icon tb-results-obs-icon--lung" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                          </svg>
                        </span>
                        <span className="tb-results-obs-name">Pleural Space</span>
                      </div>
                      <span className="tb-results-obs-val">No significant effusion detected.</span>
                    </div>

                    <div className="tb-results-obs-row">
                      <div className="tb-results-obs-label-group">
                        <span className="tb-results-obs-icon tb-results-obs-icon--bone" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.8 5.2a3.5 3.5 0 0 0-4.9 0l-.9.9-.9-.9a3.5 3.5 0 0 0-4.9 4.9l.9.9-4.8 4.8a3.5 3.5 0 0 0 4.9 4.9l4.8-4.8.9.9a3.5 3.5 0 0 0 4.9-4.9l-.9-.9.9-.9a3.5 3.5 0 0 0 0-4.9z"/>
                          </svg>
                        </span>
                        <span className="tb-results-obs-name">Bone Structure</span>
                      </div>
                      <span className="tb-results-obs-val">Ribs and clavicle appear normal.</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Toast Notification (e.g. PDF disabled notice) */}
          {pdfNotification && (
            <aside className="tb-results-toast" role="status" aria-live="polite">
              <span className="tb-results-toast-icon" aria-hidden="true">ℹ</span>
              <span>{pdfNotification}</span>
            </aside>
          )}

          {/* 4. Bottom Navigation & Action Bar */}
          <div className="tb-results-actions-bar">
            <button
              type="button"
              className="tb-results-btn tb-results-btn--back"
              onClick={onBack}
              aria-label="Back to Previous View"
            >
              <span aria-hidden="true">&larr;</span>
              <span>Back</span>
            </button>

            <div className="tb-results-btn-group">
              <button
                type="button"
                className="tb-results-btn tb-results-btn--download"
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
                className="tb-results-btn tb-results-btn--new"
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

export default TBResultsPage;