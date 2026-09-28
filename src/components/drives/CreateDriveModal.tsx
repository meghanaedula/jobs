import React, { useState } from 'react';
import { Branch, CompanyDrive, PackageTier } from '../../types';
import { usePlacement } from '../../context/PlacementContext';
import { X, Building2, Plus, Trash2 } from 'lucide-react';

interface CreateDriveModalProps {
  onClose: () => void;
}

const ALL_BRANCHES: Branch[] = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
];

export const CreateDriveModal: React.FC<CreateDriveModalProps> = ({ onClose }) => {
  const { createDrive } = usePlacement();

  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState('');
  const [website, setWebsite] = useState('https://');
  const [industry, setIndustry] = useState('Technology & Software');
  const [roleTitle, setRoleTitle] = useState('');
  const [ctc, setCtc] = useState<number>(14.0);
  const [stipend, setStipend] = useState('');
  const [location, setLocation] = useState('Bengaluru / Hybrid');
  const [jobDescription, setJobDescription] = useState('');
  const [minCgpa, setMinCgpa] = useState<number>(7.5);
  const [maxBacklogsAllowed, setMaxBacklogsAllowed] = useState<number>(0);
  const [minTenthPercent, setMinTenthPercent] = useState<number>(70);
  const [minTwelfthPercent, setMinTwelfthPercent] = useState<number>(70);
  const [eligibleBranches, setEligibleBranches] = useState<Branch[]>([
    'Computer Science & Engineering',
    'Information Technology',
  ]);
  const [applicationDeadline, setApplicationDeadline] = useState('2026-10-25');
  const [driveDate, setDriveDate] = useState('2026-10-30 to 2026-11-05');
  const [vacancies, setVacancies] = useState<number>(10);

  const calculateTier = (pkg: number): PackageTier => {
    if (pkg >= 18.0) return 'Super Dream';
    if (pkg >= 10.0) return 'Dream';
    if (pkg >= 6.0) return 'Core';
    return 'Standard';
  };

  const toggleBranch = (branch: Branch) => {
    setEligibleBranches((prev) =>
      prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) {
      alert('Please fill out the Company Name and Role Title.');
      return;
    }

    const tier = calculateTier(ctc);

    createDrive({
      companyName,
      logo:
        logo.trim() ||
        `https://avatar.vercel.sh/${encodeURIComponent(companyName)}.svg?text=${companyName.slice(0, 2).toUpperCase()}`,
      website,
      industry,
      roleTitle,
      ctc,
      stipend: stipend || undefined,
      tier,
      location,
      jobDescription:
        jobDescription.trim() ||
        `Recruitment drive for ${roleTitle} at ${companyName}. Open for pre-final and final year eligible candidates.`,
      eligibility: {
        minCgpa,
        maxBacklogsAllowed,
        eligibleBranches,
        minTenthPercent,
        minTwelfthPercent,
      },
      rounds: [
        {
          id: 1,
          name: 'Online Aptitude & Coding Test',
          type: 'Aptitude / Online Assessment',
          date: driveDate.split(' ')[0] || '2026-10-30',
          venue: 'Online Proctoring Portal',
          status: 'Upcoming',
        },
        {
          id: 2,
          name: 'Technical Interview Round 1',
          type: 'Technical Round 1',
          date: '2026-11-02',
          venue: 'TPO Seminar Hall / Virtual Panel',
          status: 'Upcoming',
        },
        {
          id: 3,
          name: 'HR & Final Offer Round',
          type: 'HR & Cultural Fit',
          date: '2026-11-05',
          venue: 'Executive Boardroom',
          status: 'Upcoming',
        },
      ],
      applicationDeadline,
      driveDate,
      status: 'Applications Open',
      vacancies,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Publish New Recruitment Drive</h2>
              <p className="text-xs text-slate-500">Configure corporate visit cutoffs and candidate criteria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Amazon / Qualcomm / Infosys"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Job Profile / Designation *</label>
              <input
                type="text"
                required
                placeholder="e.g. Associate SDE / Hardware Engineer"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Annual CTC (LPA) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={ctc}
                onChange={(e) => setCtc(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Tier Auto-tag: <strong className="text-slate-700">{calculateTier(ctc)}</strong>
              </span>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Internship Stipend</label>
              <input
                type="text"
                placeholder="e.g. ₹60,000 / month"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Vacancies</label>
              <input
                type="number"
                value={vacancies}
                onChange={(e) => setVacancies(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Academic Cutoffs */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              Academic Benchmark Cutoffs
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Min CGPA Cutoff</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="10"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Max Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={maxBacklogsAllowed}
                  onChange={(e) => setMaxBacklogsAllowed(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">10th Std Min %</label>
                <input
                  type="number"
                  value={minTenthPercent}
                  onChange={(e) => setMinTenthPercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">12th / Diploma Min %</label>
                <input
                  type="number"
                  value={minTwelfthPercent}
                  onChange={(e) => setMinTwelfthPercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                Eligible Engineering Branches
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_BRANCHES.map((br) => {
                  const isChecked = eligibleBranches.includes(br);
                  return (
                    <label
                      key={br}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-white border-slate-900 font-semibold text-slate-900'
                          : 'bg-slate-100/70 border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBranch(br)}
                        className="rounded text-slate-900"
                      />
                      <span className="truncate">{br}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Application Deadline</label>
              <input
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recruitment Drive Date Window</label>
              <input
                type="text"
                placeholder="e.g. 2026-10-30 to 2026-11-05"
                value={driveDate}
                onChange={(e) => setDriveDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Job Description & Responsibilities</label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Outline technical responsibilities, stack requirements, and candidate expectations..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Publish Recruitment Drive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
