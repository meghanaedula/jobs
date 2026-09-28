import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  ShieldCheck,
  Briefcase,
  Users,
  Bell,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  onOpenAiSuite: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAiSuite }) => {
  const {
    role,
    setRole,
    activeStudent,
    students,
    setActiveStudentId,
    notices,
    drives,
    resetAllData,
  } = usePlacement();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showStudentMenu, setShowStudentMenu] = useState(false);
  const [showNoticesMenu, setShowNoticesMenu] = useState(false);

  const activeDrivesCount = drives.filter((d) => d.status === 'Applications Open' || d.status === 'Ongoing Drive').length;
  const placedCount = students.filter((s) => s.status === 'Placed').length;
  const placementRate = Math.round((placedCount / students.length) * 100);

  const roleMeta: Record<UserRole, { label: string; icon: any; desc: string }> = {
    tpo_admin: {
      label: 'TPO Director (Admin)',
      icon: ShieldCheck,
      desc: 'Placement Cell Chief Officer',
    },
    student: {
      label: 'Student Portal',
      icon: GraduationCap,
      desc: `${activeStudent.name} (${activeStudent.rollNumber})`,
    },
    recruiter: {
      label: 'Corporate Recruiter',
      icon: Briefcase,
      desc: 'Google / Microsoft Partner',
    },
    faculty: {
      label: 'Faculty Coordinator',
      icon: Users,
      desc: 'Dept. Placement Mentor',
    },
  };

  const CurrentRoleIcon = roleMeta[role].icon;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & College Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="tracking-tighter">NP</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base tracking-tight">NexPlacement</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  TPO Central
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Apex Institute of Technology &middot; Directorate of Campus Recruitment
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar (Quiet unboxed text) */}
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-600 border-x border-slate-100 px-6">
            <div>
              <span className="text-slate-400">Active Drives:</span>{' '}
              <span className="font-semibold text-slate-900">{activeDrivesCount}</span>
            </div>
            <div>
              <span className="text-slate-400">Placed:</span>{' '}
              <span className="font-semibold text-emerald-700">{placedCount}/{students.length} ({placementRate}%)</span>
            </div>
            <div>
              <span className="text-slate-400">Batch:</span>{' '}
              <span className="font-medium text-slate-800">2023-2027 Final Year</span>
            </div>
          </div>

          {/* Controls: AI Button, Notifications, Role Switcher */}
          <div className="flex items-center gap-3">
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAiSuite}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>AI Placement Tools</span>
            </button>

            {/* Circulars / Notice Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNoticesMenu(!showNoticesMenu)}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="View Placement Circulars"
              >
                <Bell className="w-4 h-4" />
                {notices.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                )}
              </button>

              {showNoticesMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Official Circulars ({notices.length})
                    </span>
                    <span className="text-[11px] text-slate-400">TPO Notice Board</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notices.slice(0, 4).map((not) => (
                      <div key={not.id} className="p-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-mono text-slate-700">{not.circularNumber}</span>
                          <span>{not.date}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-900 mt-1 line-clamp-1">{not.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {not.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Student Switcher (If in student role) */}
            {role === 'student' && (
              <div className="relative">
                <button
                  onClick={() => setShowStudentMenu(!showStudentMenu)}
                  className="flex items-center gap-2 px-2.5 py-1 text-xs border border-slate-200 rounded-lg hover:border-slate-300 bg-slate-50 transition-colors"
                  title="Switch Mock Student"
                >
                  <img
                    src={activeStudent.avatar}
                    alt={activeStudent.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-medium text-slate-800 max-w-[90px] truncate">{activeStudent.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showStudentMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Simulate as Candidate
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {students.map((std) => (
                        <button
                          key={std.id}
                          onClick={() => {
                            setActiveStudentId(std.id);
                            setShowStudentMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 flex items-center gap-2.5 text-xs hover:bg-slate-50 transition-colors ${
                            std.id === activeStudent.id ? 'bg-sky-50 text-sky-900 font-medium' : 'text-slate-700'
                          }`}
                        >
                          <img
                            src={std.avatar}
                            alt={std.name}
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold truncate">{std.name}</span>
                              <span className="font-mono text-[11px] text-slate-500">CGPA {std.cgpa}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {std.branch.split(' ')[0]} &middot; {std.status}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
              >
                <CurrentRoleIcon className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">{roleMeta[role].label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Switch Perspective
                  </div>
                  {(['tpo_admin', 'student', 'recruiter', 'faculty'] as UserRole[]).map((r) => {
                    const item = roleMeta[r];
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          setRole(r);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                          role === r ? 'bg-slate-50 text-slate-900 font-semibold' : 'text-slate-600'
                        }`}
                      >
                        <ItemIcon className="w-4 h-4 mt-0.5 text-slate-500 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">{item.label}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Data Reset Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all demo placement drives, applications, and student records to sample defaults?')) {
                  resetAllData();
                }
              }}
              title="Reset Sample Records"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
