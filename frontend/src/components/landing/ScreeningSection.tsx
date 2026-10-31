import React from 'react';
import './ScreeningSection.css';
import { Badge, Button, Card } from '../common';
import { useInView } from '../../hooks/useInView';

export interface ScreeningSectionProps {
  onSelectWorkflow?: (workflow: 'tb' | 'dr') => void;
}

export const ScreeningSection: React.FC<ScreeningSectionProps> = ({ onSelectWorkflow }) => {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      id="screening"
      className={`screening-section ${isInView ? 'screening-section--visible' : ''}`}
      aria-labelledby="screening-heading"
    >
      <div className="container screening-section__container">
        {/* Section Header */}
        <div className="screening-section__header">
          <Badge variant="tb" dot className="screening-section__badge">
            Targeted Screening Modules
          </Badge>
          <h2 id="screening-heading" className="screening-section__title">
            Intelligent Medical Screening Workflows
          </h2>
          <p className="screening-section__subtitle">
            MediScan AI demonstrates targeted automated screening for two critical health
            conditions. Select a workflow to explore its simulated detection pipeline and
            decision-support interface.
          </p>
        </div>

        {/* Dual Workflow Cards */}
        <div className="screening-cards-grid">
          {/* ============================================================
              Card A: Tuberculosis (TB) Screening — Blue Theme
              ============================================================ */}
          <Card
            workflow="tb"
            accentTop
            padding="lg"
            className="screening-card screening-card--tb"
          >
            {/* Card Header with Badges */}
            <div className="screening-card__top">
              <div className="screening-card__badges">
                <Badge variant="tb">Respiratory Health</Badge>
                <Badge variant="simulated">Demonstration Model</Badge>
              </div>
              <span className="screening-card__modality-pill">PA Chest Radiograph</span>
            </div>

            {/* Medical Illustration: Chest Radiograph / Lung Fields */}
            <div className="screening-card__visual-container screening-card__visual-container--tb">
              <svg
                className="screening-card__svg"
                viewBox="0 0 320 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="320" height="180" rx="12" fill="#0c1a32" />
                {/* Radiograph Grid Backdrop */}
                <path
                  d="M0 45h320M0 90h320M0 135h320M80 0v180M160 0v180M240 0v180"
                  stroke="#1e293b"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                />

                {/* Thoracic Spine & Rib Silhouette */}
                <path
                  d="M160 15v150M155 35h10M155 55h10M155 75h10M155 95h10M155 115h10M155 135h10"
                  stroke="#334155"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Left Lung Field Silhouette */}
                <path
                  d="M148 30 C130 25, 95 40, 85 75 C75 110, 85 145, 115 152 C135 155, 148 140, 148 120 Z"
                  fill="#0369a1"
                  fillOpacity="0.25"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />

                {/* Right Lung Field Silhouette */}
                <path
                  d="M172 30 C190 25, 225 40, 235 75 C245 110, 235 145, 205 152 C185 155, 172 140, 172 120 Z"
                  fill="#0369a1"
                  fillOpacity="0.25"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />

                {/* Trachea & Bronchial Tree Branches */}
                <path
                  d="M160 25v35M160 60l-25 25M160 60l25 25M135 85l-15 15M185 85l15 15"
                  stroke="#60a5fa"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                {/* Simulated Apical Lesion Localization Box (Right Apical Region) */}
                <g className="screening-card__annotation-box">
                  <rect
                    x="200"
                    y="42"
                    width="42"
                    height="38"
                    rx="4"
                    fill="#38bdf8"
                    fillOpacity="0.18"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <circle cx="221" cy="61" r="10" fill="#0284c7" fillOpacity="0.3" />
                  <circle cx="221" cy="61" r="4" fill="#38bdf8" />
                  {/* Bounding Box Corner Reticles */}
                  <path
                    d="M198 47v-7h7 M237 40h7v7 M244 75v7h-7 M205 82h-7v-7"
                    stroke="#38bdf8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  {/* Label */}
                  <rect x="200" y="27" width="60" height="13" rx="2" fill="#0284c7" />
                  <text x="203" y="36.5" fill="#ffffff" fontSize="8" fontWeight="600" fontFamily="sans-serif">
                    TB Infiltrate 89%
                  </text>
                </g>

                {/* Scan Pulse Line Animation */}
                <line
                  className="screening-card__scanline"
                  x1="70"
                  y1="20"
                  x2="250"
                  y2="20"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Card Content */}
            <div className="screening-card__body">
              <h3 className="screening-card__title">Tuberculosis (TB) Screening</h3>
              <p className="screening-card__desc">
                Simulates screening of posteroanterior (PA) chest X-rays for pulmonary
                manifestations of active tuberculosis, including apical consolidation, cavitary
                lesions, and pleural effusions.
              </p>

              {/* Technical Specifications Checklist */}
              <ul className="screening-card__features" aria-label="TB Screening Capabilities">
                <li className="screening-card__feature-item">
                  <span className="screening-card__check-icon" aria-hidden="true">✓</span>
                  <span><strong>Modality:</strong> PA/AP Chest Radiographs (DICOM, PNG, JPEG)</span>
                </li>
                <li className="screening-card__feature-item">
                  <span className="screening-card__check-icon" aria-hidden="true">✓</span>
                  <span><strong>Analysis:</strong> Pulmonary infiltrate & cavity localization</span>
                </li>
                <li className="screening-card__feature-item">
                  <span className="screening-card__check-icon" aria-hidden="true">✓</span>
                  <span><strong>Quality Guardrail:</strong> Exposure & inspiration verification</span>
                </li>
              </ul>

              {/* Disclaimer */}
              <div className="screening-card__disclaimer">
                <span className="screening-card__disclaimer-icon" aria-hidden="true">ℹ</span>
                <span>Simulated demonstration. Does not provide certified diagnostic conclusions.</span>
              </div>

              {/* Action Button */}
              <div className="screening-card__action">
                <Button
                  workflow="tb"
                  size="lg"
                  fullWidth
                  trailingIcon={<span aria-hidden="true">→</span>}
                  onClick={() => onSelectWorkflow?.('tb')}
                >
                  Explore TB Screening
                </Button>
              </div>
            </div>
          </Card>

          {/* ============================================================
              Card B: Diabetic Retinopathy (DR) Screening — Coral Theme
              ============================================================ */}
          <Card
            workflow="dr"
            accentTop
            padding="lg"
            className="screening-card screening-card--dr"
          >
            {/* Card Header with Badges */}
            <div className="screening-card__top">
              <div className="screening-card__badges">
                <Badge variant="dr">Ophthalmic Health</Badge>
                <Badge variant="simulated">Demonstration Model</Badge>
              </div>
              <span className="screening-card__modality-pill screening-card__modality-pill--dr">
                Retinal Fundus Image
              </span>
            </div>

            {/* Medical Illustration: Retinal Fundus & Microvascular Anatomy */}
            <div className="screening-card__visual-container screening-card__visual-container--dr">
              <svg
                className="screening-card__svg"
                viewBox="0 0 320 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="320" height="180" rx="12" fill="#1c0f0a" />
                {/* Circular Fundus Aperture */}
                <circle cx="160" cy="90" r="76" fill="#7c2d12" fillOpacity="0.4" stroke="#c2410c" strokeWidth="1.2" />
                <circle cx="160" cy="90" r="72" fill="#9a3412" fillOpacity="0.25" />

                {/* Optic Disc Silhouette */}
                <ellipse cx="125" cy="90" rx="14" ry="17" fill="#fed7aa" fillOpacity="0.85" />
                <ellipse cx="123" cy="90" rx="9" ry="11" fill="#fff7ed" />

                {/* Macular Fovea Region */}
                <circle cx="185" cy="92" r="12" fill="#451a03" fillOpacity="0.5" />
                <circle cx="185" cy="92" r="4" fill="#291002" />

                {/* Retinal Blood Vessels (Arcades emerging from optic disc) */}
                <path
                  d="M125 78 C128 55, 155 45, 190 48 M125 78 C135 65, 160 62, 185 68"
                  stroke="#ef4444"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M125 102 C128 125, 155 135, 190 132 M125 102 C135 115, 160 118, 185 112"
                  stroke="#ef4444"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Capillary Branches */}
                <path
                  d="M150 50l12-10 M170 52l10-8 M150 130l12 10 M170 128l10 8"
                  stroke="#dc2626"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />

                {/* Simulated Hard Exudates & Hemorrhage Markers */}
                <g className="screening-card__annotation-box">
                  <circle cx="178" cy="74" r="3" fill="#facc15" />
                  <circle cx="184" cy="76" r="2.5" fill="#facc15" />
                  <circle cx="192" cy="72" r="2" fill="#facc15" />
                  <circle cx="172" cy="108" r="3.5" fill="#ef4444" />
                  <circle cx="166" cy="112" r="2.5" fill="#b91c1c" />

                  {/* Anomaly Bounding Box */}
                  <rect
                    x="165"
                    y="65"
                    width="44"
                    height="24"
                    rx="4"
                    fill="#ea580c"
                    fillOpacity="0.18"
                    stroke="#ea580c"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  {/* Label */}
                  <rect x="165" y="49" width="66" height="13" rx="2" fill="#ea580c" />
                  <text x="168" y="58.5" fill="#ffffff" fontSize="8" fontWeight="600" fontFamily="sans-serif">
                    Exudates / DR 94%
                  </text>
                </g>

                {/* Scan Pulse Line Animation */}
                <line
                  className="screening-card__scanline screening-card__scanline--dr"
                  x1="88"
                  y1="25"
                  x2="232"
                  y2="25"
                  stroke="#ea580c"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Card Body */}
            <div className="screening-card__body">
              <h3 className="screening-card__title">Diabetic Retinopathy (DR) Screening</h3>
              <p className="screening-card__desc">
                Simulates screening of digital color fundus photography for diabetic microvascular
                anomalies, including microaneurysms, hemorrhages, hard exudates, and macular edema.
              </p>

              {/* Technical Specifications Checklist */}
              <ul className="screening-card__features" aria-label="DR Screening Capabilities">
                <li className="screening-card__feature-item">
                  <span className="screening-card__check-icon screening-card__check-icon--dr" aria-hidden="true">✓</span>
                  <span><strong>Modality:</strong> Color Fundus Photography (Macula / Disc centered)</span>
                </li>
                <li className="screening-card__feature-item">
                  <span className="screening-card__check-icon screening-card__check-icon--dr" aria-hidden="true">✓</span>
                  <span><strong>Analysis:</strong> Microaneurysm & exudate pattern detection</span>
                </li>
                <li className="screening-card__feature-item">
                  <span className="screening-card__check-icon screening-card__check-icon--dr" aria-hidden="true">✓</span>
                  <span><strong>Quality Guardrail:</strong> Illumination, sharpness & field centering</span>
                </li>
              </ul>

              {/* Disclaimer */}
              <div className="screening-card__disclaimer">
                <span className="screening-card__disclaimer-icon" aria-hidden="true">ℹ</span>
                <span>Simulated demonstration. Does not replace professional clinical ophthalmoscopy.</span>
              </div>

              {/* Action Button */}
              <div className="screening-card__action">
                <Button
                  workflow="dr"
                  size="lg"
                  fullWidth
                  trailingIcon={<span aria-hidden="true">→</span>}
                  onClick={() => onSelectWorkflow?.('dr')}
                >
                  Explore DR Screening
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ScreeningSection;
