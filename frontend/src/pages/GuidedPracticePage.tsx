import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { YogaPose, YogaProgram, Difficulty, SectionType } from '../types';
import Badge from '../components/Badge';
import BreathingGuide from '../components/BreathingGuide';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  SkipForward,
  Wind,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  Award,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface StudioPoseItem {
  pose: YogaPose;
  durationSeconds: number;
  section: SectionType;
}

export const GuidedPracticePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const programIdParam = searchParams.get('programId');
  const poseIdParam = searchParams.get('poseId');

  // Studio Configuration State
  const [sessionLevel, setSessionLevel] = useState<Difficulty>('BEGINNER');
  const [selectedDurationMins, setSelectedDurationMins] = useState<number>(10);
  const [sessionTitle, setSessionTitle] = useState<string>('Mindful Daily Practice');
  const [activeProgram, setActiveProgram] = useState<YogaProgram | null>(null);

  // Practice Sequence & Current Index
  const [sequence, setSequence] = useState<StudioPoseItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Timer States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [poseSecondsLeft, setPoseSecondsLeft] = useState<number>(60);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState<number>(0);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState<number>(600);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Audio & Breathing guide toggles
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showBreathingGuide, setShowBreathingGuide] = useState<boolean>(false);

  // Saving / Result State
  const [savingSession, setSavingSession] = useState<boolean>(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [sessionNotes, setSessionNotes] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Build or fetch sequence
  useEffect(() => {
    const initializeSequence = async () => {
      try {
        if (programIdParam) {
          const progRes = await api.get<{ program: YogaProgram }>(`/programs/${programIdParam}`);
          const prog = progRes.program;
          setActiveProgram(prog);
          setSessionTitle(prog.title);
          setSessionLevel(prog.difficulty);
          setSelectedDurationMins(prog.totalDurationMinutes);

          if (prog.poses && prog.poses.length > 0) {
            const items: StudioPoseItem[] = prog.poses.map((p) => ({
              pose: p.pose,
              durationSeconds: p.customDurationSeconds || p.pose.durationSeconds || 60,
              section: p.section,
            }));
            setSequence(items);
            const total = items.reduce((acc, curr) => acc + curr.durationSeconds, 0);
            setTotalSessionSeconds(total);
            setPoseSecondsLeft(items[0]?.durationSeconds || 60);
            return;
          }
        }

        if (poseIdParam) {
          const poseRes = await api.get<{ pose: YogaPose }>(`/poses/${poseIdParam}`);
          const pose = poseRes.pose;
          setSessionTitle(`${pose.englishName} Solo Practice`);
          setSessionLevel(pose.difficulty);
          const dur = pose.durationSeconds || 60;
          setSequence([
            {
              pose,
              durationSeconds: dur,
              section: 'MAIN',
            },
          ]);
          setTotalSessionSeconds(dur);
          setPoseSecondsLeft(dur);
          return;
        }

        // Generic sequence generation based on duration and level
        const posesRes = await api.get<{ poses: YogaPose[] }>(`/poses?difficulty=${sessionLevel}`);
        const pool = posesRes.poses;

        if (pool.length > 0) {
          // Build a sequence matching selected duration in seconds
          const targetSeconds = selectedDurationMins * 60;
          const items: StudioPoseItem[] = [];
          let accumulated = 0;

          // Pick warm up
          const warmup = pool.find((p) => p.category === 'RESTORATIVE' || p.category === 'STANDING') || pool[0];
          items.push({ pose: warmup, durationSeconds: 60, section: 'WARMUP' });
          accumulated += 60;

          // Main poses
          let idx = 0;
          while (accumulated < targetSeconds - 60 && idx < pool.length) {
            const p = pool[idx % pool.length];
            const d = p.durationSeconds || 60;
            items.push({ pose: p, durationSeconds: d, section: 'MAIN' });
            accumulated += d;
            idx++;
          }

          // Cool down
          const cooldown = pool.find((p) => p.englishName.includes('Child') || p.englishName.includes('Corpse')) || pool[pool.length - 1];
          items.push({ pose: cooldown, durationSeconds: Math.max(60, targetSeconds - accumulated), section: 'COOLDOWN' });

          const total = items.reduce((acc, curr) => acc + curr.durationSeconds, 0);
          setSequence(items);
          setTotalSessionSeconds(total);
          setPoseSecondsLeft(items[0]?.durationSeconds || 60);
        }
      } catch (err) {
        console.error('Failed to prepare studio sequence:', err);
      }
    };

    initializeSequence();
  }, [programIdParam, poseIdParam, sessionLevel, selectedDurationMins]);

  // Audio chime using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz - Solfeggio Love frequency
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  // Timer countdown hook
  useEffect(() => {
    if (isPlaying && !isCompleted) {
      timerRef.current = setInterval(() => {
        setTotalElapsedSeconds((t) => t + 1);

        setPoseSecondsLeft((prev) => {
          if (prev <= 1) {
            playChime();
            // Advance to next pose or complete
            if (currentIndex < sequence.length - 1) {
              const nextIdx = currentIndex + 1;
              setCurrentIndex(nextIdx);
              return sequence[nextIdx].durationSeconds;
            } else {
              // Session complete!
              finishSession();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isCompleted, currentIndex, sequence, soundEnabled]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipPose = () => {
    if (currentIndex < sequence.length - 1) {
      playChime();
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setPoseSecondsLeft(sequence[nextIdx].durationSeconds);
    } else {
      finishSession();
    }
  };

  const handleResetSession = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setTotalElapsedSeconds(0);
    setPoseSecondsLeft(sequence[0]?.durationSeconds || 60);
    setIsCompleted(false);
  };

  const finishSession = async () => {
    setIsPlaying(false);
    setIsCompleted(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#5e835e', '#7e9f7e', '#cbb17e', '#3a533a'],
      });
    } catch (e) {}

    // Save session to backend if user is authenticated
    if (user && totalElapsedSeconds >= 10) {
      setSavingSession(true);
      try {
        const res = await api.post<{
          session: any;
          newlyUnlocked: string[];
          stats: any;
        }>('/sessions', {
          programId: activeProgram?.id || null,
          sessionTitle: sessionTitle,
          durationSeconds: totalElapsedSeconds,
          targetDurationSeconds: totalSessionSeconds,
          completed: true,
          notes: sessionNotes || 'Guided Studio practice completed.',
        });

        if (res.newlyUnlocked && res.newlyUnlocked.length > 0) {
          setUnlockedAchievements(res.newlyUnlocked);
        }
      } catch (err) {
        console.error('Failed to log practice session:', err);
      } finally {
        setSavingSession(false);
      }
    }
  };

  const currentItem = sequence[currentIndex];
  const nextItem = sequence[currentIndex + 1];

  const overallProgressPercent = Math.min(
    100,
    Math.round((totalElapsedSeconds / Math.max(1, totalSessionSeconds)) * 100)
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* 1. Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sage-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="sage">Guided Studio</Badge>
            {activeProgram && <Badge variant="cream">Program: {activeProgram.title}</Badge>}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
            {sessionTitle}
          </h1>
        </div>

        {/* Studio Controls Top Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-sage-50 border-sage-200 text-sage-800'
                : 'bg-stone-50 border-stone-200 text-stone-400'
            }`}
            title={soundEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowBreathingGuide(!showBreathingGuide)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showBreathingGuide
                ? 'bg-sage-600 text-white border-sage-600 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:border-sage-300'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>Breathing Metronome</span>
          </button>
        </div>
      </div>

      {/* Guest Notice */}
      {!user && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Practicing in Guest Mode. <strong>Log in or create a free account</strong> to record
              your practice minutes, preserve day streaks, and earn milestones.
            </span>
          </div>
          <Link to="/login" className="font-bold underline hover:text-amber-950 shrink-0 ml-3">
            Log In
          </Link>
        </div>
      )}

      {/* 2. Completion Screen Modal / Overlay */}
      {isCompleted ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sage-200 shadow-2xl text-center max-w-2xl mx-auto space-y-6 animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-lg shadow-emerald-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <Badge variant="emerald">Session Complete</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
              Namaste. Practice Concluded.
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed max-w-md mx-auto">
              You dedicated conscious breath and movement to your physical well-being and mental
              stillness today.
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-sage-50 border border-sage-100">
              <span className="text-xs uppercase font-bold text-stone-400 block">Total Time</span>
              <span className="font-display text-2xl font-bold text-sage-800">
                {formatTime(totalElapsedSeconds)}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200">
              <span className="text-xs uppercase font-bold text-stone-400 block">Asanas Flowed</span>
              <span className="font-display text-2xl font-bold text-stone-800">
                {sequence.length}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-earth-50 border border-earth-100 col-span-2 sm:col-span-1">
              <span className="text-xs uppercase font-bold text-stone-400 block">Status</span>
              <span className="font-display text-xl font-bold text-emerald-700">Logged</span>
            </div>
          </div>

          {/* Newly Unlocked Achievements Alert */}
          {unlockedAchievements.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span>New Milestone Unlocked!</span>
              </div>
              <p className="text-xs text-amber-800">
                Congratulations! You earned: <strong>{unlockedAchievements.join(', ')}</strong>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={handleResetSession}
              className="px-6 py-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-sm transition-colors"
            >
              Practice Again
            </button>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              View Personal Dashboard
            </Link>
          </div>
        </div>
      ) : (
        /* 3. Main Studio Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Active Asana Stage */}
          <div className="lg:col-span-8 space-y-6">
            {currentItem ? (
              <div className="bg-white rounded-3xl border border-sage-200 shadow-lg overflow-hidden">
                {/* Visual Image Banner with Countdown */}
                <div className="relative aspect-[16/10] bg-stone-900 overflow-hidden">
                  <img
                    src={currentItem.pose.imageUrl}
                    alt={currentItem.pose.englishName}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="sage">{currentItem.section}</Badge>
                    <Badge variant="cream">{currentItem.pose.difficulty}</Badge>
                  </div>

                  {/* Center Pose Countdown Circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-stone-950/70 backdrop-blur-md border-4 border-sage-400/80 flex flex-col items-center justify-center text-white shadow-2xl">
                      <span className="text-4xl font-display font-bold">{poseSecondsLeft}</span>
                      <span className="text-[10px] uppercase tracking-widest text-sage-300 font-semibold">
                        seconds
                      </span>
                    </div>
                  </div>

                  {/* Bottom details on image */}
                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                        {currentItem.pose.englishName}
                      </h2>
                      <p className="font-serif italic text-sage-300 text-sm">
                        {currentItem.pose.sanskritName}
                      </p>
                    </div>

                    <span className="text-xs text-white/80 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                      Step {currentIndex + 1} of {sequence.length}
                    </span>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="w-full bg-sage-100 h-2">
                  <div
                    className="bg-sage-600 h-2 transition-all duration-500 ease-out"
                    style={{ width: `${overallProgressPercent}%` }}
                  />
                </div>

                {/* Pose Instructions & Breath Guidance */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Instructions */}
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-2">
                      Alignment & Movement Instructions
                    </h4>
                    <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                      {currentItem.pose.instructions}
                    </p>
                  </div>

                  {/* Breath & Benefits */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-100">
                      <div className="flex items-center gap-1.5 text-sage-800 font-semibold text-xs mb-1">
                        <Wind className="w-4 h-4 text-sage-600" />
                        <span>Breath Cue</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {currentItem.pose.breathingGuidance}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                      <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-xs mb-1">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        <span>Precaution</span>
                      </div>
                      <p className="text-xs text-amber-800/90 leading-relaxed">
                        {currentItem.pose.contraindications}
                      </p>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="pt-6 border-t border-sage-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className={`px-6 py-3 rounded-2xl text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2 ${
                          isPlaying
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-sage-600 hover:bg-sage-700 shadow-sage-600/30'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                        <span>{isPlaying ? 'Pause' : 'Start Flow'}</span>
                      </button>

                      <button
                        onClick={handleSkipPose}
                        className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors flex items-center gap-1.5"
                        title="Skip to next pose"
                      >
                        <SkipForward className="w-4 h-4" />
                        <span>Skip Asana</span>
                      </button>

                      <button
                        onClick={handleResetSession}
                        className="p-3 rounded-2xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                        title="Reset practice"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={finishSession}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 transition-colors"
                    >
                      Complete Session Early
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl text-center border border-sage-100">
                <p className="text-sm text-stone-500">Preparing session sequence...</p>
              </div>
            )}
          </div>

          {/* Right: Studio Sidebar (Next Asana, Playlist, Metronome) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Optional Breathing Metronome */}
            {showBreathingGuide && <BreathingGuide />}

            {/* Up Next Card */}
            {nextItem ? (
              <div className="bg-white p-5 rounded-3xl border border-sage-100 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  Up Next
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src={nextItem.pose.imageUrl}
                    alt={nextItem.pose.englishName}
                    className="w-16 h-16 rounded-2xl object-cover bg-sage-50"
                  />
                  <div>
                    <h4 className="font-display font-bold text-stone-900 text-base">
                      {nextItem.pose.englishName}
                    </h4>
                    <p className="font-serif italic text-xs text-sage-600">
                      {nextItem.pose.sanskritName}
                    </p>
                    <span className="text-xs text-stone-400">{nextItem.durationSeconds}s duration</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-sage-50/70 p-5 rounded-3xl border border-sage-100 text-center">
                <Sparkles className="w-5 h-5 text-sage-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-sage-800">Final Asana of Sequence</p>
              </div>
            )}

            {/* Sequence Playlist */}
            <div className="bg-white p-6 rounded-3xl border border-sage-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Sequence Flow ({sequence.length})
                </h4>
                <span className="text-xs text-stone-400 font-medium">
                  {formatTime(totalElapsedSeconds)} / {formatTime(totalSessionSeconds)}
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {sequence.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setPoseSecondsLeft(item.durationSeconds);
                    }}
                    className={`p-3 rounded-2xl flex items-center justify-between text-xs cursor-pointer transition-all ${
                      idx === currentIndex
                        ? 'bg-sage-600 text-white font-semibold shadow-xs'
                        : idx < currentIndex
                        ? 'bg-cream-50 text-stone-400'
                        : 'bg-stone-50 hover:bg-sage-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="opacity-70">#{idx + 1}</span>
                      <span className="truncate">{item.pose.englishName}</span>
                    </div>
                    <span className="shrink-0 ml-2 opacity-80">{item.durationSeconds}s</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Settings when not playing */}
            {!isPlaying && (
              <div className="bg-white p-6 rounded-3xl border border-sage-100 shadow-xs space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Customize Routine
                </span>
                <div>
                  <label className="text-xs text-stone-600 block mb-1">Target Duration</label>
                  <div className="grid grid-cols-5 gap-1.5 text-xs font-medium">
                    {[5, 10, 15, 20, 30].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setSelectedDurationMins(mins)}
                        className={`py-2 rounded-xl border text-center transition-all ${
                          selectedDurationMins === mins
                            ? 'bg-sage-600 text-white border-sage-600'
                            : 'bg-stone-50 text-stone-600 border-stone-200'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-600 block mb-1">Level</label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
                    {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as Difficulty[]).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setSessionLevel(lvl)}
                        className={`py-2 rounded-xl border text-center transition-all ${
                          sessionLevel === lvl
                            ? 'bg-earth-600 text-white border-earth-600'
                            : 'bg-stone-50 text-stone-600 border-stone-200'
                        }`}
                      >
                        {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidedPracticePage;
