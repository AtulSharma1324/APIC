import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { AdminSidebar } from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { FloatingAIChat } from '../components/FloatingAIChat';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 relative">
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 mt-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          APIC Administration Console &bull; PostgreSQL & Supabase Powered
        </div>
      </footer>

      {/* Floating AI Assistant Fixed at Bottom Right Corner */}
      <FloatingAIChat />
    </div>
  );
};
