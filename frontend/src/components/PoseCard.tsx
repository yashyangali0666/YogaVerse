import React from 'react';
import { YogaPose } from '../types';
import Badge from './Badge';
import { Clock, Activity, ArrowRight } from 'lucide-react';

interface PoseCardProps {
  pose: YogaPose;
  onSelect: (pose: YogaPose) => void;
  onPractice?: (pose: YogaPose) => void;
}

export const PoseCard: React.FC<PoseCardProps> = ({ pose, onSelect, onPractice }) => {
  const difficultyVariant =
    pose.difficulty === 'BEGINNER'
      ? 'emerald'
      : pose.difficulty === 'INTERMEDIATE'
      ? 'amber'
      : 'rose';

  return (
    <div
      onClick={() => onSelect(pose)}
      className="group relative bg-white rounded-2xl border border-sage-100 shadow-sm hover:shadow-xl hover:border-sage-300 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Pose Image with Overlay */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sage-50">
        <img
          src={pose.imageUrl}
          alt={pose.englishName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Category & Difficulty Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant={difficultyVariant} size="sm">
            {pose.difficulty}
          </Badge>
          <Badge variant="cream" size="sm">
            {pose.category}
          </Badge>
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 bg-stone-900/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3 text-sage-300" />
          <span>{pose.durationSeconds}s</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="font-display text-xl font-bold text-stone-800 group-hover:text-sage-700 transition-colors">
              {pose.englishName}
            </h3>
          </div>
          <p className="text-xs font-serif italic text-sage-600 mb-3">{pose.sanskritName}</p>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {pose.benefits}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
            <Activity className="w-3.5 h-3.5 text-sage-500 shrink-0" />
            <span className="truncate">{pose.targetedBodyAreas}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-sage-50 flex items-center justify-between text-xs font-medium text-sage-700">
          <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
          {onPractice && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPractice(pose);
              }}
              className="px-3 py-1 bg-sage-50 hover:bg-sage-600 hover:text-white text-sage-700 rounded-lg transition-colors text-xs font-medium"
            >
              Practice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoseCard;
