import React, { useState } from 'react';
import './OriginalImageViewer.css';

export interface OriginalImageViewerProps {
  imageSrc: string;
  altText?: string;
  workflowLabel?: string;
  aspectRatio?: string;
  className?: string;
  children?: React.ReactNode; // Extension point for Module 11D annotation overlay
}

export const OriginalImageViewer: React.FC<OriginalImageViewerProps> = ({
  imageSrc,
  altText = 'Uploaded medical screening image',
  workflowLabel,
  aspectRatio = '4 / 3',
  className = '',
  children,
}) => {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div
      className={`original-image-viewer ${className}`}
      data-coordinate-space="normalized"
      aria-label="Medical Image Viewer"
    >
      {/* Header bar / Image Type Pill */}
      {workflowLabel && (
        <div className="original-image-viewer__header">
          <div className="original-image-viewer__label">
            <span className="original-image-viewer__indicator" aria-hidden="true" />
            <span>{workflowLabel}</span>
          </div>
          <span className="original-image-viewer__badge">Original Source</span>
        </div>
      )}

      {/* Main Responsive Canvas / Container */}
      <div
        className="original-image-viewer__viewport"
        style={{ aspectRatio }}
      >
        {/* Loading state skeleton */}
        {loadState === 'loading' && (
          <div className="original-image-viewer__skeleton" aria-live="polite">
            <div className="original-image-viewer__spinner" />
            <span>Rendering image source...</span>
          </div>
        )}

        {/* Error state fallback */}
        {loadState === 'error' && (
          <div className="original-image-viewer__error" role="alert">
            <svg
              className="original-image-viewer__error-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <p className="original-image-viewer__error-title">Unable to display image</p>
            <p className="original-image-viewer__error-text">
              The image source could not be decoded. Please verify file integrity.
            </p>
          </div>
        )}

        {/* The medical image element */}
        <img
          src={imageSrc}
          alt={altText}
          className={`original-image-viewer__img ${loadState === 'loaded' ? 'original-image-viewer__img--visible' : ''}`}
          onLoad={() => setLoadState('loaded')}
          onError={() => setLoadState('error')}
        />

        {/* Extension Hook: Projected annotation canvas layer (Module 11D) */}
        {loadState === 'loaded' && children && (
          <div className="original-image-viewer__overlay-layer" aria-hidden="false">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default OriginalImageViewer;
