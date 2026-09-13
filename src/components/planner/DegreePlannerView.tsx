import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  User,
  ArrowRight,
  Clock,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';
import { checkPrerequisites } from '../../services/recommendationEngine';
import { Course } from '../../types';

export const DegreePlannerView: React.FC = () => {
  const {
    student,
    caseState,
    setSelectedCourse,
    loadDemoCase,
    setIsCreatePathwayModalOpen,
    courses,
    recommendedNextCourses,
    disciplineExp,
  } = useUniPath();

  const [showAllCourses, setShowAllCourses] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'uncompleted' | 'completed'>('all');

  // Blank case empty state
  if (caseState === 'blank') {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
          <GraduationCap className="w-7 h-7 text-emerald-800" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#11291d] font-serif">
            Your Degree Pathway
          </h1>
          <p className="text-base text-[#526e60] max-w-md mx-auto">
            Your degree progression and course recommendations will appear here once you create your pathway.
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

  // Progress metrics based on student's active discipline courses
  const completedIds = student.completedCourseIds || [];
  const currentIds = student.currentCourseIds || [];
  const completedCount = completedIds.length;
  const completedCredits = completedCount * 3;
  const totalCredits = student.totalDegreeCredits || 123;
  const progressPercent = Math.min(100, Math.round((completedCredits / totalCredits) * 100));

  // Dynamically derive categories from active college courses
  const uniqueCategories = Array.from(new Set(courses.map((c) => c.categoryType)));
  const categories = ['All', ...uniqueCategories];

  const filteredCourses = courses.filter((c) => {
    if (selectedCategory !== 'All' && c.categoryType !== selectedCategory) return false;
    const isDone = completedIds.includes(c.id);
    if (statusFilter === 'completed' && !isDone) return false;
    if (statusFilter === 'uncompleted' && isDone) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-7">
      {/* Page Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e2eae4]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#526e60] mb-1">
            <span>Pathway</span>
            <span>/</span>
            <span className="font-semibold text-emerald-800">Degree & Curriculum Planner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#11291d] font-serif">
            {student.major}
          </h1>
          <p className="text-xs sm:text-sm text-[#526e60] mt-0.5">
            {student.university} • {disciplineExp?.collegeName || 'University of Sharjah'} • Year {student.yearOfStudy || 1}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-[#dce6df] text-xs font-semibold text-[#11291d] shadow-2xs">
            <span className="text-[#6b8577]">Standing: </span>
            <span className="text-emerald-850 font-bold">Good Standing (GPA 3.65)</span>
          </div>
        </div>
      </div>

      {/* 1. Top Card: Degree Name, Year, Progress toward graduation */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#dce6df] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#edf2ee]">
          <div>
            <span className="px-2.5 py-0.5 rounded-md bg-[#eef7f1] text-[#143825] text-xs font-bold border border-[#d6ebd9]">
              Accredited Curriculum Plan
            </span>
            <h2 className="text-xl font-bold text-[#11291d] font-serif mt-2">
              Graduation Progress & Milestone Tracking
            </h2>
            <p className="text-xs text-[#526e60] mt-0.5">
              Verified against University of Sharjah degree completion requirements.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-[#6b8577]">Degree Progress</span>
            <p className="text-2xl font-bold text-emerald-850 font-serif">
              {progressPercent}% Complete
            </p>
          </div>
        </div>

        {/* Graduation Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-[#edf2ee] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-850 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-[#6b8577]">
            <span>{completedCredits} credits earned ({completedCount} courses)</span>
            <span>{Math.max(0, totalCredits - completedCredits)} credits remaining ({totalCredits} total credits)</span>
          </div>
        </div>
      </div>

      {/* 2. Core Question & Recommended Next Courses (Max 3) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#11291d] font-serif">
            What should I study next?
          </h2>
          <p className="text-xs sm:text-sm text-[#526e60] mt-0.5">
            Recommended Next Courses — Hand-picked based on your prerequisites and target {disciplineExp.defaultTargetRole.title} competencies.
          </p>
        </div>

        {/* The 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedNextCourses.map((course) => {
            const prereqCheck = checkPrerequisites(course, completedIds, currentIds);

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl p-5 border border-[#dce6df] shadow-xs flex flex-col justify-between hover:border-emerald-750 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-850 bg-[#eef7f1] px-2 py-0.5 rounded-md border border-[#d6ebd9]">
                      {course.code}
                    </span>
                    <span className="text-xs text-[#6b8577] font-medium">
                      {course.credits} Credits
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#11291d] font-serif leading-snug line-clamp-2">
                      {course.name}
                    </h3>
                    <p className="text-xs text-[#526e60] mt-1 line-clamp-3">
                      {course.description}
                    </p>
                  </div>

                  {/* Prerequisites Status */}
                  <div className="pt-2 border-t border-[#edf2ee]">
                    {prereqCheck.isMet ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1a5e38]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Prerequisites met</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#804d0c]">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Needs: {prereqCheck.missing.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCourse(course)}
                  className="mt-5 w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Course Details</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Progressive Disclosure: View All Courses in Curriculum */}
      <div className="bg-white rounded-2xl border border-[#dce6df] shadow-xs overflow-hidden">
        <button
          onClick={() => setShowAllCourses(!showAllCourses)}
          className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-[#f8faf8] transition-colors cursor-pointer text-left"
        >
          <div>
            <h3 className="text-lg font-bold text-[#11291d] font-serif">
              Full {student.major} Course Catalog ({courses.length} courses)
            </h3>
            <p className="text-xs text-[#526e60] mt-0.5">
              Browse your complete degree plan, filter by requirement category, and check prerequisites.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-[#eef7f1] px-3 py-1.5 rounded-xl border border-[#d6ebd9]">
            <span>{showAllCourses ? 'Collapse Catalog' : 'Explore All Courses'}</span>
            {showAllCourses ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showAllCourses && (
          <div className="p-5 sm:p-6 border-t border-[#edf2ee] space-y-4 bg-[#fbfdfb]">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-white text-[#526e60] hover:bg-[#eef4f0] border border-[#dce6df]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-1 text-xs bg-white border border-[#dce6df] p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2 py-0.5 rounded-lg font-medium ${statusFilter === 'all' ? 'bg-[#eef7f1] text-emerald-900 font-bold' : 'text-[#526e60]'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-2 py-0.5 rounded-lg font-medium ${statusFilter === 'completed' ? 'bg-[#eef7f1] text-emerald-900 font-bold' : 'text-[#526e60]'}`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setStatusFilter('uncompleted')}
                  className={`px-2 py-0.5 rounded-lg font-medium ${statusFilter === 'uncompleted' ? 'bg-[#eef7f1] text-emerald-900 font-bold' : 'text-[#526e60]'}`}
                >
                  Remaining
                </button>
              </div>
            </div>

            {/* Course List Table */}
            <div className="divide-y divide-[#edf2ee] border border-[#dce6df] rounded-xl overflow-hidden bg-white">
              {filteredCourses.map((course) => {
                const isCompleted = completedIds.includes(course.id);
                const isCurrent = currentIds.includes(course.id);
                const prereqCheck = checkPrerequisites(course, completedIds, currentIds);

                return (
                  <div
                    key={course.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f9fbf9] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-emerald-800">
                          {course.code}
                        </span>
                        <span className="text-xs text-[#8fa89b]">•</span>
                        <span className="text-xs text-[#526e60]">
                          {course.categoryType}
                        </span>
                        <span className="text-xs text-[#8fa89b]">•</span>
                        <span className="text-xs text-[#526e60]">
                          {course.credits} Credits
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-[#eef7f1] px-2 py-0.5 rounded-md border border-[#d6ebd9]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                            Completed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            <Clock className="w-3 h-3 text-blue-600" />
                            Current Term
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#11291d]">
                        {course.name}
                      </h4>
                      <p className="text-xs text-[#526e60] line-clamp-1">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {!isCompleted && !isCurrent && (
                        <span className="text-xs text-[#526e60] hidden md:inline">
                          {prereqCheck.isMet ? (
                            <span className="text-emerald-800 font-medium">Eligible</span>
                          ) : (
                            <span className="text-amber-700 font-medium">Prereqs Pending</span>
                          )}
                        </span>
                      )}

                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="px-3 py-1.5 rounded-lg border border-[#ccd9cf] text-xs font-semibold hover:bg-[#f4f7f4] text-[#11291d] transition-colors cursor-pointer"
                      >
                        View Syllabus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
