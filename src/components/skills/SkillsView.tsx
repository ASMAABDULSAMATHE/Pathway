import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';

export const SkillsView: React.FC = () => {
  const {
    student,
    caseState,
    loadDemoCase,
    setIsCreatePathwayModalOpen,
    setActiveTab,
    skillsList,
    buildNextSkill,
    currentRole,
    updateSkillLevel,
    disciplineExp,
  } = useUniPath();

  const [expandedSkillName, setExpandedSkillName] = useState<string | null>(null);

  // Blank case empty state
  if (caseState === 'blank') {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
          <Sparkles className="w-7 h-7 text-emerald-800" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#11291d] font-serif">
            Your Skills Matrix
          </h1>
          <p className="text-base text-[#526e60] max-w-md mx-auto">
            “Your skill profile will appear here once you create your pathway.”
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

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-7">
      {/* Page Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e2eae4]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#526e60] mb-1">
            <span>Pathway</span>
            <span>/</span>
            <span className="font-semibold text-emerald-800">Skills & Target Role Fit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#11291d] font-serif">
            Skills Profile & Competencies
          </h1>
          <p className="text-xs sm:text-sm text-[#526e60] mt-0.5">
            Calibrated for {student.major} candidates targeting {roleTitle} positions in UAE & GCC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#eef7f1] text-[#143825] text-xs font-semibold border border-[#d6ebd9] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-800" />
            <span>Target Role: {roleTitle}</span>
          </span>
        </div>
      </div>

      {/* 1. Build a Skill Feature Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-emerald-700/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded-md bg-[#eef7f1] border border-[#d6ebd9]">
              Strategic Skill Recommendation
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#11291d] font-serif">
              {buildNextSkill.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#526e60]">
              {buildNextSkill.description}
            </p>
          </div>

          <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#edf2ee] text-xs space-y-1 shrink-0">
            <span className="text-[11px] font-bold text-[#6b8577] uppercase tracking-wider">
              Target Competency
            </span>
            <p className="font-bold text-emerald-800">High Demand in UAE</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#edf2ee] space-y-1">
          <span className="text-xs font-bold text-[#143825]">
            Why this skill matters now:
          </span>
          <p className="text-xs text-[#526e60]">
            {buildNextSkill.targetRoleAlignment}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setActiveTab('projects')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Build this via a Project</span>
          </button>
          <button
            onClick={() => setActiveTab('degree')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-[#f4f7f4] text-[#11291d] font-bold text-xs border border-[#ccd9cf] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Find Supporting Courses</span>
          </button>
        </div>
      </div>

      {/* 2. Grouped Skills by Domain */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#11291d] font-serif">
            Current Skill Inventory
          </h2>
          <p className="text-xs sm:text-sm text-[#526e60] mt-0.5">
            Key competencies developed across your coursework, practical labs, and personal projects.
          </p>
        </div>

        {/* Technical Competencies */}
        <div className="bg-white rounded-2xl p-6 border border-[#dce6df] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf2ee]">
            <h3 className="text-base font-bold text-[#11291d] font-serif flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-800" />
              <span>Core Technical & Clinical Competencies</span>
            </h3>
            <span className="text-xs text-[#6b8577]">
              {skillsList.technical.length} Skills
            </span>
          </div>

          <div className="space-y-4">
            {skillsList.technical.map((sk) => {
              const currentLvl = student.skills[sk.name] || sk.level;
              const isExpanded = expandedSkillName === sk.name;

              return (
                <div key={sk.name} className="p-3.5 rounded-xl border border-[#edf2ee] hover:border-[#ccd9cf] transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#11291d]">{sk.name}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#eef7f1] text-[#143825] font-semibold">
                          {sk.evidence}
                        </span>
                      </div>
                      <p className="text-xs text-[#526e60]">{sk.desc}</p>
                    </div>

                    <button
                      onClick={() => setExpandedSkillName(isExpanded ? null : sk.name)}
                      className="text-xs text-[#6b8577] hover:text-[#11291d] p-1.5 rounded-md hover:bg-[#f4f7f4] cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Level Slider Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-[#6b8577]">
                      <span>Proficiency Level</span>
                      <span className="font-bold text-emerald-800">{currentLvl}%</span>
                    </div>
                    <div className="w-full bg-[#edf2ee] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-800 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${currentLvl}%` }}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pt-2 border-t border-[#edf2ee] flex items-center justify-between text-xs text-[#526e60]">
                      <span>Adjust rating:</span>
                      <div className="flex items-center gap-2">
                        {[60, 75, 85, 95].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => updateSkillLevel(sk.name, lvl)}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer ${
                              currentLvl === lvl
                                ? 'bg-emerald-800 text-white'
                                : 'bg-[#f4f7f4] text-[#526e60] hover:bg-[#eef4f0]'
                            }`}
                          >
                            {lvl}%
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Professional & Leadership Competencies */}
        <div className="bg-white rounded-2xl p-6 border border-[#dce6df] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf2ee]">
            <h3 className="text-base font-bold text-[#11291d] font-serif flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
              <span>Professional & Interpersonal Skills</span>
            </h3>
            <span className="text-xs text-[#6b8577]">
              {skillsList.professional.length} Skills
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skillsList.professional.map((sk) => {
              const currentLvl = student.skills[sk.name] || sk.level;
              return (
                <div key={sk.name} className="p-3.5 rounded-xl border border-[#edf2ee] space-y-2 bg-[#fbfdfb]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#11291d]">{sk.name}</span>
                    <span className="text-xs font-bold text-emerald-800">{currentLvl}%</span>
                  </div>
                  <p className="text-[11px] text-[#526e60]">{sk.desc}</p>
                  <div className="w-full bg-[#edf2ee] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-800 h-1.5 rounded-full"
                      style={{ width: `${currentLvl}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Domain & Institutional Knowledge */}
        <div className="bg-white rounded-2xl p-6 border border-[#dce6df] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf2ee]">
            <h3 className="text-base font-bold text-[#11291d] font-serif flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <span>Domain Standards & Regulatory Frameworks</span>
            </h3>
            <span className="text-xs text-[#6b8577]">
              {skillsList.domain.length} Skills
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skillsList.domain.map((sk) => {
              const currentLvl = student.skills[sk.name] || sk.level;
              return (
                <div key={sk.name} className="p-3.5 rounded-xl border border-[#edf2ee] space-y-2 bg-[#fbfdfb]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#11291d]">{sk.name}</span>
                    <span className="text-xs font-bold text-emerald-800">{currentLvl}%</span>
                  </div>
                  <p className="text-[11px] text-[#526e60]">{sk.desc}</p>
                  <div className="w-full bg-[#edf2ee] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-800 h-1.5 rounded-full"
                      style={{ width: `${currentLvl}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
