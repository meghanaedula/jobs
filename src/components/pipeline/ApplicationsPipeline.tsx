import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { Application, RoundResult } from '../../types';
import {
  GitPullRequest,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ChevronRight,
  Filter,
  DollarSign,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface ApplicationsPipelineProps {
  onOpenAiPrep: (drive: any) => void;
}

export const ApplicationsPipeline: React.FC<ApplicationsPipelineProps> = ({ onOpenAiPrep }) => {
  const {
    applications,
    drives,
    students,
    updateApplicationRound,
    issueOffer,
    role,
  } = usePlacement();

  const [selectedDriveId, setSelectedDriveId] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchCandidate, setSearchCandidate] = useState<string>('');
  const [activeAppModal, setActiveAppModal] = useState<Application | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');
  const [customCtcInput, setCustomCtcInput] = useState<number>(0);

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const driveMatches = selectedDriveId === 'all' || app.driveId === selectedDriveId;
    const statusMatches =
      selectedStatusFilter === 'all' ||
      (selectedStatusFilter === 'active' && app.overallStatus === 'In Interview Rounds') ||
      (selectedStatusFilter === 'offered' && (app.overallStatus === 'Offered' || app.overallStatus === 'Offer Accepted')) ||
      (selectedStatusFilter === 'rejected' && app.overallStatus === 'Rejected');

    const student = students.find((s) => s.id === app.studentId);
    const drive = drives.find((d) => d.id === app.driveId);

    const textMatches =
      !searchCandidate ||
      (student && student.name.toLowerCase().includes(searchCandidate.toLowerCase())) ||
      (student && student.rollNumber.toLowerCase().includes(searchCandidate.toLowerCase())) ||
      (drive && drive.companyName.toLowerCase().includes(searchCandidate.toLowerCase()));

    return driveMatches && statusMatches && textMatches;
  });

  const handleOpenEvaluation = (app: Application) => {
    setActiveAppModal(app);
    setNotesInput(app.interviewerNotes || '');
    const drive = drives.find((d) => d.id === app.driveId);
    setCustomCtcInput(app.offeredCtc || drive?.ctc || 10);
  };

  const handleAdvanceRound = (app: Application, result: RoundResult) => {
    updateApplicationRound(app.id, app.currentRoundIndex, result, notesInput);
    setActiveAppModal(null);
  };

  const handleIssueOffer = (app: Application) => {
    issueOffer(app.id, customCtcInput);
    setActiveAppModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Recruitment Rounds & Candidate Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track student advancement across technical interviews, aptitude screens, and final corporate offers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Total Applications:</span>
          <span className="font-mono font-bold text-slate-900">{applications.length}</span>
        </div>
      </div>

      {/* Filter and Drive Selector Controls */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate name or roll no..."
            value={searchCandidate}
            onChange={(e) => setSearchCandidate(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Drive Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Drive:</label>
          <select
            value={selectedDriveId}
            onChange={(e) => setSelectedDriveId(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Drives ({drives.length})</option>
            {drives.map((d) => (
              <option key={d.id} value={d.id}>
                {d.companyName} ({d.tier})
              </option>
            ))}
          </select>
        </div>

        {/* Status Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {[
            { id: 'all', label: 'All Candidates' },
            { id: 'active', label: 'In Rounds' },
            { id: 'offered', label: 'Offered / Placed' },
            { id: 'rejected', label: 'Rejected' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatusFilter(st.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedStatusFilter === st.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Candidate</th>
                <th className="px-4 py-3">Company & Role</th>
                <th className="px-4 py-3">Current Round Stage</th>
                <th className="px-4 py-3">Round Progression</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => {
                const student = students.find((s) => s.id === app.studentId);
                const drive = drives.find((d) => d.id === app.driveId);
                if (!student || !drive) return null;

                const currentRound = drive.rounds[app.currentRoundIndex] || drive.rounds[0];

                return (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student Info */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-mono">{student.rollNumber}</span>
                            <span>&middot;</span>
                            <span>{student.branch.split(' ')[0]}</span>
                            <span>&middot;</span>
                            <span className="font-mono font-medium text-slate-700">CGPA {student.cgpa}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Company Info */}
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900">{drive.companyName}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-mono font-medium text-slate-700">₹{drive.ctc} LPA</span>
                        <span>&middot;</span>
                        <span>{drive.tier}</span>
                      </div>
                    </td>

                    {/* Current Round */}
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-800">
                        Round {app.currentRoundIndex + 1}: {currentRound?.name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {currentRound?.venue || 'Online Proctoring'}
                      </p>
                    </td>

                    {/* Round Progression Steps */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {drive.rounds.map((rnd, idx) => {
                          const status = app.roundResults[idx];
                          const isCleared = status === 'Cleared';
                          const isRejected = status === 'Rejected';
                          const isCurrent = idx === app.currentRoundIndex && !isCleared && !isRejected;

                          return (
                            <div
                              key={rnd.id}
                              title={`Round ${idx + 1}: ${rnd.name} (${status || 'Upcoming'})`}
                              className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-mono font-bold transition-all ${
                                isCleared
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isRejected
                                  ? 'bg-rose-100 text-rose-800'
                                  : isCurrent
                                  ? 'bg-sky-100 text-sky-800 ring-1 ring-sky-300'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                            >
                              R{idx + 1}
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Overall Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          app.overallStatus === 'Offer Accepted'
                            ? 'bg-emerald-100 text-emerald-800 font-bold'
                            : app.overallStatus === 'Offered'
                            ? 'bg-purple-100 text-purple-800'
                            : app.overallStatus === 'In Interview Rounds'
                            ? 'bg-sky-100 text-sky-800'
                            : app.overallStatus === 'Rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {app.overallStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      {(role === 'tpo_admin' || role === 'recruiter') ? (
                        <button
                          onClick={() => handleOpenEvaluation(app)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Evaluate & Advance
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenAiPrep(drive)}
                          className="px-2.5 py-1 text-xs text-sky-700 hover:text-sky-900 bg-sky-50 rounded-lg"
                        >
                          AI Prep Kit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredApps.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-xs">
              No applications match the current filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* Candidate Evaluation & Promotion Modal */}
      {activeAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Round Evaluation: Round {activeAppModal.currentRoundIndex + 1}
                </h3>
                <p className="text-slate-500 mt-0.5">
                  Update candidate selection status for this recruitment phase
                </p>
              </div>
              <button
                onClick={() => setActiveAppModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Interviewer / Panel Evaluation Feedback
              </label>
              <textarea
                rows={3}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Candidate demonstrated clean O(N) solution in tree traversal; communication was lucid..."
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[11px]">
                Promote / Update Selection Result
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAdvanceRound(activeAppModal, 'Cleared')}
                  className="py-2.5 px-3 font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Clear & Promote to Next</span>
                </button>

                <button
                  onClick={() => handleAdvanceRound(activeAppModal, 'Rejected')}
                  className="py-2.5 px-3 font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Reject in this Round</span>
                </button>
              </div>
            </div>

            {/* Direct Offer Roll-out */}
            <div className="pt-3 border-t border-slate-100 bg-slate-50 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Issue Official Campus Offer</span>
                <span className="text-[11px] text-slate-500">Direct Roll-out</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={customCtcInput}
                  onChange={(e) => setCustomCtcInput(parseFloat(e.target.value) || 0)}
                  className="w-28 px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-xs"
                />
                <span className="text-slate-600">LPA CTC</span>
                <button
                  onClick={() => handleIssueOffer(activeAppModal)}
                  className="ml-auto px-4 py-1.5 font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors cursor-pointer"
                >
                  Issue Offer Letter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
