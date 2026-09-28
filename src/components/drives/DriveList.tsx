import React, { useState } from 'react';
import { CompanyDrive, PackageTier } from '../../types';
import { usePlacement } from '../../context/PlacementContext';
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Briefcase,
} from 'lucide-react';
import { DriveDetailModal } from './DriveDetailModal';
import { CreateDriveModal } from './CreateDriveModal';

interface DriveListProps {
  onOpenAiPrep: (drive: CompanyDrive) => void;
}

export const DriveList: React.FC<DriveListProps> = ({ onOpenAiPrep }) => {
  const { drives, role, activeStudent, checkEligibility, applications } = usePlacement();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDrive, setSelectedDrive] = useState<CompanyDrive | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filters
  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = selectedTier === 'all' || drive.tier === selectedTier;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'open' && drive.status === 'Applications Open') ||
      (selectedStatus === 'ongoing' && drive.status === 'Ongoing Drive') ||
      (selectedStatus === 'completed' && drive.status === 'Completed');

    return matchesSearch && matchesTier && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Campus Recruitment Drives
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Active corporate recruitment drives, technical assessment cutoffs, and slot scheduling.
          </p>
        </div>

        {(role === 'tpo_admin' || role === 'recruiter') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Recruitment Drive</span>
          </button>
        )}
      </div>

      {/* Search & Segmented Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by company, profile, or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        {/* Tier Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {['all', 'Super Dream', 'Dream', 'Core', 'Standard'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedTier === tier
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tier === 'all' ? 'All Tiers' : tier}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {[
            { id: 'all', label: 'All Status' },
            { id: 'open', label: 'Open' },
            { id: 'ongoing', label: 'Ongoing' },
            { id: 'completed', label: 'Past' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedStatus === st.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrives.map((drive) => {
          const { isEligible } = checkEligibility(activeStudent, drive);
          const hasApplied = applications.some(
            (a) => a.driveId === drive.id && a.studentId === activeStudent.id
          );

          return (
            <div
              key={drive.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all p-5 shadow-xs flex flex-col justify-between group"
            >
              <div>
                {/* Header & Logo */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-slate-100 bg-slate-50 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={drive.logo}
                        alt={drive.companyName}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-700 transition-colors">
                        {drive.companyName}
                      </h3>
                      {/* Quiet unboxed metadata with dot separator */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span>{drive.industry}</span>
                        <span aria-hidden="true">&middot;</span>
                        <span className="font-mono text-slate-700 font-medium">{drive.tier}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compensation in mono font */}
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-slate-900 text-sm block">
                      ₹{drive.ctc} LPA
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Annual CTC</span>
                  </div>
                </div>

                {/* Role Designation */}
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{drive.roleTitle}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {drive.jobDescription}
                  </p>
                </div>

                {/* Academic Benchmarks List */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Min CGPA</span>
                    <span className="font-mono font-bold text-slate-800">{drive.eligibility.minCgpa.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Backlogs</span>
                    <span className="font-mono font-bold text-slate-800">
                      {drive.eligibility.maxBacklogsAllowed === 0 ? 'Nil' : `<= ${drive.eligibility.maxBacklogsAllowed}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Rounds</span>
                    <span className="font-mono font-bold text-slate-800">{drive.rounds.length} Rounds</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Openings</span>
                    <span className="font-mono font-bold text-slate-800">{drive.vacancies}</span>
                  </div>
                </div>

                {/* Candidate Status Indicator */}
                <div className="mt-3.5 flex items-center justify-between text-xs">
                  {hasApplied ? (
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Application Registered</span>
                    </span>
                  ) : isEligible ? (
                    <span className="flex items-center gap-1 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Eligible to apply</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Cutoff restriction</span>
                    </span>
                  )}

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>Closes {drive.applicationDeadline}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedDrive(drive)}
                  className="flex-1 py-1.5 px-3 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Review Drive</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => onOpenAiPrep(drive)}
                  title="Prepare AI interview questions for this company"
                  className="p-1.5 text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-sky-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDrives.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No recruitment drives found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, package tier filter, or check back when new corporate partners register.
          </p>
        </div>
      )}

      {/* Modals */}
      {selectedDrive && (
        <DriveDetailModal
          drive={selectedDrive}
          onClose={() => setSelectedDrive(null)}
          onOpenAiPrep={(d) => {
            setSelectedDrive(null);
            onOpenAiPrep(d);
          }}
        />
      )}

      {showCreateModal && <CreateDriveModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};
