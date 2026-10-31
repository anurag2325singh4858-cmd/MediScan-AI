import React, { useState, useEffect } from 'react';
import './Hero.css';
import { Button } from '../common';

export interface HeroProps {
  onGetStarted?: () => void;
  ctaRef?: React.Ref<HTMLDivElement>;
  isCtaHidden?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, ctaRef, isCtaHidden }) => {
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(hover: hover) and (pointer: fine)');
      setCanHover(media.matches);
      const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!canHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setPointerOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setPointerOffset({ x: 0, y: 0 });
  };

  return (
    <section
      id="home"
      className="hero"
      aria-label="MediScan AI Hero Introduction"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container hero__container">
        <div className="hero__grid">
          {/* ============================================================
              Left Column: Headline, Supporting Copy, and Coral Get Started CTA
              ============================================================ */}
          <div className="hero__content">
            {/* Subtle AI Constellation Graphic Background */}
            <svg
              className="hero__constellation"
              viewBox="0 0 400 350"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Connecting dashed constellation lines */}
              <line x1="40" y1="60" x2="120" y2="40" className="hero__constellation-line" />
              <line x1="120" y1="40" x2="200" y2="90" className="hero__constellation-line" />
              <line x1="120" y1="40" x2="100" y2="150" className="hero__constellation-line" />
              <line x1="100" y1="150" x2="60" y2="220" className="hero__constellation-line" />
              <line x1="100" y1="150" x2="190" y2="180" className="hero__constellation-line" />
              <line x1="190" y1="180" x2="280" y2="160" className="hero__constellation-line" />
              <line x1="190" y1="180" x2="170" y2="280" className="hero__constellation-line" />
              <line x1="60" y1="220" x2="170" y2="280" className="hero__constellation-line" />
              <line x1="170" y1="280" x2="260" y2="270" className="hero__constellation-line" />
              <line x1="280" y1="160" x2="360" y2="120" className="hero__constellation-line" />
              <line x1="280" y1="160" x2="350" y2="220" className="hero__constellation-line" />

              {/* Constellation Nodes */}
              <circle cx="40" cy="60" r="4" className="hero__constellation-node" />
              <circle cx="120" cy="40" r="5" className="hero__constellation-node hero__constellation-node--pulse" />
              <circle cx="200" cy="90" r="3.5" className="hero__constellation-node" />
              <circle cx="100" cy="150" r="6" className="hero__constellation-node hero__constellation-node--pulse" />
              <circle cx="60" cy="220" r="4" className="hero__constellation-node" />
              <circle cx="190" cy="180" r="5" className="hero__constellation-node" />
              <circle cx="280" cy="160" r="4.5" className="hero__constellation-node hero__constellation-node--pulse" />
              <circle cx="170" cy="280" r="4" className="hero__constellation-node" />
              <circle cx="260" cy="270" r="5" className="hero__constellation-node hero__constellation-node--pulse" />
              <circle cx="360" cy="120" r="3.5" className="hero__constellation-node" />
              <circle cx="350" cy="220" r="4" className="hero__constellation-node" />
            </svg>

            {/* Main Headline */}
            <h1 className="hero__headline">
              <span className="hero__headline-line hero__headline-line--1">Early Detection.</span>
              <span className="hero__headline-line hero__headline-line--2">
                Healthier <span className="hero__headline-accent">Tomorrows.</span>
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="hero__subtitle">
              AI-powered screening for multiple health conditions. Simple. Fast. Accessible.
            </p>

            {/* Prominent Coral/Orange Get Started CTA Button */}
            <div
              ref={ctaRef}
              className={`hero__cta-wrapper ${isCtaHidden ? 'hero__cta-wrapper--hidden' : ''}`}
            >
              <Button
                workflow="dr"
                size="lg"
                className="hero__cta-btn"
                onClick={onGetStarted}
                tabIndex={isCtaHidden ? -1 : 0}
                aria-hidden={isCtaHidden}
                trailingIcon={<span className="hero__cta-arrow" aria-hidden="true">→</span>}
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* ============================================================
              Right Column: Medical Professional & Medical-Imaging Graphics
              ============================================================ */}
          <div className="hero__visual-container">
            {/* Atmospheric Gradient Glow Halos (Subtly parallaxed) */}
            <div
              className="hero__halo hero__halo--blue"
              aria-hidden="true"
              style={{
                transform: canHover
                  ? `translate(${pointerOffset.x * -12}px, ${pointerOffset.y * -12}px)`
                  : undefined,
              }}
            />
            <div
              className="hero__halo hero__halo--coral"
              aria-hidden="true"
              style={{
                transform: canHover
                  ? `translate(${pointerOffset.x * -10}px, ${pointerOffset.y * -10}px)`
                  : undefined,
              }}
            />

            {/* Floating Visual Wrapper with Clean Approved Graphic */}
            <div
              className="hero__visual-wrapper"
              style={{
                '--parallax-x': `${pointerOffset.x * 10}px`,
                '--parallax-y': `${pointerOffset.y * 10}px`,
                '--tilt-x': `${-pointerOffset.y * 3.5}deg`,
                '--tilt-y': `${pointerOffset.x * 3.5}deg`,
              } as React.CSSProperties}
            >
              <img
                src="/assets/hero-doctor-visual.jpg"
                alt="Medical professional surrounded by diagnostic imaging: chest X-ray for Tuberculosis, retinal fundus photo for Diabetic Retinopathy, and future screening modalities"
                className="hero__visual-img"
                loading="eager"
              />

              {/* Pulsing Screening Focus Indicators */}
              <div
                className="hero__pulse-point hero__pulse-point--retina"
                title="Diabetic Retinopathy Screening (Fundus Photo)"
                aria-hidden="true"
              />
              <div
                className="hero__pulse-point hero__pulse-point--xray"
                title="Tuberculosis Screening (Chest X-Ray)"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
