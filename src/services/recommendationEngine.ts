import {
  Course,
  StudentProfile,
  CourseRecommendation,
  NextBestAction,
  SkillGapItem,
  TargetRole,
  SpecializationPath,
  Opportunity,
  WorkloadLevel,
} from '../types';
import {
  ALL_COURSES,
  TARGET_ROLES,
  SPECIALIZATION_PATHS,
  ALL_OPPORTUNITIES,
  PROJECT_RECOMMENDATIONS,
} from '../data/mockUniversityData';

export function getCourseById(idOrCode: string): Course | undefined {
  return ALL_COURSES.find(
    (c) => c.id.toLowerCase() === idOrCode.toLowerCase() || c.code.toLowerCase() === idOrCode.toLowerCase()
  );
}

/**
 * Checks prerequisite eligibility for a course given completed and enrolled courses.
 */
export function checkPrerequisites(
  course: Course,
  completedCourseIds: string[],
  enrolledCourseIds: string[] = []
): { isMet: boolean; missing: string[]; metList: string[] } {
  const allAvailable = new Set([...completedCourseIds, ...enrolledCourseIds]);
  const missing: string[] = [];
  const metList: string[] = [];

  for (const prereqId of course.prerequisites) {
    const prereqCourse = getCourseById(prereqId);
    const prereqName = prereqCourse ? prereqCourse.name : prereqId;
    if (allAvailable.has(prereqId) || (prereqCourse && allAvailable.has(prereqCourse.id))) {
      metList.push(prereqName);
    } else {
      missing.push(prereqName);
    }
  }

  return {
    isMet: missing.length === 0,
    missing,
    metList,
  };
}

/**
 * Evaluates courses and produces scored recommendations with transparent explanations.
 */
export function generateCourseRecommendations(student: StudentProfile): CourseRecommendation[] {
  const targetRole = TARGET_ROLES.find((r) => r.id === student.targetRoleId) || TARGET_ROLES[0];
  const completedSet = new Set(student.completedCourseIds);
  const currentSet = new Set(student.currentCourseIds);

  const activeSpecializations = SPECIALIZATION_PATHS.filter((p) =>
    student.interests.some((interest) => p.title.toLowerCase().includes(interest.toLowerCase()))
  );

  const recommendations: CourseRecommendation[] = [];

  for (const course of ALL_COURSES) {
    // Skip already completed or currently taking
    if (completedSet.has(course.id) || currentSet.has(course.id)) {
      continue;
    }

    let score = 30; // base score
    const reasons: string[] = [];

    // 1. Prerequisite Eligibility
    const prereqCheck = checkPrerequisites(course, student.completedCourseIds, student.currentCourseIds);
    if (prereqCheck.isMet) {
      score += 25;
      if (prereqCheck.metList.length > 0) {
        reasons.push(`You completed prerequisite: ${prereqCheck.metList.slice(0, 2).join(' & ')}`);
      } else {
        reasons.push('No prerequisites required; immediately accessible');
      }
    } else {
      score -= 25;
      reasons.push(`Prerequisites pending (${prereqCheck.missing.join(', ')})`);
    }

    // 2. Degree Requirement
    if (course.isMajorRequirement || course.isCoreRequirement) {
      score += 15;
      reasons.push(`Core graduation requirement for ${student.major}`);
    }

    // 3. Career Goal & Target Role Relevance
    const matchesTargetRole = targetRole.preferredCourses.some((pc) =>
      course.id.toLowerCase() === pc.toLowerCase() || course.code.toLowerCase() === pc.toLowerCase()
    );
    if (matchesTargetRole) {
      score += 20;
      reasons.push(`Directly recommended for your target role: ${targetRole.title}`);
    }

    // 4. Specialization Relevance
    const matchedSpec = activeSpecializations.find((s) =>
      s.requiredCourses.some((rc) => course.id === rc || course.code === rc)
    );
    if (matchedSpec) {
      score += 15;
      reasons.push(`Required for your ${matchedSpec.title} pathway`);
    }

    // 5. Skill Gap Addressing
    for (const skillName of course.skillsDeveloped) {
      const currentLevel = student.skills[skillName] ?? 0;
      const roleReq = targetRole.requiredSkills.find((rs) => rs.skillName.toLowerCase() === skillName.toLowerCase());
      if (roleReq && currentLevel < roleReq.recommendedLevel) {
        score += 10;
        reasons.push(`Develops ${skillName} (currently estimated at ${currentLevel}%, recommended: ${roleReq.recommendedLevel}%)`);
        break;
      }
    }

    // 6. Interest Match
    const interestOverlap = student.interests.some((interest) =>
      course.description.toLowerCase().includes(interest.toLowerCase()) ||
      course.specializations.some((s) => s.toLowerCase().includes(interest.toLowerCase()))
    );
    if (interestOverlap) {
      score += 10;
    }

    // Clamp score between 20 and 99
    const normalizedScore = Math.min(99, Math.max(25, Math.round(score)));

    recommendations.push({
      course,
      matchScore: normalizedScore,
      reasons: reasons.slice(0, 4),
      isPrereqMet: prereqCheck.isMet,
      missingPrereqs: prereqCheck.missing,
    });
  }

  // Sort by highest match score and prerequisite satisfaction
  return recommendations.sort((a, b) => {
    if (a.isPrereqMet !== b.isPrereqMet) {
      return a.isPrereqMet ? -1 : 1;
    }
    return b.matchScore - a.matchScore;
  });
}

