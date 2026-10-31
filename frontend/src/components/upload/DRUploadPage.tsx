import React, { useState, useRef, useEffect } from 'react';
import './DRUploadPage.css';
import { LandingHeader } from '../landing/LandingHeader';
import { validateUploadFile, formatFileSize } from './uploadValidation';

export interface DRUploadPageProps {
  onBack: () => void;
  onContinue: (file: File) => void;
  initialFile?: File | null;
  onBackToLanding?: () => void;
  onNavigate?: (section: 'home' | 'screening' | 'how-it-works') => void;
}

export const DRUploadPage: React.FC<DRUploadPageProps> = ({
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
    const result = validateUploadFile(file, { workflow: 'dr' });

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
    <div className="dr-upload-page">
      {/* Header with active screening state and full navigation capabilities */}
      <LandingHeader
        variant="minimal"
        activeSection="screening"
        onLogoClick={onBackToLanding || onBack}
        onNavigate={onNavigate}
      />

      {/* Background Decorative Retinal Line-Art (Warm Coral/Orange Theme) */}
      <div className="dr-upload-bg-decor dr-upload-bg-decor--left" aria-hidden="true">
        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="dr-upload-bg-svg">
          {/* Concentric retinal arcs */}
          <circle cx="80" cy="250" r="180" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="5 5" />
          <circle cx="80" cy="250" r="120" stroke="#EA580C" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="80" cy="250" r="60" stroke="#EA580C" strokeWidth="1.5" />
          <circle cx="80" cy="250" r="24" stroke="#EA580C" strokeWidth="2" />
          {/* Branching retinal vascular pathways */}
          <path
            d="M80 190 C90 140, 130 110, 190 90 M190 90 C220 80, 260 75, 310 70 M190 90 C210 120, 250 140, 300 155"
            stroke="#EA580C"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M80 310 C95 360, 140 390, 200 410 M200 410 C240 425, 280 435, 330 440 M200 410 C225 380, 270 365, 320 350"
            stroke="#EA580C"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M104 250 C160 250, 220 240, 290 220 M220 240 C250 270, 300 290, 350 305"
            stroke="#EA580C"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="dr-upload-bg-decor dr-upload-bg-decor--right" aria-hidden="true">
        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="dr-upload-bg-svg">
          {/* Circular optic disc and radiating vascular branches */}
          <circle cx="320" cy="250" r="190" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="320" cy="250" r="130" stroke="#EA580C" strokeWidth="1.2" />
          <circle cx="320" cy="250" r="70" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="320" cy="250" r="28" stroke="#EA580C" strokeWidth="2" />
          <path
            d="M320 180 C300 130, 250 100, 180 80 M180 80 C140 70, 90 65, 40 60 M180 80 C150 115, 110 135, 60 150"
            stroke="#EA580C"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M320 320 C305 370, 255 400, 190 420 M190 420 C150 435, 100 445, 50 450 M190 420 C160 390, 120 370, 70 355"
            stroke="#EA580C"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M292 250 C230 250, 170 260, 100 280 M170 260 C140 230, 90 210, 40 195"
            stroke="#EA580C"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <main className="dr-upload-content">
        <div className="container dr-upload-container">
          {/* Header Title & Workflow Badge */}
          <div className="dr-upload-heading-group">
            <h1 className="dr-upload-title">Upload Your Medical Image</h1>
            <div className="dr-upload-workflow-row">
              <div className="dr-upload-workflow-badge">
                <span className="dr-upload-workflow-icon" aria-hidden="true">
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Outer Almond Eye Shape in Orange */}
                    <path
                      d="M 6 32 C 14 18, 23 11, 32 11 C 41 11, 50 18, 58 32 C 50 46, 41 53, 32 53 C 23 53, 14 46, 6 32 Z"
                      fill="#EA580C"
                    />
                    {/* Inner White Sclera Ring */}
                    <circle cx="32" cy="32" r="13" fill="#FFFFFF" />
                    {/* Iris & Pupil in Orange */}
                    <circle cx="32" cy="32" r="7.5" fill="#EA580C" />
                    {/* Pupil Center / Reflection */}
                    <circle cx="33.8" cy="30.2" r="2.2" fill="#FFFFFF" />
                  </svg>
                </span>
                <span className="dr-upload-workflow-text">
                  Diabetic Retinopathy Screening — Fundus Image
                </span>
              </div>
            </div>
          </div>

          {/* Error Banner (Accessible validation error) */}
          {errorMessage && (
            <div className="dr-upload-error-alert" role="alert" aria-live="assertive">
              <span className="dr-upload-error-icon" aria-hidden="true">⚠️</span>
              <span className="dr-upload-error-text">{errorMessage}</span>
              <button
                type="button"
                className="dr-upload-error-close"
                onClick={() => setErrorMessage(null)}
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Two-Column Responsive Layout */}
          <div className="dr-upload-grid">
            {/* Left Column: Upload Card */}
            <div className="dr-upload-card">
              <input
                ref={fileInputRef}
                type="file"
                className="dr-upload-hidden-input"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                onChange={handleFileInputChange}
                aria-label="Select retinal fundus image file"
              />

              {!selectedFile ? (
                /* Unselected State: Dashed Drag-and-Drop Area */
                <div
                  className={`dr-upload-dropzone ${isDragging ? 'dr-upload-dropzone--dragging' : ''}`}
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
                  <div className="dr-upload-cloud-circle" aria-hidden="true">
                    <svg
                      className="dr-upload-cloud-icon"
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

                  <p className="dr-upload-dropzone-title">Drag & drop your image here</p>
                  <span className="dr-upload-dropzone-divider">or</span>

                  <button
                    type="button"
                    className="dr-upload-browse-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrowseClick();
                    }}
                  >
                    Browse Files
                  </button>

                  <p className="dr-upload-dropzone-formats">
                    Supports JPEG, PNG, or WebP (max 10 MB)
                  </p>
                </div>
              ) : (
                /* Selected File State: Image Preview & Details */
                <div className="dr-upload-selected-card">
                  <div className="dr-upload-selected-preview-box">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Selected retinal fundus image preview"
                        className="dr-upload-selected-img"
                      />
                    ) : (
                      <div className="dr-upload-selected-placeholder" aria-hidden="true">
                        👁️
                      </div>
                    )}
                  </div>

                  <div className="dr-upload-selected-details">
                    <div className="dr-upload-selected-meta">
                      <span className="dr-upload-selected-filename" title={selectedFile.name}>
                        {selectedFile.name}
                      </span>
                      <span className="dr-upload-selected-filesize">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type || 'image'}
                      </span>
                      <span className="dr-upload-selected-status">
                        <span className="dr-upload-selected-status-dot" aria-hidden="true" />
                        Image validated successfully
                      </span>
                    </div>

                    <div className="dr-upload-selected-actions">
                      <button
                        type="button"
                        className="dr-upload-replace-btn"
                        onClick={handleBrowseClick}
                      >
                        Replace Image
                      </button>
                      <button
                        type="button"
                        className="dr-upload-remove-btn"
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
            <div className="dr-guidelines-card">
              <h2 className="dr-guidelines-title">Image Guidelines</h2>

              <ul className="dr-guidelines-list" aria-label="Retinal Image Quality Guidelines">
                <li className="dr-guidelines-item">
                  <div className="dr-guidelines-icon-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dr-guidelines-icon">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <span className="dr-guidelines-text">Clear, non-blurry image</span>
                </li>

                <li className="dr-guidelines-item">
                  <div className="dr-guidelines-icon-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dr-guidelines-icon">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  </div>
                  <span className="dr-guidelines-text">Good lighting</span>
                </li>

                <li className="dr-guidelines-item">
                  <div className="dr-guidelines-icon-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dr-guidelines-icon">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <span className="dr-guidelines-text">Full retinal view</span>
                </li>

                <li className="dr-guidelines-item">
                  <div className="dr-guidelines-icon-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dr-guidelines-icon">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                  </div>
                  <span className="dr-guidelines-text">Standard format</span>
                </li>
              </ul>

              {/* Example Image Preview Panel (Pale-orange background) */}
              <div className="dr-example-panel">
                <span className="dr-example-label">Example Image</span>
                <div className="dr-example-img-wrapper">
                  <img
                    src="/assets/example-retinal-fundus.png"
                    alt="Standard retinal fundus photograph conforming to image guidelines"
                    className="dr-example-img"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="dr-upload-actions-bar">
            <button
              type="button"
              className="dr-upload-back-btn"
              onClick={onBack}
              aria-label="Back to Screening Type Selection"
            >
              <span aria-hidden="true">←</span>
              <span>Back</span>
            </button>

            <button
              type="button"
              className={`dr-upload-continue-btn ${selectedFile ? 'dr-upload-continue-btn--active' : ''}`}
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

export default DRUploadPage;
