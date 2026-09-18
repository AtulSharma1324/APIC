import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { FloatingAIChat } from '../components/FloatingAIChat';
import { MobileBottomNav } from '../components/MobileBottomNav';

export const StudentLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative pb-16 md:pb-0">
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />
      
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <footer className="bg-white border-t border-orange-100 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          Academic Program and Credit Information System with AI &copy; {new Date().getFullYear()} Institutional Portal. All rights reserved.
        </div>
      </footer>

      {/* Floating AI Assistant Fixed at Bottom Right Corner */}
      <FloatingAIChat />

      {/* Mobile App Bottom Navigation Bar */}
      <MobileBottomNav onOpenMobileMenu={() => setMobileMenuOpen(true)} />
    </div>
  );
};
