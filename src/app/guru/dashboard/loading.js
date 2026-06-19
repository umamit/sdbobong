export default function GuruDashboardLoading() {
  return (
    <div className="guru-loading-container">
      <style>{`
        .guru-loading-container {
          padding: 2rem;
          background-color: #060913;
          min-height: 100vh;
          color: #f3f4f6;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .shimmer {
          background: linear-gradient(90deg, #0e1326 25%, #1c233d 50%, #0e1326 75%);
          background-size: 200% 100%;
          animation: loading-shimmer 1.6s infinite linear;
          border-radius: 6px;
        }

        @keyframes loading-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .header-skel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid #1e293b;
          padding-bottom: 1rem;
        }

        .title-skel {
          width: 300px;
          height: 32px;
        }

        .profile-skel {
          width: 150px;
          height: 40px;
          border-radius: 20px;
        }

        .controls-skel {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .search-skel {
          flex: 1;
          height: 42px;
        }

        .select-skel {
          width: 180px;
          height: 42px;
        }

        .table-container-skel {
          border-radius: 12px;
          border: 1px solid #1e293b;
          padding: 1.5rem;
          background: #090e20;
        }

        .row-skel {
          height: 50px;
          margin-bottom: 0.75rem;
          border-radius: 6px;
        }
      `}</style>

      {/* Header */}
      <div className="header-skel">
        <div className="title-skel shimmer"></div>
        <div className="profile-skel shimmer"></div>
      </div>

      {/* Search & Filter controls */}
      <div className="controls-skel">
        <div className="search-skel shimmer"></div>
        <div className="select-skel shimmer"></div>
        <div className="select-skel shimmer"></div>
      </div>

      {/* Table Container */}
      <div className="table-container-skel">
        <div className="row-skel shimmer" style={{ height: '40px', opacity: 0.6 }}></div>
        <div className="row-skel shimmer"></div>
        <div className="row-skel shimmer"></div>
        <div className="row-skel shimmer"></div>
        <div className="row-skel shimmer"></div>
        <div className="row-skel shimmer"></div>
        <div className="row-skel shimmer"></div>
      </div>
    </div>
  );
}
