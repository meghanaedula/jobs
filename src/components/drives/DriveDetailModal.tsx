import React, { useState } from 'react';
import { CompanyDrive } from '../../types';
import { usePlacement } from '../../context/PlacementContext';
import {
  X,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { checkJobFit } from '../../services/geminiService';

interface DriveDetailModalProps {
  drive: CompanyDrive;
  onClose: () => void;
  onOpenAiPrep: (drive: CompanyDrive) => void;
}

export const DriveDetailModal: React.FC<DriveDetailModalProps> = ({
  drive,
  onClose,
  onOpenAiPrep,
}) => {
  const { role, activeStudent, applyForDrive, checkEligibility, applications, students } = usePlacement();
  const [isAnalyzingFit, setIsAnalyzingFit] = useState(false);
  const [aiFitResult, setAiFitResult] = useState<any>(null);

  const { isEligible, reasons } = checkEligibility(activeStudent, drive);
  const existingApp = applications.find(
    (a) => a.driveId === drive.id && a.studentId === activeStudent.id
  );

  const registeredStudents = students.filter((s) => drive.registeredStudentIds.includes(s.id));

  const handleApply = () => {
    applyForDrive(drive.id, activeStudent.id);
  };

  const handleRunAiFit = async () => {
    setIsAnalyzingFit(true);
    try {
      const res = await checkJobFit(activeStudent, drive);
      setAiFitResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingFit(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl border border-slate-200 bg-white p-2.5 flex items-center justify-center shrink-0 shadow-xs">
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
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{drive.companyName}</h2>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-600 font-mono">
                  {drive.tier} Tier
                </span>
              </div>
              <p className="text-sm font-medium text-slate-700 mt-0.5">{drive.roleTitle}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {drive.location}
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1 font-mono font-bold text-slate-800">
                  ₹{drive.ctc} LPA CTC
                </span>
                {drive.stipend && (
                  <>
                    <span>&middot;</span>
                    <span className="text-slate-600">{drive.stipend}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Eligibility Card for Student */}
          <div
            className={`p-4 rounded-xl border ${
              isEligible
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-rose-50/60 border-rose-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {isEligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Live Eligibility Evaluation for {activeStudent.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {isEligible
                      ? 'Candidate meets all academic and placement policy thresholds.'
                      : 'Candidate does not satisfy one or more requirements.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleRunAiFit}
                disabled={isAnalyzingFit}
                className="flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800 bg-white border border-sky-200 px-2.5 py-1 rounded-lg transition-colors shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-sky-600" />
                {isAnalyzingFit ? 'Analyzing...' : 'AI Strategic Fit'}
              </button>
            </div>

            <div className="mt-3 text-xs space-y-1 text-slate-700 pl-7">
              {reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">&bull;</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>

            {/* AI Fit Result details if expanded */}
            {aiFitResult && (
              <div className="mt-4 pt-3 border-t border-slate-200/80 bg-white/80 p-3 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span>AI Readiness Score:</span>
                  <span className="font-mono text-sky-700 font-bold text-sm">
                    {aiFitResult.readinessScore}/100
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{aiFitResult.eligibilityBreakdown}</p>
                {aiFitResult.competitiveAdvantage?.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-700">Competitive Edge:</span>
                    <ul className="list-disc pl-4 text-slate-600 mt-0.5 space-y-0.5">
                      {aiFitResult.competitiveAdvantage.map((adv: string, i: number) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Job Overview & Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Role & Responsibility Overview
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
              {drive.jobDescription}
            </p>
          </div>

          {/* Cutoffs & Criteria Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Eligibility Benchmark Criteria
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[11px] block">Min CGPA</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {drive.eligibility.minCgpa.toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[11px] block">Backlogs Allowed</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {drive.eligibility.maxBacklogsAllowed === 0
                    ? '0 (Nil)'
                    : `Max ${drive.eligibility.maxBacklogsAllowed}`}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[11px] block">10th Std Min</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {drive.eligibility.minTenthPercent}%
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[11px] block">12th / Diploma Min</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {drive.eligibility.minTwelfthPercent}%
                </span>
              </div>
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px] block mb-1">Eligible Engineering Branches</span>
              <div className="flex flex-wrap gap-2 text-slate-700">
                {drive.eligibility.eligibleBranches.map((br, i) => (
                  <span key={i} className="bg-white border border-slate-200 px-2 py-1 rounded text-[11px] font-medium">
                    {br}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recruitment Rounds Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Recruitment Process & Selection Rounds
            </h3>
            <div className="space-y-2">
              {drive.rounds.map((rnd, idx) => (
                <div
                  key={rnd.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">{rnd.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {rnd.date}
                        </span>
                        <span>&middot;</span>
                        <span>{rnd.venue}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      rnd.status === 'Completed'
                        ? 'text-emerald-700 bg-emerald-50'
                        : rnd.status === 'Active'
                        ? 'text-sky-700 bg-sky-50 font-bold'
                        : 'text-slate-500 bg-slate-100'
                    }`}
                  >
                    {rnd.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Registered Applicants List (For TPO/Recruiter) */}
          {(role === 'tpo_admin' || role === 'recruiter') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Registered Candidates ({registeredStudents.length})
                </h3>
                <span className="text-xs text-slate-500">Vacancies: {drive.vacancies}</span>
              </div>
              <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
                {registeredStudents.length === 0 ? (
                  <p className="p-4 text-xs text-slate-400 text-center">No students registered yet.</p>
                ) : (
                  registeredStudents.map((std) => (
                    <div key={std.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50">
                      <div className="flex items-center gap-2.5">
                        <img src={std.avatar} alt={std.name} className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <span className="font-semibold text-slate-900">{std.name}</span>
                          <span className="text-slate-400 text-[11px] ml-2">({std.rollNumber})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                        <span>{std.branch.split(' ')[0]}</span>
                        <span className="font-mono font-semibold text-slate-700">CGPA {std.cgpa}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => onOpenAiPrep(drive)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Generate Interview Kit</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>

            {existingApp ? (
              <span className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Applied ({existingApp.overallStatus})</span>
              </span>
            ) : (
              <button
                onClick={handleApply}
                disabled={!isEligible || drive.status === 'Completed'}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  isEligible && drive.status !== 'Completed'
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Submit Campus Application</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
