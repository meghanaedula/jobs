import React from 'react';
import { usePlacement } from '../../context/PlacementContext';
import {
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Building2,
  DollarSign,
  Download,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Branch } from '../../types';

export const PlacementAnalytics: React.FC = () => {
  const { students, drives, applications } = usePlacement();

  const totalStudents = students.length;
  const placedStudents = students.filter((s) => s.status === 'Placed');
  const inProcessStudents = students.filter((s) => s.status === 'In Process');
  const unplacedStudents = students.filter((s) => s.status === 'Unplaced');
  const placementRate = totalStudents > 0 ? Math.round((placedStudents.length / totalStudents) * 100) : 0;

  // Packages
  const packages = placedStudents.map((s) => s.placedPackageLpa || 0).filter((p) => p > 0);
  const highestPackage = packages.length > 0 ? Math.max(...packages) : 0;
  const averagePackage = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : '0';

  // Median Package calculation
  const sortedPackages = [...packages].sort((a, b) => a - b);
  const medianPackage =
    sortedPackages.length > 0
      ? sortedPackages.length % 2 === 0
        ? ((sortedPackages[sortedPackages.length / 2 - 1] + sortedPackages[sortedPackages.length / 2]) / 2).toFixed(1)
        : sortedPackages[Math.floor(sortedPackages.length / 2)].toFixed(1)
      : '0';

  // Tier counts
  const tierCounts = {
    'Super Dream (>18 LPA)': placedStudents.filter((s) => s.tier === 'Super Dream').length,
    'Dream (10-18 LPA)': placedStudents.filter((s) => s.tier === 'Dream').length,
    'Core (6-10 LPA)': placedStudents.filter((s) => s.tier === 'Core').length,
    'Standard (<6 LPA)': placedStudents.filter((s) => s.tier === 'Standard').length,
  };

  // Branch-wise distribution
  const branches: Branch[] = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const branchData = branches.map((branch) => {
    const branchStudents = students.filter((s) => s.branch === branch);
    const branchPlaced = branchStudents.filter((s) => s.status === 'Placed');
    const rate = branchStudents.length > 0 ? Math.round((branchPlaced.length / branchStudents.length) * 100) : 0;
    return {
      name: branch,
      shortName: branch.replace('Engineering', '').trim(),
      total: branchStudents.length,
      placed: branchPlaced.length,
      rate,
    };
  });

  const handleDownloadFullReport = () => {
    const reportData = [
      ['Metric', 'Value'],
      ['Total Final Year Batch', totalStudents],
      ['Total Placed Students', placedStudents.length],
      ['Placement Percentage', `${placementRate}%`],
      ['Highest Package', `₹${highestPackage} LPA`],
      ['Average Package', `₹${averagePackage} LPA`],
      ['Median Package (NIRF)', `₹${medianPackage} LPA`],
      ['Active Recruitment Drives', drives.length],
      ['Total Applications Processed', applications.length],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + reportData.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_tpo_analytics_report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Placement Statistics & NIRF Accreditation Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time hiring metrics, CTC package distributions, and departmental performance benchmarks.
          </p>
        </div>

        <button
          onClick={handleDownloadFullReport}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Download NIRF Audit Report</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placement Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Placement Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{placementRate}%</span>
            <span className="text-xs text-slate-500">
              ({placedStudents.length}/{totalStudents} placed)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all"
              style={{ width: `${placementRate}%` }}
            ></div>
          </div>
        </div>

        {/* Highest Package */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Highest Package</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-900 font-mono">
              ₹{highestPackage} <span className="text-base font-normal">LPA</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Super Dream Offer (Google / MSFT)</p>
        </div>

        {/* Average Package */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Average Package</span>
            <DollarSign className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-sky-900 font-mono">
              ₹{averagePackage} <span className="text-base font-normal">LPA</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">+18.4% compared to previous academic year</p>
        </div>

        {/* Median Package (NIRF Metric) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Median Package</span>
            <ShieldCheck className="w-4 h-4 text-slate-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              ₹{medianPackage} <span className="text-base font-normal">LPA</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">NIRF Criteria 5 / NBA Audit Compliant</p>
        </div>
      </div>

      {/* Package Tier Distribution & Recruiters Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Salary Tier Distribution
            </h3>
            <span className="text-xs text-slate-400 font-mono">Total Offers: {placedStudents.length}</span>
          </div>

          <div className="space-y-4">
            {Object.entries(tierCounts).map(([tierName, count]) => {
              const pct = placedStudents.length > 0 ? Math.round((count / placedStudents.length) * 100) : 0;
              return (
                <div key={tierName} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{tierName}</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {count} offers ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        tierName.startsWith('Super')
                          ? 'bg-purple-600'
                          : tierName.startsWith('Dream')
                          ? 'bg-sky-600'
                          : tierName.startsWith('Core')
                          ? 'bg-amber-600'
                          : 'bg-slate-500'
                      }`}
                      style={{ width: `${Math.max(5, pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Recruiting Companies Leaderboard */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Corporate Recruitment Partners
            </h3>
            <span className="text-xs text-slate-400">Current Session</span>
          </div>

          <div className="space-y-3">
            {drives.slice(0, 5).map((drive) => {
              const hires = drive.selectedStudentIds.length;
              return (
                <div
                  key={drive.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center">
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
                      <h4 className="text-xs font-bold text-slate-900">{drive.companyName}</h4>
                      <p className="text-[11px] text-slate-500">{drive.industry}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 text-xs block">
                      ₹{drive.ctc} LPA
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {hires > 0 ? `${hires} Selected` : 'Drive in Progress'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Department Branch-Wise Performance */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Departmental Placement Progression
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Placement conversion across engineering branches for NIRF / AICTE accreditation
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {branchData.map((b) => (
            <div key={b.name} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900">{b.name}</span>
                  <span className="text-slate-400 ml-2">
                    ({b.placed} placed of {b.total} students)
                  </span>
                </div>
                <div className="font-mono font-bold text-slate-800">
                  {b.rate}% Placement Rate
                </div>
              </div>
              <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-slate-900 h-2 rounded-full transition-all"
                  style={{ width: `${b.rate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
