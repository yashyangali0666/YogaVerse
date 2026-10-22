import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DashboardStats, UserGoal } from '../types';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ComposedChart,
} from 'recharts';
import {
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Play,
  Edit2,
  ArrowRight,
  TrendingUp,
  Target,
  Loader2,
  User,
  Compass,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);
  const [goalDailyMinutes, setGoalDailyMinutes] = useState<number>(20);
  const [goalWeeklyDays, setGoalWeeklyDays] = useState<number>(5);
  const [goalLevel, setGoalLevel] = useState<string>('BEGINNER');
  const [goalFocus, setGoalFocus] = useState<string>('Flexibility, Stress Relief');
  const [updatingGoal, setUpdatingGoal] = useState<boolean>(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get<DashboardStats>('/dashboard/stats');
      setData(res);
      if (res.userGoal) {
        setGoalDailyMinutes(res.userGoal.dailyMinutesGoal);
        setGoalWeeklyDays(res.userGoal.weeklyDaysGoal);
        setGoalLevel(res.userGoal.targetExperienceLevel);
        setGoalFocus(res.userGoal.focusAreas);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingGoal(true);
    try {
      await api.put('/goals', {
        dailyMinutesGoal: Number(goalDailyMinutes),
        weeklyDaysGoal: Number(goalWeeklyDays),
        targetExperienceLevel: goalLevel,
        focusAreas: goalFocus,
      });
      setIsGoalModalOpen(false);
      await fetchDashboard();
      await refreshUser();
    } catch (err) {
      console.error('Failed to update goal:', err);
    } finally {
      setUpdatingGoal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage-600 animate-spin mb-2" />
        <p className="text-xs text-stone-500">Preparing your wellness dashboard...</p>
      </div>
    );
  }

  if (!data) return null;

  const { stats, weeklyActivity, recentSessions, enrolledPrograms, upcomingEvents, achievements } =
    data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* 1. Header Greeting & Today's Goal Progress */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sage-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-sage-200 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-sage-600 text-white flex items-center justify-center font-display text-2xl font-bold shrink-0">
              {user?.name.charAt(0)}
            </div>
          )}
          <div>
            <span className="text-xs font-semibold text-sage-700 tracking-wider uppercase">
              Welcome back to your breath
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-stone-900">
              {user?.name}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Target: {stats.dailyGoalMinutes} min daily mindful movement
            </p>
          </div>
        </div>

        {/* Quick Start Practice & Edit Goal */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Practice Goal</span>
          </button>
          <Link
            to="/guided-practice"
            className="px-5 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold shadow-md shadow-sage-600/20 transition-all flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Today's Session</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Practice Minutes */}
        <div className="bg-white p-6 rounded-3xl border border-sage-100 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
            Total Minutes
          </span>
          <span className="font-display text-3xl font-bold text-stone-900 block">
            {stats.totalMinutes}
          </span>
          <span className="text-[11px] text-stone-500">Recorded mindful practice</span>
        </div>

        {/* Metric 2: Completed Sessions */}
        <div className="bg-white p-6 rounded-3xl border border-sage-100 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
            Sessions Completed
          </span>
          <span className="font-display text-3xl font-bold text-stone-900 block">
            {stats.completedSessions}
          </span>
          <span className="text-[11px] text-stone-500">Full flows logged</span>
        </div>

        {/* Metric 3: Current Streak */}
        <div className="bg-white p-6 rounded-3xl border border-sage-100 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
            Daily Streak
          </span>
          <span className="font-display text-3xl font-bold text-stone-900 block">
            {stats.currentStreak} {stats.currentStreak === 1 ? 'Day' : 'Days'}
          </span>
          <span className="text-[11px] text-stone-500">Consecutive calendar days</span>
        </div>

        {/* Metric 4: Today's Goal Completion */}
        <div className="bg-white p-6 rounded-3xl border border-sage-100 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Today's Goal
            </span>
            <span className="text-xs font-bold text-sage-700">
              {stats.todayMinutes} / {stats.dailyGoalMinutes}m
            </span>
          </div>
          <span className="font-display text-3xl font-bold text-stone-900 block">
            {stats.goalCompletionPercent}%
          </span>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-sage-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.goalCompletionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Analytics Chart & Today's Recommended Routine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Weekly Activity Recharts (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-sage-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-stone-900">
                Weekly Practice Activity
              </h3>
              <p className="text-xs text-stone-500">Minutes practiced per day vs daily target</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-sage-50 text-sage-800 rounded-full border border-sage-100">
              Past 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f4f0" />
                <XAxis dataKey="day" tickLine={false} stroke="#8c998c" fontSize={12} />
                <YAxis tickLine={false} stroke="#8c998c" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #ccd9cc',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} mins`, 'Practice Time']}
                />
                <Bar dataKey="minutes" fill="#5e835e" radius={[8, 8, 0, 0]} maxBarSize={40} />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#c5a286"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                  name="Daily Goal"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Recommended Practice (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-sage-100 shadow-xs space-y-4">
          <Badge variant="sage">Suggested For You</Badge>
          <h3 className="font-display text-xl font-bold text-stone-900">
            {data.recommendedProgram?.title || 'Daily Balance Awakening'}
          </h3>
          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
            {data.recommendedProgram?.description ||
              'A mindful sequence calibrated to ease joint stiffness and cultivate steady presence.'}
          </p>

          {data.recommendedProgram?.imageUrl && (
            <img
              src={data.recommendedProgram.imageUrl}
              alt="Recommended Flow"
              className="w-full aspect-[16/10] rounded-2xl object-cover bg-sage-50"
            />
          )}

          <button
            onClick={() => {
              if (data.recommendedProgram) {
                navigate(`/guided-practice?programId=${data.recommendedProgram.id}`);
              } else {
                navigate('/guided-practice');
              }
            }}
            className="w-full py-3 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Begin Recommendation</span>
          </button>
        </div>
      </div>

      {/* 4. Enrolled Programs & Recent Practice History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrolled Programs */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sage-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-stone-900">
              Enrolled Programs ({enrolledPrograms.length})
            </h3>
            <Link to="/programs" className="text-xs font-semibold text-sage-700 hover:underline">
              Explore More
            </Link>
          </div>

          {enrolledPrograms.length === 0 ? (
            <div className="p-8 text-center bg-cream-50/50 rounded-2xl border border-cream-200">
              <Compass className="w-8 h-8 text-sage-400 mx-auto mb-2" />
              <p className="text-xs text-stone-600 mb-3">You are not enrolled in any programs yet.</p>
              <Link
                to="/programs"
                className="px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold"
              >
                Enroll in a 7-Day Journey
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolledPrograms.map((enr) => (
                <div
                  key={enr.id}
                  className="p-4 rounded-2xl bg-cream-50/60 border border-cream-200/80 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-display font-bold text-sm text-stone-900">
                        {enr.program.title}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {enr.completedSessions} sessions logged
                      </p>
                    </div>
                    <Badge variant={enr.status === 'COMPLETED' ? 'emerald' : 'sage'}>
                      {enr.status}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-stone-600">
                      <span>Progress</span>
                      <span>{enr.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sage-600 h-1.5 rounded-full"
                        style={{ width: `${enr.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/guided-practice?programId=${enr.program.id}`)}
                    className="w-full py-2 rounded-xl bg-white hover:bg-sage-600 hover:text-white border border-sage-200 text-sage-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Resume Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Session History */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sage-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-stone-900">Recent Sessions</h3>
            <span className="text-xs text-stone-400">Validated Database Records</span>
          </div>

          {recentSessions.length === 0 ? (
            <div className="p-8 text-center bg-cream-50/50 rounded-2xl border border-cream-200">
              <Clock className="w-8 h-8 text-sage-400 mx-auto mb-2" />
              <p className="text-xs text-stone-600 mb-3">No practice records completed yet.</p>
              <Link
                to="/guided-practice"
                className="px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold"
              >
                Start First Practice (5 min)
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {recentSessions.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs"
                >
                  <div className="truncate">
                    <h5 className="font-display font-bold text-stone-900 truncate">
                      {s.sessionTitle}
                    </h5>
                    <p className="text-[11px] text-stone-500">
                      {new Date(s.completedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="font-bold text-sage-800 bg-sage-100 px-2.5 py-1 rounded-full shrink-0 ml-3">
                    {Math.floor(s.durationSeconds / 60)}m {s.durationSeconds % 60}s
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Milestones & Achievements Showcase */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sage-100 shadow-xs space-y-6">
        <div>
          <Badge variant="earth" className="mb-1">Badges of Dedication</Badge>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
            Achievements & Milestones
          </h3>
          <p className="text-xs text-stone-500">
            Earn traditional honor badges as your practice consistency, duration, and mindfulness grow.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border text-center transition-all ${
                ach.isUnlocked
                  ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                  : 'bg-stone-50/60 border-stone-200 opacity-50 grayscale'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-2 ${
                  ach.isUnlocked ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-400'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>
              <h5 className="font-display font-bold text-xs text-stone-900 truncate">{ach.title}</h5>
              <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5">{ach.description}</p>
              <span
                className={`inline-block mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  ach.isUnlocked
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {ach.isUnlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Practice Goal Modal */}
      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title="Adjust Wellness Practice Goal"
        maxWidth="md"
      >
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Daily Practice Target (Minutes)
            </label>
            <input
              type="number"
              min={5}
              max={180}
              value={goalDailyMinutes}
              onChange={(e) => setGoalDailyMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-sage-500 text-stone-900"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Weekly Days Target
            </label>
            <input
              type="number"
              min={1}
              max={7}
              value={goalWeeklyDays}
              onChange={(e) => setGoalWeeklyDays(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-sage-500 text-stone-900"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Target Level
            </label>
            <select
              value={goalLevel}
              onChange={(e) => setGoalLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-sage-500 text-stone-900"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Focus Areas
            </label>
            <input
              type="text"
              value={goalFocus}
              onChange={(e) => setGoalFocus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-sage-500 text-stone-900"
              placeholder="e.g. Flexibility, Core, Stress Relief"
              required
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsGoalModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatingGoal}
              className="flex-1 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold shadow-md"
            >
              {updatingGoal ? 'Saving...' : 'Save Goal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
