import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { YogaProgram, YogaPose } from '../types';
import Badge from '../components/Badge';
import PoseDetailModal from '../components/PoseDetailModal';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  Play,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const ProgramDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [program, setProgram] = useState<YogaProgram | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);

  const fetchProgram = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ program: YogaProgram }>(`/programs/${slug}`);
      setProgram(res.program);
    } catch (err) {
      console.error('Failed to load program:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgram();
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!program) return;

    setEnrolling(true);
    try {
      await api.post(`/programs/${program.id}/enroll`);
      await fetchProgram();
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage-600 animate-spin mb-2" />
        <p className="text-xs text-stone-500">Unfolding program pathway...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">Program Not Found</h2>
        <Link to="/programs" className="text-sm text-sage-700 underline">
          Back to all programs
        </Link>
      </div>
    );
  }

  const warmupPoses = program.poses?.filter((p) => p.section === 'WARMUP') || [];
  const mainPoses = program.poses?.filter((p) => p.section === 'MAIN') || [];
  const cooldownPoses = program.poses?.filter((p) => p.section === 'COOLDOWN') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      {/* Back button */}
      <button
        onClick={() => navigate('/programs')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Programs</span>
      </button>

      {/* 1. Program Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-sage-200/80 shadow-md">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald">{program.difficulty}</Badge>
            <Badge variant="cream">{program.category}</Badge>
            <div className="inline-flex items-center gap-1 text-xs text-stone-500 font-medium ml-2">
              <Clock className="w-3.5 h-3.5 text-sage-600" />
              <span>{program.totalDurationMinutes} mins/session</span>
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
            {program.title}
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {program.description}
          </p>

          {/* Enrollment Progress if enrolled */}
          {program.enrollment && (
            <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200/60 max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-sage-900">
                <span>Active Journey Progress</span>
                <span>{program.enrollment.progressPercent}%</span>
              </div>
              <div className="w-full bg-sage-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sage-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${program.enrollment.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-500">
                Completed {program.enrollment.completedSessions} sessions.
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate(`/guided-practice?programId=${program.id}`)}
              className="px-6 py-3.5 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm shadow-md shadow-sage-600/20 transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Guided Practice Now</span>
            </button>

            {!program.enrollment && (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="px-6 py-3.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-stone-800 font-semibold text-sm border border-cream-300 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-sage-700" />
                <span>{enrolling ? 'Enrolling...' : 'Enroll in Program'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-sage-50 shadow-xl border-4 border-white">
            <img
              src={program.imageUrl}
              alt={program.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 2. Structured Syllabus / Sequence Flow */}
      <div className="space-y-8">
        <div>
          <Badge variant="sage" className="mb-1">Step-by-Step Flow</Badge>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Program Asana Sequence ({program.poses?.length || 0} Poses)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Click on any asana below to review detailed anatomy, alignment instructions, and breathing guidance.
          </p>
        </div>

        {/* Warm-up Section */}
        {warmupPoses.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <h3 className="font-display text-lg font-bold text-stone-800">
                Section 1: Warm-up & Spine Mobilization
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {warmupPoses.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPose(p.pose)}
                  className="p-4 rounded-2xl bg-white border border-sage-100 shadow-xs hover:border-sage-300 hover:shadow-md transition-all flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={p.pose.imageUrl}
                    alt={p.pose.englishName}
                    className="w-14 h-14 rounded-xl object-cover bg-sage-50 shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="font-display font-bold text-stone-900 text-sm truncate">
                      {p.pose.englishName}
                    </h4>
                    <p className="font-serif italic text-xs text-sage-600 truncate">
                      {p.pose.sanskritName}
                    </p>
                    <span className="text-[11px] text-stone-400">
                      {p.customDurationSeconds || p.pose.durationSeconds}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Flow Section */}
        {mainPoses.length > 0 && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sage-500" />
              <h3 className="font-display text-lg font-bold text-stone-800">
                Section 2: Main Flow & Postural Alignment
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mainPoses.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPose(p.pose)}
                  className="p-4 rounded-2xl bg-white border border-sage-100 shadow-xs hover:border-sage-300 hover:shadow-md transition-all flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={p.pose.imageUrl}
                    alt={p.pose.englishName}
                    className="w-14 h-14 rounded-xl object-cover bg-sage-50 shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="font-display font-bold text-stone-900 text-sm truncate">
                      {p.pose.englishName}
                    </h4>
                    <p className="font-serif italic text-xs text-sage-600 truncate">
                      {p.pose.sanskritName}
                    </p>
                    <span className="text-[11px] text-stone-400">
                      {p.customDurationSeconds || p.pose.durationSeconds}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cool-down Section */}
        {cooldownPoses.length > 0 && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400" />
              <h3 className="font-display text-lg font-bold text-stone-800">
                Section 3: Cool-down & Restorative Integration
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cooldownPoses.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPose(p.pose)}
                  className="p-4 rounded-2xl bg-white border border-sage-100 shadow-xs hover:border-sage-300 hover:shadow-md transition-all flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={p.pose.imageUrl}
                    alt={p.pose.englishName}
                    className="w-14 h-14 rounded-xl object-cover bg-sage-50 shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="font-display font-bold text-stone-900 text-sm truncate">
                      {p.pose.englishName}
                    </h4>
                    <p className="font-serif italic text-xs text-sage-600 truncate">
                      {p.pose.sanskritName}
                    </p>
                    <span className="text-[11px] text-stone-400">
                      {p.customDurationSeconds || p.pose.durationSeconds}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pose Modal */}
      <PoseDetailModal
        pose={selectedPose}
        onClose={() => setSelectedPose(null)}
        onStartPractice={() => navigate(`/guided-practice?programId=${program.id}`)}
      />
    </div>
  );
};

export default ProgramDetailPage;
