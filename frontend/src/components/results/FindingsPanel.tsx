import React from 'react';
import { FindingItem } from '../../types/results';
import './FindingsPanel.css';

export interface FindingsPanelProps {
  findings: FindingItem[];
  workflowTitle?: string;
  selectedFindingId?: string | null;
  onSelectFinding?: (findingId: string | null) => void;
  className?: string;
}

export const FindingsPanel: React.FC<FindingsPanelProps> = ({
  findings,
  workflowTitle = 'Screening Demonstration Findings',
  selectedFindingId,
  onSelectFinding,
  className = '',
}) => {
  const handleItemClick = (id: string) => {
    if (onSelectFinding) {
      if (selectedFindingId === id) {
        onSelectFinding(null); // Toggle off
      } else {
        onSelectFinding(id);
      }
    }
  };

  return (
    <section
      className={`findings-panel ${className}`}
      aria-label="Screening Findings Panel"
    >
      <div className="findings-panel__header">
        <div className="findings-panel__header-title-row">
          <svg
            className="findings-panel__header-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <h2 className="findings-panel__title">{workflowTitle}</h2>
        </div>
        <span className="findings-panel__count-badge" aria-label={`${findings.length} findings listed`}>
          {findings.length} {findings.length === 1 ? 'Marker' : 'Markers'}
        </span>
      </div>

      <div className="findings-panel__content">
        {findings.length === 0 ? (
          <div className="findings-panel__empty" role="status">
            <svg
              className="findings-panel__empty-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="findings-panel__empty-title">No demonstration markers</p>
            <p className="findings-panel__empty-desc">
              No simulated finding markers are recorded for this demonstration instance.
            </p>
          </div>
        ) : (
          <ul className="findings-panel__list" role="list">
            {findings.map((item, index) => {
              const isSelected = selectedFindingId === item.id;
              const hasCoordinates = !!item.coordinates;

              return (
                <li
                  key={item.id}
                  className={`findings-panel__item ${isSelected ? 'findings-panel__item--selected' : ''}`}
                  onClick={() => handleItemClick(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleItemClick(item.id);
                    }
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Finding ${index + 1}: ${item.title}`}
                >
                  <div className="findings-panel__item-header">
                    <span className="findings-panel__item-index">{index + 1}</span>
                    <span className="findings-panel__item-id">{item.id}</span>
                    {hasCoordinates && (
                      <span className="findings-panel__item-geo" title="Spatial marker coordinate attached">
                        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Overlay
                      </span>
                    )}
                  </div>

                  <h3 className="findings-panel__item-title">{item.title}</h3>
                  <p className="findings-panel__item-desc">{item.description}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default FindingsPanel;
