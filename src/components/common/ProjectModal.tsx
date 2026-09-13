import React from 'react';
import { X, Clock, CheckCircle2, Bookmark, Sparkles, Layers, Plus } from 'lucide-react';
import { ProjectRecommendation, TrackedProject } from '../../types';
import { useUniPath } from '../../context/UniPathContext';

interface ProjectModalProps {
  project: ProjectRecommendation | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { student, toggleSaveProject, addTrackedProject, currentRole, addToast } = useUniPath();

  if (!project) return null;

  const isSaved = student.savedProjectIds.includes(project.id);
  const isAlreadyTracked = student.trackedProjects.some(
    (p) => p.title.toLowerCase() === project.title.toLowerCase()
  );

  const handleAddToTracker = () => {
    if (isAlreadyTracked) {
      addToast('This project is already in your active tracker', 'info');
      return;
    }

    const tracked: TrackedProject = {
      id: `tp_${Date.now()}`,
      title: project.title,
      category: project.category,
      description: project.description,
      status: 'planning',
      progress: 0,
      targetRoleAlignment: project.addressesGapForRole || `Strengthens core skills for ${currentRole.title}`,
      skillsStrengthened: project.skillsGained,
      estimatedHours: project.estimatedHours,
      keyDeliverable: project.deliverables[0] || 'Technical Project Deliverable',
      tasks: project.deliverables.map((d, idx) => ({
        id: `t_modal_${idx}`,
        title: d,
        completed: false,
      })),
    };

    addTrackedProject(tracked);
    onClose();
  };

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
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-[#eef7f1] text-[#1a5e38] border border-[#d6ebd9] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {project.category}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#f4f7f4] text-[#526e60] border border-[#e0e7e1]">
                {project.difficulty}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#f4f7f4] text-[#526e60] border border-[#e0e7e1] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#6b8577]" /> ~{project.estimatedHours} Hours
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#11291d] font-serif">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8fa89b] hover:text-[#11291d] rounded-lg hover:bg-[#eef4f0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#486355]">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-1.5">Project Brief</h4>
            <p className="leading-relaxed text-[#11291d]">{project.description}</p>
          </div>

          {project.addressesGapForRole && (
            <div className="p-3.5 rounded-xl bg-[#eef7f1] border border-[#d0ead8] text-xs">
              <span className="font-bold text-[#143828] block mb-0.5">🎯 Target Skill Gap Addressed</span>
              <p className="text-[#1c5c37]">{project.addressesGapForRole}</p>
            </div>
          )}

          {/* Skills gained */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-2">Capabilities Built</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.skillsGained.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#eef7f1] text-[#1c5c37] border border-[#d6ebd9] flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" /> {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b8577] mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" /> Key Portfolio Deliverables
            </h4>
            <ul className="space-y-1.5 text-xs text-[#11291d]">
              {project.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-[#f8faf8] border border-[#e0ece3]">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#edf2ee] bg-[#f8faf8] flex items-center justify-between">
          <button
            onClick={() => toggleSaveProject(project.id)}
            className="text-xs font-semibold text-[#526e60] hover:text-[#11291d] cursor-pointer"
          >
            {isSaved ? 'Remove Bookmark' : 'Bookmark for Later'}
          </button>

          <button
            onClick={handleAddToTracker}
            disabled={isAlreadyTracked}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isAlreadyTracked
                ? 'bg-[#f4f7f4] text-[#8fa89b] cursor-not-allowed'
                : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            {isAlreadyTracked ? 'In Active Tracker' : 'Add to My Project Tracker'}
          </button>
        </div>
      </div>
    </div>
  );
};
