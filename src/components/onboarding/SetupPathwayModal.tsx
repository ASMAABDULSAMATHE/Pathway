import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Building2,
  Stethoscope,
  Laptop,
  Cpu,
  BarChart3,
  Scale,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';
import { getCollegeProgram, DisciplineType } from '../../data/uosCurriculumData';

const INTEREST_AREAS: Record<DisciplineType, string[]> = {
  health: [
    'Clinical Patient Care & Hospital Wards',
    'Health Informatics & Electronic Records',
    'Pharmacotherapy & Medication Safety',
    'Infection Prevention & Quality Control',
    'Public Health & Community Screening',
    'Emergency Triage & Critical Care',
  ],
  computing: [
    'Full-Stack Web & Cloud Systems',
    'Artificial Intelligence & Deep Learning',
    'Algorithms & Distributed Systems',
    'Cybersecurity & Network Defense',
    'Database Architecture & SQL',
    'DevOps & Microservices',
  ],
  engineering: [
    'Smart Grid & Renewable Energy',
    'Circuit Design & Embedded Systems',
    'Feedback Control & Robotics',
    'Industrial Operations & Supply Chain',
    'Power Systems & Utilities',
    'Structural & Mechanical Modeling',
  ],
  business: [
    'Business Process Modeling (BPMN)',
    'Data Analytics & Power BI',
    'Digital Transformation & Strategy',
    'Enterprise ERP Systems',
    'Financial Systems & Cost Analysis',
    'Agile Product Management',
  ],
  humanities: [
    'Corporate Law & UAE Compliance',
    'Public Relations & Strategic Media',
    'Applied Psychology & Behavioral Research',
    'International Relations & Diplomacy',
    'Digital Journalism & Communication',
    'Policy Analysis & Ethics',
  ],
};

const CAREER_GOALS: Record<DisciplineType, string[]> = {
  health: [
    'Registered Clinical Nurse / Healthcare Specialist',
    'Health Informatics & Clinical Data Analyst',
    'Healthcare Quality & Patient Safety Officer (JCI)',
    'Clinical Research Coordinator (CRC)',
  ],
  computing: [
    'Software Engineer (Full-Stack / Backend)',
    'Artificial Intelligence & ML Engineer',
    'Cloud Systems & DevOps Engineer',
    'Cybersecurity & Application Security Analyst',
  ],
  engineering: [
    'Power Systems & Smart Grid Engineer (SEWA/DEWA)',
    'Renewable Energy & Clean Tech Specialist',
    'Industrial & Operations Optimization Engineer',
    'Control & Robotics Systems Engineer',
  ],
  business: [
    'Business Analyst / Digital Transformation Consultant',
    'Business Intelligence & Reporting Analyst',
    'Enterprise Systems (ERP) Specialist',
    'Product Operations Specialist',
  ],
  humanities: [
    'Legal & Regulatory Compliance Officer',
    'Strategic Communications & PR Specialist',
    'Media Relations & Digital Strategist',
    'Policy & Organizational Development Analyst',
  ],
};

const WORKING_TOWARD_OPTIONS = [
  { id: 'internship', label: 'Hospital / Industry Internship', desc: 'Hands-on clinical or corporate placement' },
  { id: 'career', label: 'Direct Career Entry', desc: 'Licensed practice or graduate role upon completion' },
  { id: 'research', label: 'Academic & Lab Research', desc: 'Faculty clinical research or published capstone' },
  { id: 'portfolio', label: 'Verified Skills Portfolio', desc: 'Demonstrable real-world projects and certifications' },
];

