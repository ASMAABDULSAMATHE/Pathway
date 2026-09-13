export type WorkloadLevel = 'Low' | 'Medium' | 'High';

export type CourseStatus = 'completed' | 'enrolled' | 'planned' | 'eligible' | 'locked';

export type CourseCategoryType = 
  | 'University Requirements'
  | 'College Requirements'
  | 'Major Core'
  | 'Business Core'
  | 'Major Electives';

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
  level: number; // 100, 200, 300, 400
  description: string;
  prerequisites: string[]; // Course IDs or codes
  workload: WorkloadLevel;
  difficultyRating: number; // 1 to 5
  skillsDeveloped: string[];
  specializations: string[];
  recommendedSemester?: number;
  syllabusHighlights?: string[];
  isMajorRequirement?: boolean;
  isCoreRequirement?: boolean;
  categoryType?: CourseCategoryType;
}

export type SkillCategory = 'Business & Systems' | 'Data & Analytics' | 'Technical & Tools' | 'Management & Communication' | 'Domain Knowledge';

export type SkillProficiencyLevel = 'Developing' | 'Working knowledge' | 'Strong';

export type OpportunityMatchTier = 'Strong match' | 'Good match' | 'Worth exploring';

export type CaseStateType = 'blank' | 'demo' | 'custom';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 0 to 100 (self-reported/estimated)
  associatedCourses: string[];
  associatedProjects: string[];
}

export interface TargetRole {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: { skillName: string; recommendedLevel: number }[];
  preferredCourses: string[];
  averageStartingSalary?: string;
  industrySectors: string[];
}

export interface SpecializationPath {
  id: string;
  title: string;
  description: string;
  category: string;
  matchScore: number;
  matchReasons: string[];
  requiredCourses: string[];
  recommendedElectives: string[];
  requiredSkills: string[];
  potentialProjects: string[];
  careerRoles: string[];
  researchAreas: string[];
  internshipOpportunities: string[];
  pathwaySequence: string[]; // sequence of course codes/titles for the flow diagram
}

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TrackedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed';
  progress: number; // 0 to 100
  targetRoleAlignment: string;
  skillsStrengthened: string[];
  tasks: ProjectTask[];
  estimatedHours: number;
  startDate?: string;
  targetCompletionDate?: string;
  portfolioUrl?: string;
  keyDeliverable: string;
  reflectionNotes?: string;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  skillsGained: string[];
  prerequisiteSkills: string[];
  addressesGapForRole?: string;
  deliverables: string[];
  githubTemplateUrl?: string;
}

export type OpportunityType = 'Internship' | 'Undergraduate Research' | 'Summer Program' | 'Lab Assistant' | 'Competition' | 'Certification';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: OpportunityType;
  field: string;
  duration: string;
  deadline: string;
  stipend?: string;
  description: string;
  requiredSkills: string[];
  preferredCourses: string[];
  applicationUrl?: string;
}

export interface SemesterPlan {
  id: string;
  semesterName: string; // e.g., "Fall 2026", "Spring 2027"
  year: number;
  season: 'Fall' | 'Spring' | 'Summer';
  isCurrent?: boolean;
  courseIds: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  university: string;
  degree: string;
  major: string;
  yearOfStudy: number;
  currentSemester: string;
  gpa: number;
  totalDegreeCredits: number;
  completedCourseIds: string[];
  currentCourseIds: string[];
  plannedSemesters: SemesterPlan[];
  interests: string[];
  careerGoals: string[];
  targetRoleId: string;
  skills: Record<string, number>; // skillName -> level 0-100
  savedProjectIds: string[];
  appliedOpportunityIds: string[];
  trackedProjects: TrackedProject[];
  isOnboarded: boolean;
}

export interface CourseRecommendation {
  course: Course;
  matchScore: number;
  reasons: string[];
  isPrereqMet: boolean;
  missingPrereqs: string[];
  workloadConflictWarning?: string;
}

export interface NextBestAction {
  id: string;
  type: 'course' | 'skill' | 'project' | 'opportunity' | 'warning';
  title: string;
  subtitle: string;
  relevanceScore: number;
  relevanceLabel: string;
  actionText: string;
  targetView: string;
  targetId?: string;
  tags: string[];
}

export interface SkillGapItem {
  skillName: string;
  currentLevel: number;
  recommendedLevel: number;
  gap: number;
  importance: 'Critical' | 'High' | 'Medium';
  recommendedCourses: string[];
  recommendedProjects: string[];
}
