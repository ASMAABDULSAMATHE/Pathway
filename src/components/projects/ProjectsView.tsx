import React, { useState } from 'react';
import {
  Layers,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  Sparkles,
  Calendar,
  CheckSquare,
  Square,
  User,
  FolderPlus,
  Briefcase,
} from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';
import { TrackedProject, ProjectTask, ProjectRecommendation } from '../../types';

export const ProjectsView: React.FC = () => {
  const {
    student,
    caseState,
    loadDemoCase,
    setIsCreatePathwayModalOpen,
    toggleProjectTask,
    addTrackedProject,
    currentRole,
    recommendedProjectsList,
    disciplineExp,
  } = useUniPath();

  const [activeSubTab, setActiveSubTab] = useState<'active' | 'completed'>('active');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [activeProjectForTasks, setActiveProjectForTasks] = useState<TrackedProject | null>(null);

  // Simple New Project state
  const [projectName, setProjectName] = useState('');
  const [projectGoal, setProjectGoal] = useState('');
  const [projectSkills, setProjectSkills] = useState('');
  const [startDate, setStartDate] = useState('2026-03-01');
  const [targetDate, setTargetDate] = useState('2026-05-15');
  const [tasksText, setTasksText] = useState(
    '1. Define scope and literature/data sources\n2. Design system workflow / clinical protocol\n3. Execute audit & synthesize findings\n4. Deliver final documentation and portfolio presentation'
  );

  // Blank case empty state
  if (caseState === 'blank') {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
          <Layers className="w-7 h-7 text-emerald-800" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#11291d] font-serif">
            Your Projects Tracker
          </h1>
          <p className="text-base text-[#526e60] max-w-md mx-auto">
            “No projects yet. Applied projects will appear here as you turn your coursework into verifiable portfolio evidence.”
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

  // Active student projects (or fallback to discipline experience tracked projects)
  const currentTrackedProjects =
    student.trackedProjects && student.trackedProjects.length > 0
      ? student.trackedProjects
      : disciplineExp.trackedProjects;

  const activeProjects = currentTrackedProjects.filter((p) => p.status !== 'completed');
  const completedProjects = currentTrackedProjects.filter((p) => p.status === 'completed');
  const displayedProjects = activeSubTab === 'active' ? activeProjects : completedProjects;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const parsedTasks: ProjectTask[] = tasksText
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((taskStr, index) => ({
        id: `task_${Date.now()}_${index}`,
        title: taskStr.replace(/^\d+[\.\)]\s*/, ''),
        completed: index === 0,
      }));

    const newProject: TrackedProject = {
      id: `proj_${Date.now()}`,
      title: projectName.trim(),
      category: projectGoal.trim() || `${student.major} Applied Project`,
      description: projectGoal.trim() || 'Demonstrates applied skills for portfolio review.',
      status: 'in_progress',
      progress: parsedTasks.length > 0 && parsedTasks[0].completed ? Math.round(100 / parsedTasks.length) : 0,
      targetRoleAlignment: `Target Role: ${currentRole.title}`,
      skillsStrengthened: projectSkills
        ? projectSkills.split(',').map((s) => s.trim())
        : [disciplineExp.buildNextSkill.name, 'Problem Solving'],
      tasks: parsedTasks.length > 0 ? parsedTasks : [{ id: 't1', title: 'Initial Project Scope', completed: false }],
      estimatedHours: 25,
      startDate,
      targetCompletionDate: targetDate,
      keyDeliverable: 'Final Project Report & Code/Workflow Repository',
    };

    addTrackedProject(newProject);
    setIsNewProjectModalOpen(false);
    setProjectName('');
    setProjectGoal('');
    setProjectSkills('');
  };

  const handleStartRecommendation = (rec: ProjectRecommendation) => {
    const newProject: TrackedProject = {
      id: `proj_rec_${Date.now()}`,
      title: rec.title,
      category: rec.category,
      description: rec.description,
      status: 'in_progress',
      progress: 25,
      targetRoleAlignment: `Aligned with ${currentRole.title}`,
      skillsStrengthened: rec.skillsGained,
      tasks: [
        { id: 't1', title: 'Review requirements and protocol literature', completed: true },
        { id: 't2', title: rec.deliverables[0] || 'Complete primary deliverable analysis', completed: false },
        { id: 't3', title: rec.deliverables[1] || 'Draft final project presentation and audit', completed: false },
      ],
      estimatedHours: rec.estimatedHours,
      keyDeliverable: rec.deliverables.join(', '),
    };
    addTrackedProject(newProject);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-7">
      {/* Page Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e2eae4]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#526e60] mb-1">
            <span>Pathway</span>
            <span>/</span>
            <span className="font-semibold text-emerald-800">Applied Projects & Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#11291d] font-serif">
            Projects Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#526e60] mt-0.5">
            Turn theoretical coursework into tangible, verifiable evidence for {currentRole.title} employers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      {/* Toggle Tabs: Active Projects vs. Completed Projects */}
      <div className="flex items-center gap-2 border-b border-[#e2ece5] pb-2">
        <button
          onClick={() => setActiveSubTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'active'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-[#526e60] hover:bg-[#eef5f0]'
          }`}
        >
          Active Projects ({activeProjects.length})
        </button>
        <button
          onClick={() => setActiveSubTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'completed'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-[#526e60] hover:bg-[#eef5f0]'
          }`}
        >
          Completed Projects ({completedProjects.length})
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {displayedProjects.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#dce6df] space-y-2">
            <p className="text-sm font-semibold text-[#11291d]">
              No {activeSubTab} projects found.
            </p>
            <p className="text-xs text-[#6b8577]">
              {activeSubTab === 'active'
                ? 'Create a new project or select one from the recommendations below.'
                : 'Projects you complete will be highlighted here in your portfolio.'}
            </p>
          </div>
        ) : (
          displayedProjects.map((project) => {
            const nextIncompleteTask =
              project.tasks.find((t) => !t.completed)?.title ||
              'All tasks completed! Ready for portfolio review.';

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl p-6 border border-[#dce6df] shadow-xs hover:border-emerald-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-[#11291d] font-serif">
                      {project.title}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#eef7f1] text-[#143825] border border-[#d6ebd9]">
                      {project.status === 'completed'
                        ? 'Completed'
                        : project.status === 'in_progress'
                        ? 'In Progress'
                        : 'Planning'}
                    </span>
                    <span className="text-xs text-[#6b8577]">
                      {project.category}
                    </span>
                  </div>

                  <p className="text-xs text-[#526e60] leading-relaxed">
                    {project.description}
                  </p>

                  <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#edf2ee] space-y-1">
                    <p className="text-[11px] font-bold text-[#6b8577] uppercase tracking-wider">
                      Next actionable milestone:
                    </p>
                    <p className="text-xs font-semibold text-[#11291d]">
                      {nextIncompleteTask}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.skillsStrengthened.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-[#f4f7f4] text-[#143825] text-[11px] font-medium border border-[#dce6df]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Column: Progress & Action Button */}
                <div className="w-full md:w-56 flex flex-col justify-between gap-4 border-t md:border-t-0 md:border-l border-[#edf2ee] pt-4 md:pt-0 md:pl-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6b8577] font-medium">Completion</span>
                      <span className="font-bold text-emerald-800">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-[#edf2ee] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-800 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#8fa89b]">
                      {project.tasks.filter((t) => t.completed).length} of{' '}
                      {project.tasks.length} tasks completed
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveProjectForTasks(project)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Checklist & Tasks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recommended Projects Based on Major & Career Goal */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-lg font-bold text-[#11291d] font-serif">
            Curated Project Blueprints for {student.major}
          </h2>
          <p className="text-xs text-[#526e60]">
            Selected based on University of Sharjah coursework and target {currentRole.title} competencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedProjectsList.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl p-5 border border-[#dce6df] shadow-xs flex flex-col justify-between hover:border-emerald-600 transition-all"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded-md bg-[#eef7f1] border border-[#d6ebd9]">
                  {rec.category}
                </span>
                <h3 className="text-base font-bold text-[#11291d] font-serif">
                  {rec.title}
                </h3>
                <p className="text-xs text-[#526e60] leading-relaxed line-clamp-2">
                  {rec.description}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {rec.skillsGained.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-[#f4f7f4] text-[#143825] text-[10px] font-semibold border border-[#dce6df]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleStartRecommendation(rec)}
                className="mt-4 w-full py-2 px-3 rounded-xl border border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Add to My Projects</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Task Checklist Modal */}
      {activeProjectForTasks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f291e]/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e0e7e1] p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded-md bg-[#eef7f1] border border-[#d6ebd9]">
                  Project Task Milestones
                </span>
                <h2 className="text-xl font-bold text-[#11291d] font-serif mt-1">
                  {activeProjectForTasks.title}
                </h2>
                <p className="text-xs text-[#526e60] mt-0.5">
                  Progress: {activeProjectForTasks.progress}% complete
                </p>
              </div>
              <button
                onClick={() => setActiveProjectForTasks(null)}
                className="p-1.5 text-[#8fa89b] hover:text-[#11291d] rounded-lg hover:bg-[#eef4f0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activeProjectForTasks.tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    toggleProjectTask(activeProjectForTasks.id, task.id);
                    setActiveProjectForTasks((prev) => {
                      if (!prev) return null;
                      const updated = prev.tasks.map((t) =>
                        t.id === task.id ? { ...t, completed: !t.completed } : t
                      );
                      const done = updated.filter((t) => t.completed).length;
                      return {
                        ...prev,
                        tasks: updated,
                        progress: Math.round((done / updated.length) * 100),
                      };
                    });
                  }}
                  className="w-full p-3 rounded-xl border border-[#edf2ee] hover:bg-[#fbfdfb] text-left flex items-center justify-between text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[#8fa89b] shrink-0" />
                    )}
                    <span className={task.completed ? 'line-through text-[#8fa89b]' : 'text-[#11291d] font-medium'}>
                      {task.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveProjectForTasks(null)}
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Creation Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f291e]/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e0e7e1] p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#11291d] font-serif">
                  Create a New Project
                </h2>
                <p className="text-xs text-[#526e60] mt-0.5">
                  Plan a research study, clinical protocol, software prototype, or engineering design.
                </p>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-1.5 text-[#8fa89b] hover:text-[#11291d] rounded-lg hover:bg-[#eef4f0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#6b8577] mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Clinical Pediatric Care Quality Audit"
                  className="w-full px-3 py-2 rounded-xl border border-[#ccd9cf] focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#6b8577] mb-1">
                  Core Objective & Summary
                </label>
                <input
                  type="text"
                  value={projectGoal}
                  onChange={(e) => setProjectGoal(e.target.value)}
                  placeholder="What problem does this solve?"
                  className="w-full px-3 py-2 rounded-xl border border-[#ccd9cf] focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#6b8577] mb-1">
                  Skills Strengthened (Comma Separated)
                </label>
                <input
                  type="text"
                  value={projectSkills}
                  onChange={(e) => setProjectSkills(e.target.value)}
                  placeholder="e.g., Clinical Informatics, Triage, Patient Safety"
                  className="w-full px-3 py-2 rounded-xl border border-[#ccd9cf] focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#6b8577] mb-1">
                  Task Milestones (one per line)
                </label>
                <textarea
                  rows={4}
                  value={tasksText}
                  onChange={(e) => setTasksText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#ccd9cf] focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-[#11291d]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#526e60] hover:bg-[#eef4f0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
