import React, { useState } from 'react';
import {
  Dumbbell,
  Clock,
  Flame,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { generateCustomWorkout } from '../../services/gemini';

export const WorkoutsView: React.FC = () => {
  const { profile, metrics, workouts, todayLog, toggleWorkoutComplete, addCustomWorkout } = useFitness();
  
  const [selectedAgeTab, setSelectedAgeTab] = useState<'all' | 'recommended' | 'teen' | 'adult' | 'senior' | 'custom'>('recommended');
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(workouts[0]?.id || null);
  const [aiFocusPrompt, setAiFocusPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Filter routines based on selected tab
  const filteredWorkouts = workouts.filter((routine) => {
    if (selectedAgeTab === 'recommended') {
      return routine.ageCategory === metrics.ageGroup;
    }
    if (selectedAgeTab === 'custom') {
      return routine.isCustomAI;
    }
    if (selectedAgeTab === 'all') {
      return true;
    }
    return routine.ageCategory === selectedAgeTab;
  });

  const handleGenerateAiWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiFocusPrompt.trim()) return;

    setIsGenerating(true);
    setGenerateError(null);
    try {
      const newRoutine = await generateCustomWorkout(profile, aiFocusPrompt);
      addCustomWorkout(newRoutine);
      setExpandedRoutineId(newRoutine.id);
      setSelectedAgeTab('custom');
      setAiFocusPrompt('');
    } catch (err) {
      console.error(err);
      setGenerateError('Could not generate routine. Please check your connection or API key in .env.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:bg-lime-500/15 dark:text-lime-300 dark:border-lime-500/30">
              Age-Calibrated Engine
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Pure Form & Progression</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Workouts & Training Routines
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Workouts formulated specifically for your age ({profile.age} yrs), goals, and joint safety.
          </p>
        </div>

        {/* User limitations badge */}
        {profile.limitations.length > 0 && profile.limitations[0] !== 'none' && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Safety active for: <strong>{profile.limitations.join(', ').replace(/_/g, ' ')}</strong></span>
          </div>
        )}
      </div>

      {/* AI Workout Generator Bar */}
      <div className="glass-card p-5 border-emerald-500/30 dark:border-lime-500/20 bg-slate-50/50 dark:bg-charcoal-900/60">
        <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-lime-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> AI Custom Workout Generator (Google Gemini)
        </div>
        <form onSubmit={handleGenerateAiWorkout} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={aiFocusPrompt}
            onChange={(e) => setAiFocusPrompt(e.target.value)}
            placeholder={`e.g. "Quick 20-minute arms & core routine with ${profile.equipment.replace('_', ' ')}"`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={isGenerating || !aiFocusPrompt.trim()}
            className="brand-btn-primary px-6 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap shadow-sm"
          >
            {isGenerating ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white dark:border-charcoal-950 border-t-transparent rounded-full animate-spin" />
                Crafting Plan...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate Plan
              </>
            )}
          </button>
        </form>

        {generateError && (
          <p className="mt-2 text-xs text-rose-500">{generateError}</p>
        )}
      </div>

      {/* Age & Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'recommended', label: `🎯 For You (${metrics.ageGroup.toUpperCase()})` },
          { id: 'teen', label: 'Teens (13–17)' },
          { id: 'adult', label: 'Adults (18–49)' },
          { id: 'senior', label: 'Seniors (50+)' },
          { id: 'custom', label: '✨ AI Generated' },
          { id: 'all', label: 'All Routines' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedAgeTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedAgeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-sm dark:bg-lime-400 dark:text-charcoal-950 dark:shadow-glow-lime-sm'
                : 'bg-white hover:bg-slate-100 dark:bg-charcoal-900 dark:hover:bg-charcoal-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Routines List */}
      <div className="space-y-4">
        {filteredWorkouts.length === 0 ? (
          <div className="p-12 text-center glass-card">
            <Dumbbell className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">No routines found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try generating a custom routine with AI above!</p>
          </div>
        ) : (
          filteredWorkouts.map((routine) => {
            const isCompleted = todayLog.completedWorkoutIds.includes(routine.id);
            const isExpanded = expandedRoutineId === routine.id;

            // Check if any exercises have contraindication warnings
            const hasConflict = routine.exercises.some((ex) =>
              ex.contraindications.some((c) => profile.limitations.includes(c))
            );

            return (
              <div
                key={routine.id}
                className={`glass-card transition-all overflow-hidden border ${
                  isCompleted
                    ? 'border-emerald-500/50 bg-emerald-50/30 dark:bg-charcoal-900/90'
                    : isExpanded
                    ? 'border-emerald-500/40 dark:border-lime-500/40'
                    : 'border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Routine Card Header */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div
                    onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 dark:bg-charcoal-800 dark:text-lime-300 dark:border-lime-500/20">
                        {routine.ageCategory.toUpperCase()} ({routine.difficulty})
                      </span>
                      {routine.isCustomAI && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:bg-lime-500/20 dark:text-lime-300">
                          AI Created
                        </span>
                      )}
                      {hasConflict && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Limitation Caution
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {routine.title}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-emerald-600 dark:text-lime-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </h3>
                    
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{routine.description}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" /> {routine.durationMinutes} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" /> ~{routine.caloriesBurnEstimate} kcal
                      </span>
                      <span className="capitalize">
                        📦 {routine.equipment.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Completion Action */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => toggleWorkoutComplete(
                        routine.id,
                        routine.durationMinutes,
                        routine.caloriesBurnEstimate
                      )}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40 hover:bg-emerald-500/30 dark:text-emerald-300'
                          : 'brand-btn-primary'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isCompleted ? 'Completed' : 'Log Completed'}</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Exercises Section */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-charcoal-900/50 space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold uppercase tracking-wider text-emerald-700 dark:text-lime-400">
                        Exercise Breakdown ({routine.exercises.length} Movements)
                      </span>
                      <span>Rest: 45–90s between sets</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {routine.exercises.map((ex, idx) => {
                        const isContraindicated = ex.contraindications.some((c) =>
                          profile.limitations.includes(c)
                        );

                        return (
                          <div
                            key={ex.id || idx}
                            className={`p-4 rounded-2xl border transition-all ${
                              isContraindicated
                                ? 'bg-amber-500/10 border-amber-500/30'
                                : 'bg-white dark:bg-charcoal-950 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-700 dark:bg-charcoal-800 dark:text-lime-400 text-xs font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ex.name}</h4>
                              </div>
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:bg-lime-500/15 dark:text-lime-300">
                                {ex.suggestedSets} sets × {ex.suggestedReps}
                              </span>
                            </div>

                            {/* Target muscles */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {ex.targetMuscles.map((m) => (
                                <span key={m} className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-charcoal-800 dark:text-slate-400">
                                  {m}
                                </span>
                              ))}
                            </div>

                            {/* Instructions */}
                            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside mb-2 pl-0.5">
                              {ex.instructions.map((inst, i) => (
                                <li key={i} className="text-[11px] leading-relaxed">{inst}</li>
                              ))}
                            </ul>

                            {/* Safety tips */}
                            {ex.safetyTips && (
                              <p className="text-[11px] text-emerald-800 dark:text-lime-300 bg-emerald-50 dark:bg-lime-950/40 p-2 rounded-lg border border-emerald-200 dark:border-lime-500/20 mt-2">
                                💡 <strong>Form Tip:</strong> {ex.safetyTips}
                              </p>
                            )}

                            {isContraindicated && (
                              <p className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-500/30 mt-2">
                                ⚠️ Caution: Involves {ex.contraindications.join(', ')}. Perform with extra care or substitute.
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
