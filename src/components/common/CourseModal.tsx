import React, { useState } from 'react';
import {
  X,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Briefcase,
  Calendar,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { Course } from '../../types';
import { useUniPath } from '../../context/UniPathContext';
import { checkPrerequisites } from '../../services/recommendationEngine';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose }) => {
  const { student, toggleCourseCompletion } = useUniPath();

  // Accordion state for progressive disclosure
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    prereqs: false,
    skills: false,
    semester: false,
    careers: false,
    university: false,
  });

  if (!course) return null;

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isCompleted = (student.completedCourseIds || []).includes(course.id);
  const prereqCheck = checkPrerequisites(
    course,
    student.completedCourseIds || [],
    student.currentCourseIds || []
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f291e]/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#e0e7e1] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Course Name, Code, Credits */}
        <div className="p-6 border-b border-[#edf2ee] bg-[#f8faf8] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-[#eef7f1] text-[#1a5e38] border border-[#d6ebd9]">
                {course.code}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#f4f7f4] text-[#526e60] border border-[#e0e7e1]">
                {course.credits} Credits
              </span>
              {isCompleted && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Completed
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-[#11291d] font-serif">
              {course.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8fa89b] hover:text-[#11291d] rounded-lg hover:bg-[#eef4f0] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Short Description + Collapsible Accordions */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* Short Description */}
          <div>
            <p className="text-sm text-[#385244] leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Progressive Disclosure Sections */}
          <div className="border border-[#e2ece5] rounded-xl overflow-hidden divide-y divide-[#e2ece5]">
            {/* 1. Prerequisites */}
            <div className="bg-white">
              <button
                onClick={() => toggleSection('prereqs')}
                className="w-full px-4 py-3 text-left font-semibold text-xs text-[#11291d] flex items-center justify-between hover:bg-[#f8faf8] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                  <span>Prerequisites</span>
                </div>
                {openSections.prereqs ? (
                  <ChevronDown className="w-4 h-4 text-[#8fa89b]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#8fa89b]" />
                )}
              </button>
              {openSections.prereqs && (
                <div className="px-4 pb-3 pt-1 text-xs text-[#526e60] bg-[#f8faf8] border-t border-[#edf4ef]">
                  {course.prerequisites && course.prerequisites.length > 0 ? (
                    <div className="space-y-1.5">
                      <p className="font-medium text-[#11291d]">
                        Required course prerequisites:
                      </p>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        {course.prerequisites.map((p) => (
                          <li key={p}>
                            {p.toUpperCase()} (
                            {prereqCheck.missing.includes(p)
                              ? 'Missing / Not completed'
                              : 'Satisfied'}
                            )
                          </li>
                        ))}
                      </ul>
                      <p className="text-[11px] font-semibold text-emerald-800 pt-1">
                        Status:{' '}
                        {prereqCheck.isMet
                          ? 'Prerequisites met — You are eligible to enroll.'
                          : 'Prerequisites pending completion.'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-emerald-800 font-medium">
                      ✓ No prerequisites required. Open for direct enrollment.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 2. Skills developed */}
            <div className="bg-white">
              <button
                onClick={() => toggleSection('skills')}
                className="w-full px-4 py-3 text-left font-semibold text-xs text-[#11291d] flex items-center justify-between hover:bg-[#f8faf8] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-800" />
                  <span>Skills developed</span>
                </div>
                {openSections.skills ? (
                  <ChevronDown className="w-4 h-4 text-[#8fa89b]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#8fa89b]" />
                )}
              </button>
              {openSections.skills && (
                <div className="px-4 pb-3 pt-1 bg-[#f8faf8] border-t border-[#edf4ef]">
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {course.skillsDeveloped && course.skillsDeveloped.length > 0 ? (
                      course.skillsDeveloped.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-md bg-white border border-[#d6ebd9] text-[#1a5e38] text-xs font-medium"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#526e60]">
                        Analytical modeling and technical system problem solving.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Recommended semester */}
            <div className="bg-white">
              <button
                onClick={() => toggleSection('semester')}
                className="w-full px-4 py-3 text-left font-semibold text-xs text-[#11291d] flex items-center justify-between hover:bg-[#f8faf8] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-800" />
                  <span>Recommended semester</span>
                </div>
                {openSections.semester ? (
                  <ChevronDown className="w-4 h-4 text-[#8fa89b]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#8fa89b]" />
                )}
              </button>
              {openSections.semester && (
                <div className="px-4 pb-3 pt-1 text-xs text-[#526e60] bg-[#f8faf8] border-t border-[#edf4ef]">
                  <p>
                    Recommended in{' '}
                    <strong className="text-[#11291d]">
                      Semester {course.recommendedSemester || 4}
                    </strong>{' '}
                    (Year {Math.ceil((course.recommendedSemester || 4) / 2)}).
                  </p>
                  <p className="mt-1">
                    Workload balance:{' '}
                    <span className="font-semibold text-[#11291d]">
                      {course.workload === 'High'
                        ? 'Intensive coursework'
                        : course.workload === 'Low'
                        ? 'Light workload'
                        : 'Balanced workload'}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* 4. Related careers */}
            <div className="bg-white">
              <button
                onClick={() => toggleSection('careers')}
                className="w-full px-4 py-3 text-left font-semibold text-xs text-[#11291d] flex items-center justify-between hover:bg-[#f8faf8] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-800" />
                  <span>Related careers</span>
                </div>
                {openSections.careers ? (
                  <ChevronDown className="w-4 h-4 text-[#8fa89b]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#8fa89b]" />
                )}
              </button>
              {openSections.careers && (
                <div className="px-4 pb-3 pt-1 text-xs text-[#526e60] bg-[#f8faf8] border-t border-[#edf4ef]">
                  <p className="mb-1.5 text-[#11291d] font-medium">
                    Prepares students for these professional industry paths:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {course.specializations && course.specializations.length > 0 ? (
                      course.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200"
                        >
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                        Business Analyst • Data Specialist
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Official university information */}
            <div className="bg-white">
              <button
                onClick={() => toggleSection('university')}
                className="w-full px-4 py-3 text-left font-semibold text-xs text-[#11291d] flex items-center justify-between hover:bg-[#f8faf8] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-emerald-800" />
                  <span>Official university information</span>
                </div>
                {openSections.university ? (
                  <ChevronDown className="w-4 h-4 text-[#8fa89b]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#8fa89b]" />
                )}
              </button>
              {openSections.university && (
                <div className="px-4 pb-3 pt-1 text-xs text-[#526e60] bg-[#f8faf8] border-t border-[#edf4ef] space-y-1.5">
                  <p>
                    <strong className="text-[#11291d]">Institution:</strong> University of Sharjah (UOS)
                  </p>
                  <p>
                    <strong className="text-[#11291d]">Academic Catalog:</strong> Department of Management Information Systems / Computer Science
                  </p>
                  <p>
                    <strong className="text-[#11291d]">Classification:</strong> {course.categoryType || 'Major Core Requirement'}
                  </p>
                  <a
                    href="https://www.sharjah.ac.ae/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-800 font-semibold hover:underline pt-1"
                  >
                    <span>View University of Sharjah official bulletin</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#edf2ee] bg-[#f8faf8] flex items-center justify-between">
          <button
            onClick={() => toggleCourseCompletion(course.id)}
            className="text-xs font-semibold text-[#3a5746] hover:text-[#11291d] cursor-pointer"
          >
            {isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white hover:bg-emerald-700 text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
