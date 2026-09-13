import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Layers,
  Briefcase,
  GitFork,
  HelpCircle,
  LogOut,
  User,
  PlusCircle,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

// Exactly the required 7 navigation items
const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'degree', label: 'Degree', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'projects', label: 'Projects', icon: Layers },
  { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  { id: 'roadmap', label: 'Roadmap', icon: GitFork },
  { id: 'problem-solution', label: 'Problem & Solution', icon: HelpCircle },
];

export const Sidebar: React.FC<{ isOpenMobile: boolean; setIsOpenMobile: (open: boolean) => void }> = ({
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const {
    activeTab,
    setActiveTab,
    student,
    caseState,
    isDemoCase,
    exitDemoCase,
    setIsCreatePathwayModalOpen,
  } = useUniPath();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-[#0f291e]/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-60 bg-[#122b1e] text-[#d6e5dc] flex flex-col border-r border-[#1e4431] transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1b3d2b]">
          <button
            onClick={() => {
              if (caseState === 'blank') {
                setActiveTab('landing');
              } else {
                setActiveTab('dashboard');
              }
              setIsOpenMobile(false);
            }}
            className="flex flex-col items-start text-left group cursor-pointer w-full"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-xs border border-emerald-600/40 group-hover:bg-emerald-700 transition-colors shrink-0">
                <GraduationCap className="w-4 h-4 text-emerald-100" />
              </div>
              <span className="font-bold text-white text-base tracking-tight font-serif">
                Pathway
              </span>
            </div>
            <p className="text-[9px] text-[#8fa89b] font-medium leading-tight tracking-tight mt-1.5 whitespace-nowrap overflow-hidden text-ellipsis w-full">
              Your degree. Your skills. Your next step.
            </p>
          </button>
        </div>

        {/* Case / Student Status Indicator */}
        {isDemoCase ? (
          <div className="px-4 py-3 bg-[#0d2217] border-b border-[#1b3d2b]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Demo Case
              </span>
              <button
                onClick={exitDemoCase}
                className="text-[10px] font-semibold text-[#a3beae] hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
                title="Exit demo and start fresh"
              >
                <LogOut className="w-3 h-3" />
                Exit Demo
              </button>
            </div>
            <p className="text-xs font-bold text-white truncate">Maya Hassan</p>
            <p className="text-[11px] text-[#8fa89b] truncate">BSc Business Info Systems (Yr 2)</p>
          </div>
        ) : caseState === 'custom' ? (
          <div className="px-4 py-3 bg-[#0d2217] border-b border-[#1b3d2b]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                My Pathway
              </span>
              <span className="text-[10px] font-semibold text-emerald-200 bg-emerald-950 px-1.5 py-0.2 rounded-sm border border-emerald-800">
                Year {student.yearOfStudy}
              </span>
            </div>
            <p className="text-xs font-bold text-white truncate">{student.name}</p>
            <p className="text-[11px] text-[#8fa89b] truncate">{student.major}</p>
          </div>
        ) : (
          <div className="px-4 py-3 bg-[#0d2217]/60 border-b border-[#1b3d2b]">
            <p className="text-[11px] text-[#8fa89b] mb-2">No active pathway loaded.</p>
            <button
              onClick={() => setIsCreatePathwayModalOpen(true)}
              className="w-full py-1.5 px-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create My Pathway</span>
            </button>
          </div>
        )}

        {/* Simplified Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpenMobile(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs border border-emerald-600/30'
                    : 'text-[#9cb5a7] hover:text-white hover:bg-[#1a3d2c]/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#82a091]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="px-1.5 py-2 border-t border-[#1b3d2b] bg-[#0d2217]/40 text-center overflow-hidden">
          <p className="text-[10px] font-semibold leading-tight tracking-tight text-[#a8c4b4] whitespace-nowrap overflow-hidden text-ellipsis">
            Degree · Skills · Projects · Opps · Roadmap
          </p>
        </div>
      </aside>
    </>
  );
};