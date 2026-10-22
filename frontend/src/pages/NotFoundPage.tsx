import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge';
import { Compass, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-4">
      <div className="w-16 h-16 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>
      <Badge variant="sage">Path Not Found</Badge>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">404 — Still Waters</h1>
      <p className="text-sm text-stone-600 max-w-md">
        The mindful page you seek does not exist or has dissolved into quiet contemplation.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-xs shadow-md transition-all mt-4"
      >
        <span>Return to Serenity (Home)</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default NotFoundPage;
