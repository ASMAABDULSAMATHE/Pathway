import React from 'react';
import { X, Building2, MapPin, Calendar, CheckCircle2, AlertTriangle, Bookmark, ExternalLink } from 'lucide-react';
import { Opportunity } from '../../types';
import { useUniPath } from '../../context/UniPathContext';
import { calculateOpportunityMatch } from '../../services/recommendationEngine';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({ opportunity, onClose }) => {
  const { student, toggleApplyOpportunity } = useUniPath();

  if (!opportunity) return null;

  const isApplied = student.appliedOpportunityIds.includes(opportunity.id);
  const { matchScore, matchedSkills, missingSkills } = calculateOpportunityMatch(opportunity, student);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f291e]/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e0e7e1] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#edf2ee] bg-[#f8faf8] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-[#eef7f1] text-[#1a5e38] border border-[#d6ebd9]">
                {opportunity.type}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#f4f7f4] text-[#526e60] border border-[#e0e7e1]">
                {opportunity.field}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">
                {matchScore}% Match
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#11291d] font-serif">{opportunity.title}</h2>
            <div className="flex items-center gap-4 text-xs text-[#526e60] mt-2 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-[#11291d]">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" /> {opportunity.organization}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#6b8577]" /> {opportunity.location}
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-800">
                <Calendar className="w-3.5 h-3.5" /> Deadline: {opportunity.deadline}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8fa89b] hover:text-[#11291d] rounded-lg hover:bg-[#eef4f0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#486355]">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-1.5">Overview & Mission</h4>
            <p className="leading-relaxed text-[#11291d]">{opportunity.description}</p>
          </div>

          {/* Match analysis */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#f2f7f3] border border-[#d6e7dc]">
              <h4 className="text-xs font-bold text-[#1a5e38] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matched Capabilities ({matchedSkills.length})
              </h4>
              <ul className="space-y-1.5 text-xs text-[#1c5c37]">
                {matchedSkills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>{skill} (verified coursework)</span>
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Strong GPA: {student.gpa.toFixed(1)}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#fef9f4] border border-[#fae2c8]">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" /> Areas to Strengthen ({missingSkills.length})
              </h4>
              {missingSkills.length === 0 ? (
                <p className="text-xs text-[#1c5c37] font-semibold">You meet all listed qualifications!</p>
              ) : (
                <ul className="space-y-1.5 text-xs text-amber-950">
                  {missingSkills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      <span>{skill} (take relevant project/course)</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-[#f8faf8] rounded-xl border border-[#e0ece3] flex items-center justify-between text-xs">
            <span>Stipend: <strong className="text-[#11291d]">{opportunity.stipend}</strong></span>
            <span>Duration: <strong className="text-[#11291d]">{opportunity.duration}</strong></span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#edf2ee] bg-[#f8faf8] flex items-center justify-between">
          <button
            onClick={() => toggleApplyOpportunity(opportunity.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isApplied
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-[#f4f7f4] text-[#11291d] border border-[#ccd9cf] hover:bg-[#eef4f0]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            {isApplied ? 'Saved to Tracker' : 'Bookmark Opportunity'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
