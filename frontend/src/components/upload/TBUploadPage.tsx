import React, { useState, useRef, useEffect } from 'react';
import './TBUploadPage.css';
import { LandingHeader } from '../landing/LandingHeader';
import { validateUploadFile, formatFileSize } from './uploadValidation';

export interface TBUploadPageProps {
  onBack: () => void;
  onContinue: (file: File) => void;
  initialFile?: File | null;
  onBackToLanding?: () => void;
  onNavigate?: (section: 'home' | 'screening' | 'how-it-works') => void;
}

export const TBUploadPage: React.FC<TBUploadPageProps> = ({
  onBack,
  onContinue,
  initialFile = null,
  onBackToLanding,
  onNavigate,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFile);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Maintain ephemeral preview URL and cleanup on unmount or file change
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleProcessFile = (file: File) => {
    setErrorMessage(null);
    const result = validateUploadFile(file, { workflow: 'tb' });

    if (!result.isValid) {
      setSelectedFile(null);
      setErrorMessage(result.error || 'Invalid file selected.');
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedFile(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContinueClick = () => {
    if (selectedFile) {
      onContinue(selectedFile);
    }
  };

  return (
    <div className="tb-upload-page">
      {/* Header with active screening state and full navigation capabilities */}
      <LandingHeader
        variant="minimal"
        activeSection="screening"
        onLogoClick={onBackToLanding || onBack}
        onNavigate={onNavigate}
      />

      {/* Background Decorative Pulmonic Line-Art */}
      <div className="tb-upload-bg-decor tb-upload-bg-decor--left" aria-hidden="true">
        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="tb-upload-bg-svg">
          <path
            d="M200 40v360M185 70c-25-15-70-5-85 45s-10 110 20 160c25 40 65 30 65 10M215 70c25-15 70-5 85 45s10 110-20 160c-25 40-65 30-65 10"
            stroke="#0284C7"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M200 90l-35 30m35-15l35 30m-35 15l-45 35m45-20l45 35m-45 15l-50 40m50-25l50 40"
            stroke="#0284C7"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <div className="tb-upload-bg-decor tb-upload-bg-decor--right" aria-hidden="true">
        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="tb-upload-bg-svg">
          <circle cx="280" cy="240" r="140" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="5 5" />
          <circle cx="280" cy="240" r="90" stroke="#0284C7" strokeWidth="1" />
          <path d="M280 180c-30-40-70-50-120-45M280 300c-30 40-70 50-120 45" stroke="#0284C7" strokeWidth="1.2" />
        </svg>
      </div>

      <main className="tb-upload-content">
        <div className="container tb-upload-container">
          {/* Header Title & Workflow Badge */}
          <div className="tb-upload-heading-group">
            <h1 className="tb-upload-title">Upload Your Medical Image</h1>
            <div className="tb-upload-workflow-row">
              <div className="tb-upload-workflow-badge">
                <span className="tb-upload-workflow-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.5 5.5 C10.5 5.5, 7.5 6, 5.5 8.5 C3.5 11.5, 3 17, 4.5 20.5 C6.5 23, 10 22, 10.5 19.5 C11 17, 10.5 9, 10.5 5.5 Z"
                      fill="#0284C7"
                    />
                    <path
                      d="M13.5 5.5 C13.5 5.5, 16.5 6, 18.5 8.5 C20.5 11.5, 21 17, 19.5 20.5 C17.5 23, 14 22, 13.5 19.5 C13 17, 13.5 9, 13.5 5.5 Z"
                      fill="#0284C7"
                    />
                  </svg>
                </span>
                <span className="tb-upload-workflow-text">Tuberculosis Screening — Chest X-ray</span>
              </div>
            </div>
          </div>

          {/* Error Banner (Accessible validation error) */}
          {errorMessage && (
            <div className="tb-upload-error-alert" role="alert" aria-live="assertive">
              <span className="tb-upload-error-icon" aria-hidden="true">⚠️</span>
              <span className="tb-upload-error-text">{errorMessage}</span>
              <button
                type="button"
                className="tb-upload-error-close"
                onClick={() => setErrorMessage(null)}
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Two-Column Responsive Layout */}
          <div className="tb-upload-grid">
            {/* Left Column: Upload Card */}
            <div className="tb-upload-card">
              <input
                ref={fileInputRef}
                type="file"
                className="tb-upload-hidden-input"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                onChange={handleFileInputChange}
                aria-label="Select chest X-ray image file"
              />

              {!selectedFile ? (
                /* Unselected State: Dashed Drag-and-Drop Area */
                <div
                  className={`tb-upload-dropzone ${isDragging ? 'tb-upload-dropzone--dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleBrowseClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleBrowseClick();
                    }
                  }}
                  aria-label="Drag and drop your image here or browse files"
                >
                  <div className="tb-upload-cloud-circle" aria-hidden="true">
                    <svg
                      className="tb-upload-cloud-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                      <polyline points="12 11 12 16" />
                      <polyline points="9 13 12 10 15 13" />
                    </svg>
                  </div>

                  <p className="tb-upload-dropzone-title">Drag & drop your image here</p>
                  <span className="tb-upload-dropzone-divider">or</span>

                  <button
                    type="button"
                    className="tb-upload-browse-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrowseClick();
                    }}
                  >
                    Browse Files
                  </button>

                  <p className="tb-upload-dropzone-formats">
                    Supports JPEG, PNG, or WebP (max 10 MB)
                  </p>
                </div>
              ) : (
                /* Selected File State: Image Preview & Details */
                <div className="tb-upload-selected-card">
                  <div className="tb-upload-selected-preview-box">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Selected chest radiograph preview"
                        className="tb-upload-selected-img"
                      />
                    ) : (
                      <div className="tb-upload-selected-placeholder" aria-hidden="true">
                        🖼️
                      </div>
                    )}
                  </div>

                  <div className="tb-upload-selected-details">
                    <div className="tb-upload-selected-meta">
                      <span className="tb-upload-selected-filename" title={selectedFile.name}>
                        {selectedFile.name}
                      </span>
                      <span className="tb-upload-selected-filesize">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type || 'image'}
                      </span>
                      <span className="tb-upload-selected-status">
                        <span className="tb-upload-selected-status-dot" aria-hidden="true" />
                        Image validated successfully
                      </span>
                    </div>

                    <div className="tb-upload-selected-actions">
                      <button
                        type="button"
                        className="tb-upload-replace-btn"
                        onClick={handleBrowseClick}
                      >
                        Replace Image
                      </button>
                      <button
                        type="button"
                        className="tb-upload-remove-btn"
                        onClick={handleRemoveFile}
                        aria-label="Remove selected image"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Image Guidelines Card */}
            <div className="tb-guidelines-card">
              <h2 className="tb-guidelines-title">Image Guidelines</h2>

              <ul className="tb-guidelines-list" aria-label="Radiograph Quality Guidelines">
                <li className="tb-guidelines-item">
                  <div className="tb-guidelines-icon-box tb-guidelines-icon-box--blue" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tb-guidelines-icon">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <span className="tb-guidelines-text">Clear, non-blurry image</span>
                </li>

                <li className="tb-guidelines-item">
                  <div className="tb-guidelines-icon-box tb-guidelines-icon-box--amber" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tb-guidelines-icon">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  </div>
                  <span className="tb-guidelines-text">Good lighting</span>
                </li>

                <li className="tb-guidelines-item">
                  <div className="tb-guidelines-icon-box tb-guidelines-icon-box--blue" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tb-guidelines-icon">
                      <path d="M6 2v14a2 2 0 0 0 2 2h14" />
                      <path d="M18 22V8a2 2 0 0 0-2-2H2" />
                    </svg>
                  </div>
                  <span className="tb-guidelines-text">Full chest area visible</span>
                </li>

                <li className="tb-guidelines-item">
                  <div className="tb-guidelines-icon-box tb-guidelines-icon-box--blue" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tb-guidelines-icon">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                  </div>
                  <span className="tb-guidelines-text">Standard chest X-ray</span>
                </li>
              </ul>

              {/* Example Image Preview Panel */}
              <div className="tb-example-panel">
                <span className="tb-example-label">Example Image</span>
                <div className="tb-example-img-wrapper">
                  <img
                    src="/assets/example-chest-xray.png?v=2"
                    alt="Standard chest radiograph conforming to image guidelines"
                    className="tb-example-img"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="tb-upload-actions-bar">
            <button
              type="button"
              className="tb-upload-back-btn"
              onClick={onBack}
              aria-label="Back to Screening Type Selection"
            >
              <span aria-hidden="true">←</span>
              <span>Back</span>
            </button>

            <button
              type="button"
              className={`tb-upload-continue-btn ${selectedFile ? 'tb-upload-continue-btn--active' : ''}`}
              disabled={!selectedFile}
              onClick={handleContinueClick}
              aria-disabled={!selectedFile}
            >
              <span>Continue</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TBUploadPage;
