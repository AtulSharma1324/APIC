import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  CreditCard,
  ClipboardList,
  FileText,
  Search,
  Bot,
  UserCircle,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const studentNavItems = [
  { label: 'Dashboard',           path: '/student/dashboard',    icon: LayoutDashboard },
  { label: 'My Curriculum',       path: '/student/curriculum',   icon: GraduationCap },
  { label: 'Subjects',            path: '/programs',             icon: BookOpen },
  { label: 'Credits',             path: '/student/credits',      icon: CreditCard },
  { label: 'CA / Assessment',     path: '/student/assessment',   icon: ClipboardList },
  { label: 'Syllabus',            path: '/student/syllabus',     icon: FileText },
  { label: 'Search',              path: '/search',               icon: Search },
  { label: 'AI Academic Assistant', path: '/student/ai-assistant', icon: Bot, badge: 'AI' },
  { label: 'Profile',             path: '/student/dashboard',    icon: UserCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const content = (
    <aside className="w-72 max-w-[85vw] bg-white text-slate-800 flex flex-col h-full min-h-screen border-r border-orange-100 shadow-2xl overflow-y-auto">

      {/* Profile Card Header */}
      <div className="bg-sunset-header p-6 text-white text-center relative overflow-hidden shadow-md">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full transition lg:hidden z-10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Avatar */}
        <div className="flex justify-center mb-3">
          <div className="relative w-20 h-20 rounded-full border-4 border-white/90 shadow-xl overflow-hidden bg-orange-100 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center text-2xl font-black uppercase">
              {user?.name ? user.name.slice(0, 2) : 'ST'}
            </div>
          </div>
        </div>

        <h2 className="text-base font-black tracking-tight text-white">
          {user?.name || 'Student'}
        </h2>
        <p className="text-xs font-bold text-orange-100 tracking-wider mt-0.5">
          {user?.student_id || '—'}
        </p>
        <p className="text-[11px] font-medium text-white/80 mt-1 leading-snug px-2">
          {user?.program_name
            ? `${user.program_name}${user.specialization_name ? ` (${user.specialization_name})` : ''}`
            : 'Student Portal'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {studentNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path + item.label}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 shadow-sm border border-brand-100'
                    : 'text-slate-600 hover:bg-orange-50 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-[18px] h-[18px] shrink-0 transition-colors group-hover:text-brand-600" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-sunset-header text-white rounded-full shadow-sm">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Divider + Logout */}
      <div className="px-3 pb-5">
        <div className="border-t border-slate-100 mb-3" />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all group"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0 group-hover:text-red-500" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );

  return (
    <>
      {/* Desktop Static Sidebar */}
      <div className="hidden lg:block shrink-0">
        {content}
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
          <div className="relative z-10 w-72 max-w-[85vw] bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
