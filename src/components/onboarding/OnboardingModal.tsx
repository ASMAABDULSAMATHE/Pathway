import React, { useState } from 'react';
import { X, Check, Sparkles, Compass, Target, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';
import { ALL_COURSES, TARGET_ROLES, DEMO_STUDENT } from '../../data/mockUniversityData';

const AVAILABLE_INTERESTS = [
  'Technology',
  'Business',
  'Data',
  'Systems Analysis',
  'Process Improvement',
  'Enterprise Software (ERP)',
  'FinTech & Banking',
  'Artificial Intelligence',
  'Digital Transformation',
  'Project Management',
];

const AVAILABLE_CAREER_GOALS = [
  'Business Analyst',
  'Business Intelligence Analyst',
  'Enterprise Systems & ERP Consultant',
  'Digital Product Manager',
  'Technology Consultant',
  'Management & Strategy',
];

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, student, updateStudent, addToast, resetToDemoStudent } = useUniPath();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: student.name,
    university: student.university,
    degree: student.degree,
    major: student.major,
    yearOfStudy: student.yearOfStudy,
    currentSemester: student.currentSemester,
    gpa: student.gpa,
    completedCourseIds: [...student.completedCourseIds],
    currentCourseIds: [...student.currentCourseIds],
    interests: [...student.interests],
    careerGoals: [...student.careerGoals],
    targetRoleId: student.targetRoleId,
  });

  if (!isOnboardingOpen) return null;

  const toggleCourse = (courseId: string, type: 'completed' | 'current') => {
    if (type === 'completed') {
      const isSelected = formData.completedCourseIds.includes(courseId);
      const newCompleted = isSelected
        ? formData.completedCourseIds.filter((id) => id !== courseId)
        : [...formData.completedCourseIds, courseId];

      setFormData((prev) => ({
        ...prev,
        completedCourseIds: newCompleted,
        currentCourseIds: prev.currentCourseIds.filter((id) => id !== courseId),
      }));
    } else {
      const isSelected = formData.currentCourseIds.includes(courseId);
      const newCurrent = isSelected
        ? formData.currentCourseIds.filter((id) => id !== courseId)
        : [...formData.currentCourseIds, courseId];

      setFormData((prev) => ({
        ...prev,
        currentCourseIds: newCurrent,
        completedCourseIds: prev.completedCourseIds.filter((id) => id !== courseId),
      }));
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((i) => i !== interest) : [...prev.interests, interest],
      };
    });
  };

  const toggleCareerGoal = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.careerGoals.includes(goal);
      return {
        ...prev,
        careerGoals: exists ? prev.careerGoals.filter((g) => g !== goal) : [...prev.careerGoals, goal],
      };
    });
  };

  const handleFinish = () => {
    updateStudent({
      name: formData.name || 'Maya Hassan',
      university: formData.university || 'University of Sharjah',
      degree: formData.degree || 'Bachelor of Science (BSc)',
      major: formData.major || 'BSc Business Information Systems',
      yearOfStudy: Number(formData.yearOfStudy) || 2,
      currentSemester: formData.currentSemester || 'Year 2, Semester 4 (Spring 2026)',
      gpa: Number(formData.gpa) || 3.5,
      completedCourseIds: formData.completedCourseIds,
      currentCourseIds: formData.currentCourseIds,
      interests: formData.interests,
      careerGoals: formData.careerGoals,
      targetRoleId: formData.targetRoleId,
      isOnboarded: true,
    });

    addToast('Profile calibrated successfully. Pathway is updated.', 'success');
    setIsOnboardingOpen(false);
  };

  const handleLoadDemo = () => {
    resetToDemoStudent();
    setFormData({
      name: DEMO_STUDENT.name,
      university: DEMO_STUDENT.university,
      degree: DEMO_STUDENT.degree,
      major: DEMO_STUDENT.major,
      yearOfStudy: DEMO_STUDENT.yearOfStudy,
      currentSemester: DEMO_STUDENT.currentSemester,
      gpa: DEMO_STUDENT.gpa,
      completedCourseIds: [...DEMO_STUDENT.completedCourseIds],
      currentCourseIds: [...DEMO_STUDENT.currentCourseIds],
      interests: [...DEMO_STUDENT.interests],
      careerGoals: [...DEMO_STUDENT.careerGoals],
      targetRoleId: DEMO_STUDENT.targetRoleId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f291e]/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#e0e7e1] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-[#edf2ee] bg-[#f8faf8] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-md bg-emerald-800 text-white flex items-center justify-center text-xs font-bold font-serif">
                P
              </span>
              <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
                Pathway Student Profile
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#11291d] font-serif">
              {step === 1 && '1. Academic Information & Courses'}
              {step === 2 && '2. Academic & Functional Interests'}
              {step === 3 && '3. Career Objective & Target Role'}
              {step === 4 && '4. Review & Calibrate Plan'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadDemo}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#eef7f1] text-[#1a5e38] hover:bg-[#e2f2e7] transition-colors flex items-center gap-1.5 cursor-pointer border border-[#d6ebd9]"
              title="Reset to Maya Hassan (BSc Business Information Systems, Year 2, GPA 3.5)"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Maya Hassan Profile
            </button>
            <button
              onClick={() => setIsOnboardingOpen(false)}
              className="p-2 text-[#8fa89b] hover:text-[#11291d] rounded-lg hover:bg-[#eef4f0] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#edf2ee] h-1.5">
          <div
            className="bg-emerald-800 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step Contents */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-1.5">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#ccd9cf] focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d]"
                    placeholder="e.g. Maya Hassan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-1.5">
                    University
                  </label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#ccd9cf] focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-1.5">
                    Degree & Major (Any Major Supported)
                  </label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#ccd9cf] focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d]"
                    placeholder="e.g. BSc Business Information Systems"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-1.5">
                    Year of Study
                  </label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#ccd9cf] focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d]"
                  >
                    <option value={1}>Year 1 (Freshman)</option>
                    <option value={2}>Year 2 (Sophomore)</option>
                    <option value={3}>Year 3 (Junior)</option>
                    <option value={4}>Year 4 (Senior)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-1.5">
                  Cumulative GPA
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.05"
                    min="0.0"
                    max="4.0"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) || 0 })}
                    className="w-32 px-3.5 py-2 text-sm rounded-xl border border-[#ccd9cf] focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d] font-bold"
                  />
                  <span className="text-xs text-[#526e60]">On standard 4.0 scale</span>
                </div>
              </div>

              {/* Course selection quick-toggle */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-2">
                  Select Completed & Currently Enrolled Courses
                </label>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {ALL_COURSES.map((course) => {
                    const isCompleted = formData.completedCourseIds.includes(course.id);
                    const isCurrent = formData.currentCourseIds.includes(course.id);

                    return (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-[#e0ece3] bg-[#f8faf8] text-xs hover:border-emerald-600 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-mono font-bold text-emerald-800 mr-2">{course.code}</span>
                          <span className="font-medium text-[#11291d]">{course.name}</span>
                          <span className="text-[11px] text-[#6b8577] ml-2">({course.credits} cr)</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleCourse(course.id, 'completed')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                              isCompleted
                                ? 'bg-emerald-800 text-white'
                                : 'bg-white border border-[#ccd9cf] text-[#526e60] hover:bg-[#edf2ee]'
                            }`}
                          >
                            {isCompleted ? '✓ Completed' : 'Completed'}
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleCourse(course.id, 'current')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-emerald-700 text-white'
                                : 'bg-white border border-[#ccd9cf] text-[#526e60] hover:bg-[#edf2ee]'
                            }`}
                          >
                            {isCurrent ? '● Enrolled' : 'Enrolled'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-[#11291d] mb-1">Academic & Functional Interests</h3>
                <p className="text-xs text-[#526e60]">
                  Select the themes that motivate your university studies. Pathway aligns projects and courses to these.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = formData.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                          : 'bg-[#f8faf8] text-[#11291d] border-[#d6ebd9] hover:bg-white'
                      }`}
                    >
                      {isSelected ? `✓ ${interest}` : `+ ${interest}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-[#11291d] mb-1">Target Role & Career Direction</h3>
                <p className="text-xs text-[#526e60]">
                  Choose the industry destination you want Pathway to calibrate against.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TARGET_ROLES.map((role) => {
                  const isSelected = formData.targetRoleId === role.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => setFormData({ ...formData, targetRoleId: role.id })}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-emerald-700 shadow-sm ring-2 ring-emerald-700/20'
                          : 'bg-[#f8faf8] border-[#e0ece3] hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b8577]">
                          {role.category}
                        </span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                      </div>
                      <h4 className="font-bold text-[#11291d] text-sm font-serif">{role.title}</h4>
                      <p className="text-xs text-[#526e60] mt-1 line-clamp-2 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#eef7f1] border border-[#d6ebd9]">
                <h3 className="text-sm font-bold text-[#143828] mb-1 flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-4 h-4 text-emerald-700" /> Personalized Pathway Calibrated
                </h3>
                <p className="text-xs text-[#1c5c37] leading-relaxed">
                  Based on your university coursework, academic standing, and career ambition, Pathway is ready:
                </p>

                <div className="mt-3 p-3 bg-white rounded-lg border border-[#c4e3cb] flex items-center justify-between text-xs font-semibold text-[#143828] flex-wrap gap-2">
                  <span>{formData.major}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Year {formData.yearOfStudy} (GPA {formData.gpa})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Target: {TARGET_ROLES.find((r) => r.id === formData.targetRoleId)?.title || 'Business Analyst'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e0ece3]">
                  <span className="text-[#6b8577] text-[11px] block">Completed</span>
                  <span className="text-lg font-bold text-[#11291d]">{formData.completedCourseIds.length} Courses</span>
                </div>
                <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e0ece3]">
                  <span className="text-[#6b8577] text-[11px] block">Current Term GPA</span>
                  <span className="text-lg font-bold text-emerald-800">{formData.gpa.toFixed(1)}</span>
                </div>
                <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e0ece3]">
                  <span className="text-[#6b8577] text-[11px] block">Active Interests</span>
                  <span className="text-lg font-bold text-[#11291d]">{formData.interests.length} Areas</span>
                </div>
                <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e0ece3]">
                  <span className="text-[#6b8577] text-[11px] block">Target Role</span>
                  <span className="text-xs font-bold text-emerald-900 line-clamp-1 mt-1">
                    {TARGET_ROLES.find((r) => r.id === formData.targetRoleId)?.title.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-[#edf2ee] bg-[#f8faf8] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-bold text-[#526e60] hover:text-[#11291d] rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-800 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-800 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              Launch Pathway <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
