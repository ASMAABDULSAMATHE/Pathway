import React from 'react';
import {
  GraduationCap,
  ArrowRight,
  Sparkles,
  User,
  CheckCircle2,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';

export const LandingView: React.FC = () => {
  const { loadDemoCase, setIsCreatePathwayModalOpen, setActiveTab } = useUniPath();

  return (
    <div className="h-full max-h-[calc(100vh-6rem)] flex flex-col justify-between py-2 sm:py-4 px-2 sm:px-4 max-w-4xl mx-auto overflow-hidden">
      {/* Centered Main Hero & Cards */}
      <div className="my-auto flex flex-col items-center text-center space-y-4 sm:space-y-6">
        
        {/* Brand Icon & Heading */}
        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-800 text-white shadow-md ring-4 ring-emerald-100">
            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-100" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#11291d] tracking-tight font-serif">
            Pathway
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-semibold text-emerald-800">
            Your degree. Your skills. Your next step.
          </p>

          <p className="text-xs sm:text-sm text-[#4a6355] leading-relaxed max-w-lg mx-auto">
            Build a personalized academic and career pathway based on your degree, skills, interests, and goals.
          </p>
        </div>

        {/* Two Dominant Action Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl text-left">
          
          {/* Choice 1: Create My Pathway */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-emerald-700 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-800" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Recommended
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#11291d] font-serif">
                  Create My Pathway
                </h2>
                <p className="text-xs sm:text-sm text-[#4a6355] mt-1 leading-normal">
                  Start with your own academic and career information. Quick 3-step setup tailored to any university major.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-medium">Your degree & completed courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-medium">Key skills & areas of interest</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-medium">Target career or exploratory direction</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCreatePathwayModalOpen(true)}
              className="mt-4 sm:mt-5 w-full py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer group-hover:gap-2.5"
            >
              <span>Create My Pathway</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Choice 2: Explore a Demo */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#cadad0] shadow-sm hover:shadow-md hover:border-emerald-600 transition-all flex flex-col justify-between group">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#edf5f0] text-emerald-800 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-800" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                  Sample Case
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#11291d] font-serif">
                  Explore a Demo
                </h2>
                <p className="text-xs sm:text-sm text-[#4a6355] mt-1 leading-normal">
                  See how Pathway works using Maya's example. Fully populated with degree courses, skill gaps, projects, and internships.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#f7faf8] border border-[#e0ece3] text-xs text-[#2d4d3c] space-y-0.5">
                <p className="font-bold text-[#11291d]">Maya Hassan • Year 2</p>
                <p className="text-[11px] text-[#4a6355]">BSc Business Information Systems</p>
                <p className="text-[11px] font-semibold text-emerald-800">Target: Business Analyst</p>
              </div>
            </div>

            <button
              onClick={loadDemoCase}
              className="mt-4 sm:mt-5 w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#f4f7f4] hover:bg-emerald-800 hover:text-white text-emerald-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-[#b8ccbf] hover:border-emerald-800 cursor-pointer group-hover:gap-2.5"
            >
              <span>Explore Maya's Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Static Footer (No overflow) */}
      <div className="pt-2 sm:pt-4 border-t border-[#d8e4dc] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#526e60] shrink-0">
        <span className="font-medium">Pathway Academic & Career System</span>
        <button
          onClick={() => setActiveTab('problem-solution')}
          className="text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1.5 cursor-pointer hover:underline"
        >
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>Why Pathway? Read Problem & Solution</span>
        </button>
      </div>
    </div>
  );
};
