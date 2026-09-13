import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  ChevronRight,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';
import { ALL_COURSES } from '../../data/mockUniversityData';
import {
  generateCourseRecommendations,
  checkPrerequisites,
  getCourseById,
} from '../../services/recommendationEngine';

export const CoursesView: React.FC = () => {
  const {
    student,
    setSelectedCourse,
    addCourseToSemester,
    searchQuery,
    setSearchQuery,
    currentRole,
  } = useUniPath();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Eligible' | 'Completed' | 'Locked'>('All');
  const [selectedWorkload, setSelectedWorkload] = useState<string>('All');

  const recommendations = generateCourseRecommendations(student);
  const recMap = new Map(recommendations.map((r) => [r.course.id, r]));

  // Departments list
  const departments = ['All', 'Computer Science', 'Mathematics', 'Physics & Astronomy', 'Aerospace & Systems'];

  const filteredCourses = ALL_COURSES.filter((course) => {
    // Search query
    if (searchQuery) {
      const matchCode = course.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchName = course.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSkill = course.skillsDeveloped.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchCode && !matchName && !matchSkill) return false;
    }

    // Dept
    if (selectedDept !== 'All' && course.department !== selectedDept) return false;

    // Workload
    if (selectedWorkload !== 'All' && course.workload !== selectedWorkload) return false;

    // Status filter
    const isCompleted = student.completedCourseIds.includes(course.id);
    const isEnrolled = student.currentCourseIds.includes(course.id);
    const prereq = checkPrerequisites(course, student.completedCourseIds, student.currentCourseIds);

    if (selectedStatus === 'Completed' && !isCompleted) return false;
    if (selectedStatus === 'Eligible' && (!prereq.isMet || isCompleted || isEnrolled)) return false;
    if (selectedStatus === 'Locked' && (prereq.isMet || isCompleted || isEnrolled)) return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">What Should I Take Next?</h1>
              <p className="text-xs text-slate-500">
                Transparent constraint-based matching calibrated for <span className="font-semibold text-slate-700">{currentRole.title}</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
            ★ Highest Match: 96%
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
            {recommendations.filter((r) => r.isPrereqMet).length} Immediately Eligible
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                Dept: {d}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="All">Status: All Courses</option>
            <option value="Eligible">Status: Eligible Now (Prereqs Met)</option>
            <option value="Completed">Status: Completed</option>
            <option value="Locked">Status: Locked (Missing Prereqs)</option>
          </select>

          {/* Workload Filter */}
          <select
            value={selectedWorkload}
            onChange={(e) => setSelectedWorkload(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="All">Workload: All</option>
            <option value="Low">Workload: Low</option>
            <option value="Medium">Workload: Medium</option>
            <option value="High">Workload: High</option>
          </select>
        </div>

        <span className="text-slate-400 text-xs">
          Showing {filteredCourses.length} of {ALL_COURSES.length} courses
        </span>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((course) => {
          const isCompleted = student.completedCourseIds.includes(course.id);
          const isCurrent = student.currentCourseIds.includes(course.id);
          const rec = recMap.get(course.id);
          const prereqCheck = checkPrerequisites(course, student.completedCourseIds, student.currentCourseIds);

          return (
            <div
              key={course.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between hover:shadow-md ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/10'
                  : isCurrent
                  ? 'border-blue-200 bg-blue-50/10'
                  : prereqCheck.isMet
                  ? 'border-slate-200 hover:border-indigo-300'
                  : 'border-slate-200/60 opacity-80'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-xs px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {course.code}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {course.credits} Credits
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                          course.workload === 'High'
                            ? 'bg-rose-50 text-rose-700'
                            : course.workload === 'Medium'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {course.workload} Workload
                      </span>

                      {isCompleted && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Completed
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> In Progress
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => setSelectedCourse(course)}
                      className="text-sm font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                      {course.name}
                    </h3>
                  </div>

                  {rec && !isCompleted && !isCurrent && (
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                      ★ {rec.matchScore}% Match
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {course.description}
                </p>

                {/* Prerequisites breakdown */}
                <div className="text-xs mb-3">
                  <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                    Prerequisites:
                  </span>
                  {course.prerequisites.length === 0 ? (
                    <span className="text-emerald-700 text-xs font-medium">✓ None (Direct enrollment)</span>
                  ) : prereqCheck.isMet ? (
                    <div className="text-emerald-700 text-xs flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{prereqCheck.metList.slice(0, 2).join(', ')} (Satisfied)</span>
                    </div>
                  ) : (
                    <div className="text-rose-600 text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Missing: {prereqCheck.missing.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Why recommended if available */}
                {rec && rec.reasons.length > 0 && !isCompleted && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 mb-3">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                      Recommendation Drivers:
                    </span>
                    {rec.reasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-slate-700">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {course.skillsDeveloped.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                >
                  Syllabus Details <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {!isCompleted && !isCurrent && (
                    <button
                      onClick={() => {
                        const targetSem = student.plannedSemesters[0];
                        if (targetSem) {
                          addCourseToSemester(targetSem.id, course.id);
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add to Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
