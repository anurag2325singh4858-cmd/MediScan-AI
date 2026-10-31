import React from 'react';
import './ScreeningSelectionPage.css';
import { LandingHeader } from '../landing/LandingHeader';

export interface ScreeningSelectionPageProps {
  selectedWorkflow?: 'tb' | 'dr' | null;
  onSelectWorkflow: (workflow: 'tb' | 'dr') => void;
  onBackToLanding?: () => void;
  onNavigate?: (section: 'home' | 'screening' | 'how-it-works') => void;
}

export const ScreeningSelectionPage: React.FC<ScreeningSelectionPageProps> = ({
  selectedWorkflow,
  onSelectWorkflow,
  onBackToLanding,
  onNavigate,
}) => {
  return (
    <div className="selection-page">
      {/* Header with active screening state and full navigation capabilities */}
      <LandingHeader
        variant="minimal"
        activeSection="screening"
        onLogoClick={onBackToLanding}
        onNavigate={onNavigate}
      />

      {/* Background Medical Visuals (Low Opacity Decorative Elements) */}
      <div className="selection-bg-decor selection-bg-decor--left" aria-hidden="true">
        <svg
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="selection-bg-svg"
        >
          {/* Faint blue thoracic cage & lung schematic */}
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
          <circle cx="100" cy="180" r="4" fill="#0284C7" />
          <circle cx="120" cy="240" r="3" fill="#0284C7" />
          <circle cx="70" cy="210" r="2.5" fill="#0284C7" />
          <circle cx="300" cy="180" r="4" fill="#0284C7" />
          <circle cx="280" cy="240" r="3" fill="#0284C7" />
          <circle cx="330" cy="210" r="2.5" fill="#0284C7" />
        </svg>
      </div>

      <div className="selection-bg-decor selection-bg-decor--right" aria-hidden="true">
        <svg
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="selection-bg-svg"
        >
          {/* Faint orange retinal & optic nerve schematic */}
          <circle cx="280" cy="240" r="140" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="5 5" />
          <circle cx="280" cy="240" r="110" stroke="#EA580C" strokeWidth="1" />
          <circle cx="280" cy="240" r="50" stroke="#EA580C" strokeWidth="1.5" />
          <circle cx="280" cy="240" r="15" fill="#EA580C" fillOpacity="0.4" />
          {/* Branching vascular lines */}
          <path
            d="M280 190c-30-40-70-50-120-45M280 290c-30 40-70 50-120 45M230 240c-40 0-80-15-110-35M230 240c-40 10-80 30-110 50"
            stroke="#EA580C"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="180" cy="155" r="3" fill="#EA580C" />
          <circle cx="140" cy="210" r="2.5" fill="#EA580C" />
          <circle cx="170" cy="325" r="3" fill="#EA580C" />
        </svg>
      </div>

      {/* Main Content Area */}
      <main className="selection-content">
        <div className="container">
          {/* Heading Block */}
          <div className="selection-heading-block">
            <span className="selection-eyebrow">SELECT SCREENING TYPE</span>
            <h1 className="selection-title">
              Upload. Analyse.
              <br />
              Get Insights.
            </h1>
            <p className="selection-subtitle">
              Choose the type of medical image you want to analyse
              <br className="selection-break-desktop" />
              and take the next step towards better health.
            </p>
            <p className="selection-note">More screening types coming soon.</p>
          </div>

          {/* Screening Cards Grid */}
          <div className="selection-cards">
            {/* ============================================================
                Card A: Tuberculosis Screening (Chest X-ray Analysis)
                ============================================================ */}
            <div
              className={`selection-card selection-card--tb ${
                selectedWorkflow === 'tb' ? 'selection-card--active' : ''
              }`}
              onClick={() => onSelectWorkflow('tb')}
              role="region"
              aria-label="Tuberculosis Screening Selection Card"
            >
              {/* Protruding Blue Circular Icon Badge */}
              <div className="selection-card__icon-badge selection-card__icon-badge--tb" aria-hidden="true">
                <svg
                  className="selection-card__icon-svg"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Left Lung */}
                  <path
                    d="M 29 13 C 29 13, 21 14, 16 20 C 11 27, 10 40, 14 49 C 18 55, 27 54, 29 48 C 30 42, 29 23, 29 13 Z"
                    fill="#0066FF"
                  />
                  {/* Left inner bronchus highlight */}
                  <path
                    d="M 23 35 L 19 40 L 25 41"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Right Lung */}
                  <path
                    d="M 35 13 C 35 13, 43 14, 48 20 C 53 27, 54 40, 50 49 C 46 55, 37 54, 35 48 C 34 42, 35 23, 35 13 Z"
                    fill="#0066FF"
                  />
                  {/* Right inner bronchus highlight */}
                  <path
                    d="M 41 35 L 45 40 L 39 41"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="selection-card__body">
                <h2 className="selection-card__title">Tuberculosis Screening</h2>
                <p className="selection-card__subtitle">Chest X-ray Analysis</p>

                <button
                  type="button"
                  className="selection-card__btn selection-card__btn--tb"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectWorkflow('tb');
                  }}
                  aria-label="Choose Tuberculosis Screening"
                >
                  <span>Choose</span>
                  <span className="selection-card__btn-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            {/* ============================================================
                Card B: Diabetic Retinopathy Screening (Retinal Image Analysis)
                ============================================================ */}
            <div
              className={`selection-card selection-card--dr ${
                selectedWorkflow === 'dr' ? 'selection-card--active' : ''
              }`}
              onClick={() => onSelectWorkflow('dr')}
              role="region"
              aria-label="Diabetic Retinopathy Screening Selection Card"
            >
              {/* Protruding Orange Circular Icon Badge */}
              <div className="selection-card__icon-badge selection-card__icon-badge--dr" aria-hidden="true">
                <svg
                  className="selection-card__icon-svg"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer Almond Eye Shape in Orange */}
                  <path
                    d="M 6 32 C 14 18, 23 11, 32 11 C 41 11, 50 18, 58 32 C 50 46, 41 53, 32 53 C 23 53, 14 46, 6 32 Z"
                    fill="#FF5A36"
                  />
                  {/* Inner White Sclera Ring */}
                  <circle cx="32" cy="32" r="13" fill="#FFFFFF" />
                  {/* Iris & Pupil in Orange */}
                  <circle cx="32" cy="32" r="7.5" fill="#FF5A36" />
                  {/* Pupil Center / Reflection */}
                  <circle cx="33.8" cy="30.2" r="2.2" fill="#FFFFFF" />
                </svg>
              </div>

              <div className="selection-card__body">
                <h2 className="selection-card__title">Diabetic Retinopathy Screening</h2>
                <p className="selection-card__subtitle">Retinal Image Analysis</p>

                <button
                  type="button"
                  className="selection-card__btn selection-card__btn--dr"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectWorkflow('dr');
                  }}
                  aria-label="Choose Diabetic Retinopathy Screening"
                >
                  <span>Choose</span>
                  <span className="selection-card__btn-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScreeningSelectionPage;
