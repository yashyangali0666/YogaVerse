import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Difficulty, YogaPose, YogaProgram } from '../types';
import Badge from '../components/Badge';
import {
  Compass,
  Clock,
  Sparkles,
  Play,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Sun,
  Moon,
  Coffee,
  Heart,
  Activity,
} from 'lucide-react';

interface PlannerRecommendation {
  routineTitle: string;
  summary: string;
  timeAllocation: {
    warmUpMinutes: number;
    mainPracticeMinutes: number;
    coolDownMinutes: number;
    totalMinutes: number;
  };
  matchedProgram?: YogaProgram | null;
  suggestedPoses: YogaPose[];
  guidelines: string[];
  disclaimer: string;
}

export const PlannerPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard State
  const [experienceLevel, setExperienceLevel] = useState<Difficulty>('BEGINNER');
  const [availableMinutes, setAvailableMinutes] = useState<number>(15);
  const [sessionType, setSessionType] = useState<string>('GENTLE');
  const [wellnessGoals, setWellnessGoals] = useState<string[]>(['flexibility', 'stress_relief']);
  const [timeOfDay, setTimeOfDay] = useState<string>('MORNING');

  const [loading, setLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<PlannerRecommendation | null>(null);

  const goalOptions = [
    { id: 'flexibility', label: 'Flexibility & Hip Opening' },
    { id: 'stress_relief', label: 'Stress Relief & Anxiety Calm' },
    { id: 'posture', label: 'Spine & Postural Alignment' },
    { id: 'energy', label: 'Invigorating Morning Energy' },
    { id: 'sleep', label: 'Deep Evening Rest & Sleep' },
  ];

  const handleToggleGoal = (id: string) => {
    if (wellnessGoals.includes(id)) {
      if (wellnessGoals.length > 1) {
        setWellnessGoals(wellnessGoals.filter((g) => g !== id));
      }
    } else {
      setWellnessGoals([...wellnessGoals, id]);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<{ recommendation: PlannerRecommendation }>('/planner/recommend', {
        experienceLevel,
        availableMinutes,
        sessionType,
        wellnessGoals,
        timeOfDay,
      });
      setRecommendation(res.recommendation);
    } catch (err) {
      console.error('Planner error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecommendation(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* 1. Header */}
      <div className="text-center space-y-3">
        <Badge variant="sage">Rule-Based Advisor</Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Personalized Yoga Planner
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Tell us about your schedule, practice level, and wellness goals. Our deterministic engine
          curates an optimal sequence tailored for you.
        </p>
      </div>

      {recommendation ? (
        /* 2. Generated Plan Result View */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sage-200 shadow-xl space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sage-100">
            <div>
              <Badge variant="emerald" className="mb-2">Your Tailored Sequence</Badge>
              <h2 className="font-display text-3xl font-bold text-stone-900">
                {recommendation.routineTitle}
              </h2>
              <p className="text-xs text-stone-500 mt-1">{recommendation.summary}</p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Modify Answers</span>
            </button>
          </div>

          {/* Time Budget Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Session Time Allocation
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <span className="text-[11px] uppercase font-bold text-amber-800 block">Warm-up</span>
                <span className="font-display text-2xl font-bold text-amber-900">
                  {recommendation.timeAllocation.warmUpMinutes}m
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-sage-50 border border-sage-100">
                <span className="text-[11px] uppercase font-bold text-sage-800 block">Main Practice</span>
                <span className="font-display text-2xl font-bold text-sage-900">
                  {recommendation.timeAllocation.mainPracticeMinutes}m
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                <span className="text-[11px] uppercase font-bold text-sky-800 block">Cool-down</span>
                <span className="font-display text-2xl font-bold text-sky-900">
                  {recommendation.timeAllocation.coolDownMinutes}m
                </span>
              </div>
            </div>
          </div>

          {/* Suggested Asanas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Curated Asana Sequence ({recommendation.suggestedPoses.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendation.suggestedPoses.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200/60 flex items-center gap-3"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.englishName}
                    className="w-14 h-14 rounded-xl object-cover bg-sage-50 shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-[10px] font-bold text-sage-600 block">Step {idx + 1}</span>
                    <h5 className="font-display font-bold text-sm text-stone-900 truncate">
                      {p.englishName}
                    </h5>
                    <p className="font-serif italic text-xs text-stone-500 truncate">
                      {p.sanskritName} • {p.durationSeconds}s
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Guidelines */}
          <div className="space-y-2 p-5 rounded-2xl bg-sage-50/70 border border-sage-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage-800">
              Practice Mindfulness Cues
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-600">
              {recommendation.guidelines.map((g, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 shrink-0 mt-0.5" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prominent Medical Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Wellness Advisory:</strong> {recommendation.disclaimer}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                if (recommendation.matchedProgram) {
                  navigate(`/guided-practice?programId=${recommendation.matchedProgram.id}`);
                } else {
                  navigate('/guided-practice');
                }
              }}
              className="px-8 py-3.5 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm shadow-md shadow-sage-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Routine in Studio</span>
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3.5 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-sm transition-colors"
            >
              Adjust Parameters
            </button>
          </div>
        </div>
      ) : (
        /* 3. Questionnaire Form */
        <form
          onSubmit={handleGeneratePlan}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-sage-200 shadow-sm space-y-8"
        >
          {/* Question 1: Experience Level */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-stone-900">
              1. What is your current yoga experience level?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'BEGINNER', label: 'Beginner', desc: 'New or returning to yoga' },
                { id: 'INTERMEDIATE', label: 'Intermediate', desc: 'Practicing regularly' },
                { id: 'ADVANCED', label: 'Advanced', desc: 'Deep posture mastery' },
              ].map((lvl) => (
                <button
                  type="button"
                  key={lvl.id}
                  onClick={() => setExperienceLevel(lvl.id as Difficulty)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    experienceLevel === lvl.id
                      ? 'bg-sage-50 border-sage-600 ring-2 ring-sage-500'
                      : 'bg-cream-50/50 border-stone-200 hover:border-sage-300'
                  }`}
                >
                  <span className="font-display font-bold text-stone-900 text-sm block">
                    {lvl.label}
                  </span>
                  <span className="text-xs text-stone-500 block mt-0.5">{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Available Practice Time */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-stone-900">
              2. How much time do you have to practice today?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[5, 10, 15, 20, 30].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setAvailableMinutes(mins)}
                  className={`py-3 rounded-2xl border text-center transition-all ${
                    availableMinutes === mins
                      ? 'bg-sage-600 text-white border-sage-600 font-bold shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-sage-50'
                  }`}
                >
                  <span className="text-base font-display">{mins}</span>
                  <span className="text-[10px] block opacity-80 uppercase tracking-widest">min</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Preferred Session Style */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-stone-900">
              3. What style of session would best serve you?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'GENTLE', label: 'Gentle Flow' },
                { id: 'FLOW', label: 'Dynamic Vinyasa' },
                { id: 'RESTORATIVE', label: 'Restorative & Calm' },
                { id: 'STRENGTH', label: 'Core & Stability' },
                { id: 'DESK_BREAK', label: 'Desk Worker Reset' },
              ].map((style) => (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => setSessionType(style.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    sessionType === style.id
                      ? 'bg-sage-50 border-sage-600 ring-2 ring-sage-500 text-sage-900 font-bold'
                      : 'bg-cream-50/50 border-stone-200 hover:border-sage-300 text-stone-700'
                  }`}
                >
                  <span className="text-xs font-semibold">{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Primary Wellness Goals */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-stone-900">
              4. Primary wellness goals (Select one or more):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {goalOptions.map((g) => {
                const isSelected = wellnessGoals.includes(g.id);
                return (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => handleToggleGoal(g.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between text-xs font-medium ${
                      isSelected
                        ? 'bg-earth-50 border-earth-600 text-earth-900 font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{g.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-earth-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 5: Preferred Time of Day */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-stone-900">
              5. Preferred practice time:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'MORNING', label: 'Morning Awakening', icon: Sun },
                { id: 'AFTERNOON', label: 'Midday Reset', icon: Coffee },
                { id: 'EVENING', label: 'Evening Wind-Down', icon: Moon },
              ].map((tod) => {
                const Icon = tod.icon;
                return (
                  <button
                    type="button"
                    key={tod.id}
                    onClick={() => setTimeOfDay(tod.id)}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      timeOfDay === tod.id
                        ? 'bg-sage-600 text-white border-sage-600 font-semibold shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-sage-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{tod.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-sage-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-base shadow-lg shadow-sage-600/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Your Routine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Personalized Sequence</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PlannerPage;
