import React from 'react';
import './TechnicalOverviewSection.css';

export const TechnicalOverviewSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Input',
      desc: 'Supported image formats.',
      variant: 'cyan',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Validation',
      desc: 'File integrity & raster decoding',
      variant: 'blue',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Visualization',
      desc: 'Original image & annotation overlay',
      variant: 'cyan',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Output',
      desc: 'Structured results & technical information.',
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
    <section className="tech-overview" id="technical-overview" aria-label="Technical Workflow Overview">
      <div className="container tech-overview__container">
        
        {/* Section Header */}
        <div className="tech-overview__header">
          <h2 className="tech-overview__title">Built Around a Clear Workflow</h2>
        </div>

        {/* Light Blue Rounded Card Container */}
        <div className="tech-overview__card">
          <div className="tech-overview__flow" role="list">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="tech-overview__step" role="listitem">
                  <div className={`tech-overview__icon-box tech-overview__icon-box--${step.variant}`} aria-hidden="true">
                    {step.icon}
                  </div>

                  <h3 className="tech-overview__step-title">{step.title}</h3>
                  <p className="tech-overview__step-desc">{step.desc}</p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="tech-overview__arrow" aria-hidden="true">
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

export default TechnicalOverviewSection;