export const SetupPathwayModal: React.FC = () => {
  const {
    isCreatePathwayModalOpen,
    setIsCreatePathwayModalOpen,
    createCustomPathway,
  } = useUniPath();

  const [step, setStep] = useState<number>(1);
  const [selectedCollege, setSelectedCollege] = useState<DisciplineType>('health');

  // Form inputs
  const [formData, setFormData] = useState({
    name: '',
    major: 'BSc Nursing',
    college: 'College of Health Sciences & Medicine',
    yearOfStudy: 2,
    interests: ['Clinical Patient Care & Hospital Wards', 'Health Informatics & Electronic Records'],
    careerGoal: 'Registered Clinical Nurse / Healthcare Specialist',
    workingToward: 'Hospital / Industry Internship',
  });

  const [customMajorInput, setCustomMajorInput] = useState('');

  useEffect(() => {
    if (isCreatePathwayModalOpen) {
      setStep(1);
    }
  }, [isCreatePathwayModalOpen]);

  if (!isCreatePathwayModalOpen) return null;

  const collegeObj = getCollegeProgram(selectedCollege);

  const handleCollegeSelect = (colKey: DisciplineType) => {
    setSelectedCollege(colKey);
    const colData = getCollegeProgram(colKey);
    setFormData((prev) => ({
      ...prev,
      college: colData.collegeName,
      major: colData.popularMajors[0],
      interests: (INTEREST_AREAS[colKey] || []).slice(0, 2),
      careerGoal: (CAREER_GOALS[colKey] || [])[0] || '',
    }));
    setCustomMajorInput('');
  };

  const handleMajorSelect = (majorName: string) => {
    setCustomMajorInput('');
    setFormData((prev) => ({
      ...prev,
      major: majorName,
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleFinish = () => {
    createCustomPathway({
      name: formData.name.trim() || 'Student',
      major: (customMajorInput.trim() || formData.major),
      college: formData.college,
      yearOfStudy: formData.yearOfStudy,
      university: 'University of Sharjah',
      interests: formData.interests,
      careerGoal: formData.careerGoal,
      workingToward: formData.workingToward,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0d2217]/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#d6ebd9] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-[#edf2ee] flex items-center justify-between bg-[#fbfdfb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-xs">
              <GraduationCap className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#11291d] font-serif">
                Create My University Pathway
              </h2>
              <p className="text-xs text-[#526e60]">
                Step {step} of 3 • Tailored for University of Sharjah
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreatePathwayModalOpen(false)}
            className="p-2 text-[#8fa89b] hover:text-[#11291d] rounded-lg hover:bg-[#eef4f0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Step Progress Indicator */}
        <div className="w-full bg-[#edf2ee] h-1.5">
          <div
            className="bg-emerald-800 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          {/* STEP 1: COLLEGE & MAJOR */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sarah Al-Nuaimi or Alex"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#ccd9cf] focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-2">
                  Select University of Sharjah College
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleCollegeSelect('health')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      selectedCollege === 'health'
                        ? 'bg-emerald-800 text-white border-emerald-950 shadow-xs'
                        : 'bg-[#f8faf8] text-[#11291d] border-[#d6ebd9] hover:bg-white hover:border-emerald-600'
                    }`}
                  >
                    <Stethoscope className={`w-5 h-5 ${selectedCollege === 'health' ? 'text-emerald-200' : 'text-emerald-800'}`} />
                    <span className="text-xs font-bold leading-tight">Health Sciences & Medicine</span>
                    <span className={`text-[10px] ${selectedCollege === 'health' ? 'text-emerald-200' : 'text-[#62806e]'}`}>Nursing, Pharmacy, HealthTech</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCollegeSelect('computing')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      selectedCollege === 'computing'
                        ? 'bg-emerald-800 text-white border-emerald-950 shadow-xs'
                        : 'bg-[#f8faf8] text-[#11291d] border-[#d6ebd9] hover:bg-white hover:border-emerald-600'
                    }`}
                  >
                    <Laptop className={`w-5 h-5 ${selectedCollege === 'computing' ? 'text-emerald-200' : 'text-emerald-800'}`} />
                    <span className="text-xs font-bold leading-tight">Computing & Informatics</span>
                    <span className={`text-[10px] ${selectedCollege === 'computing' ? 'text-emerald-200' : 'text-[#62806e]'}`}>CS, AI, Cybersecurity, SWE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCollegeSelect('business')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      selectedCollege === 'business'
                        ? 'bg-emerald-800 text-white border-emerald-950 shadow-xs'
                        : 'bg-[#f8faf8] text-[#11291d] border-[#d6ebd9] hover:bg-white hover:border-emerald-600'
                    }`}
                  >
                    <BarChart3 className={`w-5 h-5 ${selectedCollege === 'business' ? 'text-emerald-200' : 'text-emerald-800'}`} />
                    <span className="text-xs font-bold leading-tight">Business Administration</span>
                    <span className={`text-[10px] ${selectedCollege === 'business' ? 'text-emerald-200' : 'text-[#62806e]'}`}>BIS, Finance, Marketing</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCollegeSelect('engineering')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      selectedCollege === 'engineering'
                        ? 'bg-emerald-800 text-white border-emerald-950 shadow-xs'
                        : 'bg-[#f8faf8] text-[#11291d] border-[#d6ebd9] hover:bg-white hover:border-emerald-600'
                    }`}
                  >
                    <Cpu className={`w-5 h-5 ${selectedCollege === 'engineering' ? 'text-emerald-200' : 'text-emerald-800'}`} />
                    <span className="text-xs font-bold leading-tight">Engineering</span>
                    <span className={`text-[10px] ${selectedCollege === 'engineering' ? 'text-emerald-200' : 'text-[#62806e]'}`}>Electrical, Energy, Industrial</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCollegeSelect('humanities')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      selectedCollege === 'humanities'
                        ? 'bg-emerald-800 text-white border-emerald-950 shadow-xs'
                        : 'bg-[#f8faf8] text-[#11291d] border-[#d6ebd9] hover:bg-white hover:border-emerald-600'
                    }`}
                  >
                    <Scale className={`w-5 h-5 ${selectedCollege === 'humanities' ? 'text-emerald-200' : 'text-emerald-800'}`} />
                    <span className="text-xs font-bold leading-tight">Law & Humanities</span>
                    <span className={`text-[10px] ${selectedCollege === 'humanities' ? 'text-emerald-200' : 'text-[#62806e]'}`}>Law, PR, Psychology</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-2">
                  Select Your Major ({collegeObj?.collegeName || 'University of Sharjah'})
                </label>
                <div className="flex flex-wrap gap-2 mb-2.5">
                  {(collegeObj?.popularMajors || []).map((majorName) => {
                    const isSelected = formData.major === majorName && !customMajorInput;
                    return (
                      <button
                        key={majorName}
                        type="button"
                        onClick={() => handleMajorSelect(majorName)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                            : 'bg-[#f8faf8] text-[#11291d] border-[#ccd9cf] hover:bg-white hover:border-emerald-700'
                        }`}
                      >
                        {majorName}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2">
                  <input
                    type="text"
                    value={customMajorInput}
                    onChange={(e) => {
                      setCustomMajorInput(e.target.value);
                      setFormData({ ...formData, major: e.target.value });
                    }}
                    placeholder="Or type a custom program (e.g., Clinical Nutrition or Biomedical)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#ccd9cf] focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-1.5">
                    Year of Study
                  </label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#ccd9cf] focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d]"
                  >
                    <option value={1}>Year 1 (Freshman / Foundations)</option>
                    <option value={2}>Year 2 (Sophomore / Core)</option>
                    <option value={3}>Year 3 (Junior / Advanced)</option>
                    <option value={4}>Year 4 (Senior / Practicum)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-1.5">
                    Institution
                  </label>
                  <input
                    type="text"
                    disabled
                    value="University of Sharjah (UOS)"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#ccd9cf] bg-[#f2f6f3] text-[#526e60] cursor-not-allowed font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: INTERESTS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#526e60]">
                  Select the key competencies and subjects you want your degree journey to emphasize.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(INTEREST_AREAS[selectedCollege] || []).map((interest) => {
                  const isSelected = formData.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-950 shadow-xs'
                          : 'bg-[#f8faf8] text-[#11291d] border-[#d6ebd9] hover:bg-white hover:border-emerald-600'
                      }`}
                    >
                      <span>{interest}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-[#eef7f1] rounded-xl border border-[#cbe4d2] text-xs text-[#143825]">
                <span className="font-bold">Tailored Experience:</span> Selecting these focus areas customizes your course prerequisites, project recommendations, and partner internship listings.
              </div>
            </div>
          )}

          {/* STEP 3: CAREER GOAL & MILESTONE */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-1.5">
                  Target Career Role
                </label>
                <div className="space-y-2 mb-3">
                  {(CAREER_GOALS[selectedCollege] || []).map((goal) => {
                    const isSelected = formData.careerGoal === goal;
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setFormData({ ...formData, careerGoal: goal })}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-950 shadow-xs'
                            : 'bg-[#f8faf8] text-[#11291d] border-[#ccd9cf] hover:bg-white hover:border-emerald-700'
                        }`}
                      >
                        <span>{goal}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={formData.careerGoal}
                  onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                  placeholder="Or enter a specific target role title"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#ccd9cf] focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-1.5">
                  Immediate Milestone You’re Working Toward
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {WORKING_TOWARD_OPTIONS.map((opt) => {
                    const isSelected = formData.workingToward === opt.label;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, workingToward: opt.label })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-950 shadow-xs'
                            : 'bg-[#f8faf8] text-[#11291d] border-[#ccd9cf] hover:bg-white hover:border-emerald-700'
                        }`}
                      >
                        <div className="text-xs font-bold mb-0.5">{opt.label}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-[#526e60]'}`}>
                          {opt.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-[#edf2ee] bg-[#f8faf8] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#526e60] hover:text-[#11291d] hover:bg-[#eef4f0] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !formData.name.trim()) {
                  formData.name = 'Sarah';
                }
                setStep(step + 1);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate My UOS Pathway</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
