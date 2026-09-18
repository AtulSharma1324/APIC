import React, { useState } from 'react';
import { Logo } from './Logo';
import { AIChat } from './AIChat';
import { X, Sparkles, ChevronDown } from 'lucide-react';

export const FloatingAIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Floating Action Button (FAB) anchored in Bottom-Right Corner */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end">
        {!isOpen && (
          <div className="group relative flex items-center">
            {/* Tooltip Badge */}
            <div className="mr-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-lg border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ask AI Academic Assistant</span>
            </div>

            {/* Main FAB Trigger Button with Logo & Sunset Concentric Ripple */}
            <button
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-2xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 logo-ripple flex items-center justify-center border-2 border-orange-500 focus:outline-none overflow-hidden p-0"
              aria-label="Open AI Assistant"
            >
              <Logo size="full" showText={false} disableLink={true} className="w-full h-full" />

              {/* Online Indicator Badge */}
              <span className="absolute top-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>

              {/* Floating Pill Tag */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-extrabold uppercase rounded-full shadow-md tracking-wider border border-orange-300/40">
                AI BOT
              </span>
            </button>
          </div>
        )}

        {/* Floating Chat Drawer Window (Bottom Right Corner Popover) */}
        {isOpen && (
          <div className={`w-[360px] sm:w-[420px] max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl border border-orange-200 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            isMinimized ? 'h-16' : 'h-[580px] max-h-[82vh]'
          }`}>
            
            {/* Sunset Header with Logo & Controls */}
            <div className="bg-sunset-header p-3.5 sm:p-4 text-white flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 border border-white/40">
                  <Logo size="sm" showText={false} disableLink={true} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-tight">AI Academic Assistant</h3>
                  <p className="text-[10px] text-orange-100/90 font-medium mt-0.5">Powered by Gemini AI</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-white">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition"
                  title={isMinimized ? "Expand Chat" : "Minimize Chat"}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition"
                  title="Close AI Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body Container */}
            {!isMinimized && (
              <div className="flex-1 overflow-hidden bg-slate-50/40">
                <AIChat showHeader={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
