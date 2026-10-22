import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { YogaPose, PoseCategory, Difficulty } from '../types';
import PoseCard from '../components/PoseCard';
import PoseDetailModal from '../components/PoseDetailModal';
import Badge from '../components/Badge';
import { Search, Filter, SlidersHorizontal, Loader2, Sparkles, RefreshCw } from 'lucide-react';

export const PosesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [poses, setPoses] = useState<YogaPose[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(searchParams.get('difficulty') || 'ALL');
  const [sortBy, setSortBy] = useState<string>('englishName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Standing', value: 'STANDING' },
    { label: 'Seated', value: 'SEATED' },
    { label: 'Balancing', value: 'BALANCING' },
    { label: 'Supine', value: 'SUPINE' },
    { label: 'Prone', value: 'PRONE' },
    { label: 'Inversion', value: 'INVERSION' },
    { label: 'Restorative', value: 'RESTORATIVE' },
  ];

  const difficulties: { label: string; value: string }[] = [
    { label: 'All Levels', value: 'ALL' },
    { label: 'Beginner', value: 'BEGINNER' },
    { label: 'Intermediate', value: 'INTERMEDIATE' },
    { label: 'Advanced', value: 'ADVANCED' },
  ];

  const fetchPoses = async () => {
    setLoading(true);
    try {
      const queryParts = [];
      if (searchQuery.trim()) queryParts.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      if (selectedCategory !== 'ALL') queryParts.push(`category=${selectedCategory}`);
      if (selectedDifficulty !== 'ALL') queryParts.push(`difficulty=${selectedDifficulty}`);
      queryParts.push(`sortBy=${sortBy}`);
      queryParts.push(`sortOrder=${sortOrder}`);

      const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
      const data = await api.get<{ poses: YogaPose[]; count: number }>(`/poses${queryString}`);
      setPoses(data.poses);
    } catch (err) {
      console.error('Failed to fetch poses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoses();
  }, [selectedCategory, selectedDifficulty, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPoses();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedDifficulty('ALL');
    setSortBy('englishName');
    setSortOrder('asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="sage">Asana Treasury</Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Yoga Asanas Library
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Explore over 20 classical and therapeutic postures. Review biomechanical alignment,
          respiratory guidance, anatomical targets, and safety contraindications.
        </p>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-sage-200/80 shadow-sm space-y-6">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search poses by English name, Sanskrit, target anatomy, or benefits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-cream-50/70 border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:bg-white transition-all text-stone-800"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Search
          </button>
        </form>

        {/* Categories Pills */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Category
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-sage-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-sage-100 text-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulties & Sort Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-sage-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-2">
              Level:
            </span>
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() => setSelectedDifficulty(diff.value)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                  selectedDifficulty === diff.value
                    ? 'bg-earth-600 text-white'
                    : 'bg-stone-50 hover:bg-stone-200 text-stone-600'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Sort:
            </span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so as 'asc' | 'desc');
              }}
              className="text-xs rounded-xl bg-stone-50 border border-stone-200 py-1.5 px-3 text-stone-700 focus:outline-none focus:ring-1 focus:ring-sage-500"
            >
              <option value="englishName-asc">Name (A-Z)</option>
              <option value="englishName-desc">Name (Z-A)</option>
              <option value="durationSeconds-asc">Duration (Shortest first)</option>
              <option value="durationSeconds-desc">Duration (Longest first)</option>
            </select>

            {(selectedCategory !== 'ALL' || selectedDifficulty !== 'ALL' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1 ml-2"
                title="Reset filters"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Results Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Showing <span className="text-sage-800 font-bold">{poses.length}</span> Asanas
          </p>
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-sage-600 animate-spin mb-2" />
            <p className="text-xs text-stone-500">Finding your asanas...</p>
          </div>
        ) : poses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-sage-100 max-w-md mx-auto">
            <Sparkles className="w-10 h-10 text-sage-400 mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold text-stone-800 mb-1">No Poses Found</h3>
            <p className="text-xs text-stone-500 mb-4">
              Try adjusting your search terms or clearing your difficulty and category filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {poses.map((pose) => (
              <PoseCard
                key={pose.id}
                pose={pose}
                onSelect={(p) => setSelectedPose(p)}
                onPractice={(p) => navigate(`/guided-practice?poseId=${p.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <PoseDetailModal
        pose={selectedPose}
        onClose={() => setSelectedPose(null)}
        onStartPractice={(p) => navigate(`/guided-practice?poseId=${p.id}`)}
      />
    </div>
  );
};

export default PosesPage;
