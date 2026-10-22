import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Article } from '../types';
import Badge from '../components/Badge';
import { Clock, User, ChevronLeft, Loader2, Share2, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await api.get<{ article: Article; related: Article[] }>(`/articles/${slug}`);
        setArticle(res.article);
        setRelated(res.related || []);
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage-600 animate-spin mb-2" />
        <p className="text-xs text-stone-500">Preparing article reading view...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">Article Not Found</h2>
        <Link to="/articles" className="text-sm text-sage-700 underline">
          Back to awareness articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      {/* Back button */}
      <button
        onClick={() => navigate('/articles')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Articles</span>
      </button>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="sage">{article.category}</Badge>
          <span className="text-xs text-stone-400">•</span>
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-sage-600" />
            {article.readTimeMinutes} min read
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-bold text-stone-900 leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed italic border-l-4 border-sage-400 pl-4 py-1">
          {article.summary}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-100 text-sage-800 font-bold flex items-center justify-center text-sm">
              {article.author.charAt(0)}
            </div>
            <div>
              <span className="block text-xs font-bold text-stone-800">{article.author}</span>
              <span className="block text-[11px] text-stone-400">
                Published on {new Date(article.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Cover Image */}
      <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-sage-50 shadow-md">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Markdown Body */}
      <main className="prose prose-stone prose-lg max-w-none text-stone-800 leading-relaxed font-sans space-y-6">
        <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed space-y-4">
          {article.content}
        </div>
      </main>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-sage-100 space-y-6">
          <h3 className="font-display text-2xl font-bold text-stone-900">
            More in {article.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/articles/${rel.slug}`)}
                className="bg-white rounded-2xl p-4 border border-sage-100 hover:border-sage-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="w-full aspect-[16/10] rounded-xl object-cover mb-3"
                  />
                  <h4 className="font-display font-bold text-sm text-stone-900 line-clamp-2 mb-1">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2">{rel.summary}</p>
                </div>
                <span className="text-xs font-semibold text-sage-700 mt-3 flex items-center gap-1">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ArticleDetailPage;
