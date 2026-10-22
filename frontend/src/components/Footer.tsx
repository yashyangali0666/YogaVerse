import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Mail, Globe, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sage-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-display text-2xl font-bold text-white tracking-tight">
                Yoga<span className="text-sage-400">Life</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Your comprehensive yoga awareness & practice platform. Dedicated to sharing authentic
              yogic wisdom, mindful movement, guided breathwork, and empowering lifelong personal
              wellness.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800 text-sage-400 text-xs font-medium border border-stone-700">
                <Sparkles className="w-3.5 h-3.5" />
                Rooted in Classical Ashtanga Tradition
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
              Explore Practice
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/poses" className="hover:text-sage-400 transition-colors">
                  Asanas Library
                </Link>
              </li>
              <li>
                <Link to="/guided-practice" className="hover:text-sage-400 transition-colors">
                  Guided Practice Studio
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-sage-400 transition-colors">
                  Curated Programs
                </Link>
              </li>
              <li>
                <Link to="/planner" className="hover:text-sage-400 transition-colors">
                  Personalized Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Education */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
              Knowledge & Roots
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/about" className="hover:text-sage-400 transition-colors">
                  About Yoga Philosophy
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-sage-400 transition-colors">
                  Yoga Awareness Hub
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-sage-400 transition-colors">
                  Community Workshops
                </Link>
              </li>
              <li>
                <Link to="/about#eight-limbs" className="hover:text-sage-400 transition-colors">
                  The Eight Limbs (Ashtanga)
                </Link>
              </li>
            </ul>
          </div>

          {/* Philosophy / Disclaimer */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
              Peace & Safety
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Yoga is a transformative path of non-violence (Ahimsa) toward your body. Practice with
              patient self-awareness and honour your unique constitution.
            </p>
            <div className="text-[11px] text-stone-500">
              General wellness guidance. Not medical advice.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} YogaLife — Yoga Awareness & Practice Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built with Love, Science & Traditional Wisdom</span>
            <Link to="/about" className="hover:text-stone-300 transition-colors">
              Philosophy & Ethics
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
