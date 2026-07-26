'use client';


import React from 'react';
import dynamic from 'next/dynamic';
import { AdminDashboardProvider, useAdminDashboard } from './AdminDashboardContext';
import Sidebar from '../../../components/admin/shared/Sidebar';
import Header from '../../../components/admin/shared/Header';
import Modals from '../../../components/admin/shared/Modals';
import PremiumLoadingOverlay from '../../../components/PremiumLoadingOverlay';

// Loading Spinner for lazy-loaded tabs
function TabLoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      width: '100%',
      color: 'var(--text-muted)',
      gap: '0.75rem'
    }}>
      <div className="spinner" style={{
        width: '24px',
        height: '24px',
        border: '3px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: 'var(--primary-light)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span>Memuat tab...</span>
    </div>
  );
}

// Dynamic lazy imports for all 15 tabs
const OverviewTab = dynamic(() => import('../../../components/admin/tabs/OverviewTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const PpdbTab = dynamic(() => import('../../../components/admin/tabs/PpdbTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const ContentTab = dynamic(() => import('../../../components/admin/tabs/ContentTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const NewsTab = dynamic(() => import('../../../components/admin/tabs/NewsTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const TeachersTab = dynamic(() => import('../../../components/admin/tabs/TeachersTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const AchievementsTab = dynamic(() => import('../../../components/admin/tabs/AchievementsTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const PagesTab = dynamic(() => import('../../../components/admin/tabs/PagesTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const AgendaTab = dynamic(() => import('../../../components/admin/tabs/AgendaTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const DownloadsTab = dynamic(() => import('../../../components/admin/tabs/DownloadsTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const FaqsTab = dynamic(() => import('../../../components/admin/tabs/FaqsTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const GalleryTab = dynamic(() => import('../../../components/admin/tabs/GalleryTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const MessagesTab = dynamic(() => import('../../../components/admin/tabs/MessagesTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const GraduationTab = dynamic(() => import('../../../components/admin/tabs/GraduationTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const StudentsTab = dynamic(() => import('../../../components/admin/tabs/StudentsTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});
const SecurityTab = dynamic(() => import('../../../components/admin/tabs/SecurityTab'), { 
  ssr: false, 
  loading: () => <TabLoadingSpinner /> 
});

function AdminDashboardShell() {
  const { activeTab, isDetailModalOpen, isProcessing, processingMessage, activeThreats, setActiveTab } = useAdminDashboard();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  return (
    <div className={`admin-dashboard-layout ${isDetailModalOpen ? 'print-detail-open' : ''} ${mobileSidebarOpen ? 'mobile-sidebar-open' : ''}`}>
      
      <Sidebar onClose={() => setMobileSidebarOpen(false)} />
      
      {mobileSidebarOpen && (
        <div 
          className="mobile-sidebar-backdrop" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      <div className="main-wrapper">
        <Header onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        
        <main className="content-body">
          {/* Security Threat Banner — di sini agar tidak overlap dengan fixed navbar */}
          {activeThreats && activeThreats.length > 0 && (
            <div className="security-threat-banner">
              <div className="threat-banner-content">
                <div className="threat-icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div className="threat-text">
                  <h4 className="threat-title">Peringatan Keamanan Sistem</h4>
                  <p className="threat-desc">Terdeteksi {activeThreats.length} alamat IP mencurigakan dengan kegagalan login beruntun yang berpotensi membahayakan sistem!</p>
                </div>
              </div>
              <button className="btn-threat-action" onClick={() => setActiveTab('security')}>
                Periksa &amp; Selesaikan Ancaman
              </button>
            </div>
          )}

          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'ppdb' && <PpdbTab />}
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'news' && <NewsTab />}
          {activeTab === 'teachers' && <TeachersTab />}
          {activeTab === 'achievements' && <AchievementsTab />}
          {activeTab === 'pages' && <PagesTab />}
          {activeTab === 'agenda' && <AgendaTab />}
          {activeTab === 'downloads' && <DownloadsTab />}
          {activeTab === 'faqs' && <FaqsTab />}
          {activeTab === 'gallery' && <GalleryTab />}
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'graduation' && <GraduationTab />}
          {activeTab === 'students' && <StudentsTab />}
          {activeTab === 'security' && <SecurityTab />}
        </main>
      </div>
      
      <Modals />
      <PremiumLoadingOverlay active={isProcessing} message={processingMessage} />
    </div>
  );
}

export default function AdminDashboardClient(props) {
  return (
    <AdminDashboardProvider {...props}>
      <AdminDashboardShell />
    </AdminDashboardProvider>
  );
}
