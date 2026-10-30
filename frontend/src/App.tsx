import React, { useEffect, useState } from 'react';
import './App.css';

interface HealthResponse {
  status: string;
  service: string;
  version: string;
  environment: string;
}

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: HealthResponse = await response.json();
      setHealth(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to connect to backend';
      setError(message);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, [apiUrl]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>MediScan AI</h1>
        <p>Medical Image Screening Demonstration Platform</p>
      </header>

      <main>
        <section className="status-section">
          <h2>System Foundation (Module 1)</h2>
          {loading && (
            <div className="status-badge checking">Checking backend status...</div>
          )}
          {!loading && error && (
            <div>
              <div className="status-badge disconnected">Backend Disconnected</div>
              <p style={{ color: '#dc2626', margin: '0.5rem 0' }}>{error}</p>
            </div>
          )}
          {!loading && health && (
            <div>
              <div className="status-badge connected">Backend Operational</div>
              <div className="info-grid">
                <span className="info-label">Service:</span>
                <span className="info-value">{health.service}</span>
                <span className="info-label">Version:</span>
                <span className="info-value">{health.version}</span>
                <span className="info-label">Environment:</span>
                <span className="info-value">{health.environment}</span>
                <span className="info-label">Status:</span>
                <span className="info-value">{health.status}</span>
              </div>
            </div>
          )}

          <div className="action-bar">
            <button
              className="btn-check"
              onClick={checkHealth}
              disabled={loading}
            >
              {loading ? 'Pinging Backend...' : 'Re-check Backend Health'}
            </button>
          </div>
        </section>

        <section>
          <div className="info-grid">
            <span className="info-label">Configured API:</span>
            <span className="info-value">{apiUrl}</span>
            <span className="info-label">Screening Workflows:</span>
            <span className="info-value">Tuberculosis (TB) & Diabetic Retinopathy (DR) [Simulated - Future Modules]</span>
          </div>
        </section>
      </main>

      <footer className="footer-note">
        MediScan AI &bull; Module 1: Project Foundation & Environment Setup
      </footer>
    </div>
  );
};

export default App;
