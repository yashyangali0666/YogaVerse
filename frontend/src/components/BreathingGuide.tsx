import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';

export const BreathingGuide: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [counter, setCounter] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            // Transition phase
            setPhase((curr) => {
              if (curr === 'Inhale') return 'Hold (Full)';
              if (curr === 'Hold (Full)') return 'Exhale';
              if (curr === 'Exhale') return 'Hold (Empty)';
              setCompletedCycles((c) => c + 1);
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  const reset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setCounter(4);
    setCompletedCycles(0);
  };

  const getScaleClass = () => {
    switch (phase) {
      case 'Inhale':
        return 'scale-125 bg-sage-500 shadow-sage-200/50';
      case 'Hold (Full)':
        return 'scale-125 bg-sage-600 shadow-sage-300/50';
      case 'Exhale':
        return 'scale-90 bg-sage-400 shadow-sage-100';
      case 'Hold (Empty)':
        return 'scale-90 bg-sage-300 shadow-none';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/90 backdrop-blur rounded-2xl border border-sage-200/80 shadow-lg text-center">
      <div className="flex items-center gap-2 text-sage-700 mb-2">
        <Wind className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-semibold uppercase tracking-wider">Sama Vritti • Box Breathing</span>
      </div>
      <p className="text-xs text-stone-500 mb-6">Equal ratio 4-count breathing to activate parasympathetic calm</p>

      {/* Visual Animation Circle */}
      <div className="relative w-48 h-48 flex items-center justify-center my-4">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-sage-200 animate-spin-slow opacity-60" />

        {/* Dynamic Expanding/Contracting Circle */}
        <div
          className={`w-36 h-36 rounded-full flex flex-col items-center justify-center text-white font-medium transition-all duration-1000 ease-in-out shadow-2xl ${getScaleClass()}`}
        >
          <span className="text-sm uppercase tracking-widest opacity-90">{phase}</span>
          <span className="text-3xl font-display font-bold">{counter}s</span>
        </div>
      </div>

      <div className="text-xs text-stone-600 mt-2 mb-4">
        Completed Cycles: <span className="font-semibold text-sage-800">{completedCycles}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
            isActive
              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              : 'bg-sage-600 text-white hover:bg-sage-700 shadow-md shadow-sage-600/20'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isActive ? 'Pause' : 'Start Breath'}
        </button>
        <button
          onClick={reset}
          className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          title="Reset Breathing"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BreathingGuide;
