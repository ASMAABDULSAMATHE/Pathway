import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  LogOut,
  User,
  Settings,
  Sparkles,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';

export const Header: React.FC<{ onToggleMobileMenu: () => void }> = ({ onToggleMobileMenu }) => {
  const {
    student,
    caseState,
    isDemoCase,
    exitDemoCase,
    setIsCreatePathwayModalOpen,
    setActiveTab,
  } = useUniPath();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#e2e8e2] px-4 md:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-[#4a6354] hover:text-[#13241b] rounded-lg md:hidden hover:bg-[#eef4f0] cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Persistent Demo Case Label & Exit Demo (As strictly requested) */}
        {isDemoCase ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0f7f2] border border-[#cbe4d2] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
            <span className="font-bold text-[#143825]">Demo Case — Maya Hassan</span>
            <span className="text-[#8fa89b] hidden sm:inline">•</span>
            <button
              onClick={exitDemoCase}
              className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline hover:no-underline ml-1 cursor-pointer flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Exit Demo
            </button>
          </div>
        ) : caseState === 'custom' ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#13241b]">{student.name}</span>
            <span className="text-[#8fa89b]">•</span>
            <span className="text-[#526e60]">{student.major}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#526e60]">
            <span>Pathway</span>
            <span>•</span>
            <span className="italic">No Pathway Yet</span>
          </div>
        )}
      </div>

      {/* Right Side: Profile / Settings under User Avatar */}
      <div className="flex items-center gap-3">
        {caseState === 'blank' && (
          <button
            onClick={() => setIsCreatePathwayModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 text-white hover:bg-emerald-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create My Pathway</span>
          </button>
        )}

        {/* User Avatar Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#f2f6f3] border border-transparent hover:border-[#d6e3d9] transition-all cursor-pointer"
            aria-label="Profile and Settings Menu"
          >
            <div className="w-8 h-8 rounded-full bg-[#122b1e] text-white flex items-center justify-center font-bold text-xs">
              {caseState === 'demo' ? 'MH' : student.name ? student.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#526e60]" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e0e7e1] py-2 z-50 text-xs text-[#11291d] divide-y divide-[#f0f4f1]">
              <div className="px-4 py-2.5">
                <p className="font-bold truncate">
                  {caseState === 'demo' ? 'Maya Hassan' : student.name || 'Anonymous Student'}
                </p>
                <p className="text-[11px] text-[#6b8577] truncate">
                  {caseState === 'demo'
                    ? 'BSc Business Information Systems'
                    : student.major || 'No major selected'}
                </p>
                {student.university && (
                  <p className="text-[10px] text-[#8fa89b] truncate mt-0.5">
                    {student.university}
                  </p>
                )}
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsCreatePathwayModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#f4f7f4] flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                  <span>{caseState === 'custom' ? 'Edit Profile & Goals' : 'Create My Pathway'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setActiveTab('problem-solution');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#f4f7f4] flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Info className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Problem & Solution Rationale</span>
                </button>
              </div>

              {isDemoCase && (
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      exitDemoCase();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Exit Demo Case</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};