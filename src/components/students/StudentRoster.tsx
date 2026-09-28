import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { Branch, Student } from '../../types';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Download,
  Eye,
  X,
  FileText,
  UserCheck,
} from 'lucide-react';

interface StudentRosterProps {
  onRunAtsScan: (student: Student) => void;
}

const ALL_BRANCHES: string[] = [
  'All Branches',
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
];

export const StudentRoster: React.FC<StudentRosterProps> = ({ onRunAtsScan }) => {
  const { students, updateStudent, role } = usePlacement();

  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeStudentModal, setActiveStudentModal] = useState<Student | null>(null);

  const filteredStudents = students.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(search.toLowerCase()) ||
      std.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      std.email.toLowerCase().includes(search.toLowerCase()) ||
      std.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()));

    const matchesBranch =
      selectedBranch === 'All Branches' || std.branch === selectedBranch;

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'placed' && std.status === 'Placed') ||
      (selectedStatus === 'unplaced' && std.status === 'Unplaced') ||
      (selectedStatus === 'process' && std.status === 'In Process');

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleExportCsv = () => {
    const headers = ['Roll Number', 'Name', 'Branch', 'CGPA', 'Active Backlogs', 'Placement Status', 'Placed Company', 'Package LPA', 'Tier'];
    const rows = filteredStudents.map((s) => [
      s.rollNumber,
      `"${s.name}"`,
      `"${s.branch}"`,
      s.cgpa,
      s.activeBacklogs,
      s.status,
      `"${s.placedCompany || 'N/A'}"`,
      s.placedPackageLpa || 'N/A',
      s.tier || 'N/A',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_placement_students_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleVerification = (student: Student) => {
    const nextStatus =
      student.verificationStatus === 'Verified'
        ? 'Flagged'
        : 'Verified';

    updateStudent({
      ...student,
      verificationStatus: nextStatus,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Student Placement Roster & Academic Audits
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Departmental roster, CGPA transcripts, backlog verification, and placement credentials.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export NAAC/NBA CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, roll no, or tech skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Branch Filter */}
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
        >
          {ALL_BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* Status Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {[
            { id: 'all', label: 'All Students' },
            { id: 'placed', label: 'Placed' },
            { id: 'process', label: 'In Process' },
            { id: 'unplaced', label: 'Unplaced' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Student & Roll No</th>
                <th className="px-4 py-3">Department Branch</th>
                <th className="px-4 py-3">Academic Score</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3">Placement Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Candidate */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={std.avatar}
                        alt={std.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{std.name}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-mono">{std.rollNumber}</span>
                          <span>&middot;</span>
                          <span>{std.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Branch */}
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-800">{std.branch}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{std.batch}</p>
                  </td>

                  {/* Academics */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {std.cgpa.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-slate-400">CGPA</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {std.activeBacklogs === 0 ? (
                        <span className="text-emerald-700 font-medium">0 Backlogs</span>
                      ) : (
                        <span className="text-rose-600 font-bold">{std.activeBacklogs} Active Backlog(s)</span>
                      )}
                    </div>
                  </td>

                  {/* Verification Status */}
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleToggleVerification(std)}
                      title="Click to toggle audit status"
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                        std.verificationStatus === 'Verified'
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      {std.verificationStatus === 'Verified' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      <span>{std.verificationStatus}</span>
                    </button>
                  </td>

                  {/* Placement Status */}
                  <td className="px-4 py-3.5">
                    {std.status === 'Placed' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          Placed: {std.placedCompany}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 font-mono">
                          <span>₹{std.placedPackageLpa} LPA</span>
                          <span>&middot;</span>
                          <span>{std.tier}</span>
                        </div>
                      </div>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          std.status === 'In Process'
                            ? 'bg-sky-50 text-sky-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {std.status}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => onRunAtsScan(std)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer"
                      title="Run AI Resume Matcher"
                    >
                      <Sparkles className="w-3 h-3 text-sky-600" />
                      <span>ATS Screen</span>
                    </button>

                    <button
                      onClick={() => setActiveStudentModal(std)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="View Student Dossier"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-xs">
              No students found for current search/filter combination.
            </div>
          )}
        </div>
      </div>

      {/* Student Dossier Modal */}
      {activeStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-5 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeStudentModal.avatar}
                  alt={activeStudentModal.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeStudentModal.name}</h3>
                  <p className="text-slate-500 font-mono text-xs">
                    {activeStudentModal.rollNumber} &middot; {activeStudentModal.branch}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveStudentModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic stats */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 text-[11px] block">CGPA</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {activeStudentModal.cgpa}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">10th / 12th</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {activeStudentModal.tenthPercent}% / {activeStudentModal.twelfthPercent}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Active Backlogs</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {activeStudentModal.activeBacklogs}
                </span>
              </div>
            </div>

            {/* Resume Summary */}
            <div>
              <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px] mb-1.5">
                Profile & Project Summary
              </span>
              <p className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 leading-relaxed">
                {activeStudentModal.resumeSummary || 'No resume summary provided.'}
              </p>
            </div>

            {/* Core Tech Skills */}
            <div>
              <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px] mb-1.5">
                Verified Technical Proficiencies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeStudentModal.skills.map((sk, i) => (
                  <span
                    key={i}
                    className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-800"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* TPO Counselor Notes */}
            {activeStudentModal.notes && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900">
                <span className="font-bold text-[11px] uppercase tracking-wider block mb-0.5">
                  TPO Counselor Remarks
                </span>
                <p className="text-xs leading-relaxed">{activeStudentModal.notes}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => {
                  onRunAtsScan(activeStudentModal);
                  setActiveStudentModal(null);
                }}
                className="px-4 py-2 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Run AI ATS Resume Screen</span>
              </button>

              <button
                onClick={() => setActiveStudentModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
