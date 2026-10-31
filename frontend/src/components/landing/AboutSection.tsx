import React from 'react';
import './AboutSection.css';
import { Badge, Card } from '../common';
import { useInView } from '../../hooks/useInView';

export const AboutSection: React.FC = () => {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      id="about"
      className={`about-section ${isInView ? 'about-section--visible' : ''}`}
      aria-labelledby="about-heading"
    >
      <div className="container about-section__container">
        {/* Section Header */}
        <div className="about-section__header">
          <Badge variant="tb" dot className="about-section__badge">
            About MediScan AI
          </Badge>
          <h2 id="about-heading" className="about-section__title">
            Accessible AI-Assisted Medical Screening
          </h2>
          <p className="about-section__subtitle">
            MediScan AI is an interactive medical image screening demonstration engineered to
            illustrate assistive computer-vision workflows for primary and frontline healthcare.
          </p>
        </div>

        {/* 2-Column Grid: Mission & Capabilities vs. Pipeline Architecture */}
        <div className="about-section__grid">
          {/* Left Column: Mission & Core Objectives */}
          <div className="about-section__content">
            <Card padding="lg" className="about-card about-card--mission">
              <h3 className="about-card__title">Bridging Primary Care Screening Gaps</h3>
              <p className="about-card__text">
                Conditions such as pulmonary tuberculosis and diabetic retinopathy are primary
                causes of preventable health decline and vision impairment worldwide. In many
                community and rural settings, diagnostic confirmation is constrained by specialist
                shortages, geographic distances, and equipment latency.
              </p>
              <p className="about-card__text">
                MediScan AI models a simulation-first screening protocol where standard digital
                radiographs and fundus images undergo rapid technical validation, feature
                localization, and structured risk stratification before clinical review.
              </p>

              {/* Core Pillars */}
              <div className="about-pillars">
                <div className="about-pillar">
                  <div className="about-pillar__icon about-pillar__icon--tb" aria-hidden="true">
                    ⚡
                  </div>
                  <div>
                    <h4 className="about-pillar__heading">Rapid Simulation Engine</h4>
                    <p className="about-pillar__desc">
                      Sub-second automated screening simulation for immediate interactive evaluation.
                    </p>
                  </div>
                </div>

                <div className="about-pillar">
                  <div className="about-pillar__icon about-pillar__icon--dr" aria-hidden="true">
                    🩺
                  </div>
                  <div>
                    <h4 className="about-pillar__heading">Dual Screening Modalities</h4>
                    <p className="about-pillar__desc">
                      Dedicated pipelines tailored for chest radiographs (TB) and retinal fundus photography (DR).
                    </p>
                  </div>
                </div>

                <div className="about-pillar">
                  <div className="about-pillar__icon about-pillar__icon--neutral" aria-hidden="true">
                    📊
                  </div>
                  <div>
                    <h4 className="about-pillar__heading">Explainable Decision Support</h4>
                    <p className="about-pillar__desc">
                      Heatmap visualizations, localized anomaly markers, and structured clinical report summaries.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Interactive Pipeline Architecture Visual */}
          <div className="about-section__visual">
            <Card padding="lg" className="about-card about-card--architecture">
              <div className="about-arch-header">
                <span className="about-arch-header__title">Screening Pipeline Architecture</span>
                <Badge variant="simulated">Simulation Demo</Badge>
              </div>

              {/* Step 1: Input Modalities */}
              <div className="about-arch-step about-arch-step--1">
                <div className="about-arch-step__indicator">01</div>
                <div className="about-arch-step__body">
                  <div className="about-arch-step__title">Clinical Image Ingestion</div>
                  <p className="about-arch-step__text">
                    Digital radiography (DICOM/PNG) or optical fundus photograph upload.
                  </p>
                  <div className="about-arch-step__tags">
                    <span className="about-tag">Chest X-Ray</span>
                    <span className="about-tag">Retinal Fundus</span>
                  </div>
                </div>
              </div>

              {/* Connecting Pulse Line */}
              <div className="about-arch-connector" aria-hidden="true">
                <span className="about-arch-connector__pulse" />
              </div>

              {/* Step 2: Quality & Analysis */}
              <div className="about-arch-step about-arch-step--2">
                <div className="about-arch-step__indicator">02</div>
                <div className="about-arch-step__body">
                  <div className="about-arch-step__title">Technical Quality & Simulation</div>
                  <p className="about-arch-step__text">
                    Automated checks for resolution, blur, and exposure followed by simulated anomaly extraction.
                  </p>
                  <div className="about-arch-step__tags">
                    <span className="about-tag">Quality Guardrails</span>
                    <span className="about-tag">Feature Extraction</span>
                  </div>
                </div>
              </div>

              {/* Connecting Pulse Line */}
              <div className="about-arch-connector" aria-hidden="true">
                <span className="about-arch-connector__pulse" />
              </div>

              {/* Step 3: Decision Support */}
              <div className="about-arch-step about-arch-step--3">
                <div className="about-arch-step__indicator">03</div>
                <div className="about-arch-step__body">
                  <div className="about-arch-step__title">Clinician Decision Support</div>
                  <p className="about-arch-step__text">
                    Confidence stratifications, localized heatmaps, and downloadable summary reports.
                  </p>
                  <div className="about-arch-step__tags">
                    <span className="about-tag">Visual Heatmap</span>
                    <span className="about-tag">Structured Report</span>
                  </div>
                </div>
              </div>

              <div className="about-arch-footer">
                <span className="about-arch-footer__dot" aria-hidden="true" />
                <span>Simulation-first workflow • No live diagnostic inference performed</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
