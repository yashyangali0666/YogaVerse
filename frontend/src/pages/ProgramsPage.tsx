import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { YogaProgram, ProgramCategory, Difficulty } from '../types';
import Badge from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Clock,
  Layers,
  ArrowRight,
  CheckCircle,
  Play,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const ProgramsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [programs, setPrograms] = useState<YogaProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { label: 'All Journeys', value: 'ALL' },
    { label: 'Beginners', value: 'BEGINNERS' },
    { label: 'Morning Flow', value: 'MORNING' },
    { label: 'Flexibility', value: 'FLEXIBILITY' },
    { label: 'Stress Relief', value: 'STRESS_RELIEF' },
    { label: 'Desk Break', value: 'DESK_BREAK' },
    { label: 'Evening', value: 'EVENING' },
  ];

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const query = selectedCategory !== 'ALL' ? `?category=${selectedCategory}` : '';
      const res = await api.get<{ programs: YogaProgram[] }>(`/programs${query}`);
      setPrograms(res.programs);
    } catch (err) {
      console.error('Failed to load programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [selectedCategory]);

  const handleEnroll = async (programId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/programs/${programId}/enroll`);
      fetchPrograms();
    } catch (err) {
      console.error('Failed to enroll:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="sage">Curated Pathways</Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Yoga Programs & Pathways
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Follow expert-structured journeys designed to build alignment, melt workplace stiffness,
          and establish a calm daily practice habit.
        </p>
      </div>

      {/* 2. Filter tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setSelectedCategory(c.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              selectedCategory === c.value
                ? 'bg-sage-600 text-white shadow-xs'
                : 'bg-white hover:bg-sage-50 text-stone-600 border border-stone-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 3. Program Cards Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-sage-600 animate-spin mb-2" />
          <p className="text-xs text-stone-500">Loading yoga pathways...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog) => (
            <div
              key={prog.id}
              onClick={() => navigate(`/programs/${prog.slug}`)}
              className="group bg-white rounded-3xl border border-sage-100 shadow-sm hover:shadow-xl hover:border-sage-300 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Image banner */}
              <div className="relative aspect-[16/10] bg-sage-50 overflow-hidden">
                <img
                  src={prog.imageUrl}
                  alt={prog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="emerald">{prog.difficulty}</Badge>
                  <Badge variant="cream">{prog.category}</Badge>
                </div>

                <div className="absolute bottom-3 right-3 bg-stone-900/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sage-300" />
                  <span>{prog.totalDurationMinutes} mins/session</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-stone-900 group-hover:text-sage-700 transition-colors mb-2">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                {/* Enrollment status if enrolled */}
                {prog.enrollment && (
                  <div className="p-3 rounded-2xl bg-sage-50 border border-sage-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-sage-800">
                      <span>Enrollment Progress</span>
                      <span>{prog.enrollment.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-sage-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sage-600 h-1.5 rounded-full"
                        style={{ width: `${prog.enrollment.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-sage-50 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-sage-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Sequence <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/guided-practice?programId=${prog.id}`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Practice Flow</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramsPage;
