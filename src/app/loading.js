export default function Loading() {
  return (
    <>
      {/* Self-contained CSS for high performance shimmer animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes skeleton-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .skeleton-shimmer-bg {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite linear;
        }

        /* Dark mode compatibility if active */
        @media (prefers-color-scheme: dark) {
          .skeleton-shimmer-bg {
            background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%);
            background-size: 200% 100%;
          }
        }

        .loading-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--space-lg) var(--space-sm);
        }

        .skeleton-banner {
          width: 100%;
          height: 180px;
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-lg);
        }

        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .skeleton-card {
          background: var(--bg-card);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          height: 380px;
        }

        .skeleton-card-img {
          width: 100%;
          height: 180px;
        }

        .skeleton-card-content {
          padding: var(--space-sm);
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .skeleton-badge {
          width: 80px;
          height: 18px;
          border-radius: var(--radius-sm);
        }

        .skeleton-title {
          width: 90%;
          height: 24px;
          border-radius: var(--radius-sm);
          margin: var(--space-xs) 0;
        }

        .skeleton-text-line {
          height: 14px;
          border-radius: var(--radius-sm);
        }

        .skeleton-text-line.short {
          width: 60%;
        }
      `}} />

      {/* Main Skeleton Page Structure */}
      <div className="loading-container">
        {/* Shimmering Header/Banner */}
        <div className="skeleton-banner skeleton-shimmer-bg" />

        {/* Shimmering Content Grid */}
        <div className="skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-card-img skeleton-shimmer-bg" />
              <div className="skeleton-card-content">
                <div className="skeleton-badge skeleton-shimmer-bg" />
                <div className="skeleton-title skeleton-shimmer-bg" />
                <div className="skeleton-text-line skeleton-shimmer-bg" />
                <div className="skeleton-text-line skeleton-shimmer-bg" />
                <div className="skeleton-text-line skeleton-shimmer-bg short" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
