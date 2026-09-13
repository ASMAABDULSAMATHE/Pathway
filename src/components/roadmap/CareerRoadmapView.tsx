import React from 'react';
import {
  GitFork,
  ArrowDown,
  BookOpen,
  Sparkles,
  Layers,
  Briefcase,
  Target,
  ArrowRight,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';

export const CareerRoadmapView: React.FC = () => {
  const {
    student,
    caseState,
    loadDemoCase,
    setIsCreatePathwayModalOpen,
    setActiveTab,
    currentRole,
    careerRoadmap,
    disciplineExp,
  } = useUniPath();

  // Blank case empty state
  if (caseState === 'blank') {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
          <GitFork className="w-7 h-7 text-emerald-800" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#11291d] font-serif">
            Your Career Roadmap
          </h1>
          <p className="text-base text-[#526e60] max-w-md mx-auto">
            “Your visual degree-to-career sequence will appear here once you create your pathway.”
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setIsCreatePathwayModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Create My Pathway</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={loadDemoCase}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-[#f4f7f4] text-[#11291d] font-bold text-sm border border-[#ccd9cf] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Explore Maya's Demo</span>
          </button>
        </div>
      </div>
    );
  }

  const roleTitle = currentRole.title || disciplineExp.defaultTargetRole.title;

  const getStepIcon = (tabTarget?: string) => {
    switch (tabTarget) {
      case 'degree':
        return BookOpen;
      case 'skills':
        return Sparkles;
      case 'projects':
        return Layers;
      case 'opportunities':
      default:
        return Briefcase;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-7">
      {/* Page Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e2eae4]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#526e60] mb-1">
            <span>Pathway</span>
            <span>/</span>
            <span className="font-semibold text-emerald-800">Career Roadmap & Milestones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#11291d] font-serif">
            Degree-to-Career Sequence
          </h1>
          <p className="text-xs sm:text-sm text-[#526e60] mt-0.5">
            How coursework, skill acquisition, projects, and internships link sequentially to {roleTitle}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#eef7f1] text-[#143825] text-xs font-semibold border border-[#d6ebd9] flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-800" />
            <span>Target: {roleTitle}</span>
          </span>
        </div>
      </div>

      {/* Target Role Overview Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#dce6df] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded-md bg-[#eef7f1] border border-[#d6ebd9]">
            Ultimate Career Target
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#11291d] font-serif">
            {roleTitle}
          </h2>
          <p className="text-xs text-[#526e60] max-w-xl">
            {currentRole.description ||
              `A strategic career trajectory connecting your ${student.major} studies at University of Sharjah to prominent industry employers in the UAE and GCC.`}
          </p>
        </div>

        <div className="p-3.5 bg-[#f8faf8] rounded-xl border border-[#edf2ee] space-y-1 shrink-0 text-xs">
          <p className="text-[11px] text-[#6b8577] font-semibold uppercase tracking-wider">
            Average Starting Compensation
          </p>
          <p className="font-bold text-emerald-800">
            {currentRole.averageStartingSalary || 'AED 18,000 - 24,000 / month'}
          </p>
        </div>
      </div>

      {/* Sequential 4-Step Flow */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-[#11291d] font-serif">
            Step-by-Step Strategic Roadmap
          </h2>
          <p className="text-xs text-[#526e60]">
            From active semester to licensed graduate placement.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#ccd9cf]">
          {careerRoadmap.map((step, index) => {
            const StepIcon = getStepIcon(step.tabTarget);

            return (
              <div key={step.stepLabel} className="relative space-y-2">
                {/* Node Bullet Marker */}
                <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-emerald-800 flex items-center justify-center text-[11px] font-bold text-emerald-800 shadow-xs">
                  {index + 1}
                </div>

                {/* Step Card */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#dce6df] shadow-xs space-y-3 hover:border-emerald-600 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${step.badgeColor}`}
                      >
                        {step.stepLabel}
                      </span>
                      <h3 className="text-base font-bold text-[#11291d] font-serif">
                        {step.title}
                      </h3>
                    </div>

                    {step.tabTarget && (
                      <button
                        onClick={() => setActiveTab(step.tabTarget!)}
                        className="text-xs text-emerald-800 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{step.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#526e60] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
