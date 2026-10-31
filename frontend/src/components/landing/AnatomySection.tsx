import React from 'react';
import './AnatomySection.css';

export const AnatomySection: React.FC = () => {
  return (
    <section className="anatomy-section" id="anatomy" aria-label="Visual Anatomy Inspection">
      <div className="container anatomy-section__container">
        
        {/* Section Header */}
        <div className="anatomy-section__header">
          <h2 className="anatomy-section__title">
            More Than <span className="anatomy-section__title-accent">an Image</span>
          </h2>
        </div>

        {/* Side-by-Side Anatomical Cards */}
        <div className="anatomy-section__grid">
          
          {/* Card 1: Chest X-ray Anatomy */}
          <div className="anatomy-card anatomy-card--cxr">
            <div className="anatomy-card__top">
              <span className="anatomy-card__badge anatomy-card__badge--cxr">Chest X-ray Anatomy</span>
            </div>

            {/* Visual with leader lines and callouts */}
            <div className="anatomy-card__display" aria-hidden="true">
              {/* Left callout pills */}
              <div className="anatomy-callouts anatomy-callouts--left">
                <div className="anatomy-pill">Lung Apex</div>
                <div className="anatomy-pill">Lung Field</div>
                <div className="anatomy-pill">Pleural Space</div>
              </div>

              {/* Center Image Container with Pointer Lines */}
              <div className="anatomy-card__img-wrap anatomy-card__img-wrap--cxr">
                <img
                  src="/assets/example-chest-xray.png"
                  alt="Frontal Chest X-ray radiograph with labeled anatomical landmarks"
                  className="anatomy-card__img"
                />

                {/* SVG Pointer Reticles & Lines */}
                <svg className="anatomy-card__pointer-svg" viewBox="0 0 200 200" fill="none">
                  {/* Lung Apex pointer */}
                  <circle cx="65" cy="45" r="4" fill="#38bdf8" />
                  <line x1="0" y1="35" x2="65" y2="45" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Mid Lung Field pointer */}
                  <circle cx="55" cy="95" r="4" fill="#38bdf8" />
                  <line x1="0" y1="95" x2="55" y2="95" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Pleural Space pointer */}
                  <circle cx="35" cy="140" r="4" fill="#38bdf8" />
                  <line x1="0" y1="155" x2="35" y2="140" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Hilar Region pointer */}
                  <circle cx="115" cy="85" r="4" fill="#38bdf8" />
                  <line x1="200" y1="35" x2="115" y2="85" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Right Lung Field pointer */}
                  <circle cx="145" cy="100" r="4" fill="#38bdf8" />
                  <line x1="200" y1="95" x2="145" y2="100" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Costophrenic Angle pointer */}
                  <circle cx="170" cy="165" r="4" fill="#38bdf8" />
                  <line x1="200" y1="155" x2="170" y2="165" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              </div>

              {/* Right callout pills */}
              <div className="anatomy-callouts anatomy-callouts--right">
                <div className="anatomy-pill">Hilar Region</div>
                <div className="anatomy-pill">Lung Field</div>
                <div className="anatomy-pill">Costophrenic Angle</div>
              </div>
            </div>
          </div>

          {/* Card 2: Retinal Anatomy */}
          <div className="anatomy-card anatomy-card--dr">
            <div className="anatomy-card__top">
              <span className="anatomy-card__badge anatomy-card__badge--dr">Retinal Anatomy</span>
            </div>

            {/* Visual with leader lines and callouts */}
            <div className="anatomy-card__display" aria-hidden="true">
              {/* Left callout pills */}
              <div className="anatomy-callouts anatomy-callouts--left">
                <div className="anatomy-pill">Retinal Vessels</div>
                <div className="anatomy-pill">Macula</div>
              </div>

              {/* Center Image Container with Pointer Lines */}
              <div className="anatomy-card__img-wrap anatomy-card__img-wrap--dr">
                <img
                  src="/assets/example-retinal-fundus.png"
                  alt="Retinal Fundus photograph with labeled anatomical landmarks"
                  className="anatomy-card__img anatomy-card__img--round"
                />

                {/* SVG Pointer Reticles & Lines */}
                <svg className="anatomy-card__pointer-svg" viewBox="0 0 200 200" fill="none">
                  {/* Retinal Vessels pointer */}
                  <circle cx="70" cy="65" r="4" fill="#ea580c" />
                  <line x1="0" y1="55" x2="70" y2="65" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Macula pointer */}
                  <circle cx="95" cy="105" r="4" fill="#ea580c" />
                  <line x1="0" y1="135" x2="95" y2="105" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Optic Disc pointer */}
                  <circle cx="150" cy="98" r="4" fill="#ea580c" />
                  <line x1="200" y1="55" x2="150" y2="98" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Retinal Quadrants pointer */}
                  <circle cx="140" cy="145" r="4" fill="#ea580c" />
                  <line x1="200" y1="135" x2="140" y2="145" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              </div>

              {/* Right callout pills */}
              <div className="anatomy-callouts anatomy-callouts--right">
                <div className="anatomy-pill">Optic Disc</div>
                <div className="anatomy-pill">Retinal Quadrants</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AnatomySection;
