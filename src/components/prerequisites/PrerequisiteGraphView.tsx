import React, { useState } from 'react';
import {
  GitFork,
  CheckCircle,
  Clock,
  Lock,
  Sparkles,
  Info,
  ArrowDown,
  Layers,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';
import { ALL_COURSES } from '../../data/mockUniversityData';
import { checkPrerequisites, getCourseById } from '../../services/recommendationEngine';
import { Course } from '../../types';

interface TrackStep {
  courseId: string;
  stageName: string;
  notes: string;
}

const AI_VISION_TRACK: TrackStep[] = [
  { courseId: 'cs101', stageName: 'Foundation Programming', notes: 'Procedural algorithmic problem solving' },
  { courseId: 'cs102', stageName: 'Object-Oriented Design', notes: 'C++ memory management & polymorphism' },
  { courseId: 'cs201', stageName: 'Core Algorithms', notes: 'Graph search, trees & asymptotic analysis' },
  { courseId: 'cs320', stageName: 'Machine Learning', notes: 'Statistical loss optimization & gradient descent' },
  { courseId: 'cs420', stageName: 'Deep Learning', notes: 'PyTorch autograd, backpropagation & GPUs' },
  { courseId: 'cs425', stageName: 'Computer Vision', notes: '3D scene geometry & optical perception' },
  { courseId: 'eng480', stageName: 'Space AI Systems', notes: 'Autonomous flight guidance & radiation-tolerant edge ML' },
  { courseId: 'cs499', stageName: 'Senior AI Capstone', notes: 'Supervised peer-reviewed research project' },
];

const SCIENTIFIC_AI_TRACK: TrackStep[] = [
  { courseId: 'math101', stageName: 'Continuous Mathematics', notes: 'Derivatives, integrals & optimization' },
  { courseId: 'math201', stageName: 'Linear Algebra', notes: 'Matrix decompositions & vector spaces' },
  { courseId: 'math305', stageName: 'Numerical Methods', notes: 'ODE solvers & scientific discretization' },
  { courseId: 'cs340', stageName: 'Scientific Simulation', notes: 'Physical simulation modeling & error analysis' },
  { courseId: 'cs440', stageName: 'Parallel & CUDA Computing', notes: 'MPI, OpenMP & distributed supercomputing' },
  { courseId: 'cs445', stageName: 'Scientific ML (PINNs)', notes: 'Physics-informed neural networks' },
];

export const PrerequisiteGraphView: React.FC = () => {
  const { student, setSelectedCourse } = useUniPath();
  const [activeTrack, setActiveTrack] = useState<'ai_vision' | 'sciml' | 'all_dag'>('ai_vision');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cs320');

  const selectedNodeCourse = getCourseById(selectedNodeId);

  // Helper to get status
  const getCourseStatus = (courseId: string): 'completed' | 'current' | 'recommended' | 'locked' => {
    if (student.completedCourseIds.includes(courseId)) return 'completed';
    if (student.currentCourseIds.includes(courseId)) return 'current';
    const course = getCourseById(courseId);
    if (!course) return 'locked';
    const prereqCheck = checkPrerequisites(course, student.completedCourseIds, student.currentCourseIds);
    return prereqCheck.isMet ? 'recommended' : 'locked';
  };

  const trackItems = activeTrack === 'ai_vision' ? AI_VISION_TRACK : SCIENTIFIC_AI_TRACK;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <GitFork className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Interactive Prerequisite Graph</h1>
              <p className="text-xs text-slate-500">
                Visual dependency hierarchy linking foundational math to advanced AI specializations.
              </p>
            </div>
          </div>
        </div>

        {/* Track switch selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTrack('ai_vision')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTrack === 'ai_vision'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI & Space Vision Chain
          </button>
          <button
            onClick={() => setActiveTrack('sciml')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTrack === 'sciml'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scientific AI Chain
          </button>
          <button
            onClick={() => setActiveTrack('all_dag')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTrack === 'all_dag'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Full Academic Matrix
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Node Status Legend:</span>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-200" />
            <span>Currently Enrolled</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-3 h-3 rounded-full bg-indigo-600 ring-2 ring-indigo-200 animate-pulse" />
            <span>Recommended (Prereqs Met)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-3 h-3 rounded-full bg-slate-300 ring-2 ring-slate-100" />
            <span>Locked (Prereqs Pending)</span>
          </div>
        </div>
        <span className="text-[11px] text-slate-400">Click any node to inspect syllabus & ancestors</span>
      </div>

      {/* Main Graph Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Graph Chain Container (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center">
          {activeTrack !== 'all_dag' ? (
            /* Linear Flow Chain */
            <div className="w-full max-w-lg space-y-3 py-4">
              {trackItems.map((step, idx) => {
                const course = getCourseById(step.courseId);
                if (!course) return null;
                const status = getCourseStatus(course.id);
                const isSelected = selectedNodeId === course.id;

                return (
                  <div key={course.id} className="flex flex-col items-center">
                    {/* Node Card */}
                    <div
                      onClick={() => setSelectedNodeId(course.id)}
                      className={`w-full p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected ? 'ring-2 ring-indigo-600 shadow-md' : 'hover:shadow-xs'
                      } ${
                        status === 'completed'
                          ? 'bg-emerald-50/40 border-emerald-300'
                          : status === 'current'
                          ? 'bg-blue-50/40 border-blue-300'
                          : status === 'recommended'
                          ? 'bg-indigo-50/50 border-indigo-300'
                          : 'bg-slate-50/80 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Step {idx + 1}: {step.stageName}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-slate-900">
                            {course.code}: {course.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">{step.notes}</p>
                        </div>

                        {/* Status Icon */}
                        <div className="shrink-0 mt-0.5">
                          {status === 'completed' && (
                            <span className="p-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1 text-[11px] font-semibold px-2">
                              <CheckCircle className="w-3.5 h-3.5" /> Met
                            </span>
                          )}
                          {status === 'current' && (
                            <span className="p-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1 text-[11px] font-semibold px-2">
                              <Clock className="w-3.5 h-3.5" /> Enrolled
                            </span>
                          )}
                          {status === 'recommended' && (
                            <span className="p-1 rounded-full bg-indigo-100 text-indigo-700 flex items-center gap-1 text-[11px] font-semibold px-2">
                              <Sparkles className="w-3.5 h-3.5" /> Ready
                            </span>
                          )}
                          {status === 'locked' && (
                            <span className="p-1 rounded-full bg-slate-200 text-slate-600 flex items-center gap-1 text-[11px] font-semibold px-2">
                              <Lock className="w-3.5 h-3.5" /> Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Arrow to next node */}
                    {idx < trackItems.length - 1 && (
                      <div className="py-2 flex flex-col items-center text-slate-400">
                        <div className="w-0.5 h-3 bg-slate-300" />
                        <ArrowDown className="w-4 h-4 -mt-1 text-slate-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Full Academic Matrix (Bento grid of nodes with prerequisite badges) */
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
              {ALL_COURSES.map((course) => {
                const status = getCourseStatus(course.id);
                const isSelected = selectedNodeId === course.id;

                return (
                  <div
                    key={course.id}
                    onClick={() => setSelectedNodeId(course.id)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-indigo-600 shadow-sm' : 'hover:border-slate-300'
                    } ${
                      status === 'completed'
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : status === 'current'
                        ? 'bg-blue-50/40 border-blue-200'
                        : status === 'recommended'
                        ? 'bg-indigo-50/40 border-indigo-200'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{course.code}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{course.credits} cr</span>
                    </div>
                    <p className="font-semibold text-slate-800 truncate mb-1.5">{course.name.split('(')[0]}</p>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Prereqs: {course.prerequisites.length ? course.prerequisites.length : 'None'}</span>
                      <span
                        className={`font-semibold ${
                          status === 'completed'
                            ? 'text-emerald-700'
                            : status === 'current'
                            ? 'text-blue-700'
                            : status === 'recommended'
                            ? 'text-indigo-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Node Lineage & Detail Card (1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          {selectedNodeCourse ? (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                  Selected Node Inspector
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900">{selectedNodeCourse.code}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {selectedNodeCourse.credits} Credits
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-1">{selectedNodeCourse.name}</p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Course Description
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedNodeCourse.description}</p>
              </div>

              {/* Ancestor Prerequisites */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Immediate Prerequisites ({selectedNodeCourse.prerequisites.length})
                </h4>
                {selectedNodeCourse.prerequisites.length === 0 ? (
                  <p className="text-xs text-emerald-700 font-medium">✓ No prerequisites. Immediate entry level.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedNodeCourse.prerequisites.map((pid) => {
                      const pc = getCourseById(pid);
                      const isMet = student.completedCourseIds.includes(pid) || (pc && student.completedCourseIds.includes(pc.id));
                      return (
                        <div
                          key={pid}
                          className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                        >
                          <span className="font-semibold text-slate-800">{pc ? pc.code : pid}</span>
                          {isMet ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                              <CheckCircle className="w-3 h-3" /> Met
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold flex items-center gap-1 text-[11px]">
                              <Lock className="w-3 h-3" /> Unmet
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dependent Successors */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Unlocks Later Courses
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_COURSES.filter((c) => c.prerequisites.includes(selectedNodeCourse.id)).map((succ) => (
                    <button
                      key={succ.id}
                      onClick={() => setSelectedNodeId(succ.id)}
                      className="px-2 py-1 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100"
                    >
                      {succ.code} →
                    </button>
                  ))}
                  {ALL_COURSES.filter((c) => c.prerequisites.includes(selectedNodeCourse.id)).length === 0 && (
                    <span className="text-xs text-slate-400">Terminal or capstone level</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedCourse(selectedNodeCourse)}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  Inspect Full Syllabus & Plan <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Select a course node on the left to inspect its dependency hierarchy.</p>
          )}
        </div>
      </div>
    </div>
  );
};