/**
 * Calculates Skill Gaps for the student's selected target role.
 */
export function analyzeSkillGaps(student: StudentProfile): {
  targetRole: TargetRole;
  gaps: SkillGapItem[];
  highestPriorityGap: SkillGapItem | null;
  overallMatchScore: number;
} {
  const targetRole = TARGET_ROLES.find((r) => r.id === student.targetRoleId) || TARGET_ROLES[0];
  const gaps: SkillGapItem[] = [];

  let totalWeightedScore = 0;
  let totalWeights = 0;

  for (const req of targetRole.requiredSkills) {
    const current = student.skills[req.skillName] ?? 25; // baseline estimation
    const target = req.recommendedLevel;
    const gap = Math.max(0, target - current);

    let importance: 'Critical' | 'High' | 'Medium' = 'Medium';
    if (gap >= 35) importance = 'Critical';
    else if (gap >= 15) importance = 'High';

    // Find courses that teach this
    const relevantCourses = ALL_COURSES.filter((c) =>
      c.skillsDeveloped.some((s) => s.toLowerCase().includes(req.skillName.toLowerCase()))
    ).map((c) => `${c.code} (${c.name.split('(')[0].trim()})`);

    // Find projects that address this
    const relevantProjects = PROJECT_RECOMMENDATIONS.filter((p) =>
      p.skillsGained.some((s) => s.toLowerCase().includes(req.skillName.toLowerCase()))
    ).map((p) => p.title);

    gaps.push({
      skillName: req.skillName,
      currentLevel: current,
      recommendedLevel: target,
      gap,
      importance,
      recommendedCourses: relevantCourses.slice(0, 2),
      recommendedProjects: relevantProjects.slice(0, 2),
    });

    const weight = importance === 'Critical' ? 3 : importance === 'High' ? 2 : 1;
    const skillMatchRatio = Math.min(1, current / target);
    totalWeightedScore += skillMatchRatio * weight;
    totalWeights += weight;
  }

  // Sort gaps so largest/critical gaps come first
  gaps.sort((a, b) => b.gap - a.gap);

  const highestPriorityGap = gaps.length > 0 && gaps[0].gap > 0 ? gaps[0] : null;
  const overallMatchScore = totalWeights > 0 ? Math.round((totalWeightedScore / totalWeights) * 100) : 70;

  return {
    targetRole,
    gaps,
    highestPriorityGap,
    overallMatchScore,
  };
}

/**
 * Generates Top 4 Next Best Actions for student dashboard.
 */
