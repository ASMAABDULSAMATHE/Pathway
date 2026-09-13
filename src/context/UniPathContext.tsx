import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  StudentProfile,
  Course,
  Opportunity,
  ProjectRecommendation,
  TargetRole,
  TrackedProject,
  CaseStateType,
} from '../types';
import {
  DEMO_STUDENT,
  EMPTY_STUDENT,
  TARGET_ROLES,
} from '../data/mockUniversityData';
import {
  DisciplineExperience,
  getDisciplineExperience,
  GroupedSkillItem,
  CuratedOpportunityItem,
  RoadmapStepItem,
} from '../data/uosDynamicExperience';
import { checkPrerequisites } from '../services/recommendationEngine';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface UniPathContextType {
  student: StudentProfile;
  caseState: CaseStateType;
  isDemoCase: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  selectedOpportunity: Opportunity | null;
  setSelectedOpportunity: (opp: Opportunity | null) => void;
  selectedProject: ProjectRecommendation | null;
  setSelectedProject: (project: ProjectRecommendation | null) => void;
  selectedTrackedProject: TrackedProject | null;
  setSelectedTrackedProject: (project: TrackedProject | null) => void;
  isCreatePathwayModalOpen: boolean;
  setIsCreatePathwayModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Case management
  loadDemoCase: () => void;
  exitDemoCase: () => void;
  createCustomPathway: (data: {
    name: string;
    university: string;
    major: string;
    college?: string;
    yearOfStudy: number;
    interests: string[];
    workingToward: string;
    careerGoal?: string;
  }) => void;

  // Dynamic Discipline-aligned data
  disciplineExp: DisciplineExperience;
  courses: Course[];
  recommendedNextCourses: Course[];
  skillsList: {
    technical: GroupedSkillItem[];
    professional: GroupedSkillItem[];
    domain: GroupedSkillItem[];
  };
  buildNextSkill: {
    name: string;
    description: string;
    targetRoleAlignment: string;
  };
  curatedOpportunities: CuratedOpportunityItem[];
  recommendedProjectsList: ProjectRecommendation[];
  careerRoadmap: RoadmapStepItem[];
  currentRole: TargetRole;

  // Mutators
  updateStudent: (partial: Partial<StudentProfile>) => void;
  updateSkillLevel: (skillName: string, newLevel: number) => void;
  setTargetRole: (roleId: string) => void;
  addCourseToSemester: (semesterId: string, courseId: string) => void;
  removeCourseFromSemester: (semesterId: string, courseId: string) => void;
  toggleCourseCompletion: (courseId: string) => void;
  toggleSaveProject: (projectId: string) => void;
  toggleApplyOpportunity: (oppId: string) => void;
  toggleProjectTask: (projectId: string, taskId: string) => void;
  updateProjectProgress: (projectId: string, progress: number) => void;
  updateProjectStatus: (projectId: string, status: 'planning' | 'in_progress' | 'completed') => void;
  addTrackedProject: (project: TrackedProject) => void;
  resetToDemoStudent: () => void;
}

const UniPathContext = createContext<UniPathContextType | undefined>(undefined);

