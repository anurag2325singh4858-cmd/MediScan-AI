import React from 'react';
import './ReferenceMedicalImagingSection.css';

export const ReferenceMedicalImagingSection: React.FC = () => {
  return (
    <section
      id="medical-imaging"
      className="ref-medical-imaging-section"
      aria-label="Medical Imaging Screening Workflows and Anatomy Visuals"
    >
      <div className="container ref-medical-imaging-container">
        <img
          src="/assets/reference-medical-imaging-sections.png"
          alt="Medical Imaging Clearer Insights, Available Screening Workflows for Tuberculosis and Diabetic Retinopathy, and Anatomical Landmark Visualizations"
          className="ref-medical-imaging-img"
        />
      </div>
    </section>
  );
};

export default ReferenceMedicalImagingSection;