export function generateNextBestActions(student: StudentProfile): NextBestAction[] {
  const actions: NextBestAction[] = [];
  const { highestPriorityGap, targetRole } = analyzeSkillGaps(student);
  const courseRecs = generateCourseRecommendations(student);
  const topCourse = courseRecs.find((c) => c.isPrereqMet);

  // 1. Top Course action
  if (topCourse) {
    actions.push({
      id: 'nba_course',
      type: 'course',
      title: `Take ${topCourse.course.name.split('(')[0].trim()} (${topCourse.course.code})`,
      subtitle: `${topCourse.matchScore}% relevance • All prerequisites met`,
      relevanceScore: topCourse.matchScore,
      relevanceLabel: `${topCourse.matchScore}% relevance`,
      actionText: 'Add to Plan',
      targetView: 'planner',
      targetId: topCourse.course.id,
      tags: [topCourse.course.department, `${topCourse.course.credits} Credits`],
    });
  }

  // 2. Skill Gap action
  if (highestPriorityGap) {
    actions.push({
      id: 'nba_skill',
      type: 'skill',
      title: `Close skill gap in ${highestPriorityGap.skillName}`,
      subtitle: `Current: ${highestPriorityGap.currentLevel}% → Target: ${highestPriorityGap.recommendedLevel}% for ${targetRole.title}`,
      relevanceScore: 89,
      relevanceLabel: 'High Priority Gap',
      actionText: 'View Action Plan',
      targetView: 'skill-gaps',
      tags: ['Estimated Gap', `${highestPriorityGap.gap}% to target`],
    });
  }

  // 3. Project recommendation
  const recommendedProject = PROJECT_RECOMMENDATIONS.find((p) =>
    highestPriorityGap ? p.skillsGained.includes(highestPriorityGap.skillName) : true
  ) || PROJECT_RECOMMENDATIONS[0];

  actions.push({
    id: 'nba_project',
    type: 'project',
    title: `Build "${recommendedProject.title}"`,
    subtitle: `Hands-on project gaining ${recommendedProject.skillsGained.slice(0, 3).join(', ')}`,
    relevanceScore: 84,
    relevanceLabel: 'Portfolio Project',
    actionText: 'Explore Project',
    targetView: 'projects',
    targetId: recommendedProject.id,
    tags: [recommendedProject.category, recommendedProject.difficulty],
  });

  // 4. Opportunity matching
  const matchedOpp = ALL_OPPORTUNITIES[0];
  actions.push({
    id: 'nba_opp',
    type: 'opportunity',
    title: `Apply for ${matchedOpp.title}`,
    subtitle: `${matchedOpp.organization} • Deadline: ${matchedOpp.deadline}`,
    relevanceScore: 78,
    relevanceLabel: 'Opportunity Match',
    actionText: 'Review Match',
    targetView: 'opportunities',
    targetId: matchedOpp.id,
    tags: [matchedOpp.field, matchedOpp.type],
  });

  return actions;
}

/**
 * Calculates Opportunity Match Score & Breakdown
 */
export function calculateOpportunityMatch(
  opp: Opportunity,
  student: StudentProfile
): { matchScore: number; matchedSkills: string[]; missingSkills: string[] } {
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const reqSkill of opp.requiredSkills) {
    const studentSkillLevel = student.skills[reqSkill] ?? 0;
    if (studentSkillLevel >= 50) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  }

  // Check preferred courses
  const completedAndCurrent = new Set([...student.completedCourseIds, ...student.currentCourseIds]);
  let courseMatchCount = 0;
  for (const pCourseCode of opp.preferredCourses) {
    const course = getCourseById(pCourseCode);
    if (course && completedAndCurrent.has(course.id)) {
      courseMatchCount++;
    }
  }

  const skillScore = opp.requiredSkills.length > 0 ? (matchedSkills.length / opp.requiredSkills.length) * 60 : 60;
  const courseScore = opp.preferredCourses.length > 0 ? (courseMatchCount / opp.preferredCourses.length) * 30 : 30;
  const gpaBonus = student.gpa >= 3.5 ? 10 : 5;

  const rawScore = Math.round(skillScore + courseScore + gpaBonus);
  const matchScore = Math.min(98, Math.max(35, rawScore));

  return {
    matchScore,
    matchedSkills,
    missingSkills,
  };
}

