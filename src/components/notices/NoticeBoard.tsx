import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { Notice, Branch } from '../../types';
import {
  Bell,
  Search,
  Plus,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  FileText,
} from 'lucide-react';

interface NoticeBoardProps {
  onOpenAiDrafter: () => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ onOpenAiDrafter }) => {
  const { notices, publishNotice, role } = usePlacement();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(notices[0]?.id || null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New notice form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Notice['category']>('Drive Announcement');
  const [urgency, setUrgency] = useState<Notice['urgency']>('High');
  const [content, setContent] = useState('');
  const [actionRequired, setActionRequired] = useState('');

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.circularNumber.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    publishNotice({
      title,
      circularNumber: `TPO/CIR/2026/${Math.floor(150 + Math.random() * 800)}`,
      category,
      author: 'Prof. Dr. Rajesh Sharma',
      authorRole: 'Head - Training & Placement Directorate',
      date: new Date().toISOString().split('T')[0],
      urgency,
      targetBranches: ['All'],
      content,
      actionRequired: actionRequired || undefined,
    });

    setShowCreateModal(false);
    setTitle('');
    setContent('');
    setActionRequired('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Institutional Circulars & Placement Notices
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative communications, round schedules, policy compliance memos, and shortlist notifications.
          </p>
        </div>

        {(role === 'tpo_admin' || role === 'faculty') && (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAiDrafter}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
            >
              <span>Draft with AI</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Circular</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search circulars by subject, keyword, or circular no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {['all', 'Drive Announcement', 'Interview Schedule', 'Policy Update', 'Training & Preparation'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'All Notices' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Feed List */}
      <div className="space-y-3">
        {filteredNotices.map((notice) => {
          const isExpanded = expandedNoticeId === notice.id;

          return (
            <div
              key={notice.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1.5">
                  {/* Quiet unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono text-slate-700 font-bold">{notice.circularNumber}</span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {notice.date}
                    </span>
                    <span>&middot;</span>
                    <span>{notice.category}</span>
                    <span>&middot;</span>
                    <span
                      className={`font-semibold ${
                        notice.urgency === 'Critical'
                          ? 'text-rose-600'
                          : notice.urgency === 'High'
                          ? 'text-amber-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {notice.urgency} Priority
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{notice.title}</h3>
                </div>

                <div className="p-1 text-slate-400 hover:text-slate-600 rounded">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs text-slate-700 space-y-4 animate-in fade-in-50">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 whitespace-pre-line leading-relaxed">
                    {notice.content}
                  </div>

                  {notice.actionRequired && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <span className="font-bold">Required Student Action: </span>
                        <span>{notice.actionRequired}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <div>
                      <span>Issued by: </span>
                      <strong className="text-slate-700">{notice.author}</strong> ({notice.authorRole})
                    </div>
                    <div>
                      <span>Circulated to: </span>
                      <span className="text-slate-600 font-medium">
                        {notice.targetBranches.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredNotices.length === 0 && (
        <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
          No circulars match the selected filter query.
        </div>
      )}

      {/* Broadcast Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Broadcast Placement Circular</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject / Header *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technical Round 1 Shortlist Announcement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="Drive Announcement">Drive Announcement</option>
                    <option value="Interview Schedule">Interview Schedule</option>
                    <option value="Offer Letter Release">Offer Letter Release</option>
                    <option value="Policy Update">Policy Update</option>
                    <option value="Training & Preparation">Training & Preparation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Circular Content / Instructions *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="State venue, reporting time, documentation requirements, and instructions..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Action Required Deadline</label>
                <input
                  type="text"
                  placeholder="e.g. Upload resume by 6 PM today"
                  value={actionRequired}
                  onChange={(e) => setActionRequired(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  Broadcast Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
