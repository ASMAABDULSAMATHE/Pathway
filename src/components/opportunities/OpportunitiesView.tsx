import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Bookmark,
  Filter,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';
import { OpportunityMatchTier } from '../../types';

export const OpportunitiesView: React.FC = () => {
  const {
    student,
    caseState,
    loadDemoCase,
    setIsCreatePathwayModalOpen,
    curatedOpportunities,
    toggleApplyOpportunity,
    disciplineExp,
    currentRole,
  } = useUniPath();

  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Strong match' | 'Good match' | 'Certification'>('All');

  // Blank case empty state
  if (caseState === 'blank') {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
          <Briefcase className="w-7 h-7 text-emerald-800" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#11291d] font-serif">
            Your Opportunities
          </h1>
          <p className="text-base text-[#526e60] max-w-md mx-auto">
            “Personalized internship and industry recommendations will appear here once you create your pathway.”
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

  const renderTierBadge = (tier: OpportunityMatchTier) => {
    switch (tier) {
      case 'Strong match':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#eef7f1] text-[#145732] border border-[#cbe5d3]">
            Strong match
          </span>
        );
      case 'Good match':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#f0f6fc] text-[#1d528b] border border-[#d2e3f5]">
            Good match
          </span>
        );
      case 'Worth exploring':
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#faf5ec] text-[#805012] border border-[#eddcc4]">
            Worth exploring
          </span>
        );
    }
  };

  const filteredOpportunities = curatedOpportunities.filter((opp) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Certification') {
      return opp.field.toLowerCase().includes('cert') || opp.name.toLowerCase().includes('cert');
    }
    return opp.tier === selectedFilter;
  });

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-7">
      {/* Page Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e2eae4]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#526e60] mb-1">
            <span>Pathway</span>
            <span>/</span>
            <span className="font-semibold text-emerald-800">Curated Opportunities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#11291d] font-serif">
            Internships & Field Placements
          </h1>
          <p className="text-xs sm:text-sm text-[#526e60] mt-0.5">
            Verified opportunities in Sharjah, Dubai, and the UAE tailored for {student.major} students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#eef7f1] text-[#143825] text-xs font-semibold border border-[#d6ebd9] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-800" />
            <span>Target: {currentRole.title}</span>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap bg-white p-2.5 rounded-2xl border border-[#dce6df]">
        <div className="flex items-center gap-1.5">
          {(['All', 'Strong match', 'Good match', 'Certification'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-[#526e60] hover:bg-[#f4f7f4]'
              }`}
            >
              {filter === 'Certification' ? 'Certifications' : filter}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#6b8577] px-2">
          {filteredOpportunities.length} opportunities shown
        </span>
      </div>

      {/* Curated Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.map((opp) => {
          const isApplied = (student.appliedOpportunityIds || []).includes(opp.id);

          return (
            <div
              key={opp.id}
              className="bg-white rounded-2xl p-6 border border-[#dce6df] shadow-xs hover:border-emerald-600 transition-all space-y-4"
            >
              {/* Top row: Name, Organization, Tier */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-xs text-[#11291d] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#6b8577]" />
                      {opp.organization}
                    </span>
                    <span className="text-[#8fa89b]">•</span>
                    <span className="text-xs text-[#6b8577] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#6b8577]" />
                      {opp.location}
                    </span>
                    <span className="text-[#8fa89b]">•</span>
                    <span className="text-xs text-[#6b8577] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#6b8577]" />
                      {opp.deadline}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-[#11291d] font-serif">
                    {opp.name}
                  </h2>
                </div>

                <div className="shrink-0">{renderTierBadge(opp.tier)}</div>
              </div>

              {/* Match Rationale Details */}
              <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#e5efe7] space-y-2 text-xs">
                <div>
                  <span className="font-bold text-[#145732]">Why it matches your profile:</span>{' '}
                  <span className="text-[#3a5445] leading-relaxed">
                    {opp.whyItMatches}
                  </span>
                </div>

                {opp.strengthenFirst && (
                  <div>
                    <span className="font-bold text-[#805012]">
                      What you could strengthen first:
                    </span>{' '}
                    <span className="text-[#59422b] leading-relaxed">
                      {opp.strengthenFirst}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer with Official Link & Applied tracker */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                <span className="text-xs text-[#6b8577] font-medium">
                  Sector: {opp.field}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleApplyOpportunity(opp.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isApplied
                        ? 'bg-[#eef7f1] text-emerald-900 border-[#cbe5d3]'
                        : 'bg-white text-[#526e60] border-[#ccd9cf] hover:bg-[#f4f7f4]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isApplied ? 'text-emerald-700' : 'text-[#8fa89b]'}`} />
                    <span>{isApplied ? 'Tracked as Applied' : 'Mark as Applying'}</span>
                  </button>

                  <a
                    href={opp.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
