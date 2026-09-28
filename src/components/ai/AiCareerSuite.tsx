import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { CompanyDrive, Student } from '../../types';
import {
  Sparkles,
  FileText,
  HelpCircle,
  Briefcase,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
  Cpu,
  BookOpen,
} from 'lucide-react';
import {
  analyzeResumeAts,
  generateInterviewKit,
  draftTpoNotice,
} from '../../services/geminiService';

interface AiCareerSuiteProps {
  initialDrive?: CompanyDrive | null;
  initialStudent?: Student | null;
}

export const AiCareerSuite: React.FC<AiCareerSuiteProps> = ({
  initialDrive,
  initialStudent,
}) => {
  const { students, drives, activeStudent, publishNotice, showToast } = usePlacement();

  const [activeAiTab, setActiveAiTab] = useState<'ats' | 'interview' | 'circular'>('ats');

  // ATS State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || activeStudent.id
  );
  const [selectedDriveId, setSelectedDriveId] = useState<string>(
    initialDrive?.id || drives[0]?.id || ''
  );
  const [customResumeText, setCustomResumeText] = useState<string>('');
  const [isAtsLoading, setIsAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<any>(null);

  // Interview Kit State
  const [interviewCompany, setInterviewCompany] = useState<string>(
    initialDrive?.companyName || 'Google'
  );
  const [interviewRole, setInterviewRole] = useState<string>(
    initialDrive?.roleTitle || 'Software Engineer'
  );
  const [interviewRound, setInterviewRound] = useState<string>('Technical Round 1');
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);
  const [interviewKitResult, setInterviewKitResult] = useState<any>(null);

  // Circular State
  const [circularType, setCircularType] = useState<string>('New Campus Drive Registration Open');
  const [circularCompany, setCircularCompany] = useState<string>('Google');
  const [circularCtc, setCircularCtc] = useState<number>(32.5);
  const [circularDate, setCircularDate] = useState<string>('Next Monday, 09:30 AM');
  const [circularNotes, setCircularNotes] = useState<string>(
    'Strict formal attire required. Carry 3 hard copies of verified resume.'
  );
  const [isCircularLoading, setIsCircularLoading] = useState(false);
  const [circularResult, setCircularResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Handlers
  const handleRunAts = async () => {
    const student = students.find((s) => s.id === selectedStudentId) || activeStudent;
    const drive = drives.find((d) => d.id === selectedDriveId) || drives[0];

    setIsAtsLoading(true);
    setAtsResult(null);
    try {
      const res = await analyzeResumeAts(
        customResumeText || student.resumeSummary || '',
        drive.roleTitle,
        drive.companyName,
        drive.jobDescription,
        student
      );
      setAtsResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAtsLoading(false);
    }
  };

  const handleGenerateInterviewKit = async () => {
    setIsInterviewLoading(true);
    setInterviewKitResult(null);
    try {
      const student = students.find((s) => s.id === selectedStudentId) || activeStudent;
      const res = await generateInterviewKit(
        interviewCompany,
        interviewRole,
        interviewRound,
        student.branch,
        student.skills
      );
      setInterviewKitResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsInterviewLoading(false);
    }
  };

  const handleDraftCircular = async () => {
    setIsCircularLoading(true);
    setCircularResult(null);
    try {
      const res = await draftTpoNotice(
        circularType,
        circularCompany,
        'Campus Engineer',
        circularCtc,
        circularDate,
        circularNotes
      );
      setCircularResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCircularLoading(false);
    }
  };

  const handlePublishGeneratedNotice = () => {
    if (!circularResult) return;
    publishNotice({
      title: circularResult.subject,
      circularNumber: circularResult.circularNumber,
      category: 'Drive Announcement',
      author: 'Prof. Dr. Rajesh Sharma',
      authorRole: 'Head - Training & Placement Directorate',
      date: new Date().toISOString().split('T')[0],
      urgency: circularResult.urgency || 'High',
      targetBranches: ['All'],
      content: circularResult.body,
      actionRequired: circularResult.actionRequired,
    });
    showToast({
      type: 'success',
      title: 'Notice Broadcasted',
      message: 'Notice has been published to the student circulars board.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Placement Intelligence Suite
            </h1>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
              Gemini 3.8 Flash Powered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated resume ATS matching, company-tailored interview question rubrics, and official TPO circular drafting.
          </p>
        </div>
      </div>

      {/* Segmented Tool Selector (Button controls compliant with Frontend Design) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveAiTab('ats')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAiTab === 'ats'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Resume & ATS Analyzer</span>
        </button>

        <button
          onClick={() => setActiveAiTab('interview')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAiTab === 'interview'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Interview Prep & Rubrics</span>
        </button>

        <button
          onClick={() => setActiveAiTab('circular')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAiTab === 'circular'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>TPO Circular Drafter</span>
        </button>
      </div>

      {/* TAB 1: RESUME & ATS ANALYZER */}
      {activeAiTab === 'ats' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Input (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Target Evaluation Parameters</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Candidate Profile</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-slate-900"
              >
                {students.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.name} ({std.rollNumber}) &middot; CGPA {std.cgpa} &middot; {std.branch.split(' ')[0]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Recruitment Drive</label>
              <select
                value={selectedDriveId}
                onChange={(e) => setSelectedDriveId(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-slate-900"
              >
                {drives.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.companyName} &middot; {d.roleTitle} ({d.ctc} LPA)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Custom Resume / Project Bullets (Optional)
              </label>
              <textarea
                rows={5}
                placeholder="Paste raw resume text, project accomplishments, or certifications to evaluate against the JD..."
                value={customResumeText}
                onChange={(e) => setCustomResumeText(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <button
              onClick={handleRunAts}
              disabled={isAtsLoading}
              className="w-full py-2.5 px-4 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>{isAtsLoading ? 'Analyzing Resume with Gemini...' : 'Run AI ATS Screening'}</span>
            </button>
          </div>

          {/* Results Output (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-xs">
            {!atsResult && !isAtsLoading && (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center text-slate-400">
                <FileText className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">No Resume Scanned Yet</h4>
                <p className="max-w-xs mt-1 text-slate-500">
                  Select a candidate and company drive on the left, then click &apos;Run AI ATS Screening&apos; to view score breakdowns.
                </p>
              </div>
            )}

            {isAtsLoading && (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="font-semibold text-slate-800">Screening Resume against Corporate JD...</p>
                <p className="text-slate-400 text-[11px] mt-1">Comparing technical skills, branch criteria, and project depth</p>
              </div>
            )}

            {atsResult && !isAtsLoading && (
              <div className="space-y-5 animate-in fade-in-50">
                {/* Score Header */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      ATS Match Rating
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{atsResult.verdict}</h3>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-3xl font-extrabold text-slate-900">
                      {atsResult.atsScore}
                    </span>
                    <span className="text-slate-400 text-xs font-mono font-medium">/100</span>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                    Recruiter Assessment Summary
                  </h4>
                  <p className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 leading-relaxed">
                    {atsResult.tailoredSummary}
                  </p>
                </div>

                {/* Matched vs Missing Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg">
                    <span className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider block mb-1">
                      Matched Core Competencies ({atsResult.matchedSkills?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {atsResult.matchedSkills?.map((sk: string, i: number) => (
                        <span key={i} className="bg-white text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-lg">
                    <span className="font-bold text-rose-800 text-[11px] uppercase tracking-wider block mb-1">
                      High-Priority Missing Keywords ({atsResult.missingSkills?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {atsResult.missingSkills?.map((sk: string, i: number) => (
                        <span key={i} className="bg-white text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                    Actionable Improvement Recommendations
                  </h4>
                  <div className="space-y-1.5">
                    {atsResult.actionableRecommendations?.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 border border-slate-100 rounded-md text-slate-700">
                        <span className="font-bold text-slate-400 font-mono">{i + 1}.</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INTERVIEW PREPARATION KIT */}
      {activeAiTab === 'interview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Target Interview Round</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recruiting Company</label>
              <input
                type="text"
                value={interviewCompany}
                onChange={(e) => setInterviewCompany(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Role Title</label>
              <input
                type="text"
                value={interviewRole}
                onChange={(e) => setInterviewRole(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Round Category</label>
              <select
                value={interviewRound}
                onChange={(e) => setInterviewRound(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="Online Assessment & Aptitude">Online Assessment & Aptitude</option>
                <option value="Technical Round 1 (Data Structures)">Technical Round 1 (Data Structures)</option>
                <option value="Technical Round 2 (System Design / Core)">Technical Round 2 (System Design / Core)</option>
                <option value="HR & Leadership Fit">HR & Leadership Fit</option>
              </select>
            </div>

            <button
              onClick={handleGenerateInterviewKit}
              disabled={isInterviewLoading}
              className="w-full py-2.5 px-4 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>{isInterviewLoading ? 'Synthesizing Questions...' : 'Generate Interview Rubric'}</span>
            </button>
          </div>

          <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-xs">
            {!interviewKitResult && !isInterviewLoading && (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center text-slate-400">
                <HelpCircle className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">No Interview Kit Generated</h4>
                <p className="max-w-xs mt-1 text-slate-500">
                  Select company and round on the left, then click &apos;Generate Interview Rubric&apos; to view company-specific technical questions.
                </p>
              </div>
            )}

            {isInterviewLoading && (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="font-semibold text-slate-800">Generating Placement Interview Questions & Grading Rubric...</p>
              </div>
            )}

            {interviewKitResult && !isInterviewLoading && (
              <div className="space-y-4 animate-in fade-in-50">
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-900">
                  <span className="font-bold text-[11px] uppercase tracking-wider block">Round Focus</span>
                  <p className="mt-0.5 leading-relaxed">{interviewKitResult.roundFocus}</p>
                </div>

                <div className="space-y-3">
                  {interviewKitResult.questions?.map((q: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-sm flex items-start gap-2">
                          <span className="font-mono text-slate-400">Q{idx + 1}.</span>
                          <span>{q.question}</span>
                        </h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-700 shrink-0">
                          {q.difficulty}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                        <span className="font-semibold text-slate-700 text-[11px] block">
                          Expected Answer Structure (&apos;A&apos; Grade Candidate):
                        </span>
                        <p className="text-slate-600 leading-relaxed">{q.expectedAnswerOutline}</p>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-start gap-1.5 pt-1">
                        <span className="font-semibold text-slate-700 shrink-0">Interviewer Rubric:</span>
                        <span>{q.interviewerRubric}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: TPO CIRCULAR DRAFTER */}
      {activeAiTab === 'circular' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Circular Specifications</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Circular Purpose</label>
              <select
                value={circularType}
                onChange={(e) => setCircularType(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="New Campus Drive Registration Open">New Campus Drive Registration Open</option>
                <option value="Shortlist Release & Interview Schedule">Shortlist Release & Interview Schedule</option>
                <option value="Placement Policy Compliance Reminder">Placement Policy Compliance Reminder</option>
                <option value="Offer Letter Celebration & Acceptance Window">Offer Letter Celebration & Acceptance Window</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Partner</label>
                <input
                  type="text"
                  value={circularCompany}
                  onChange={(e) => setCircularCompany(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Package (CTC LPA)</label>
                <input
                  type="number"
                  step="0.5"
                  value={circularCtc}
                  onChange={(e) => setCircularCtc(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Drive / Schedule Date</label>
              <input
                type="text"
                value={circularDate}
                onChange={(e) => setCircularDate(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specific Instructions / Protocol</label>
              <textarea
                rows={3}
                value={circularNotes}
                onChange={(e) => setCircularNotes(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <button
              onClick={handleDraftCircular}
              disabled={isCircularLoading}
              className="w-full py-2.5 px-4 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>{isCircularLoading ? 'Drafting Official Notice...' : 'Draft TPO Circular'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-xs">
            {!circularResult && !isCircularLoading && (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center text-slate-400">
                <Send className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">No Notice Drafted Yet</h4>
                <p className="max-w-xs mt-1 text-slate-500">
                  Configure circular options on the left to draft an authoritative college placement announcement.
                </p>
              </div>
            )}

            {isCircularLoading && (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="font-semibold text-slate-800">Drafting Institutional Circular...</p>
              </div>
            )}

            {circularResult && !isCircularLoading && (
              <div className="space-y-4 animate-in fade-in-50">
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-200 pb-2">
                    <span className="font-mono font-bold text-slate-800">{circularResult.circularNumber}</span>
                    <span className="font-semibold text-rose-700">{circularResult.urgency} Urgency</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{circularResult.subject}</h3>

                  <p className="text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-lg border border-slate-200 font-mono text-[11px]">
                    {circularResult.body}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${circularResult.subject}\n\n${circularResult.body}`
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Notice'}</span>
                  </button>

                  <button
                    onClick={handlePublishGeneratedNotice}
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Publish Directly to Notice Board</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
