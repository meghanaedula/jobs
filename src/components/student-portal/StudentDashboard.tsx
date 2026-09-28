import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { CompanyDrive } from '../../types';
import {
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Award,
  AlertCircle,
  FileCheck2,
  Download,
  Calendar,
  Building2,
} from 'lucide-react';
import { DriveDetailModal } from '../drives/DriveDetailModal';

interface StudentDashboardProps {
  onOpenAiSuite: () => void;
  onOpenExploreDrives: () => void;
  onOpenAiPrep: (drive: CompanyDrive) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenAiSuite,
  onOpenExploreDrives,
  onOpenAiPrep,
}) => {
  const {
    activeStudent,
    applications,
    drives,
    checkEligibility,
    acceptOffer,
    applyForDrive,
  } = usePlacement();

  const [selectedDriveForDetail, setSelectedDriveForDetail] = useState<CompanyDrive | null>(null);

  // My applications
  const myApps = applications.filter((a) => a.studentId === activeStudent.id);

  // Eligible drives where student has NOT applied yet
  const eligibleUnappliedDrives = drives.filter((drive) => {
    const hasApplied = myApps.some((a) => a.driveId === drive.id);
    if (hasApplied) return false;
    const { isEligible } = checkEligibility(activeStudent, drive);
    return isEligible && drive.status !== 'Completed';
  });

  return (
    <div className="space-y-6">
      {/* Student Welcome Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={activeStudent.avatar}
            alt={activeStudent.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{activeStudent.name}</h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                {activeStudent.rollNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {activeStudent.branch} &middot; Batch {activeStudent.batch}
            </p>
            <div className="flex items-center gap-3 text-xs mt-2">
              <span className="font-semibold text-slate-700">
                CGPA: <span className="font-mono text-slate-900 font-bold">{activeStudent.cgpa}</span>
              </span>
              <span>&middot;</span>
              <span className={activeStudent.activeBacklogs === 0 ? 'text-emerald-700 font-medium' : 'text-rose-600 font-bold'}>
                {activeStudent.activeBacklogs === 0 ? '0 Backlogs' : `${activeStudent.activeBacklogs} Active Backlog(s)`}
              </span>
              <span>&middot;</span>
              <span className="text-slate-500">
                Audit: <strong className="text-slate-700">{activeStudent.verificationStatus}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Status Pill Badge */}
        <div className="flex flex-col sm:items-end gap-2">
          {activeStudent.status === 'Placed' ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                Official Placement Confirmed
              </span>
              <span className="text-base font-extrabold text-slate-900">
                {activeStudent.placedCompany}
              </span>
              <div className="text-xs font-mono font-bold text-emerald-800 mt-0.5">
                ₹{activeStudent.placedPackageLpa} LPA &middot; {activeStudent.tier}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAiSuite}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>AI ATS Resume Screen</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pending Offers Alert (If student has an offer awaiting decision!) */}
      {myApps
        .filter((a) => a.overallStatus === 'Offered')
        .map((offeredApp) => {
          const drive = drives.find((d) => d.id === offeredApp.driveId);
          if (!drive) return null;

          return (
            <div
              key={offeredApp.id}
              className="p-5 rounded-xl border border-purple-200 bg-purple-50/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in-50"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 block">
                    Campus Offer Letter Awaiting Your Acceptance
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {drive.companyName} &middot; {drive.roleTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Offered Annual CTC: <strong className="font-mono text-purple-950 font-bold">₹{offeredApp.offeredCtc || drive.ctc} LPA</strong> ({drive.tier} Tier)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => acceptOffer(offeredApp.id)}
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Accept Offer Letter
                </button>
              </div>
            </div>
          );
        })}

      {/* Active Application Rounds Pipeline for this student */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              My Application Tracker & Round Status ({myApps.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live updates from TPO on aptitude screens, technical panels, and interview venues.
            </p>
          </div>

          <button
            onClick={onOpenExploreDrives}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore More Drives</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {myApps.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            You have not submitted applications for any drives yet. Check the recommended drives below!
          </div>
        ) : (
          <div className="space-y-3">
            {myApps.map((app) => {
              const drive = drives.find((d) => d.id === app.driveId);
              if (!drive) return null;

              const currentRound = drive.rounds[app.currentRoundIndex];

              return (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/40 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
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
                        <h4 className="font-bold text-slate-900 text-sm">{drive.companyName}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{drive.roleTitle}</span>
                          <span>&middot;</span>
                          <span className="font-mono font-medium text-slate-700">₹{drive.ctc} LPA</span>
                          <span>&middot;</span>
                          <span>Applied on {app.appliedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded ${
                          app.overallStatus === 'Offer Accepted'
                            ? 'bg-emerald-100 text-emerald-800 font-bold'
                            : app.overallStatus === 'Offered'
                            ? 'bg-purple-100 text-purple-800'
                            : app.overallStatus === 'In Interview Rounds'
                            ? 'bg-sky-100 text-sky-800'
                            : app.overallStatus === 'Rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {app.overallStatus}
                      </span>

                      <button
                        onClick={() => onOpenAiPrep(drive)}
                        className="p-1.5 text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg text-xs"
                        title="Prepare AI interview questions for this drive"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      </button>
                    </div>
                  </div>

                  {/* Round Progress Bar */}
                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[11px] font-semibold text-slate-500">Recruitment Stages:</span>
                    {drive.rounds.map((rnd, idx) => {
                      const status = app.roundResults[idx];
                      const isCleared = status === 'Cleared';
                      const isRejected = status === 'Rejected';
                      const isCurrent = idx === app.currentRoundIndex && !isCleared && !isRejected;

                      return (
                        <div
                          key={rnd.id}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium ${
                            isCleared
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : isRejected
                              ? 'bg-rose-50 border-rose-200 text-rose-800'
                              : isCurrent
                              ? 'bg-white border-sky-400 text-sky-900 font-bold shadow-xs'
                              : 'bg-slate-100 border-slate-200 text-slate-400'
                          }`}
                        >
                          <span className="font-mono">R{idx + 1}:</span>
                          <span>{rnd.name.split('(')[0].trim()}</span>
                          {isCleared && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Feedback if any */}
                  {app.interviewerNotes && (
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
                      <strong className="text-slate-800">Panel Feedback: </strong>
                      <span>{app.interviewerNotes}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Eligible Drives Quick Application Recommendation */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Eligible Opportunities Open for Registration ({eligibleUnappliedDrives.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your CGPA of {activeStudent.cgpa} and branch qualifications meet the criteria for these recruitment drives.
          </p>
        </div>

        {eligibleUnappliedDrives.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No unapplied eligible drives at this time. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {eligibleUnappliedDrives.map((drv) => (
              <div
                key={drv.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={drv.logo}
                      alt={drv.companyName}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{drv.companyName}</h4>
                    <p className="text-[11px] text-slate-500">{drv.roleTitle}</p>
                    <div className="text-[11px] font-mono font-bold text-slate-800 mt-0.5">
                      ₹{drv.ctc} LPA &middot; {drv.tier}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDriveForDetail(drv)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Details & Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDriveForDetail && (
        <DriveDetailModal
          drive={selectedDriveForDetail}
          onClose={() => setSelectedDriveForDetail(null)}
          onOpenAiPrep={onOpenAiPrep}
        />
      )}
    </div>
  );
};
