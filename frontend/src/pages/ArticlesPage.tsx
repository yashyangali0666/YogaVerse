import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Article } from '../types';
import Badge from '../components/Badge';
import { Search, BookOpen, Clock, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export const ArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Yoga Basics',
    'Breathing Exercises',
    'Meditation Guides',
    'Myths vs Facts',
    'Yoga for Students',
    'Office Yoga',
    'Safety & Precautions',
  ];

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const parts = [];
      if (searchQuery.trim()) parts.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      if (selectedCategory !== 'ALL') parts.push(`category=${encodeURIComponent(selectedCategory)}`);
      const q = parts.length ? `?${parts.join('&')}` : '';

      const res = await api.get<{ articles: Article[] }>(`/articles${q}`);
      setArticles(res.articles);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="sage">Educational Hub</Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Yoga Awareness Hub
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Deepen your understanding with evidence-based wellness articles, historical philosophy,
          anatomical safety guides, and workplace ergonomic tips.
        </p>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="bg-white p-6 rounded-3xl border border-sage-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title, keywords, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-24 py-3 rounded-2xl bg-cream-50/70 border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 text-stone-800"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-sage-600 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-sage-100 text-stone-700'
              }`}
            >
              {cat === 'ALL' ? 'All Topics' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Articles Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-sage-600 animate-spin mb-2" />
          <p className="text-xs text-stone-500">Retrieving articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-sage-100 max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-sage-400 mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold text-stone-800 mb-1">No Articles Found</h3>
          <p className="text-xs text-stone-500 mb-4">Try clearing your search terms or filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              onClick={() => navigate(`/articles/${art.slug}`)}
              className="group bg-white rounded-3xl border border-sage-100 shadow-sm hover:shadow-xl hover:border-sage-300 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="relative aspect-[16/10] bg-sage-50 overflow-hidden">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="cream">{art.category}</Badge>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-xs text-stone-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sage-600" />
                      {art.readTimeMinutes} min read
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      {art.author}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-stone-900 group-hover:text-sage-700 transition-colors mb-2 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-sage-50 flex items-center justify-between text-xs font-semibold text-sage-700">
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
