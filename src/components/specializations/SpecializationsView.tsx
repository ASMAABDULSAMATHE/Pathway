import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Briefcase,
  Layers,
  Search,
  ChevronRight,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';
import { SPECIALIZATION_PATHS } from '../../data/mockUniversityData';
import { SpecializationPath } from '../../types';

export const SpecializationsView: React.FC = () => {
  const { student, setActiveTab, setSelectedProject } = useUniPath();
  const [selectedPathId, setSelectedPathId] = useState<string>(SPECIALIZATION_PATHS[0].id);

  const selectedPath = SPECIALIZATION_PATHS.find((p) => p.id === selectedPathId) || SPECIALIZATION_PATHS[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Explore Your Academic Paths</h1>
              <p className="text-xs text-slate-500">
                AI-synthesized specialization pathways bridging coursework, research labs, and frontier industry roles.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            Top Recommendation: AI & Computer Vision (94% Fit)
          </span>
        </div>
      </div>

      {/* Path Cards Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {SPECIALIZATION_PATHS.map((path) => {
          const isSelected = selectedPathId === path.id;
          return (
            <div
              key={path.id}
              onClick={() => setSelectedPathId(path.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {path.category}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      path.matchScore >= 90
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {path.matchScore}% Match
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{path.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{path.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>Inspect Curriculum</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Path Deep Dive */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900">{selectedPath.title}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Best Suited For You: {selectedPath.matchScore}%
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">{selectedPath.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('planner')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Align My Degree Plan
            </button>
          </div>
        </div>

        {/* Why Suited Breakdown */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Why This Specialization Fits Your Profile
          </h4>
          <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
            {selectedPath.matchReasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pathway Flowchart Diagram */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" /> Curricular Course Sequence
          </h4>
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1">
            {selectedPath.pathwaySequence.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="shrink-0 p-3 rounded-xl bg-white border border-indigo-200 shadow-xs min-w-[140px] text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Stage {idx + 1}</span>
                  <span className="text-xs font-bold text-slate-800 line-clamp-2">{step}</span>
                </div>
                {idx < selectedPath.pathwaySequence.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 4-Panel Grid: Required Courses, Skills, Projects, Career Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Required & Electives */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 block mb-1">
                Required Core Courses
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPath.requiredCourses.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-semibold text-slate-800">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 block mb-1">
                Recommended Electives
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPath.recommendedElectives.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 font-medium text-indigo-800">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Core Skills Developed */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 block mb-1">
              Required Mastery Skills
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedPath.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium flex items-center gap-1 text-xs"
                >
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Potential Projects */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 block mb-1">
              Capstone & Portfolio Projects
            </span>
            <ul className="space-y-1.5 text-slate-700">
              {selectedPath.potentialProjects.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Career & Research Outcomes */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 block mb-1">
              Target Roles & Research Groups
            </span>
            <div className="space-y-1 text-slate-700">
              <p>
                <strong className="text-slate-900">Industry Roles:</strong> {selectedPath.careerRoles.join(', ')}
              </p>
              <p>
                <strong className="text-slate-900">Research Focus:</strong> {selectedPath.researchAreas.join(', ')}
              </p>
              <p>
                <strong className="text-slate-900">Target Fellowships:</strong> {selectedPath.internshipOpportunities.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
