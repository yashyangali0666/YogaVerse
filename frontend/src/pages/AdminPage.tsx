import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import {
  Shield,
  Users,
  Layers,
  Compass,
  BookOpen,
  Calendar,
  Activity,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Loader2,
  FileText,
  Search,
} from 'lucide-react';
import { YogaPose, YogaProgram, Article, Event, Difficulty, PoseCategory, ProgramCategory } from '../types';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'poses' | 'programs' | 'articles' | 'events' | 'users' | 'audit'>('overview');

  // Stats
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Entities
  const [poses, setPoses] = useState<YogaPose[]>([]);
  const [programs, setPrograms] = useState<YogaProgram[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Modals
  const [poseModalOpen, setPoseModalOpen] = useState<boolean>(false);
  const [editingPose, setEditingPose] = useState<YogaPose | null>(null);

  const [eventAttendeesModalOpen, setEventAttendeesModalOpen] = useState<boolean>(false);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState<any[]>([]);
  const [attendeeEventTitle, setAttendeeEventTitle] = useState<string>('');

  // Form State for Pose Creation/Editing
  const [poseForm, setPoseForm] = useState({
    englishName: '',
    sanskritName: '',
    difficulty: 'BEGINNER' as Difficulty,
    category: 'STANDING' as PoseCategory,
    targetedBodyAreas: '',
    durationSeconds: 60,
    instructions: '',
    breathingGuidance: '',
    benefits: '',
    contraindications: '',
    imageUrl: '',
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, posesRes, progsRes, artsRes, evsRes, usersRes, logsRes] = await Promise.all([
        api.get<any>('/admin/stats'),
        api.get<{ poses: YogaPose[] }>('/poses'),
        api.get<{ programs: YogaProgram[] }>('/programs'),
        api.get<{ articles: Article[] }>('/articles'),
        api.get<{ events: Event[] }>('/events'),
        api.get<{ users: any[] }>('/admin/users'),
        api.get<{ logs: any[] }>('/admin/audit-logs'),
      ]);

      setStats(statsRes.stats);
      setPoses(posesRes.poses);
      setPrograms(progsRes.programs);
      setArticles(artsRes.articles);
      setEvents(evsRes.events);
      setUsersList(usersRes.users);
      setAuditLogs(logsRes.logs);
    } catch (err) {
      console.error('Failed to load admin console data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle Pose Submit
  const handlePoseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPose) {
        await api.put(`/poses/${editingPose.id}`, poseForm);
      } else {
        await api.post('/poses', poseForm);
      }
      setPoseModalOpen(false);
      setEditingPose(null);
      await loadAllData();
    } catch (err: any) {
      alert(err.message || 'Error saving pose');
    }
  };

  const handleDeletePose = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete pose "${name}"?`)) return;
    try {
      await api.delete(`/poses/${id}`);
      await loadAllData();
    } catch (err: any) {
      alert(err.message || 'Error deleting pose');
    }
  };

  const handleOpenEditPose = (p: YogaPose) => {
    setEditingPose(p);
    setPoseForm({
      englishName: p.englishName,
      sanskritName: p.sanskritName,
      difficulty: p.difficulty,
      category: p.category,
      targetedBodyAreas: p.targetedBodyAreas,
      durationSeconds: p.durationSeconds,
      instructions: p.instructions,
      breathingGuidance: p.breathingGuidance,
      benefits: p.benefits,
      contraindications: p.contraindications,
      imageUrl: p.imageUrl,
    });
    setPoseModalOpen(true);
  };

  const handleOpenAddPose = () => {
    setEditingPose(null);
    setPoseForm({
      englishName: '',
      sanskritName: '',
      difficulty: 'BEGINNER',
      category: 'STANDING',
      targetedBodyAreas: '',
      durationSeconds: 60,
      instructions: '',
      breathingGuidance: '',
      benefits: '',
      contraindications: '',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    });
    setPoseModalOpen(true);
  };

  // View Event Attendees
  const handleViewAttendees = async (ev: Event) => {
    try {
      const res = await api.get<{ attendees: any[] }>(`/events/${ev.id}/attendees`);
      setSelectedEventAttendees(res.attendees);
      setAttendeeEventTitle(ev.title);
      setEventAttendeesModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Error loading attendees');
    }
  };

  // Toggle user role
  const handleToggleRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Change this user's role to ${nextRole}?`)) return;
    try {
      await api.put(`/admin/users/${userId}/role`, { role: nextRole });
      await loadAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
        <p className="text-xs text-stone-500">Loading administrator controls...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wider border border-purple-200">
              Administrator Console
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
            YogaLife Control Center
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage asanas, programs, educational publications, workshops, and user authorizations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddPose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Pose</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Platform Stats', icon: Activity },
          { id: 'poses', label: `Asanas (${poses.length})`, icon: Layers },
          { id: 'programs', label: `Programs (${programs.length})`, icon: Compass },
          { id: 'articles', label: `Articles (${articles.length})`, icon: BookOpen },
          { id: 'events', label: `Events (${events.length})`, icon: Calendar },
          { id: 'users', label: `Users (${usersList.length})`, icon: Users },
          { id: 'audit', label: `Audit Trail (${auditLogs.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white hover:bg-purple-50 text-stone-600 border border-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs uppercase font-bold text-stone-400 block">Total Users</span>
              <span className="font-display text-3xl font-bold text-stone-900 block">
                {stats.totalUsers}
              </span>
              <span className="text-[11px] text-stone-500">Registered practitioners</span>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs uppercase font-bold text-stone-400 block">Practice Minutes</span>
              <span className="font-display text-3xl font-bold text-stone-900 block">
                {stats.totalMinutes}
              </span>
              <span className="text-[11px] text-stone-500">Total studio practice time</span>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs uppercase font-bold text-stone-400 block">Completed Flows</span>
              <span className="font-display text-3xl font-bold text-stone-900 block">
                {stats.totalSessions}
              </span>
              <span className="text-[11px] text-stone-500">Validated session logs</span>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs uppercase font-bold text-stone-400 block">Program Enrollments</span>
              <span className="font-display text-3xl font-bold text-stone-900 block">
                {stats.totalEnrollments}
              </span>
              <span className="text-[11px] text-stone-500">Active pathway learners</span>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-3xl border border-purple-200 space-y-2">
            <h4 className="font-display text-lg font-bold text-purple-900">
              System Architecture & Integrity Status
            </h4>
            <p className="text-xs text-purple-800 leading-relaxed">
              PostgreSQL database sync active via Prisma ORM. Role checks enforced server-side.
              Administrative events recorded to dedicated immutable audit table.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Poses Management */}
      {activeTab === 'poses' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <h3 className="font-display font-bold text-base text-stone-900">All Yoga Asanas</h3>
            <button
              onClick={handleOpenAddPose}
              className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold"
            >
              + Add Pose
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Asana</th>
                  <th className="p-3">Sanskrit</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {poses.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="p-3 font-semibold text-stone-900 flex items-center gap-2">
                      <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      <span>{p.englishName}</span>
                    </td>
                    <td className="p-3 font-serif italic text-stone-500">{p.sanskritName}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">
                      <Badge size="sm" variant={p.difficulty === 'BEGINNER' ? 'emerald' : 'amber'}>
                        {p.difficulty}
                      </Badge>
                    </td>
                    <td className="p-3">{p.durationSeconds}s</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditPose(p)}
                        className="text-stone-500 hover:text-purple-600 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePose(p.id, p.englishName)}
                        className="text-rose-500 hover:text-rose-700 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Programs Management */}
      {activeTab === 'programs' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50">
            <h3 className="font-display font-bold text-base text-stone-900">Curated Programs</h3>
          </div>
          <div className="divide-y divide-stone-100">
            {programs.map((prog) => (
              <div key={prog.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={prog.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{prog.title}</h4>
                    <p className="text-stone-500 line-clamp-1">{prog.description}</p>
                    <span className="text-[10px] text-stone-400">
                      {prog.totalDurationMinutes} mins/session • {prog.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Articles Management */}
      {activeTab === 'articles' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50">
            <h3 className="font-display font-bold text-base text-stone-900">
              Awareness Hub Articles
            </h3>
          </div>
          <div className="divide-y divide-stone-100">
            {articles.map((art) => (
              <div key={art.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{art.title}</h4>
                  <span className="text-stone-500">
                    Category: {art.category} • Author: {art.author} • {art.readTimeMinutes} min read
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Events Management */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50">
            <h3 className="font-display font-bold text-base text-stone-900">Workshops & Events</h3>
          </div>
          <div className="divide-y divide-stone-100">
            {events.map((ev) => (
              <div key={ev.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{ev.title}</h4>
                  <p className="text-stone-500">
                    {new Date(ev.eventDate).toLocaleDateString()} • {ev.venue} • Seats: {ev.registeredSeats}/{ev.maxSeats}
                  </p>
                </div>
                <button
                  onClick={() => handleViewAttendees(ev)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold"
                >
                  View Registered ({ev.registeredSeats})
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: User Accounts & Roles */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50">
            <h3 className="font-display font-bold text-base text-stone-900">User Accounts & Roles</h3>
          </div>
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Sessions Completed</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50">
                  <td className="p-3 font-semibold text-stone-900">{u.name}</td>
                  <td className="p-3 font-mono text-stone-600">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-sage-100 text-sage-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">{u._count?.sessions || 0}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleRole(u.id, u.role)}
                      className="text-purple-600 hover:text-purple-900 font-semibold"
                    >
                      Change Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 7: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50">
            <h3 className="font-display font-bold text-base text-stone-900">
              System Audit Trail ({auditLogs.length} Records)
            </h3>
          </div>
          <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md">
                    {log.action}
                  </span>
                  <span className="text-stone-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-stone-700 font-mono text-[11px]">{log.details}</p>
                <span className="text-[10px] text-stone-400 block">
                  Actor: {log.userEmail || 'System'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pose Modal Form */}
      <Modal
        isOpen={poseModalOpen}
        onClose={() => setPoseModalOpen(false)}
        title={editingPose ? 'Edit Yoga Asana' : 'Create New Yoga Asana'}
        maxWidth="2xl"
      >
        <form onSubmit={handlePoseSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
                English Name
              </label>
              <input
                type="text"
                value={poseForm.englishName}
                onChange={(e) => setPoseForm({ ...poseForm, englishName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
                Sanskrit Name
              </label>
              <input
                type="text"
                value={poseForm.sanskritName}
                onChange={(e) => setPoseForm({ ...poseForm, sanskritName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
                Category
              </label>
              <select
                value={poseForm.category}
                onChange={(e) => setPoseForm({ ...poseForm, category: e.target.value as PoseCategory })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              >
                {['STANDING', 'SEATED', 'BALANCING', 'SUPINE', 'PRONE', 'INVERSION', 'RESTORATIVE'].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
                Difficulty
              </label>
              <select
                value={poseForm.difficulty}
                onChange={(e) => setPoseForm({ ...poseForm, difficulty: e.target.value as Difficulty })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
                Duration (sec)
              </label>
              <input
                type="number"
                min={10}
                max={600}
                value={poseForm.durationSeconds}
                onChange={(e) => setPoseForm({ ...poseForm, durationSeconds: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
              Targeted Body Areas
            </label>
            <input
              type="text"
              value={poseForm.targetedBodyAreas}
              onChange={(e) => setPoseForm({ ...poseForm, targetedBodyAreas: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              placeholder="e.g. Spine, Hamstrings, Core"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={poseForm.imageUrl}
              onChange={(e) => setPoseForm({ ...poseForm, imageUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
              Instructions
            </label>
            <textarea
              rows={3}
              value={poseForm.instructions}
              onChange={(e) => setPoseForm({ ...poseForm, instructions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
              Breathing Guidance
            </label>
            <textarea
              rows={2}
              value={poseForm.breathingGuidance}
              onChange={(e) => setPoseForm({ ...poseForm, breathingGuidance: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Benefits</label>
            <textarea
              rows={2}
              value={poseForm.benefits}
              onChange={(e) => setPoseForm({ ...poseForm, benefits: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
              Contraindications & Precautions
            </label>
            <textarea
              rows={2}
              value={poseForm.contraindications}
              onChange={(e) => setPoseForm({ ...poseForm, contraindications: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              required
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setPoseModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md"
            >
              {editingPose ? 'Update Pose' : 'Create Pose'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Attendees Modal */}
      <Modal
        isOpen={eventAttendeesModalOpen}
        onClose={() => setEventAttendeesModalOpen(false)}
        title={`Attendees: ${attendeeEventTitle}`}
        maxWidth="md"
      >
        <div className="space-y-3">
          {selectedEventAttendees.length === 0 ? (
            <p className="text-xs text-stone-500 py-4 text-center">No attendees registered yet.</p>
          ) : (
            selectedEventAttendees.map((att, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
              >
                <div>
                  <h5 className="font-bold text-stone-900">{att.name}</h5>
                  <p className="text-[11px] text-stone-500">{att.email}</p>
                </div>
                <span className="text-[10px] text-stone-400">
                  {new Date(att.registeredAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;
