
import React from 'react';
import { LOGO_URL } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  onAdminClick?: () => void;
  showAdminLink?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, onAdminClick, showAdminLink = true }) => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-stone-50 transition-all duration-300 relative">
      <header className="bg-emerald-900 text-white p-3 md:p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4 overflow-hidden">
          {onBack && (
            <button onClick={onBack} className="p-1.5 hover:bg-emerald-800 rounded-full transition flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={LOGO_URL} alt="MSU Logo" className="h-8 w-8 md:h-10 md:w-10 object-contain bg-white rounded-md p-1 flex-shrink-0" />
            <h1 className="font-bold text-base md:text-xl leading-tight truncate">{title || "MSU Farmer Portal"}</h1>
          </div>
        </div>
        <div className="hidden md:block text-[10px] font-medium opacity-80 uppercase tracking-widest">
          Research Division
        </div>
      </header>
      
      <main className="flex-1 w-full px-3 py-4 md:p-8 overflow-x-hidden">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
      
      <footer className="bg-stone-200 p-3 md:p-4 text-center text-[10px] text-stone-500 border-t border-stone-300 mt-auto">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-80 font-medium">
            <span>&copy; {new Date().getFullYear()} MSU</span>
            <span>|</span>
            <span>Faculty of Agriculture</span>
          </div>
          
          {showAdminLink && onAdminClick && (
            <button 
              onClick={onAdminClick}
              className="text-stone-400 hover:text-emerald-700 transition-colors uppercase tracking-widest font-bold py-1 px-2 text-[9px]"
            >
              Admin Access
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
