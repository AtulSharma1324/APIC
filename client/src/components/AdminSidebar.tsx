import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  GitBranch,
  CalendarDays,
  BookOpen,
  CreditCard,
  ClipboardList,
  FileText,
  BrainCircuit,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const adminNavItems = [
  { label: 'Dashboard',       path: '/admin/dashboard',        icon: LayoutDashboard },
  { label: 'Programs',        path: '/admin/programs',         icon: Layers },
  { label: 'Specializations', path: '/admin/specializations',  icon: GitBranch },
  { label: 'Semesters',       path: '/admin/semesters',        icon: CalendarDays },
  { label: 'Subjects',        path: '/admin/subjects',         icon: BookOpen },
  { label: 'Credits',         path: '/admin/credits',          icon: CreditCard },
  { label: 'CA Rules',        path: '/admin/ca-rules',         icon: ClipboardList },
  { label: 'Syllabus',        path: '/admin/syllabus',         icon: FileText },
  { label: 'AI Knowledge',    path: '/admin/ai-knowledge',     icon: BrainCircuit, badge: 'AI' },
  { label: 'Users',           path: '/admin/users',            icon: Users },
  { label: 'Settings',        path: '/admin/settings',         icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    if (onClose) onClose();
  };

  const content = (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-full min-h-screen border-r border-slate-800">

      {/* Admin Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">Admin Panel</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-amber-400/20 text-amber-300 rounded-md border border-amber-400/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Divider + Logout */}
      <div className="px-3 pb-5">
        <div className="border-t border-slate-800 mb-3" />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all group"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:text-red-400" />
          <span>Logout</span>
        </button>
        <p className="text-[10px] text-slate-600 text-center mt-3 font-medium">
          APIC Admin Console v1.0
        </p>
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
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
          <div className="relative z-10 w-64 max-w-xs bg-slate-950 shadow-2xl animate-in slide-in-from-left duration-300">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
