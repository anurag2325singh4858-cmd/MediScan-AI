import React from 'react';
import './PipelineSection.css';

export const PipelineSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload',
      action: 'Select a supported medical image.',
      variant: 'blue',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Validate',
      action: 'Check format, size, and image integrity.',
      variant: 'cyan',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Process',
      action: 'Execute the screening workflow.',
      variant: 'blue',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Results',
      action: 'Review findings and image visualizations.',
      variant: 'coral',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  return (
    <section className="pipeline-section" id="pipeline" aria-label="Screening Pipeline">
      <div className="container pipeline-section__container">
        
        {/* Section Header */}
        <div className="pipeline-section__header">
          <h2 className="pipeline-section__title">From Image to Insights</h2>
        </div>

        {/* Horizontal Process Card Row */}
        <div className="pipeline-card-container">
          <div className="pipeline-flow" role="list">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="pipeline-card" role="listitem">
                  <div className={`pipeline-card__icon-box pipeline-card__icon-box--${step.variant}`} aria-hidden="true">
                    {step.icon}
                  </div>

                  <h3 className="pipeline-card__title">{step.title}</h3>
                  <p className="pipeline-card__action">{step.action}</p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="pipeline-connector" aria-hidden="true">
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PipelineSection;
