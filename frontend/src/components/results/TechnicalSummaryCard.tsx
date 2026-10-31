import React, { useState } from 'react';
import { ImageValidationMetadata } from '../../types/results';
import './TechnicalSummaryCard.css';

export interface TechnicalSummaryCardProps {
  metadata?: ImageValidationMetadata | null;
  className?: string;
}

export const TechnicalSummaryCard: React.FC<TechnicalSummaryCardProps> = ({
  metadata,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!metadata) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div
      className={`technical-summary-card ${className}`}
      aria-label="Image Technical Verification Summary"
    >
      <button
        type="button"
        className="technical-summary-card__header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="technical-summary-card__title-row">
          <svg
            className="technical-summary-card__icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="technical-summary-card__title">Technical Image Integrity</span>
        </div>
        <div className="technical-summary-card__badge-row">
          <span className="technical-summary-card__badge">Verified</span>
          <svg
            className={`technical-summary-card__chevron ${isExpanded ? 'technical-summary-card__chevron--open' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="technical-summary-card__content">
          <div className="technical-summary-card__grid">
            <div className="technical-summary-card__item">
              <span className="technical-summary-card__item-label">Resolution</span>
              <span className="technical-summary-card__item-val">
                {metadata.width} &times; {metadata.height} px
              </span>
            </div>
            <div className="technical-summary-card__item">
              <span className="technical-summary-card__item-label">Encoding</span>
              <span className="technical-summary-card__item-val">{metadata.format.toUpperCase()}</span>
            </div>
            <div className="technical-summary-card__item">
              <span className="technical-summary-card__item-label">Color Space</span>
              <span className="technical-summary-card__item-val">{metadata.color_mode}</span>
            </div>
            <div className="technical-summary-card__item">
              <span className="technical-summary-card__item-label">File Size</span>
              <span className="technical-summary-card__item-val">{formatFileSize(metadata.file_size_bytes)}</span>
            </div>
          </div>
          <div className="technical-summary-card__raster-status">
            <span className="technical-summary-card__dot" />
            <span>Full raster pixel decode verified (No scanline truncation)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalSummaryCard;