/**
 * Evaluates semester workload and warns on overload.
 */
export function evaluateSemesterWorkload(courseIds: string[]): {
  totalCredits: number;
  workloadScore: number;
  workloadRating: 'Low' | 'Moderate' | 'Moderate–High' | 'Heavy' | 'Overloaded';
  highWorkloadCourses: Course[];
  alertMessage?: string;
} {
  let totalCredits = 0;
  let workloadSum = 0;
  const highWorkloadCourses: Course[] = [];

  for (const cid of courseIds) {
    const course = getCourseById(cid);
    if (!course) continue;
    totalCredits += course.credits;

    if (course.workload === 'High') {
      workloadSum += 3.5;
      highWorkloadCourses.push(course);
    } else if (course.workload === 'Medium') {
      workloadSum += 2.0;
    } else {
      workloadSum += 1.0;
    }
  }

  let workloadRating: 'Low' | 'Moderate' | 'Moderate–High' | 'Heavy' | 'Overloaded' = 'Moderate';
  let alertMessage: string | undefined = undefined;

  if (workloadSum >= 11 || highWorkloadCourses.length >= 3 || totalCredits > 17) {
    workloadRating = 'Overloaded';
    alertMessage = `⚠️ This semester contains ${highWorkloadCourses.length} high-workload courses (${highWorkloadCourses.map((c) => c.code).join(', ')}). Consider distributing one course to another term to safeguard academic performance.`;
  } else if (workloadSum >= 8.5 || highWorkloadCourses.length === 2 || totalCredits >= 15) {
    workloadRating = 'Moderate–High';
  } else if (workloadSum >= 5) {
    workloadRating = 'Moderate';
  } else {
    workloadRating = 'Low';
  }

  return {
    totalCredits,
    workloadScore: Math.round(workloadSum * 10) / 10,
    workloadRating,
    highWorkloadCourses,
    alertMessage,
  };
}

/**
 * Calculates student's degree progress metrics.
 */
export function calculateDegreeProgress(student: StudentProfile): {
  creditsCompleted: number;
  creditsEnrolled: number;
  creditsRemaining: number;
  percentCompleted: number;
  requiredCoursesPercent: number;
  majorRequirementsPercent: number;
  electivesPercent: number;
  estimatedGraduationSemester: string;
} {
  let creditsCompleted = 0;
  let requiredCompleted = 0;
  let totalRequired = 0;
  let majorCompleted = 0;
  let totalMajor = 0;

  for (const course of ALL_COURSES) {
    const isCompleted = student.completedCourseIds.includes(course.id);
    if (isCompleted) {
      creditsCompleted += course.credits;
    }
    if (course.isCoreRequirement) {
      totalRequired++;
      if (isCompleted) requiredCompleted++;
    }
    if (course.isMajorRequirement) {
      totalMajor++;
      if (isCompleted) majorCompleted++;
    }
  }

  let creditsEnrolled = 0;
  for (const cid of student.currentCourseIds) {
    const c = getCourseById(cid);
    if (c) creditsEnrolled += c.credits;
  }

  const creditsRemaining = Math.max(0, student.totalDegreeCredits - creditsCompleted);
  const percentCompleted = Math.min(100, Math.round((creditsCompleted / student.totalDegreeCredits) * 100));
  const requiredCoursesPercent = totalRequired > 0 ? Math.round((requiredCompleted / totalRequired) * 100) : 80;
  const majorRequirementsPercent = totalMajor > 0 ? Math.round((majorCompleted / totalMajor) * 100) : 65;
  const electivesPercent = 40; // realistic progress for Year 2

  return {
    creditsCompleted,
    creditsEnrolled,
    creditsRemaining,
    percentCompleted,
    requiredCoursesPercent,
    majorRequirementsPercent,
    electivesPercent,
    estimatedGraduationSemester: 'Spring 2028',
  };
}
