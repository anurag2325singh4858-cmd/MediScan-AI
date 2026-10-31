import React from 'react';
import { LandingHeader } from '../landing/LandingHeader';
import { WorkflowDefinition, ScreeningResultResponse } from '../../types/results';
import './ResultsLayout.css';

export interface ResultsLayoutProps {
  workflow: WorkflowDefinition;
  result?: ScreeningResultResponse | null;
  onNavigateHome?: () => void;
  onResetWorkflow?: () => void;
  onBackToSelection?: () => void;
  imageViewerSlot?: React.ReactNode;
  findingsSlot?: React.ReactNode;
  disclaimerSlot?: React.ReactNode;
  technicalSummarySlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const ResultsLayout: React.FC<ResultsLayoutProps> = ({
  workflow,
  result,
  onNavigateHome,
  onResetWorkflow,
  onBackToSelection,
  imageViewerSlot,
  findingsSlot,
  disclaimerSlot,
  technicalSummarySlot,
  actionsSlot,
  children,
  className = '',
}) => {
  return (
    <div className={`results-layout results-layout--${workflow.theme} ${workflow.themeClass} ${className}`}>
      {/* 1. Internal Minimal Header (MediScan AI logo only, NO nav links or CTA) */}
      <LandingHeader
        variant="minimal"
        onLogoClick={onNavigateHome}
      />

      {/* 2. Main Page Content Container */}
      <main className="results-layout__main" id="main-content">
        <div className="container results-layout__container">
          
          {/* Header Title Section */}
          <div className="results-layout__hero">
            <div className="results-layout__workflow-capsule">
              <span className="results-layout__workflow-icon" aria-hidden="true">
                {workflow.theme === 'tb' ? (
                  // Lungs Icon
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v18m0-18C10 3 6 4 4 8c-2 4-1 9 1 12 1.5 2.25 4 2 7-1m0-19c2 0 6 1 8 5 2 4 1 9-1 12-1.5 2.25-4 2-7-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  // Eye Icon
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </span>
              <span className="results-layout__workflow-name">
                {workflow.displayName} &mdash; {workflow.subtitle}
              </span>
              {result?.result_id && (
                <span className="results-layout__result-id" title={`Instance ID: ${result.result_id}`}>
                  &bull; {result.result_id}
                </span>
              )}
            </div>

            <h1 className="results-layout__title">Screening Results Demonstration</h1>
            <p className="results-layout__subtitle">
              Review synthetic demonstration markers and verified technical raster integrity for this simulation instance.
            </p>
          </div>

          {/* Top Prominent Disclaimer Slot */}
          {disclaimerSlot && (
            <div className="results-layout__disclaimer-row">
              {disclaimerSlot}
            </div>
          )}

          {/* Two-Column Responsive Work Area */}
          <div className="results-layout__grid">
            {/* Left Column: Image Viewer */}
            <div className="results-layout__col-image">
              {imageViewerSlot}
            </div>

            {/* Right Column: Findings & Technical Summary */}
            <div className="results-layout__col-details">
              {findingsSlot}
              {technicalSummarySlot}
            </div>
          </div>

          {/* Children / Extension slot */}
          {children && (
            <div className="results-layout__custom-content">
              {children}
            </div>
          )}

          {/* Navigation and Action Bar */}
          <div className="results-layout__footer-actions">
            <button
              type="button"
              className="results-layout__btn-back"
              onClick={onBackToSelection || onResetWorkflow || onNavigateHome}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Screen Another Image</span>
            </button>

            {actionsSlot && (
              <div className="results-layout__custom-actions">
                {actionsSlot}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default ResultsLayout;
