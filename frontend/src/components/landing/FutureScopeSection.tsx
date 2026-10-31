import React from 'react';
import './FutureScopeSection.css';
import { Badge, Card } from '../common';
import { useInView } from '../../hooks/useInView';

export const FutureScopeSection: React.FC = () => {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  const roadmapItems = [
    {
      title: 'Extended Pulmonary Pathology',
      modality: 'Thoracic Radiography',
      stage: 'Concept Phase',
      description:
        'Expanding the chest radiograph pipeline beyond tuberculosis to screen for pulmonary consolidation, cardiomegaly, pneumothorax, and pleural effusion patterns.',
      icon: (
        <svg
          className="roadmap-card__icon-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 3C5 5 4 8 4 12c0 5 3 9 8 9s8-4 8-9c0-4-1-7-3-9" />
          <path d="M12 3v18" />
          <path d="M8 8c1.5 2 3.5 3 4 3s2.5-1 4-3" />
          <path d="M8 14c1.5 1.5 3.5 2 4 2s2.5-.5 4-2" />
        </svg>
      ),
      tags: ['Cardiomegaly', 'Pneumonia', 'Effusion'],
    },
    {
      title: 'Glaucoma & Macular Triage',
      modality: 'Color Retinal Photography',
      stage: 'Concept Phase',
      description:
        'Extending fundus image analysis to estimate optic cup-to-disc ratios for glaucoma risk assessment and detect early geographic atrophy markers in macular degeneration.',
      icon: (
        <svg
          className="roadmap-card__icon-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M2 12c3.5-6 7.5-9 10-9s6.5 3 10 9c-3.5 6-7.5 9-10 9s-6.5-3-10-9z" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
        </svg>
      ),
      tags: ['Cup-to-Disc Ratio', 'Glaucoma Risk', 'AMD Triage'],
    },
    {
      title: 'Clinical PACS & FHIR Integration',
      modality: 'Hospital Interoperability',
      stage: 'Architecture Track',
      description:
        'Standards-compliant DICOMweb ingestion from hospital PACS archives and automated export of structured HL7 FHIR diagnostic observations for EHR interoperability.',
      icon: (
        <svg
          className="roadmap-card__icon-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
      ),
      tags: ['DICOMweb', 'HL7 FHIR', 'PACS Ingestion'],
    },
    {
      title: 'Offline Edge Inference Engine',
      modality: 'Mobile & Remote Clinics',
      stage: 'Deployment Track',
      description:
        'Optimizing quantized WebAssembly and WebGPU inference for on-device browser screening in rural health camps with intermittent or absent network connectivity.',
      icon: (
        <svg
          className="roadmap-card__icon-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
          <path d="M2 7h2 M20 7h2 M2 12h2 M20 12h2" />
        </svg>
      ),
      tags: ['WebAssembly / WebGPU', 'Zero-Latency', 'Offline Triage'],
    },
  ];

  return (
    <section
      ref={ref}
      id="future-scope"
      className={`future-scope-section ${isInView ? 'future-scope-section--visible' : ''}`}
      aria-labelledby="future-scope-heading"
    >
      <div className="container future-scope-section__container">
        {/* Section Header */}
        <div className="future-scope-section__header">
          <Badge variant="neutral" dot className="future-scope-section__badge">
            Roadmap & Conceptual Vision
          </Badge>
          <h2 id="future-scope-heading" className="future-scope-section__title">
            Future Screening Capabilities
          </h2>
          <p className="future-scope-section__subtitle">
            Conceptual extensions under research for subsequent development blocks. All items below
            represent forward-looking research proposals distinct from current active modules.
          </p>
        </div>

        {/* 4 Roadmap Cards in 2x2 Grid */}
        <div className="roadmap-grid">
          {roadmapItems.map((item, idx) => (
            <Card
              key={item.title}
              padding="lg"
              className={`roadmap-card roadmap-card--${idx + 1}`}
            >
              <div className="roadmap-card__top">
                <div className="roadmap-card__icon-wrapper">{item.icon}</div>
                <div className="roadmap-card__status-group">
                  <span className="roadmap-card__stage-pill">{item.stage}</span>
                </div>
              </div>

              <div className="roadmap-card__modality-label">{item.modality}</div>
              <h3 className="roadmap-card__title">{item.title}</h3>
              <p className="roadmap-card__desc">{item.description}</p>

              <div className="roadmap-card__tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="roadmap-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Roadmap Clarification Banner */}
        <div className="roadmap-notice">
          <div className="roadmap-notice__icon" aria-hidden="true">
            🧭
          </div>
          <div className="roadmap-notice__content">
            <h4 className="roadmap-notice__heading">Development Scope Boundary</h4>
            <p className="roadmap-notice__text">
              Active engineering in MediScan AI is strictly focused on the core Tuberculosis (TB)
              and Diabetic Retinopathy (DR) screening simulation pipelines. Roadmap concepts are
              architectural previews and are not currently active in this version.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureScopeSection;
