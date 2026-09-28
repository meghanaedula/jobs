/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlacementProvider, usePlacement } from './context/PlacementContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { DriveList } from './components/drives/DriveList';
import { ApplicationsPipeline } from './components/pipeline/ApplicationsPipeline';
import { StudentRoster } from './components/students/StudentRoster';
import { PlacementAnalytics } from './components/analytics/PlacementAnalytics';
import { AiCareerSuite } from './components/ai/AiCareerSuite';
import { NoticeBoard } from './components/notices/NoticeBoard';
import { AssessmentHub } from './components/assessments/AssessmentHub';
import { StudentDashboard } from './components/student-portal/StudentDashboard';
import { CompanyDrive, Student } from './types';

const MainContent: React.FC = () => {
  const { role } = usePlacement();
  const [activeTab, setActiveTab] = useState<ActiveTab>(role === 'student' ? 'student-hub' : 'drives');

  // Pre-filled targets for AI tools
  const [aiTargetDrive, setAiTargetDrive] = useState<CompanyDrive | null>(null);
  const [aiTargetStudent, setAiTargetStudent] = useState<Student | null>(null);

  // Sync default tab if role changes
  useEffect(() => {
    if (role === 'student' && activeTab !== 'ai-suite' && activeTab !== 'assessments' && activeTab !== 'notices' && activeTab !== 'drives') {
      setActiveTab('student-hub');
    } else if (role !== 'student' && activeTab === 'student-hub') {
      setActiveTab('drives');
    }
  }, [role]);

  const handleOpenAiPrep = (drive: CompanyDrive) => {
    setAiTargetDrive(drive);
    setActiveTab('ai-suite');
  };

  const handleRunAtsScan = (student: Student) => {
    setAiTargetStudent(student);
    setActiveTab('ai-suite');
  };

  const handleOpenAiDrafter = () => {
    setActiveTab('ai-suite');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      {/* Top Collegiate Header */}
      <Navbar onOpenAiSuite={() => setActiveTab('ai-suite')} />

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'student-hub' && (
            <StudentDashboard
              onOpenAiSuite={() => setActiveTab('ai-suite')}
              onOpenExploreDrives={() => setActiveTab('drives')}
              onOpenAiPrep={handleOpenAiPrep}
            />
          )}

          {activeTab === 'drives' && <DriveList onOpenAiPrep={handleOpenAiPrep} />}

          {activeTab === 'pipeline' && (
            <ApplicationsPipeline onOpenAiPrep={handleOpenAiPrep} />
          )}

          {activeTab === 'students' && (
            <StudentRoster onRunAtsScan={handleRunAtsScan} />
          )}

          {activeTab === 'analytics' && <PlacementAnalytics />}

          {activeTab === 'ai-suite' && (
            <AiCareerSuite
              initialDrive={aiTargetDrive}
              initialStudent={aiTargetStudent}
            />
          )}

          {activeTab === 'notices' && (
            <NoticeBoard onOpenAiDrafter={handleOpenAiDrafter} />
          )}

          {activeTab === 'assessments' && <AssessmentHub />}
        </main>
      </div>

      {/* Global Interactive Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PlacementProvider>
      <MainContent />
    </PlacementProvider>
  );
}
