import React from 'react';
import {
  HelpCircle,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Layers,
  Briefcase,
  Target,
  BookOpen,
  Users,
  Building,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';

export const ProblemSolutionView: React.FC = () => {
  const { setActiveTab } = useUniPath();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-12">
      {/* Page Title: Exactly "Problem & Solution" */}
      <div className="space-y-2 text-center sm:text-left border-b border-[#edf2ee] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#eef7f1] text-[#145732] text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Competition Presentation & Academic Rationale</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#11291d] font-serif">
          Problem & Solution
        </h1>
        <p className="text-sm sm:text-base text-[#526e60]">
          Addressing the structural disconnect between academic coursework, competency evidence, and career progression.
        </p>
      </div>

      {/* 01 — THE PROBLEM */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
            01
          </span>
          <h2 className="text-xl font-bold text-[#11291d] font-serif">
            The Problem
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#dce6df] shadow-xs space-y-4 text-sm text-[#385244] leading-relaxed">
          <p>
            Students often have academic information, career information, skills, projects, and opportunities scattered across different places. Course catalogs live in the registrar’s portal, career listings are on job boards, project code sits in private repositories, and degree requirements are buried in multi-page PDF bulletins.
          </p>
          <div className="p-4 rounded-xl bg-[#f8faf8] border-l-4 border-emerald-800 text-[#11291d]">
            <p className="text-sm font-semibold">
              The challenge is not simply finding information. It is knowing:
            </p>
            <p className="text-lg font-bold font-serif text-emerald-800 mt-1">
              “What should I do next?”
            </p>
          </div>
          <p>
            Without a unified narrative, students struggle to see how an upcoming course connects to industry skills, how those skills translate into portfolio projects, and how projects unlock tangible internships.
          </p>
        </div>
      </section>

      {/* 02 — WHAT WE FOUND */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
            02
          </span>
          <h2 className="text-xl font-bold text-[#11291d] font-serif">
            What We Found
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-[#dce6df] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Underemployment Gap
            </span>
            <h3 className="text-base font-bold text-[#11291d] font-serif">
              52% Initial Underemployment
            </h3>
            <p className="text-xs text-[#526e60] leading-relaxed">
              Over half of college graduates are underemployed in their first year when curriculum lacks transparent translation into demonstrable career skills.
            </p>
            <p className="text-[10px] font-semibold text-[#8fa89b] pt-1">
              Source: Strada Education Foundation (2023)
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#dce6df] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Employer Priorities
            </span>
            <h3 className="text-base font-bold text-[#11291d] font-serif">
              Skills Over Transcripts
            </h3>
            <p className="text-xs text-[#526e60] leading-relaxed">
              86% of hiring managers prioritize verified skill competencies and demonstrable project artifacts over cumulative university GPA.
            </p>
            <p className="text-[10px] font-semibold text-[#8fa89b] pt-1">
              Source: National Association of Colleges and Employers (NACE, 2024)
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#dce6df] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              System Fragmentation
            </span>
            <h3 className="text-base font-bold text-[#11291d] font-serif">
              4+ Disconnected Systems
            </h3>
            <p className="text-xs text-[#526e60] leading-relaxed">
              More than 60% of students consult four or more siloed platforms (SIS, LMS, job boards, advising) without a single coherent sequence of action.
            </p>
            <p className="text-[10px] font-semibold text-[#8fa89b] pt-1">
              Source: Inside Higher Ed & Hanover Research (2023)
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#dce6df] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Workforce Evolution
            </span>
            <h3 className="text-base font-bold text-[#11291d] font-serif">
              Continuous Skill Alignment
            </h3>
            <p className="text-xs text-[#526e60] leading-relaxed">
              Accelerating technological shifts demand real-time synchronization between academic degree programs and applied analytical capabilities.
            </p>
            <p className="text-[10px] font-semibold text-[#8fa89b] pt-1">
              Source: World Economic Forum (Future of Jobs, 2023)
            </p>
          </div>
        </div>
      </section>

      {/* 03 — OUR SOLUTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
            03
          </span>
          <h2 className="text-xl font-bold text-[#11291d] font-serif">
            Our Solution
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#dce6df] shadow-xs space-y-6">
          {/* Simple Visual Flow */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#f8faf8] border border-[#e2ede5]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#cbe5d3] text-emerald-800 flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#11291d] mt-1.5">
                  Degree
                </span>
                <span className="text-[10px] text-[#6b8577]">What I study</span>
              </div>

              <span className="text-emerald-700 font-bold text-lg hidden sm:inline">
                →
              </span>
              <span className="text-emerald-700 font-bold text-lg sm:hidden">
                ↓
              </span>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#cbe5d3] text-emerald-800 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#11291d] mt-1.5">
                  Skills
                </span>
                <span className="text-[10px] text-[#6b8577]">What I can do</span>
              </div>

              <span className="text-emerald-700 font-bold text-lg hidden sm:inline">
                →
              </span>
              <span className="text-emerald-700 font-bold text-lg sm:hidden">
                ↓
              </span>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#cbe5d3] text-emerald-800 flex items-center justify-center shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#11291d] mt-1.5">
                  Projects
                </span>
                <span className="text-[10px] text-[#6b8577]">How I build it</span>
              </div>

              <span className="text-emerald-700 font-bold text-lg hidden sm:inline">
                →
              </span>
              <span className="text-emerald-700 font-bold text-lg sm:hidden">
                ↓
              </span>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#cbe5d3] text-emerald-800 flex items-center justify-center shadow-xs">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#11291d] mt-1.5">
                  Opportunities
                </span>
                <span className="text-[10px] text-[#6b8577]">Where I use it</span>
              </div>

              <span className="text-emerald-700 font-bold text-lg hidden sm:inline">
                →
              </span>
              <span className="text-emerald-700 font-bold text-lg sm:hidden">
                ↓
              </span>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                  <Target className="w-5 h-5 text-emerald-100" />
                </div>
                <span className="text-xs font-bold text-[#11291d] mt-1.5">
                  Career Goal
                </span>
                <span className="text-[10px] text-[#6b8577]">Where I'm going</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#385244] leading-relaxed">
            Pathway connects these elements into a personalized sequence of actions. Instead of confronting students with disconnected portals and overwhelming analytics, Pathway progressively guides the student through one simple question at every stage of their academic journey: <em>“What should I do next?”</em>
          </p>
        </div>
      </section>

      {/* 04 — WHY IT MATTERS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
            04
          </span>
          <h2 className="text-xl font-bold text-[#11291d] font-serif">
            Why It Matters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-[#dce6df] shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              <Users className="w-4 h-4 text-emerald-800" />
            </div>
            <h3 className="text-base font-bold text-[#11291d] font-serif">
              Students
            </h3>
            <p className="text-xs text-[#526e60] leading-relaxed">
              Make better-informed academic and career decisions without confusion or cognitive overload.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#dce6df] shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#f0f5fc] text-[#1c4d87] flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-4 h-4 text-emerald-800" />
            </div>
            <h3 className="text-base font-bold text-[#11291d] font-serif">
              Universities
            </h3>
            <p className="text-xs text-[#526e60] leading-relaxed">
              Help students connect curriculum with career development and increase institutional graduation and placement rates.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#dce6df] shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#fcf5eb] text-[#804d0c] flex items-center justify-center font-bold text-xs">
              <Building className="w-4 h-4 text-emerald-800" />
            </div>
            <h3 className="text-base font-bold text-[#11291d] font-serif">
              Employers
            </h3>
            <p className="text-xs text-[#526e60] leading-relaxed">
              Help students build clearer evidence of skills and experience, streamlining entry-level recruiting and talent matching.
            </p>
          </div>
        </div>
      </section>

      {/* References Section */}
      <div className="pt-6 border-t border-[#edf2ee] text-[11px] text-[#6b8577] space-y-1">
        <p className="font-bold text-[#11291d]">References & Authentic Sources:</p>
        <p>1. Strada Education Foundation & The Burning Glass Institute (2023). <em>Talent Disrupted: College Degree Value and Underemployment</em>.</p>
        <p>2. National Association of Colleges and Employers (NACE, 2024). <em>Job Outlook 2024: Key Attributes Employers Seek on College Resumes</em>.</p>
        <p>3. Hanover Research & Inside Higher Ed (2023). <em>Survey of Student Success Technologies and Academic Advising Navigation</em>.</p>
        <p>4. World Economic Forum (2023). <em>The Future of Jobs Report 2023: Skills taxonomies and employment projections</em>.</p>
      </div>
    </div>
  );
};
