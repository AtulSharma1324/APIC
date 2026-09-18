import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, ClipboardList, Search, Menu } from 'lucide-react';
import { Logo } from './Logo';

interface MobileBottomNavProps {
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMobileMenu }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-orange-100 shadow-2xl px-2 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">

        {/* Dashboard */}
        <NavLink
          to="/student/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all px-2 ${
              isActive ? 'text-brand-600 scale-105' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        {/* My Curriculum */}
        <NavLink
          to="/student/curriculum"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all px-2 ${
              isActive ? 'text-brand-600 scale-105' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <GraduationCap className="w-5 h-5" />
          <span>Curriculum</span>
        </NavLink>

        {/* AI Assistant Center Button */}
        <NavLink
          to="/student/ai-assistant"
          className={({ isActive }) =>
            `flex flex-col items-center -mt-5 transition-transform ${
              isActive ? 'scale-110' : 'hover:scale-105'
            }`
          }
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-lg shadow-orange-500/30 border-2 border-orange-500 flex items-center justify-center overflow-hidden p-0">
            <Logo size="full" showText={false} disableLink={true} className="w-full h-full" />
          </div>
          <span className="text-[9px] font-extrabold text-brand-600 uppercase mt-0.5 tracking-tight">AI</span>
        </NavLink>

        {/* CA / Assessment */}
        <NavLink
          to="/student/assessment"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all px-2 ${
              isActive ? 'text-brand-600 scale-105' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <ClipboardList className="w-5 h-5" />
          <span>CA Rules</span>
        </NavLink>

        {/* Menu (opens sidebar drawer) */}
        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 transition px-2"
        >
          <Menu className="w-5 h-5" />
          <span>Menu</span>
        </button>

      </div>
    </div>
  );
};
