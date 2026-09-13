import React from 'react';
import {
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
  Info,
  TrendingUp,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';
import { TARGET_ROLES } from '../../data/mockUniversityData';
import { analyzeSkillGaps } from '../../services/recommendationEngine';

export const SkillGapView: React.FC = () => {
  const { student, setTargetRole, setActiveTab, setSelectedProject } = useUniPath();

  const { targetRole, gaps, highestPriorityGap, overallMatchScore } = analyzeSkillGaps(student);

  // Separate into met vs gap
  const metSkills = gaps.filter((g) => g.gap === 0 || g.currentLevel >= g.recommendedLevel);
  const deficientSkills = gaps.filter((g) => g.gap > 0 && g.currentLevel < g.recommendedLevel);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Target className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">What Am I Missing? (Skill Gap Analysis)</h1>
              <p className="text-xs text-slate-500">
                Direct benchmark comparing your current self-reported proficiencies against target market role standards.
              </p>
            </div>
          </div>
        </div>

        {/* Target Role Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Target Role:</span>
          <select
            aria-label="Select Target Role"
            value={student.targetRoleId}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-indigo-200 bg-indigo-50/70 text-indigo-900 focus:outline-hidden"
          >
            {TARGET_ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Role Profile & Overall Readiness Score */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              {targetRole.category}
            </span>
            <span className="text-xs text-slate-300">
              Est. Starting Compensation: {targetRole.averageStartingSalary}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1.5">{targetRole.title}</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">{targetRole.description}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center shrink-0 min-w-[160px]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
            Role Readiness Match
          </span>
          <span className="text-3xl font-extrabold text-white">{overallMatchScore}%</span>
          <span className="text-[11px] text-slate-300 block mt-1">
            {deficientSkills.length} skill gaps identified
          </span>
        </div>
      </div>

      {/* Highest Priority Gap Alert & Action Plan */}
      {highestPriorityGap && (
        <div className="bg-amber-50/90 rounded-2xl p-6 border border-amber-200 shadow-xs">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Critical Focus Area
                </span>
                <h3 className="text-base font-bold text-amber-950">
                  Your highest-priority gap is {highestPriorityGap.skillName}.
                </h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-200/80 text-amber-900 shrink-0">
              {highestPriorityGap.gap}% Deficit
            </span>
          </div>

          <p className="text-xs text-amber-900 leading-relaxed mb-4 max-w-3xl">
            For competitive candidacy in <strong>{targetRole.title}</strong>, recruiters expect proficiency around{' '}
            <strong>{highestPriorityGap.recommendedLevel}%</strong>. Your current self-assessment stands at{' '}
            <strong>{highestPriorityGap.currentLevel}%</strong>.
          </p>

          <div className="bg-white rounded-xl p-4 border border-amber-200/60">
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider block mb-2.5">
              Recommended Prescriptive Action Steps:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <div>
                  <strong className="text-slate-900 block">Enroll in Recommended Course</strong>
                  <span className="text-slate-600">
                    Take {highestPriorityGap.recommendedCourses[0] || 'CS 420 Deep Learning'} next semester.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <div>
                  <strong className="text-slate-900 block">Build Targeted Portfolio Project</strong>
                  <span className="text-slate-600">
                    Complete "{highestPriorityGap.recommendedProjects[0] || 'Stellar Image Classification'}".
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <div>
                  <strong className="text-slate-900 block">Learn Framework Fundamentals</strong>
                  <span className="text-slate-600">
                    Master custom PyTorch autograd tensors and neural network modules.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  4
                </span>
                <div>
                  <strong className="text-slate-900 block">Pursue Undergraduate Lab Research</strong>
                  <span className="text-slate-600">
                    Join a university AI research group as a student research assistant.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column Breakdown: Met Profile vs Identified Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Met Profile */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Your Current Profile Strengths ({metSkills.length})
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Meets Threshold
            </span>
          </div>

          <div className="space-y-3">
            {metSkills.map((item) => (
              <div key={item.skillName} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {item.skillName}
                  </span>
                  <span className="font-mono text-emerald-700 font-bold">
                    {item.currentLevel}% (Target: {item.recommendedLevel}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${item.currentLevel}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Identified Gaps */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Identified Skill Gaps ({deficientSkills.length})
            </h3>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              Needs Improvement
            </span>
          </div>

          <div className="space-y-3.5">
            {deficientSkills.map((item) => (
              <div key={item.skillName} className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/20 text-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <span className="font-bold text-slate-900 block">{item.skillName}</span>
                    <span className="text-[11px] text-amber-800">
                      Current: {item.currentLevel}% • Recommended: {item.recommendedLevel}% ({item.importance} Priority)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold font-mono text-[11px]">
                    -{item.gap}% Gap
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${item.currentLevel}%` }} />
                </div>

                {item.recommendedCourses.length > 0 && (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-2">
                    <span className="font-semibold text-slate-700">Course:</span>
                    <span>{item.recommendedCourses.join(' or ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
