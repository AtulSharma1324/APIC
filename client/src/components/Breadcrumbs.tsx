import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  customItems?: { label: string; path?: string }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems }) => {
  const location = useLocation();

  if (customItems) {
    return (
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 py-1 overflow-x-auto">
        <Link to="/" className="flex items-center gap-1 hover:text-brand-600 transition">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        {customItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {item.path ? (
              <Link to={item.path} className="hover:text-brand-600 transition font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-800 font-semibold">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 py-1 overflow-x-auto">
      <Link to="/" className="flex items-center gap-1 hover:text-brand-600 transition">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="text-slate-800 font-semibold">{formattedName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-brand-600 transition font-medium">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
