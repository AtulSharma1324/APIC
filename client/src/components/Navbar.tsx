import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  GraduationCap, 
  Menu, 
  X, 
  Bot, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Mobile Menu Button & Brand */}
          <div className="flex items-center gap-3">
            {onToggleMobileMenu && (
              <button
                onClick={onToggleMobileMenu}
                className="p-2 text-slate-700 hover:text-slate-900 rounded-xl lg:hidden hover:bg-orange-50 transition"
                aria-label="Toggle Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            <Logo size="md" showText={true} />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects, codes (e.g. MCA201), syllabus..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-orange-200/60 rounded-2xl focus:bg-white focus:border-brand-500 focus:outline-none transition-all text-slate-800 placeholder-slate-400 font-medium"
              />
            </form>
          </div>

          {/* Actions & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick AI Assistant Link */}
            <Link
              to="/student/ai-assistant"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-sunset-header rounded-xl hover:opacity-95 transition shadow-sm shadow-orange-500/20"
            >
              <Bot className="w-4 h-4 text-white animate-pulse" />
              <span>Ask AI</span>
            </Link>

            {/* Notifications Popover Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-orange-50 relative transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-sunset-coral rounded-full ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-orange-100 py-3 z-50">
                  <div className="px-4 py-2 border-b border-orange-100 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">Academic Updates</span>
                    <span className="text-[10px] font-bold bg-orange-100 text-brand-700 px-2.5 py-0.5 rounded-full">New</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    <div className="px-4 py-3 text-xs text-slate-600 hover:bg-orange-50/50 cursor-pointer">
                      <p className="font-bold text-slate-800">CA Regulations Configured</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">MCA & BCA continuous assessment rules updated by administrator.</p>
                    </div>
                    <div className="px-4 py-3 text-xs text-slate-600 hover:bg-orange-50/50 cursor-pointer">
                      <p className="font-bold text-slate-800">New Syllabus Uploaded</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">MCA201 Data Structures syllabus v1.1 is now available for download.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-orange-50 transition border border-orange-200/60"
                >
                  <div className="w-8 h-8 rounded-xl bg-sunset-header text-white flex items-center justify-center text-xs font-black uppercase shadow-xs">
                    {user.name ? user.name.slice(0, 2) : 'AS'}
                  </div>
                  <div className="hidden lg:block text-left pr-1">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">{user.name}</span>
                    <span className="text-[10px] font-semibold text-slate-500 block leading-tight capitalize">
                      {isAdmin ? 'System Admin' : (user.student_id || '12525971')}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-orange-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-orange-100">
                      <p className="text-xs font-black text-slate-800">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-200">
                          <ShieldCheck className="w-3 h-3" /> Admin Mode
                        </span>
                      )}
                    </div>
                    <div className="py-1">
                      {isAdmin ? (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-orange-50 font-semibold"
                        >
                          <ShieldCheck className="w-4 h-4 text-brand-600" />
                          Admin Console
                        </Link>
                      ) : (
                        <Link
                          to="/student/dashboard"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-orange-50 font-semibold"
                        >
                          <UserIcon className="w-4 h-4 text-brand-600" />
                          Student Dashboard
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-orange-100 pt-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                          navigate('/login');
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-bold text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-brand-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-black text-white bg-sunset-btn rounded-xl hover:opacity-95 transition shadow-sm shadow-orange-500/20"
                >
                  Register
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
