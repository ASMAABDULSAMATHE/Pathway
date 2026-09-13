import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Briefcase,
  MapPin,
  Calendar,
  Building,
  User,
  GraduationCap,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';

export const DashboardView: React.FC = () => {
  const {
    student,
    caseState,
    loadDemoCase,
    setIsCreatePathwayModalOpen,
    setActiveTab,
    setSelectedCourse,
    currentRole,
    courses,
    recommendedNextCourses,
    buildNextSkill,
    curatedOpportunities,
    disciplineExp,
  } = useUniPath();

  // If blank case: show clean intentional empty state
  if (caseState === 'blank') {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
          <User className="w-7 h-7 text-emerald-800" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#11291d] font-serif">
            Welcome to Pathway 👋
          </h1>
          <p className="text-base text-[#526e60] max-w-md mx-auto">
            Here's what matters right now. Create your personalized pathway or explore Maya's demo to get tailored next steps.
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

  const firstName = student.name ? student.name.split(' ')[0] : 'Student';

  // Degree progress calculation
  const completedCredits = (student.completedCourseIds || []).length * 3;
  const totalCredits = student.totalDegreeCredits || 123;
  const percentCompleted = Math.min(100, Math.round((completedCredits / totalCredits) * 100));

  // Determine Next Step Course tailored to active major
  const nextCourse = recommendedNextCourses[0] || courses[0];

  // Determine Opportunity tailored to active major
  const topOpportunity = curatedOpportunities[0];

  // Projects stats
  const activeProjectsCount =
    (student.trackedProjects || []).filter((p) => p.status !== 'completed').length ||
    disciplineExp.trackedProjects.filter((p) => p.status !== 'completed').length;

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e2eae4]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#526e60] mb-1">
            <span>Pathway</span>
            <span>/</span>
            <span className="font-semibold text-emerald-800">Home & Current Focus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#11291d] font-serif">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#526e60] mt-0.5">
            Here is your curated priority agenda for this week at University of Sharjah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#eef7f1] text-[#143825] text-xs font-semibold border border-[#d6ebd9] flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-800" />
            <span>{student.major} • Year {student.yearOfStudy || 1}</span>
          </span>
        </div>
      </div>

      {/* 3 Primary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: NEXT STEP */}
        <div className="bg-white rounded-2xl p-6 border border-[#dce6df] shadow-xs flex flex-col justify-between hover:border-emerald-600 transition-all">
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#eef7f1] text-[#143825] inline-block border border-[#d6ebd9]">
              NEXT DEGREE STEP
            </span>
            <div>
              <p className="text-xs text-[#6b8577]">Complete next:</p>
              <h2 className="text-base sm:text-lg font-bold text-[#11291d] font-serif mt-0.5 line-clamp-2">
                {nextCourse.name}
              </h2>
              <p className="text-xs text-[#526e60] font-medium mt-0.5">
                {nextCourse.code} • {nextCourse.credits} credits • {nextCourse.categoryType}
              </p>
            </div>
            <p className="text-xs text-[#526e60] leading-relaxed pt-1">
              “Core requirement preparing critical competencies for your {currentRole.title} journey.”
            </p>
          </div>

          <button
            onClick={() => setSelectedCourse(nextCourse)}
            className="mt-6 w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Course Details</span>
          </button>
        </div>

        {/* Card 2: BUILD A SKILL */}
        <div className="bg-white rounded-2xl p-6 border border-[#dce6df] shadow-xs flex flex-col justify-between hover:border-emerald-600 transition-all">
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f0f5fc] text-[#1c4d87] inline-block border border-[#d2e3f5]">
              BUILD A SKILL
            </span>
            <div>
              <p className="text-xs text-[#6b8577]">Target competency:</p>
              <h2 className="text-base sm:text-lg font-bold text-[#11291d] font-serif mt-0.5 line-clamp-2">
                {buildNextSkill.name}
              </h2>
              <p className="text-xs text-[#526e60] font-medium mt-0.5">
                Target Role: {currentRole.title}
              </p>
            </div>
            <p className="text-xs text-[#526e60] leading-relaxed pt-1 line-clamp-3">
              {buildNextSkill.description}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('skills')}
            className="mt-6 w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore Skills Matrix</span>
          </button>
        </div>

        {/* Card 3: OPPORTUNITY */}
        <div className="bg-white rounded-2xl p-6 border border-[#dce6df] shadow-xs flex flex-col justify-between hover:border-emerald-600 transition-all">
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#fcf5eb] text-[#804d0c] inline-block border border-[#eddcc4]">
              TOP OPPORTUNITY
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#11291d] font-serif line-clamp-2">
                {topOpportunity.name}
              </h2>
              <div className="text-xs text-[#526e60] space-y-1 mt-2">
                <p className="flex items-center gap-1.5 font-medium text-[#11291d]">
                  <Building className="w-3 h-3 text-[#6b8577] shrink-0" />
                  <span className="truncate">{topOpportunity.organization}</span>
                </p>
                <p className="flex items-center gap-1.5 text-[#6b8577]">
                  <MapPin className="w-3 h-3 text-[#6b8577] shrink-0" />
                  <span className="truncate">{topOpportunity.location}</span>
                </p>
                <p className="flex items-center gap-1.5 text-[#6b8577]">
                  <Calendar className="w-3 h-3 text-[#6b8577] shrink-0" />
                  <span>Deadline: {topOpportunity.deadline}</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-[#526e60] leading-relaxed pt-1 line-clamp-2">
              “{topOpportunity.whyItMatches}”
            </p>
          </div>

          <button
            onClick={() => setActiveTab('opportunities')}
            className="mt-6 w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>View Opportunities</span>
          </button>
        </div>
      </div>

      {/* Your Progress Summary */}
      <div className="bg-white rounded-2xl p-6 border border-[#dce6df] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b8577]">
            Degree & Career Preparation Summary
          </h3>
          <span className="text-xs text-[#526e60]">
            {student.university} • {disciplineExp?.collegeName || 'University of Sharjah'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          {/* Degree Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#11291d]">
              <span>Degree completion</span>
              <span className="text-emerald-800 font-bold">{percentCompleted}%</span>
            </div>
            <div className="w-full bg-[#edf2ee] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-800 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, percentCompleted)}%` }}
              />
            </div>
            <p className="text-[11px] text-[#6b8577]">
              {completedCredits} of {totalCredits} credits earned
            </p>
          </div>

          {/* Projects */}
          <div className="sm:border-l sm:border-[#edf2ee] sm:pl-6 space-y-1">
            <p className="text-xs text-[#6b8577] font-medium">Applied Projects</p>
            <p className="text-xl font-bold text-[#11291d] font-serif">
              {activeProjectsCount} in progress
            </p>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-emerald-800 font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Manage active projects</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Opportunities */}
          <div className="sm:border-l sm:border-[#edf2ee] sm:pl-6 space-y-1">
            <p className="text-xs text-[#6b8577] font-medium">Verified Opportunities</p>
            <p className="text-xl font-bold text-[#11291d] font-serif">
              {curatedOpportunities.length} high matches
            </p>
            <button
              onClick={() => setActiveTab('opportunities')}
              className="text-xs text-emerald-800 font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Browse partner listings</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
