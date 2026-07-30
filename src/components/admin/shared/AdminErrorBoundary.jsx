'use client';

import React from 'react';

/**
 * AdminErrorBoundary - Apple HIG Resilient Error Boundary for Admin Dashboard
 * Prevents blank screens when a client component or database payload throws an unexpected error.
 */
export default class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin Dashboard Client Error Boundary caught an exception:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="admin-error-boundary-wrap">
          <div className="admin-error-card">
            <div className="admin-error-icon-box">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FF3B30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h2 className="admin-error-title">Dasbor Memerlukan Pemulihan Sesi</h2>
            <p className="admin-error-desc">
              Terdeteksi penyesuaian skema database atau gangguan sesi sementara. Sistem telah mengisolasi kesalahan agar dasbor tidak mengalami layar kosong.
            </p>

            {this.state.error && (
              <div className="admin-error-details">
                <code>{this.state.error.toString()}</code>
              </div>
            )}

            <div className="admin-error-actions">
              <button
                type="button"
                className="btn-error-reset"
                onClick={this.handleReset}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                <span>Pulihkan &amp; Muat Ulang Dasbor</span>
              </button>

              <a
                href="/admin/login"
                className="btn-error-relogin"
              >
                Masuk Ulang Sesi Admin →
              </a>
            </div>
          </div>

          <style>{`
            .admin-error-boundary-wrap {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #060910;
              padding: 2rem 1rem;
              color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            }

            .admin-error-card {
              background: rgba(30, 41, 59, 0.85);
              backdrop-filter: blur(24px);
              -webkit-backdrop-filter: blur(24px);
              border: 1px solid rgba(255, 255, 255, 0.16);
              border-radius: 24px;
              padding: 2.5rem 2rem;
              max-width: 540px;
              width: 100%;
              text-align: center;
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 1rem;
            }

            .admin-error-icon-box {
              width: 64px;
              height: 64px;
              border-radius: 20px;
              background: rgba(255, 59, 48, 0.15);
              border: 1px solid rgba(255, 59, 48, 0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 20px rgba(255, 59, 48, 0.2);
            }

            .admin-error-title {
              font-size: 1.5rem;
              font-weight: 800;
              color: #ffffff;
              letter-spacing: -0.02em;
              margin: 0;
            }

            .admin-error-desc {
              font-size: 0.92rem;
              color: rgba(255, 255, 255, 0.75);
              line-height: 1.6;
              margin: 0;
            }

            .admin-error-details {
              background: rgba(0, 0, 0, 0.4);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              padding: 10px 14px;
              width: 100%;
              max-height: 100px;
              overflow-y: auto;
              text-align: left;
            }

            .admin-error-details code {
              font-size: 0.78rem;
              color: #FF453A;
              word-break: break-all;
            }

            .admin-error-actions {
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
              width: 100%;
              margin-top: 0.5rem;
            }

            .btn-error-reset {
              background: linear-gradient(135deg, #12A5B8 0%, #007AFF 100%);
              border: none;
              color: #ffffff;
              padding: 12px 20px;
              border-radius: 14px;
              font-size: 0.95rem;
              font-weight: 700;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
              box-shadow: 0 4px 15px rgba(18, 165, 184, 0.3);
            }

            .btn-error-reset:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(18, 165, 184, 0.45);
            }

            .btn-error-relogin {
              color: rgba(255, 255, 255, 0.65);
              font-size: 0.85rem;
              font-weight: 600;
              text-decoration: none;
              transition: color 0.2s ease;
            }

            .btn-error-relogin:hover {
              color: #ffffff;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
