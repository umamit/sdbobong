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
  const { activeTab, isDetailModalOpen, isProcessing, processingMessage } = useAdminDashboard();

  return (
    <div className={`admin-dashboard-layout ${isDetailModalOpen ? 'print-detail-open' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .print-only {
            display: none;
        }

        .no-screen {
            display: none !important;
        }


        .admin-dashboard-layout {
            --sidebar-width: 280px;
            --admin-bg: #f8fafc;
            --sidebar-bg: #0b0f19;
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --accent: #f59e0b;
            --emerald: #10b981;
            --rose: #ef4444;
            --violet: #8b5cf6;
            --card-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.03), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
            --card-shadow-hover: 0 20px 35px -5px rgba(99, 102, 241, 0.08), 0 10px 15px -5px rgba(99, 102, 241, 0.03);
            --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --radius-lg: 16px;
            --radius-md: 12px;
            --radius-sm: 8px;

            background-color: var(--admin-bg);
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: var(--text-main);
            display: flex;
            height: 100vh;
            overflow: hidden;
            width: 100%;
        }
        .sidebar {
            width: var(--sidebar-width);
            background: linear-gradient(180deg, #0b0f19 0%, #0f172a 100%);
            color: #ffffff;
            position: fixed;
            top: 80px;
            bottom: 0;
            left: 0;
            z-index: 100;
            display: flex;
            flex-direction: column;
            border-right: 1px solid rgba(255, 255, 255, 0.06);
            box-shadow: 10px 0 40px rgba(0, 0, 0, 0.25);
            transition: var(--transition-smooth);
        }
        .sidebar-brand {
            padding: 1.75rem 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            gap: 0.85rem;
        }
        .sidebar-brand img {
            width: 40px;
            height: 40px;
            filter: drop-shadow(0 4px 10px rgba(99, 102, 241, 0.3));
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            padding: 2px;
        }
        .sidebar-brand span {
            font-weight: 800;
            font-size: 0.95rem;
            letter-spacing: 0.02em;
            background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            white-space: nowrap;
        }
        .sidebar-menu {
            list-style: none;
            padding: 1.5rem 0;
            margin: 0;
            flex: 1;
            overflow-y: auto;
        }
        .sidebar-menu::-webkit-scrollbar {
            width: 4px;
        }
        .sidebar-menu::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
        }
        .sidebar-item {
            margin-bottom: 6px;
            padding: 0 16px;
        }
        .sidebar-link {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            padding: 0.85rem 1.15rem;
            color: #94a3b8;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: var(--transition-smooth);
            border-radius: var(--radius-md);
            cursor: pointer;
            border: 1px solid transparent;
        }
        .sidebar-link svg {
            width: 20px;
            height: 20px;
            color: #64748b;
            transition: var(--transition-smooth);
        }
        .sidebar-link:hover {
            color: #ffffff;
            background-color: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transform: translateX(4px);
        }
        .sidebar-link:hover svg {
            color: #ffffff;
        }
        .sidebar-link.active {
            color: #ffffff;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.03) 100%);
            border: 1px solid rgba(99, 102, 241, 0.3);
            font-weight: 700;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.1);
        }
        .sidebar-link.active svg {
            color: #818cf8;
            filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.6));
        }
        .sidebar-footer {
            padding: 1.25rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            background: #060910;
        }
        .btn-logout {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            border: none;
            border-radius: var(--radius-md);
            font-weight: 700;
            cursor: pointer;
            transition: var(--transition-smooth);
            font-size: 0.875rem;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
        }
        .btn-logout svg {
            width: 18px;
            height: 18px;
        }
        .btn-logout:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.25);
            background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
        }
        .main-wrapper {
            margin-left: var(--sidebar-width);
            margin-top: 80px;
            flex: 1;
            display: flex;
            flex-direction: column;
            height: calc(100vh - 80px);
            overflow: hidden;
            background-color: var(--admin-bg);
        }
        .top-navbar {
            height: 80px;
            background-color: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2.5rem;
            padding-left: calc(var(--sidebar-width) + 2.5rem);
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 110;
            box-sizing: border-box;
            transition: var(--transition-smooth);
        }
        .top-title h1 {
            font-size: 1.35rem;
            font-weight: 800;
            color: #0f172a;
            margin: 0;
            letter-spacing: -0.02em;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 700;
            font-size: 0.875rem;
            color: #334155;
        }
        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
            position: relative;
        }
        .user-avatar::after {
            content: '';
            position: absolute;
            bottom: 1px;
            right: 1px;
            width: 8px;
            height: 8px;
            background-color: var(--emerald);
            border: 1.5px solid white;
            border-radius: 50%;
        }
        .content-body {
            padding: 2rem 2.5rem;
            flex: 1;
            overflow-y: auto;
        }
        .content-body::-webkit-scrollbar {
            width: 6px;
        }
        .content-body::-webkit-scrollbar-track {
            background: transparent;
        }
        .content-body::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }
        .content-body::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
        .alert-toast {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 9999;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            font-size: 0.9rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid transparent;
            animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            max-width: 400px;
            backdrop-filter: blur(12px);
        }
        @keyframes slideInRight {
            from { transform: translateX(120%) scale(0.95); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
        }
        .alert-toast-success {
            background-color: rgba(236, 253, 245, 0.95);
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .alert-toast-danger {
            background-color: rgba(254, 242, 242, 0.95);
            color: #991b1b;
            border: 1px solid #fca5a5;
        }
        .tab-pane {
            display: none;
            animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .tab-pane.active {
            display: block;
        }
        .stats-overview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .overview-card {
            background-color: #ffffff;
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            box-shadow: var(--card-shadow);
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
            transition: var(--transition-smooth);
        }
        .overview-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--card-shadow-hover);
        }
        .overview-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%);
        }
        .overview-card.accent::after {
            background: linear-gradient(180deg, var(--emerald) 0%, #059669 100%);
        }
        .overview-card.warning::after {
            background: linear-gradient(180deg, var(--accent) 0%, #d97706 100%);
        }
        .overview-card.purple::after {
            background: linear-gradient(180deg, var(--violet) 0%, #7c3aed 100%);
        }
        .overview-card.cyan::after {
            background: linear-gradient(180deg, #06b6d4 0%, #0891b2 100%);
        }
        .overview-card.rose::after {
            background: linear-gradient(180deg, #f43f5e 0%, #be123c 100%);
        }
        .overview-card-title {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 0.5rem;
            letter-spacing: 0.05em;
            display: block;
        }
        .overview-card-value {
            font-size: 2.25rem;
            font-weight: 800;
            color: #0f172a;
            line-height: 1;
            letter-spacing: -0.03em;
        }
        .pulse-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 6px;
            vertical-align: middle;
        }
        .pulse-dot.green {
            background-color: #10b981;
            animation: pulse-green 2s infinite;
        }
        .pulse-dot.amber {
            background-color: #f59e0b;
            animation: pulse-amber 2s infinite;
        }
        @keyframes pulse-green {
            0% {
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }
            70% {
                box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
            }
        }
        @keyframes pulse-amber {
            0% {
                box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
            }
            70% {
                box-shadow: 0 0 0 8px rgba(245, 158, 11, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
            }
        }
        .admin-table {
            background: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--card-shadow);
            border: 1px solid #e2e8f0;
            overflow: hidden;
            margin-bottom: 2rem;
        }
        .table-toolbar {
            padding: 1.5rem;
            background-color: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .table-toolbar h3 {
            margin: 0;
            font-size: 1.15rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
        }
        .table-custom {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background-color: #ffffff;
            font-size: 0.85rem;
            text-align: left;
        }
        .table-custom th {
            background-color: #f8fafc;
            color: #475569;
            padding: 1rem 1.25rem;
            font-weight: 700;
            border-bottom: 2px solid #e2e8f0;
        }
        .table-custom td {
            padding: 1rem 1.25rem;
            border-bottom: 1px solid #f1f5f9;
            color: #475569;
            vertical-align: middle;
        }
        .table-custom tr:hover td {
            background-color: #f8fafc;
        }
        .table-custom tr:last-child td {
            border-bottom: none;
        }
        .table-responsive {
            border-radius: var(--radius-md);
            overflow-x: auto;
            border: 1px solid #e2e8f0;
            margin: 0 1.5rem 1.5rem 1.5rem;
            -webkit-overflow-scrolling: touch;
        }
        /* Database Toggle Switch */
        .db-toggle-container {
            margin-top: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 0.75rem 1rem;
            background: rgba(255, 255, 255, 0.5);
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
            box-sizing: border-box;
        }
        .db-toggle-label {
            font-size: 0.8rem;
            font-weight: 700;
            color: var(--text-main);
            text-align: left;
        }
        .db-toggle-desc {
            font-size: 0.7rem;
            color: var(--text-muted);
            font-weight: 500;
            margin-top: 2px;
            text-align: left;
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: .3s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        input:checked + .slider {
          background-color: var(--primary);
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }

        .status-badge-select {
            padding: 0.4rem 0.75rem;
            font-size: 0.75rem;
            font-weight: 700;
            border-radius: 9999px;
            border: 1px solid transparent;
            cursor: pointer;
            outline: none;
            transition: var(--transition-smooth);
            appearance: none;
            -webkit-appearance: none;
            text-align: center;
        }
        .status-badge-select.pending {
            background-color: #fef3c7;
            color: #d97706;
            border-color: #fcd34d;
        }
        .status-badge-select.verified {
            background-color: #d1fae5;
            color: #059669;
            border-color: #6ee7b7;
        }
        .status-badge-select.rejected {
            background-color: #fee2e2;
            color: #dc2626;
            border-color: #fca5a5;
        }
        .status-badge-select:focus {
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
            border-color: var(--primary);
        }
        .settings-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        @media (min-width: 950px) {
            .settings-grid {
                grid-template-columns: 1.25fr 0.75fr;
            }
        }
        .settings-card {
            background: white;
            padding: 1.75rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--card-shadow);
            border: 1px solid #e2e8f0;
            margin-bottom: 1.5rem;
        }
        .settings-card h3 {
            margin-top: 0;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 0.75rem;
            margin-bottom: 1.25rem;
            color: #0f172a;
            font-weight: 800;
            font-size: 1.15rem;
            letter-spacing: -0.02em;
        }
        .news-cms-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        @media (min-width: 950px) {
            .news-cms-grid {
                grid-template-columns: 1.1fr 0.9fr;
            }
            .news-cms-grid.news-stacked-layout {
                grid-template-columns: 1fr;
            }
        }
        .btn {
            border-radius: var(--radius-md);
            font-weight: 700;
            transition: var(--transition-smooth);
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            padding: 0.65rem 1.25rem;
            font-size: 0.875rem;
            gap: 0.5rem;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .btn:active {
            transform: translateY(0);
        }
        .btn-primary {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }
        .btn-primary:hover {
            box-shadow: 0 6px 18px rgba(99, 102, 241, 0.3);
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
        }
        .btn-secondary {
            background-color: #f1f5f9;
            color: #334155;
            border: 1px solid #e2e8f0;
        }
        .btn-secondary:hover {
            background-color: #e2e8f0;
            color: #0f172a;
        }
        .btn-danger {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }
        .btn-danger:hover {
            box-shadow: 0 6px 18px rgba(239, 68, 68, 0.3);
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        }
        .btn-action-delete {
            background-color: #fee2e2;
            color: #ef4444;
            border: 1px solid #fca5a5;
            padding: 0.4rem 0.8rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: var(--transition-smooth);
            font-size: 0.8rem;
            font-weight: 700;
        }
        .btn-action-delete:hover {
            background-color: #ef4444;
            color: white;
            box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
            transform: translateY(-1px);
        }
        .btn-action-edit {
            background-color: #e0f2fe;
            color: #0284c7;
            border: 1px solid #bae6fd;
            padding: 0.4rem 0.8rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: var(--transition-smooth);
            font-size: 0.8rem;
            font-weight: 700;
        }
        .btn-action-edit:hover {
            background-color: #0284c7;
            color: white;
            box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2);
            transform: translateY(-1px);
        }
        .form-control {
            border-radius: var(--radius-md);
            border: 1.5px solid #cbd5e1;
            padding: 0.7rem 1rem;
            font-family: inherit;
            transition: var(--transition-smooth);
            outline: none;
            font-size: 0.9rem;
            box-sizing: border-box;
            background: #ffffff;
            width: 100%;
            color: #0f172a;
        }
        .form-control:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 700;
            font-size: 0.8rem;
            color: #475569;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        @media (min-width: 768px) {
            .grid-2 {
                grid-template-columns: 1.2fr 0.8fr;
            }
        }
        .badge {
            display: inline-flex;
            align-items: center;
            border-radius: 9999px;
            padding: 0.35rem 0.75rem;
            font-size: 0.75rem;
            font-weight: 700;
        }
        @media (max-width: 768px) {
            .sidebar {
                width: 80px;
                top: 80px;
            }
            .sidebar-brand span, .sidebar-link span:last-child, .sidebar-footer button span:last-child {
                display: none;
            }
            .sidebar-brand {
                justify-content: center;
                padding: 1.5rem 0;
            }
            .sidebar-link {
                justify-content: center;
                padding: 1rem 0;
            }
            .main-wrapper {
                margin-left: 80px;
                margin-top: 80px;
                height: calc(100vh - 80px);
            }
            .top-navbar {
                padding-left: calc(80px + 1.5rem);
                padding-right: 1.5rem;
            }
        }

        /* PREMIUM STYLES FOR DASHBOARD UPGRADES */
        .analytics-card {
            background: #ffffff;
            border-radius: var(--radius-lg);
            padding: 1.75rem;
            box-shadow: var(--card-shadow);
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .analytics-grid {
            display: grid;
            grid-template-columns: 1.2fr 1.8fr;
            gap: 2rem;
            align-items: center;
        }
        @media (max-width: 1024px) {
            .analytics-grid {
                grid-template-columns: 1fr;
            }
        }
        .donut-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
        .donut-legends {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
        }
        .legend-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.85rem;
            color: var(--text-main);
        }
        .legend-color-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
        }

        .bar-chart-container {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }
        .chart-bar-item {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }
        .chart-bar-info {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            font-weight: 600;
        }
        .chart-bar-bg {
            background-color: #f1f5f9;
            height: 10px;
            border-radius: 9999px;
            overflow: hidden;
            width: 100%;
        }
        .chart-bar-fill {
            height: 100%;
            border-radius: 9999px;
            transition: width 1s ease-out;
        }

        /* Search, Filter, Pagination */
        .filter-toolbar {
            background-color: #ffffff;
            border-radius: var(--radius-md);
            padding: 1.25rem;
            border: 1px solid #e2e8f0;
            display: grid;
            grid-template-columns: 2fr 1.2fr 1.2fr 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
            box-shadow: var(--card-shadow);
        }
        @media (max-width: 768px) {
            .filter-toolbar {
                grid-template-columns: 1fr;
            }
        }
        
        .pagination-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem;
            background: #ffffff;
            border-top: 1px solid #e2e8f0;
            border-radius: 0 0 var(--radius-lg) var(--radius-lg);
            font-size: 0.85rem;
            color: var(--text-muted);
        }
        .pagination-buttons {
            display: flex;
            gap: 0.5rem;
        }
        .btn-pagination {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            padding: 0.4rem 0.8rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-weight: 600;
            color: var(--text-main);
            transition: var(--transition-smooth);
        }
        .btn-pagination:hover:not(:disabled) {
            background: #f1f5f9;
            border-color: #94a3b8;
        }
        .btn-pagination:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .btn-pagination.active {
            background: var(--primary);
            color: #ffffff;
            border-color: var(--primary);
        }

        /* Unified & Adaptive Print Styles */
        @media print {
            /* General resets for print */
            html, body {
                height: auto !important;
                overflow: visible !important;
                background-color: #ffffff !important;
                color: #000000 !important;
                font-family: 'Plus Jakarta Sans', sans-serif !important;
            }

            /* Force exact colors and backgrounds on print */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            /* 1. SCENARIO A: Printing the Individual Student Registration Slip (Modal is Open) */
            body:has(#print-slip-container), 
            body.print-detail-open {
                background: #ffffff !important;
                color: #000000 !important;
            }
            
            /* Completely hide non-printable layout containers when printing the slip */
            body.print-detail-open .sidebar,
            body.print-detail-open .main-wrapper,
            body:has(#print-slip-container) .sidebar,
            body:has(#print-slip-container) .main-wrapper {
                display: none !important;
            }

            /* Reset ancestral containers to standard block flow during print to avoid flexbox/height constraints */
            .admin-dashboard-layout.print-detail-open,
            body.print-detail-open .admin-dashboard-layout,
            body.print-detail-open .modal-backdrop,
            body.print-detail-open .modal-content,
            body:has(#print-slip-container) .admin-dashboard-layout,
            body:has(#print-slip-container) .modal-backdrop,
            body:has(#print-slip-container) .modal-content {
                position: static !important;
                display: block !important;
                width: 100% !important;
                height: auto !important;
                max-height: none !important;
                overflow: visible !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
                background: #ffffff !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
            }

            body.print-detail-open .modal-content > div,
            body:has(#print-slip-container) .modal-content > div {
                overflow: visible !important;
                padding: 0 !important;
                height: auto !important;
                background: #ffffff !important;
            }

            #print-slip-container {
                position: static !important;
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background-color: #ffffff !important;
                overflow: visible !important;
            }

            /* Hide everything under body in scenario A, except the print-slip-container */
            body:has(#print-slip-container) * {
                visibility: hidden !important;
            }
            body.print-detail-open * {
                visibility: hidden !important;
            }

            body:has(#print-slip-container) #print-slip-container,
            body:has(#print-slip-container) #print-slip-container *,
            body.print-detail-open #print-slip-container,
            body.print-detail-open #print-slip-container * {
                visibility: visible !important;
            }

            /* 2. SCENARIO B: Printing the Active Tab (Student Registration List / Tables) directly */
            body:not(:has(#print-slip-container)):not(.print-detail-open) .admin-dashboard-layout {
                display: block !important;
                width: 100% !important;
                height: auto !important;
                overflow: visible !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .main-wrapper {
                margin-left: 0 !important;
                margin-top: 0 !important;
                width: 100% !important;
                height: auto !important;
                overflow: visible !important;
                background-color: #ffffff !important;
                padding: 0 !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .content-body {
                padding: 1.5rem 0 !important;
                height: auto !important;
                overflow: visible !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .admin-table {
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                background: #ffffff !important;
                overflow: visible !important;
                display: block !important;
                width: 100% !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-responsive {
                overflow: visible !important;
                margin: 0 !important;
                border: none !important;
                display: block !important;
                width: 100% !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom {
                border-collapse: collapse !important;
                width: 100% !important;
                display: table !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom th,
            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom td {
                border: 1px solid #cbd5e1 !important;
                padding: 8px 10px !important;
                color: #0f172a !important;
                background: #ffffff !important;
                font-size: 0.8rem !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom th {
                background-color: #f1f5f9 !important;
                font-weight: 700 !important;
            }

            /* Hide interactive Actions column from printed table */
            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom th:last-child,
            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom td:last-child,
            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom th.no-print,
            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom td.no-print {
                display: none !important;
            }

            /* Universal Hides for Print */
            .no-print,
            .sidebar,
            .top-navbar,
            .table-filters,
            .pagination-container,
            .btn-pagination,
            .table-toolbar .btn,
            .table-toolbar button,
            .modal-backdrop:not(.print-detail-open) {
                display: none !important;
            }

            /* Print-only elements show up */
            .print-only {
                display: block !important;
            }

            .no-screen {
                display: table-row !important;
            }

            .table-custom tr {
                page-break-inside: avoid !important;
                keep-together: always !important;
            }

            body:not(:has(#print-slip-container)):not(.print-detail-open) .table-custom thead {
                display: table-header-group !important;
            }
        }
        
        .print-slip {
            background-color: #ffffff;
            color: #1e293b;
            font-family: 'Plus Jakarta Sans', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 3rem;
            border: 1px dashed #cbd5e1;
            border-radius: 12px;
        }
        .print-header {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            border-bottom: 3px double #0f172a;
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
        }
        .print-logo {
            width: 75px;
            height: 75px;
            object-fit: contain;
        }
        .print-title {
            flex-grow: 1;
            text-align: center;
        }
        .print-title h2 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .print-title h3 {
            margin: 4px 0 0 0;
            font-size: 1.15rem;
            font-weight: 700;
            color: var(--primary-dark);
        }
        .print-title p {
            margin: 4px 0 0 0;
            font-size: 0.75rem;
            color: #64748b;
        }
        
        .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .print-field {
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 0.5rem;
        }
        .print-field-label {
            font-size: 0.75rem;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .print-field-value {
            font-size: 1rem;
            font-weight: 600;
            color: #0f172a;
            margin-top: 2px;
        }
        
        .print-footer-signature {
            margin-top: 4rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            text-align: center;
        }
        .signature-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            height: 120px;
        }

        /* Jejak Audit & Keamanan Styles */
        .security-threat-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.25rem 2rem;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%);
            border: 1px solid rgba(239, 68, 68, 0.4);
            border-radius: var(--radius-lg);
            margin-bottom: 2rem;
            box-shadow: 0 8px 32px 0 rgba(239, 68, 68, 0.1);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            animation: borderPulse 3s infinite alternate, slideDown 0.4s ease-out;
        }
        @keyframes borderPulse {
            0% { border-color: rgba(239, 68, 68, 0.4); box-shadow: 0 8px 32px 0 rgba(239, 68, 68, 0.1); }
            100% { border-color: rgba(239, 68, 68, 0.8); box-shadow: 0 8px 32px 0 rgba(239, 68, 68, 0.25); }
        }
        @keyframes slideDown {
            from { transform: translateY(-12px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .security-threat-content {
            display: flex;
            align-items: center;
            gap: 1.25rem;
        }
        .security-threat-icon {
            width: 2.75rem;
            height: 2.75rem;
            color: #ef4444;
            flex-shrink: 0;
            animation: iconShake 1.5s infinite ease-in-out;
        }
        @keyframes iconShake {
            0%, 100% { transform: rotate(0deg) scale(1); }
            15% { transform: rotate(-8deg) scale(1.05); }
            30% { transform: rotate(8deg) scale(1.05); }
            45% { transform: rotate(-4deg) scale(1.03); }
            60% { transform: rotate(4deg) scale(1.03); }
            75% { transform: rotate(0deg) scale(1); }
        }
        .security-threat-text h3 {
            font-size: 1.1rem;
            font-weight: 700;
            color: #b91c1c;
            margin: 0 0 0.25rem 0;
        }
        .security-threat-text p {
            font-size: 0.925rem;
            color: #7f1d1d;
            margin: 0;
            font-weight: 500;
        }
        .btn-danger-pulse {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: #ffffff;
            font-weight: 600;
            padding: 0.65rem 1.5rem;
            border: none;
            border-radius: var(--radius-md);
            box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
            cursor: pointer;
            transition: var(--transition-smooth);
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        .btn-danger-pulse:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.6);
            background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
        }
        .btn-danger-pulse:active {
            transform: translateY(0);
        }

        /* Health Cards & Security Section */
        .security-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
            margin-top: 1.5rem;
        }
        @media (max-width: 1024px) {
            .security-grid {
                grid-template-columns: 1fr;
            }
        }
        .security-health-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .health-card {
            background: #ffffff;
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            border: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            gap: 1.25rem;
            box-shadow: var(--card-shadow);
            transition: var(--transition-smooth);
            position: relative;
            overflow: hidden;
        }
        .health-card:hover {
            transform: translateY(-3px);
            box-shadow: var(--card-shadow-hover);
        }
        .health-card-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .health-card-icon.safe {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }
        .health-card-icon.warning {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }
        .health-card-icon.danger {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
        .health-card-icon.info {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }
        .health-card-info {
            display: flex;
            flex-direction: column;
        }
        .health-card-label {
            font-size: 0.85rem;
            color: #64748b;
            font-weight: 500;
        }
        .health-card-value {
            font-size: 1.35rem;
            font-weight: 800;
            color: #0f172a;
            margin-top: 0.125rem;
        }
        .pulsing-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 6px;
        }
        .pulsing-dot.green {
            background-color: #10b981;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            animation: dotPulseGreen 1.8s infinite;
        }
        .pulsing-dot.red {
            background-color: #ef4444;
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            animation: dotPulseRed 1.8s infinite;
        }
        @keyframes dotPulseGreen {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @keyframes dotPulseRed {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        /* Threat Management panel */
        .threat-panel {
            background: #ffffff;
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            border: 1px solid #e2e8f0;
            box-shadow: var(--card-shadow);
            height: fit-content;
        }
        .threat-panel-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .threat-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .threat-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: var(--radius-md);
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            transition: var(--transition-smooth);
        }
        .threat-item.blocked {
            border-left: 4px solid #ef4444;
            background: linear-gradient(to right, rgba(239, 68, 68, 0.02), transparent);
        }
        .threat-item.suspicious {
            border-left: 4px solid #f59e0b;
            background: linear-gradient(to right, rgba(245, 158, 11, 0.02), transparent);
        }
        .threat-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .threat-ip {
            font-family: monospace;
            font-weight: 700;
            color: #0f172a;
            font-size: 1rem;
        }
        .threat-badge {
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.25rem 0.6rem;
            border-radius: 9999px;
        }
        .threat-badge.danger {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
        .threat-badge.warning {
            background-color: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }
        .threat-details {
            font-size: 0.85rem;
            color: #475569;
            line-height: 1.4;
        }
        .threat-action {
            display: flex;
            justify-content: flex-end;
            margin-top: 0.25rem;
        }
        .btn-resolve-threat {
            background-color: #10b981;
            color: #ffffff;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-sm);
            font-size: 0.825rem;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition-smooth);
            display: flex;
            align-items: center;
            gap: 0.35rem;
        }
        .btn-resolve-threat:hover {
            background-color: #059669;
            transform: translateY(-1px);
        }
        .no-threats-state {
            text-align: center;
            padding: 2.5rem 1.5rem;
            color: #64748b;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
        }

        /* Filter Controls */
        .security-controls {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }
        .security-search-container {
            flex: 1;
            min-width: 250px;
            position: relative;
        }
        .security-search-input {
            width: 100%;
            padding: 0.65rem 1rem 0.65rem 2.5rem;
            border: 1px solid #e2e8f0;
            border-radius: var(--radius-md);
            font-size: 0.9rem;
            outline: none;
            transition: var(--transition-smooth);
        }
        .security-search-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .security-search-icon {
            position: absolute;
            left: 0.875rem;
            top: 50%;
            transform: translateY(-50%);
            width: 1.1rem;
            height: 1.1rem;
            color: #94a3b8;
        }
        .security-filter-select {
            padding: 0.65rem 2rem 0.65rem 1rem;
            border: 1px solid #e2e8f0;
            border-radius: var(--radius-md);
            background-color: #ffffff;
            font-size: 0.9rem;
            outline: none;
            cursor: pointer;
            min-width: 160px;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 1rem;
        }

        /* Log Table */
        .log-table-container {
            background: #ffffff;
            border-radius: var(--radius-lg);
            border: 1px solid #e2e8f0;
            box-shadow: var(--card-shadow);
            overflow: hidden;
        }
        .log-badge {
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.25rem 0.6rem;
            border-radius: 6px;
            display: inline-block;
            text-align: center;
        }
        .log-badge.login { background-color: rgba(16, 185, 129, 0.1); color: #10b981; }
        .log-badge.logout { background-color: rgba(100, 116, 139, 0.1); color: #64748b; }
        .log-badge.config { background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .log-badge.security { background-color: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .log-badge.ppdb { background-color: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
        .log-badge.news { background-color: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .log-badge.teacher { background-color: rgba(236, 72, 153, 0.1); color: #ec4899; }
        .log-badge.other { background-color: rgba(100, 116, 139, 0.1); color: #64748b; }

        .device-tooltip-trigger {
            cursor: help;
            border-bottom: 1px dotted #94a3b8;
            position: relative;
            display: inline-block;
        }
        .device-tooltip-content {
            visibility: hidden;
            background-color: #0f172a;
            color: #fff;
            text-align: left;
            border-radius: 6px;
            padding: 8px 12px;
            position: absolute;
            z-index: 100;
            bottom: 125%;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.2s;
            width: 250px;
            font-size: 0.775rem;
            line-height: 1.4;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            font-weight: normal;
        }
        .device-tooltip-trigger:hover .device-tooltip-content {
            visibility: visible;
            opacity: 1;
        }

        /* Security Threat Banner */
        .security-threat-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px;
            background: linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(254, 226, 226, 0.95) 100%);
            border: 1px solid rgba(239, 68, 68, 0.4);
            border-radius: var(--radius-lg);
            margin-bottom: 24px;
            box-shadow: 0 10px 30px -10px rgba(239, 68, 68, 0.2);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            animation: pulse-border 2s infinite alternate;
        }
        @keyframes pulse-border {
            0% { border-color: rgba(239, 68, 68, 0.3); box-shadow: 0 10px 30px -10px rgba(239, 68, 68, 0.1); }
            100% { border-color: rgba(239, 68, 68, 0.7); box-shadow: 0 10px 30px -5px rgba(239, 68, 68, 0.3); }
        }
        .threat-banner-content {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .threat-icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background-color: rgba(239, 68, 68, 0.15);
            border-radius: var(--radius-md);
            color: #ef4444;
            flex-shrink: 0;
            animation: warning-ping 1.5s infinite;
        }
        @keyframes warning-ping {
            0% { transform: scale(1); }
            50% { transform: scale(1.06); }
            100% { transform: scale(1); }
        }
        .threat-icon {
            width: 24px;
            height: 24px;
        }
        .threat-text {
            color: #1e293b;
        }
        .threat-title {
            font-size: 1rem;
            font-weight: 700;
            margin: 0 0 4px 0;
            color: #991b1b;
        }
        .threat-desc {
            font-size: 0.875rem;
            margin: 0;
            color: #7f1d1d;
            font-weight: 500;
        }
        .btn-threat-action {
            padding: 10px 20px;
            background: #ef4444;
            color: #ffffff;
            border: none;
            border-radius: var(--radius-md);
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: var(--transition-smooth);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            white-space: nowrap;
        }
        .btn-threat-action:hover {
            background: #dc2626;
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(239, 68, 68, 0.5);
        }
        .btn-threat-action:active {
            transform: translateY(0);
        }
      ` }} />
      
      <Sidebar />
      
      <div className="main-wrapper">
        <Header />
        
        <main className="content-body">
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
