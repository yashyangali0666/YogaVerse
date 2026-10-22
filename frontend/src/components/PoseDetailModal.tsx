import React from 'react';
import { YogaPose } from '../types';
import Modal from './Modal';
import Badge from './Badge';
import { Clock, ShieldAlert, Heart, Wind, Play, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PoseDetailModalProps {
  pose: YogaPose | null;
  onClose: () => void;
  onStartPractice?: (pose: YogaPose) => void;
}

export const PoseDetailModal: React.FC<PoseDetailModalProps> = ({
  pose,
  onClose,
  onStartPractice,
}) => {
  const navigate = useNavigate();
  if (!pose) return null;

  const difficultyVariant =
    pose.difficulty === 'BEGINNER'
      ? 'emerald'
      : pose.difficulty === 'INTERMEDIATE'
      ? 'amber'
      : 'rose';

  return (
    <Modal isOpen={!!pose} onClose={onClose} maxWidth="3xl">
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-sage-50 shadow-inner">
            <img
              src={pose.imageUrl}
              alt={pose.englishName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant={difficultyVariant}>{pose.difficulty}</Badge>
              <Badge variant="cream">{pose.category}</Badge>
            </div>
            <div className="absolute bottom-3 right-3 bg-stone-900/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sage-300" />
              <span>Recommended: {pose.durationSeconds}s</span>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-stone-900 mb-1">
              {pose.englishName}
            </h2>
            <p className="font-serif italic text-lg text-sage-700 mb-3">{pose.sanskritName}</p>

            <div className="mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                Targeted Anatomy
              </span>
              <p className="text-sm text-stone-700 font-medium bg-sage-50/60 p-2.5 rounded-xl border border-sage-100">
                {pose.targetedBodyAreas}
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onStartPractice) {
                  onStartPractice(pose);
                } else {
                  navigate(`/guided-practice?poseId=${pose.id}`);
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white font-medium rounded-xl shadow-md shadow-sage-600/20 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              Practice This Asana in Studio
            </button>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="bg-cream-50 p-5 rounded-2xl border border-cream-200">
          <div className="flex items-center gap-2 text-stone-800 font-display text-lg font-semibold mb-2">
            <BookOpen className="w-5 h-5 text-sage-600" />
            <span>Step-by-Step Instructions</span>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
            {pose.instructions}
          </p>
        </div>

        {/* Breathing Guidance & Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-sage-50/70 border border-sage-100">
            <div className="flex items-center gap-2 text-sage-800 font-semibold text-sm mb-2">
              <Wind className="w-4 h-4 text-sage-600" />
              <span>Breathing Guidance</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">{pose.breathingGuidance}</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-2">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>Health & Mind Benefits</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">{pose.benefits}</p>
          </div>
        </div>

        {/* Contraindications & Precautions Alert */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-0.5">
              Contraindications & Safety Precautions
            </h4>
            <p className="text-xs text-amber-800/90 leading-relaxed">{pose.contraindications}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PoseDetailModal;
