import React, { useState, useEffect } from 'react';
import { UniPathProvider, useUniPath } from './context/UniPathContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { LandingView } from './components/landing/LandingView';
import { DegreePlannerView } from './components/planner/DegreePlannerView';
import { SkillsView } from './components/skills/SkillsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { CareerRoadmapView } from './components/roadmap/CareerRoadmapView';
import { ProblemSolutionView } from './components/presentation/ProblemSolutionView';

// Modals & Feedback
import { SetupPathwayModal } from './components/onboarding/SetupPathwayModal';
import { CourseModal } from './components/common/CourseModal';
import { OpportunityModal } from './components/common/OpportunityModal';
import { ProjectModal } from './components/common/ProjectModal';
import { ToastContainer } from './components/common/ToastContainer';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    caseState,
    selectedCourse,
    setSelectedCourse,
    selectedOpportunity,
    setSelectedOpportunity,
    selectedProject,
    setSelectedProject,
  } = useUniPath();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Synchronize hash with active tab to support browser history and multi-page routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = [
        'dashboard',
        'degree',
        'skills',
        'projects',
        'opportunities',
        'roadmap',
        'problem-solution',
        'landing',
      ];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActiveTab]);

  const renderActiveView = () => {
    // When in blank case on the dashboard or landing, present the clean LandingView
    if (caseState === 'blank' && (activeTab === 'landing' || activeTab === 'dashboard')) {
      return <LandingView />;
    }

    switch (activeTab) {
      case 'landing':
        return <LandingView />;
      case 'dashboard':
        return <DashboardView />;
      case 'degree':
      case 'planner':
      case 'courses':
      case 'prerequisites':
      case 'specializations':
        return <DegreePlannerView />;
      case 'skills':
      case 'skill-gaps':
        return <SkillsView />;
      case 'projects':
        return <ProjectsView />;
      case 'opportunities':
        return <OpportunitiesView />;
      case 'roadmap':
        return <CareerRoadmapView />;
      case 'problem-solution':
        return <ProblemSolutionView />;
      default:
        return caseState === 'blank' ? <LandingView /> : <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f4f7f4] overflow-hidden font-sans text-[#11291d] antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        setIsOpenMobile={setIsMobileMenuOpen}
      />

      {/* Main Multi-Page Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          <div key={activeTab} className="transition-opacity duration-200 ease-in-out">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Pathway Setup Modal (3-step UOS College & Major Onboarding) */}
      <SetupPathwayModal />

      {/* Progressive Disclosure Course Details Modal */}
      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />

      <OpportunityModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <UniPathProvider>
      <AppContent />
    </UniPathProvider>
  );
}