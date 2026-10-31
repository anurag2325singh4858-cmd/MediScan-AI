import React from 'react';
import './SimulationDisclaimer.css';

export interface SimulationDisclaimerProps {
  disclaimer?: string;
  isSimulated?: boolean;
  providerType?: 'simulation' | 'model' | string;
  className?: string;
}

const DEFAULT_SAFETY_WARNING =
  'DEMONSTRATION ONLY: These findings are synthetic illustrative simulations generated for interface demonstration purposes. They do NOT constitute clinical diagnosis, medical opinion, or an actual assessment of the uploaded medical image.';

const SAFETY_MISMATCH_WARNING =
  'SAFETY NOTICE: Result simulation status is unverified or conflicting. This demonstration interface does not perform medical diagnosis, and no output should be used for clinical decision-making.';

export const SimulationDisclaimer: React.FC<SimulationDisclaimerProps> = ({
  disclaimer = DEFAULT_SAFETY_WARNING,
  isSimulated = true,
  providerType = 'simulation',
  className = '',
}) => {
  // Safety check: if marked non-simulated under a simulation provider, or disclaimer empty
  const hasSafetyAnomaly = !isSimulated && providerType === 'simulation';
  const effectiveDisclaimer = hasSafetyAnomaly ? SAFETY_MISMATCH_WARNING : (disclaimer || DEFAULT_SAFETY_WARNING);

  return (
    <aside
      className={`simulation-disclaimer ${hasSafetyAnomaly ? 'simulation-disclaimer--alert' : ''} ${className}`}
      role="region"
      aria-label="Simulation Medical Disclaimer"
    >
      <div className="simulation-disclaimer__header">
        <div className="simulation-disclaimer__badge" aria-label="Simulated Screening Badge">
          <svg
            className="simulation-disclaimer__badge-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>SIMULATED DEMONSTRATION</span>
        </div>
        <span className="simulation-disclaimer__tag">Non-Diagnostic Research Prototype</span>
      </div>

      <div className="simulation-disclaimer__body">
        <p className="simulation-disclaimer__text">{effectiveDisclaimer}</p>
      </div>

      <div className="simulation-disclaimer__footer">
        <span className="simulation-disclaimer__subnote">
          MediScan AI is an educational technology demonstration. Always consult a licensed healthcare professional for medical diagnosis and clinical care.
        </span>
      </div>
    </aside>
  );
};

export default SimulationDisclaimer;
