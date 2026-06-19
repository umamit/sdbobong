export default function AdminDashboardLoading() {
  return (
    <div className="admin-loading-container">
      <style>{`
        .admin-loading-container {
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

        .header-skeleton {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .logo-skel {
          width: 250px;
          height: 35px;
        }

        .btn-skel {
          width: 120px;
          height: 40px;
          border-radius: 8px;
        }

        .grid-skel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .card-skel {
          height: 120px;
          border-radius: 12px;
          border: 1px solid #1e293b;
        }

        .main-skel {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
        }

        .sidebar-skel {
          height: 500px;
          border-radius: 12px;
          border: 1px solid #1e293b;
        }

        .content-skel {
          border-radius: 12px;
          border: 1px solid #1e293b;
          padding: 1.5rem;
          background: #090e20;
        }

        .title-skel {
          width: 200px;
          height: 28px;
          margin-bottom: 1.5rem;
        }

        .table-row-skel {
          height: 45px;
          margin-bottom: 0.75rem;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .main-skel {
            grid-template-columns: 1fr;
          }
          .sidebar-skel {
            display: none;
          }
        }
      `}</style>

      {/* Top Header Section */}
      <div className="header-skeleton">
        <div className="logo-skel shimmer"></div>
        <div className="btn-skel shimmer"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid-skel">
        <div className="card-skel shimmer"></div>
        <div className="card-skel shimmer"></div>
        <div className="card-skel shimmer"></div>
        <div className="card-skel shimmer"></div>
      </div>

      {/* Sidebar + Content Split */}
      <div className="main-skel">
        <div className="sidebar-skel shimmer"></div>
        <div className="content-skel">
          <div className="title-skel shimmer"></div>
          <div className="table-row-skel shimmer" style={{ height: '35px', opacity: 0.5 }}></div>
          <div className="table-row-skel shimmer"></div>
          <div className="table-row-skel shimmer"></div>
          <div className="table-row-skel shimmer"></div>
          <div className="table-row-skel shimmer"></div>
          <div className="table-row-skel shimmer"></div>
        </div>
      </div>
    </div>
  );
}
