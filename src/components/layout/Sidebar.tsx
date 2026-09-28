import React from 'react';
import { usePlacement } from '../../context/PlacementContext';
import {
  Briefcase,
  GitPullRequest,
  Users,
  BarChart3,
  Sparkles,
  Bell,
  Code2,
  CheckCircle,
  FileCheck2,
  HelpCircle,
} from 'lucide-react';

export type ActiveTab =
  | 'drives'
  | 'pipeline'
  | 'students'
  | 'analytics'
  | 'ai-suite'
  | 'notices'
  | 'assessments'
  | 'student-hub';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role, applications, drives, notices, activeStudent } = usePlacement();

  const myApplicationsCount = applications.filter((a) => a.studentId === activeStudent.id).length;
  const pendingRoundsCount = applications.filter((a) => a.overallStatus === 'In Interview Rounds').length;

  const adminNavItems: { id: ActiveTab; label: string; icon: any; badge?: string | number }[] = [
    { id: 'drives', label: 'Recruitment Drives', icon: Briefcase, badge: drives.length },
    { id: 'pipeline', label: 'Rounds Pipeline', icon: GitPullRequest, badge: pendingRoundsCount },
    { id: 'students', label: 'Student Roster', icon: Users },
    { id: 'analytics', label: 'Placement Statistics', icon: BarChart3 },
    { id: 'ai-suite', label: 'AI Placement Suite', icon: Sparkles, badge: 'AI' },
    { id: 'notices', label: 'Circulars & Notices', icon: Bell, badge: notices.length },
    { id: 'assessments', label: 'Online Assessments', icon: Code2 },
  ];

  const studentNavItems: { id: ActiveTab; label: string; icon: any; badge?: string | number }[] = [
    { id: 'student-hub', label: 'My Placement Hub', icon: FileCheck2, badge: myApplicationsCount },
    { id: 'drives', label: 'Explore Drives', icon: Briefcase, badge: drives.length },
    { id: 'ai-suite', label: 'AI Resume & Prep', icon: Sparkles, badge: 'AI' },
    { id: 'assessments', label: 'Practice Tests', icon: Code2 },
    { id: 'notices', label: 'Notices & Circulars', icon: Bell, badge: notices.length },
  ];

  const navItems = role === 'student' ? studentNavItems : adminNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden lg:flex lg:flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Navigation Category */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {role === 'student' ? 'Student Workspace' : 'Placement Cell Ops'}
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-slate-800 text-slate-200'
                          : item.badge === 'AI'
                          ? 'bg-sky-100 text-sky-800 font-bold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tier Classification Reference */}
        <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/70">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Placement Tiers</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="flex justify-between">
              <span className="font-medium text-purple-700">Super Dream</span>
              <span className="font-mono text-slate-500">&gt; 18.0 LPA</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-sky-700">Dream</span>
              <span className="font-mono text-slate-500">10.0 - 18.0 LPA</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-amber-700">Core</span>
              <span className="font-mono text-slate-500">6.0 - 10.0 LPA</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Standard / Mass</span>
              <span className="font-mono text-slate-500">&lt; 6.0 LPA</span>
            </div>
          </div>
        </div>
      </div>

      {/* College Placement Advisory Helpline */}
      <div className="border-t border-slate-100 pt-4 px-1">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="leading-tight">
            <p className="font-semibold text-slate-800">TPO Support Desk</p>
            <p className="text-[11px] text-slate-400">Auditorium Block · Room 102</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