export const UniPathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // THE APP MUST OPEN ON A BLANK CASE by default
  const [caseState, setCaseState] = useState<CaseStateType>('blank');
  const [student, setStudent] = useState<StudentProfile>(EMPTY_STUDENT);

  // Initialize activeTab based on current URL hash if present
  const getInitialTab = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['dashboard', 'degree', 'skills', 'projects', 'opportunities', 'roadmap', 'problem-solution'];
      if (validTabs.includes(hash)) return hash;
    }
    return 'landing';
  };

  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);

  // Set active tab and synchronize URL hash for multi-page feel
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectRecommendation | null>(null);
  const [selectedTrackedProject, setSelectedTrackedProject] = useState<TrackedProject | null>(null);
  const [isCreatePathwayModalOpen, setIsCreatePathwayModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Determine active discipline experience dynamically
  const disciplineExp = useMemo(() => {
    return getDisciplineExperience(student.major, student.university);
  }, [student.major, student.university]);

  // Current Target Role
  const currentRole = useMemo(() => {
    return (
      disciplineExp.allTargetRoles.find((r) => r.id === student.targetRoleId) ||
      TARGET_ROLES.find((r) => r.id === student.targetRoleId) ||
      disciplineExp.defaultTargetRole
    );
  }, [disciplineExp, student.targetRoleId]);

  // Recommended next courses based on completed courses in the active curriculum
  const recommendedNextCourses = useMemo(() => {
    const completedSet = new Set(student.completedCourseIds || []);
    const currentSet = new Set(student.currentCourseIds || []);

    const uncompleted = disciplineExp.courses.filter(
      (c) => !completedSet.has(c.id) && !currentSet.has(c.id)
    );

    const eligible = uncompleted.filter((c) => {
      const check = checkPrerequisites(
        c,
        student.completedCourseIds || [],
        student.currentCourseIds || []
      );
      return check.isMet;
    });

    if (eligible.length >= 3) {
      return eligible.slice(0, 3);
    }
    return uncompleted.slice(0, 3);
  }, [disciplineExp.courses, student.completedCourseIds, student.currentCourseIds]);

  const loadDemoCase = () => {
    setStudent(DEMO_STUDENT);
    setCaseState('demo');
    setActiveTab('dashboard');
    addToast('Loaded Demo Case: Maya Hassan (Year 2 BIS)', 'info');
  };

  const exitDemoCase = () => {
    setStudent(EMPTY_STUDENT);
    setCaseState('blank');
    setActiveTab('landing');
    addToast('Exited demo. Back to a fresh start.', 'info');
  };

  const createCustomPathway = (data: {
    name: string;
    university: string;
    major: string;
    college?: string;
    yearOfStudy: number;
    interests: string[];
    workingToward: string;
    careerGoal?: string;
  }) => {
    // Resolve discipline for the student's chosen major (and college, when known)
    const targetExp = getDisciplineExperience(data.major, data.college);

    const matchedRole =
      targetExp.allTargetRoles.find(
        (r) =>
          data.careerGoal &&
          r.title.toLowerCase().includes(data.careerGoal.toLowerCase())
      ) || targetExp.defaultTargetRole;

    const totalCredits =
      targetExp.discipline === 'health'
        ? 132
        : targetExp.discipline === 'engineering'
        ? 136
        : 123;

    // Set appropriate completed courses for their year of study
    const completedIds =
      data.yearOfStudy === 1
        ? ['uni101']
        : targetExp.defaultCompletedCourseIds;

    const currentIds =
      data.yearOfStudy === 1
        ? targetExp.courses.slice(1, 4).map((c) => c.id)
        : targetExp.defaultCurrentCourseIds;

    const newStudent: StudentProfile = {
      id: `student_${Date.now()}`,
      name: data.name.trim() || 'Student',
      university: data.university.trim() || 'University of Sharjah',
      degree: 'Bachelor of Science (BSc)',
      major: data.major.trim() || targetExp.collegeName,
      yearOfStudy: data.yearOfStudy || 1,
      currentSemester: `Year ${data.yearOfStudy || 1}, Semester 1`,
      gpa: 3.65,
      totalDegreeCredits: totalCredits,
      completedCourseIds: completedIds,
      currentCourseIds: currentIds,
      plannedSemesters: [
        {
          id: 'sem_next',
          semesterName: 'Upcoming Term',
          year: 2026,
          season: 'Fall',
          courseIds: [],
        },
      ],
      interests: data.interests.length > 0 ? data.interests : ['Clinical Care & Patient Outcomes'],
      careerGoals: data.careerGoal ? [data.careerGoal, data.workingToward] : [data.workingToward],
      targetRoleId: matchedRole.id,
      skills: {},
      savedProjectIds: [],
      appliedOpportunityIds: [],
      trackedProjects: targetExp.trackedProjects,
      isOnboarded: true,
    };

    setStudent(newStudent);
    setCaseState('custom');
    setActiveTab('dashboard');
    setIsCreatePathwayModalOpen(false);
    addToast(`Welcome ${newStudent.name}! Your pathway for ${newStudent.major} is ready.`, 'success');
  };

  const updateStudent = (partial: Partial<StudentProfile>) => {
    setStudent((prev) => ({ ...prev, ...partial }));
  };

  const updateSkillLevel = (skillName: string, newLevel: number) => {
    setStudent((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillName]: Math.min(100, Math.max(0, newLevel)),
      },
    }));
    addToast(`Updated ${skillName} skill rating`, 'info');
  };

  const setTargetRole = (roleId: string) => {
    setStudent((prev) => ({ ...prev, targetRoleId: roleId }));
    const role =
      disciplineExp.allTargetRoles.find((r) => r.id === roleId) ||
      TARGET_ROLES.find((r) => r.id === roleId);
    addToast(`Target role set to ${role?.title ?? roleId}`, 'success');
  };

  const addCourseToSemester = (semesterId: string, courseId: string) => {
    setStudent((prev) => {
      const updatedSemesters = prev.plannedSemesters.map((sem) => {
        if (sem.id === semesterId) {
          if (sem.courseIds.includes(courseId)) return sem;
          return { ...sem, courseIds: [...sem.courseIds, courseId] };
        }
        return sem;
      });
      return { ...prev, plannedSemesters: updatedSemesters };
    });
    addToast(`Course added to semester plan`, 'success');
  };

  const removeCourseFromSemester = (semesterId: string, courseId: string) => {
    setStudent((prev) => {
      const updatedSemesters = prev.plannedSemesters.map((sem) => {
        if (sem.id === semesterId) {
          return { ...sem, courseIds: sem.courseIds.filter((id) => id !== courseId) };
        }
        return sem;
      });
      return { ...prev, plannedSemesters: updatedSemesters };
    });
    addToast(`Course removed from semester plan`, 'info');
  };

  const toggleCourseCompletion = (courseId: string) => {
    setStudent((prev) => {
      const isCompleted = prev.completedCourseIds.includes(courseId);
      const newCompleted = isCompleted
        ? prev.completedCourseIds.filter((id) => id !== courseId)
        : [...prev.completedCourseIds, courseId];
      return { ...prev, completedCourseIds: newCompleted };
    });
    addToast(`Degree progression updated`, 'success');
  };

  const toggleSaveProject = (projectId: string) => {
    setStudent((prev) => {
      const isSaved = prev.savedProjectIds.includes(projectId);
      const newSaved = isSaved
        ? prev.savedProjectIds.filter((id) => id !== projectId)
        : [...prev.savedProjectIds, projectId];
      return { ...prev, savedProjectIds: newSaved };
    });
    addToast(`Project bookmark updated`, 'info');
  };

  const toggleApplyOpportunity = (oppId: string) => {
    setStudent((prev) => {
      const isApplied = prev.appliedOpportunityIds.includes(oppId);
      const newApplied = isApplied
        ? prev.appliedOpportunityIds.filter((id) => id !== oppId)
        : [...prev.appliedOpportunityIds, oppId];
      return { ...prev, appliedOpportunityIds: newApplied };
    });
    addToast(`Opportunity tracking updated`, 'success');
  };

  const toggleProjectTask = (projectId: string, taskId: string) => {
    setStudent((prev) => {
      const updatedProjects = prev.trackedProjects.map((p) => {
        if (p.id !== projectId) return p;
        const updatedTasks = p.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const calcProgress = Math.round((completedCount / updatedTasks.length) * 100);
        const newStatus: 'planning' | 'in_progress' | 'completed' =
          calcProgress === 100 ? 'completed' : calcProgress > 0 ? 'in_progress' : 'planning';
        return {
          ...p,
          tasks: updatedTasks,
          progress: calcProgress,
          status: newStatus,
        };
      });
      return { ...prev, trackedProjects: updatedProjects };
    });
  };

  const updateProjectProgress = (projectId: string, progress: number) => {
    setStudent((prev) => {
      const updatedProjects = prev.trackedProjects.map((p) => {
        if (p.id !== projectId) return p;
        const newStatus: 'planning' | 'in_progress' | 'completed' =
          progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'planning';
        return {
          ...p,
          progress,
          status: newStatus,
        };
      });
      return { ...prev, trackedProjects: updatedProjects };
    });
  };

  const updateProjectStatus = (projectId: string, status: 'planning' | 'in_progress' | 'completed') => {
    setStudent((prev) => {
      const updatedProjects = prev.trackedProjects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          status,
          progress: status === 'completed' ? 100 : status === 'planning' ? 0 : p.progress,
        };
      });
      return { ...prev, trackedProjects: updatedProjects };
    });
    addToast(`Project status updated to ${status.replace('_', ' ')}`, 'info');
  };

  const addTrackedProject = (project: TrackedProject) => {
    setStudent((prev) => ({
      ...prev,
      trackedProjects: [project, ...prev.trackedProjects],
    }));
    addToast(`Added project "${project.title}" to your active tracker`, 'success');
  };

  const resetToDemoStudent = () => {
    loadDemoCase();
  };

  return (
    <UniPathContext.Provider
      value={{
        student,
        caseState,
        isDemoCase: caseState === 'demo',
        activeTab,
        setActiveTab,
        selectedCourse,
        setSelectedCourse,
        selectedOpportunity,
        setSelectedOpportunity,
        selectedProject,
        setSelectedProject,
        selectedTrackedProject,
        setSelectedTrackedProject,
        isCreatePathwayModalOpen,
        setIsCreatePathwayModalOpen,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        loadDemoCase,
        exitDemoCase,
        createCustomPathway,
        disciplineExp,
        courses: disciplineExp.courses,
        recommendedNextCourses,
        skillsList: disciplineExp.skills,
        buildNextSkill: disciplineExp.buildNextSkill,
        curatedOpportunities: disciplineExp.opportunities,
        recommendedProjectsList: disciplineExp.recommendedProjects,
        careerRoadmap: disciplineExp.roadmapSteps,
        currentRole,
        updateStudent,
        updateSkillLevel,
        setTargetRole,
        addCourseToSemester,
        removeCourseFromSemester,
        toggleCourseCompletion,
        toggleSaveProject,
        toggleApplyOpportunity,
        toggleProjectTask,
        updateProjectProgress,
        updateProjectStatus,
        addTrackedProject,
        resetToDemoStudent,
      }}
    >
      {children}
    </UniPathContext.Provider>
  );
};

export const useUniPath = () => {
  const context = useContext(UniPathContext);
  if (!context) {
    throw new Error('useUniPath must be used within a UniPathProvider');
  }
  return context;
};