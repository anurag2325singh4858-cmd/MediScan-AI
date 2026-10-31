import React from 'react';
import './HowItWorksSection.css';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      id: 'step-upload',
      title: 'Upload Image',
      description: 'Select a supported medical image.',
      accent: 'blue',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M12 12v9" />
          <path d="m8 16 4-4 4 4" />
        </svg>
      ),
    },
    {
      id: 'step-validate',
      title: 'Validate',
      description: 'Check format, size, and image integrity.',
      accent: 'blue',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
    },
    {
      id: 'step-process',
      title: 'Process',
      description: 'Execute the selected workflow.',
      accent: 'blue',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      id: 'step-results',
      title: 'Review Results',
      description: 'View findings and image visualizations.',
      accent: 'coral',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works-flow-section" aria-label="How It Works">
      <div className="container how-it-works-flow-section__container">
        {/* Section Heading */}
        <div className="how-it-works-flow-section__header">
          <h2 className="how-it-works-flow-section__title">
            How It <span className="how-it-works-flow-section__title-accent">Works</span>
          </h2>
        </div>

        {/* 4-Step Flow Container */}
        <div className="how-it-works-flow-card">
          <div className="how-it-works-flow">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <div className={`how-it-works-step how-it-works-step--${step.accent}`}>
                  <div className={`how-it-works-step__icon-circle how-it-works-step__icon-circle--${step.accent}`}>
                    {step.icon}
                  </div>
                  <div className="how-it-works-step__content">
                    <span className="how-it-works-step__title">{step.title}</span>
                    <span className="how-it-works-step__desc">{step.description}</span>
                  </div>
                </div>

                {/* Arrow Connector (between steps) */}
                {index < steps.length - 1 && (
                  <div className="how-it-works-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
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

export default HowItWorksSection;
