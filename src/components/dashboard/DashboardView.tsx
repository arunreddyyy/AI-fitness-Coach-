import React, { useState } from 'react';
import {
  Flame,
  Footprints,
  Droplets,
  Moon,
  Dumbbell,
  Bot,
  MapPin,
  Utensils,
  Plus,
  Minus,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Scale,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { useTheme } from '../../context/ThemeContext';
import { NavTab } from '../common/Navbar';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface DashboardViewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenCoach: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenCoach,
}) => {
  const {
    profile,
    metrics,
    todayLog,
    allLogs,
    workouts,
    addWater,
    resetWater,
    addSteps,
    setSteps,
    logSleep,
    toggleWorkoutComplete,
  } = useFitness();
  const { theme } = useTheme();

  const [stepInputVal, setStepInputVal] = useState<string>('');
  const [showManualStepInput, setShowManualStepInput] = useState(false);

  // Calculate percentages
  const stepPercent = Math.min(100, Math.round((todayLog.steps / (profile.dailyStepTarget || 8000)) * 100));
  const waterPercent = Math.min(100, Math.round((todayLog.waterIntakeMl / (profile.dailyWaterTargetMl || 2500)) * 100));
  const sleepPercent = Math.min(100, Math.round((todayLog.sleepHours / (profile.dailySleepTargetHours || 8)) * 100));

  // Find workout tailored for user's age group
  const recommendedRoutine = workouts.find((w) => w.ageCategory === metrics.ageGroup) || workouts[0];
  const isRoutineDoneToday = todayLog.completedWorkoutIds.includes(recommendedRoutine.id);

  // Prepare 7-day chart data
  const chartData = Object.values(allLogs)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)
    .map((log) => {
      const dayName = new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });
      return {
        day: dayName,
        steps: log.steps,
        water: log.waterIntakeMl,
        calories: log.caloriesBurned,
      };
    });

  const handleManualStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(stepInputVal, 10);
    if (!isNaN(val) && val >= 0) {
      setSteps(val);
      setShowManualStepInput(false);
      setStepInputVal('');
    }
  };

  // Helper for needle position on the 14 - 38 BMI scale
  const getScalePercentage = (bmi: number): number => {
    const minScale = 14;
    const maxScale = 38;
    const clamped = Math.max(minScale, Math.min(maxScale, bmi));
    return ((clamped - minScale) / (maxScale - minScale)) * 100;
  };

  const isAdult = profile.age >= 20;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 dark:from-charcoal-900 dark:via-charcoal-850 dark:to-charcoal-900 border border-emerald-500/30 dark:border-lime-500/20 p-6 sm:p-8 text-white shadow-xl dark:shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 dark:bg-lime-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 dark:bg-lime-500/10 border border-white/20 dark:border-lime-500/30 text-white dark:text-lime-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-white dark:text-lime-400" />
              <span>Age: <strong>{profile.age} yrs</strong> ({metrics.ageGroup})</span>
              <span className="opacity-60">•</span>
              <span>BMI: <strong>{metrics.bmi}</strong></span>
              <span className="opacity-60">•</span>
              <span>{isAdult ? metrics.bmiCategory : 'Pediatric Percentile Required'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to crush your goals, <span>{profile.name}</span>?
            </h1>
            
            <p className="text-sm text-emerald-50 dark:text-slate-300 max-w-2xl leading-relaxed">
              Targeting <span className="font-semibold text-white dark:text-lime-300">{profile.fitnessGoals.map((g) => g.replace('_', ' ')).join(' & ')}</span> with daily target of <span className="font-semibold text-white">{metrics.dailyCaloriesTarget} kcal</span> and <span className="font-semibold text-white dark:text-lime-300">{metrics.dailyProteinGrams}g protein</span>.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <button
              onClick={onOpenCoach}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-white text-emerald-800 hover:bg-emerald-50 shadow-md dark:bg-lime-400 dark:hover:bg-lime-300 dark:text-charcoal-950 dark:shadow-glow-lime transition-all active:scale-95"
            >
              <Bot className="w-5 h-5 text-emerald-600 dark:text-charcoal-950" />
              <span>Ask AI Coach</span>
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white/15 hover:bg-white/25 text-white border border-white/30 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 dark:border-lime-500/30 dark:text-lime-300 transition-all active:scale-95"
            >
              <Scale className="w-5 h-5" />
              <span>BMI Metrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Featured BMI & Body Metrics Summary Card */}
      {/* ======================================================== */}
      <div className="glass-card glass-card-hover p-6 border-emerald-500/30 dark:border-lime-500/25 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-lime-500/15 dark:text-lime-400 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  BMI Summary & Body Composition
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-charcoal-800 dark:text-slate-300">
                  Screening Tool
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current metrics: {profile.heightCm} cm • {profile.weightKg} kg • Age {profile.age} ({profile.gender})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('metrics')}
              className="brand-btn-primary text-xs px-4 py-2"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Open BMI Calculator & History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* BMI Metric Value & Mini-Scale Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5">
          
          {/* Number + Category Badge */}
          <div className="md:col-span-4 flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Current BMI Value
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {metrics.bmi.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">kg/m²</span>
            </div>
            
            <div className="mt-2">
              {isAdult ? (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                    metrics.bmiCategory === 'Healthy weight' || metrics.bmiCategory === 'Normal'
                      ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-lime-500/15 dark:text-lime-300 dark:border-lime-500/30'
                      : metrics.bmiCategory === 'Overweight'
                      ? 'bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                      : metrics.bmiCategory === 'Underweight'
                      ? 'bg-sky-500/10 text-sky-700 border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30'
                      : 'bg-rose-500/10 text-rose-700 border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
                  }`}
                >
                  Category: {metrics.bmiCategory}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300">
                  Percentile Required (&lt; 20 yrs)
                </span>
              )}
            </div>
          </div>

          {/* Range Visualizer & Explanation */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-3">
            
            {/* Visual Bar with Needle */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                <span>Standard Adult Ranges</span>
                <span>Gauge: {metrics.bmi.toFixed(1)}</span>
              </div>

              <div className="relative w-full h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-charcoal-800 shadow-inner">
                <div style={{ width: '18.75%' }} className="h-full bg-sky-400 dark:bg-sky-500" title="Underweight (< 18.5)" />
                <div style={{ width: '26.67%' }} className="h-full bg-emerald-500 dark:bg-lime-400" title="Healthy Weight (18.5 - 24.9)" />
                <div style={{ width: '20.83%' }} className="h-full bg-amber-400 dark:bg-amber-500" title="Overweight (25.0 - 29.9)" />
                <div style={{ width: '33.75%' }} className="h-full bg-rose-500 dark:bg-rose-600" title="Obesity (≥ 30.0)" />
              </div>

              <div className="relative w-full h-3">
                <div
                  className="absolute top-0 -ml-1.5 flex flex-col items-center transition-all duration-300"
                  style={{ left: `${getScalePercentage(metrics.bmi)}%` }}
                >
                  <div className="w-0 h-0 border-x-3 border-x-transparent border-t-5 border-t-slate-800 dark:border-t-white" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1 text-[10px] text-center text-slate-500 dark:text-slate-400">
                <span>&lt; 18.5</span>
                <span>18.5 – 24.9</span>
                <span>25 – 29.9</span>
                <span>≥ 30</span>
              </div>
            </div>

            {/* Context Note */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-600 dark:text-lime-400 flex-shrink-0 mt-0.5" />
              <div>
                {!isAdult ? (
                  <p>
                    <strong>Users under 20:</strong> Adult BMI categories do not apply. BMI must be interpreted with age- and sex-specific growth percentiles due to adolescent body development.
                  </p>
                ) : (
                  <p>
                    <strong>Medical screening note:</strong> BMI is a general screening guideline and does not directly measure body fat or muscle mass. Highly muscular individuals may score as overweight without excess adiposity.
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 4 Main Glowing Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Steps */}
        <div className="glass-card glass-card-hover p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-lime-500/15 dark:text-lime-400 dark:border-lime-500/30 flex items-center justify-center">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Daily Steps</span>
                <p className="text-xs text-slate-400 dark:text-slate-500">Goal: {profile.dailyStepTarget.toLocaleString()}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:bg-lime-500/20 dark:text-lime-300">
              {stepPercent}%
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {todayLog.steps.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">steps</span>
            </div>
            
            <div className="w-full h-2 bg-slate-200 dark:bg-charcoal-950 rounded-full mt-2 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 dark:from-lime-400 dark:to-lime-500 transition-all duration-500 rounded-full"
                style={{ width: `${stepPercent}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={() => addSteps(500)}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-[11px] font-semibold text-emerald-700 dark:text-lime-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              +500
            </button>
            <button
              onClick={() => addSteps(1000)}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-[11px] font-semibold text-emerald-700 dark:text-lime-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              +1,000
            </button>
            <button
              onClick={() => setShowManualStepInput(!showManualStepInput)}
              className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              title="Set exact steps"
            >
              Edit
            </button>
          </div>

          {showManualStepInput && (
            <form onSubmit={handleManualStepSubmit} className="mt-2 flex gap-1.5">
              <input
                type="number"
                value={stepInputVal}
                onChange={(e) => setStepInputVal(e.target.value)}
                placeholder="Exact steps"
                className="w-full px-2 py-1 bg-white dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-emerald-600 text-white dark:bg-lime-400 dark:text-charcoal-950 font-bold rounded-lg text-xs"
              >
                Save
              </button>
            </form>
          )}
        </div>

        {/* Metric 2: Water Hydration */}
        <div className="glass-card glass-card-hover p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 border border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Water Intake</span>
                <p className="text-xs text-slate-400 dark:text-slate-500">Goal: {profile.dailyWaterTargetMl} ml</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
              {waterPercent}%
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {todayLog.waterIntakeMl}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">ml / {profile.dailyWaterTargetMl} ml</span>
            </div>
            
            <div className="w-full h-2 bg-slate-200 dark:bg-charcoal-950 rounded-full mt-2 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-500 rounded-full"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={() => addWater(250)}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-[11px] font-semibold text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              +250ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-[11px] font-semibold text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              +500ml
            </button>
            <button
              onClick={resetWater}
              className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-rose-50 dark:bg-charcoal-800 dark:hover:bg-rose-950/40 text-[11px] text-slate-500 hover:text-rose-600 border border-slate-200 dark:border-slate-700"
              title="Reset Water"
            >
              0
            </button>
          </div>
        </div>

        {/* Metric 3: Sleep */}
        <div className="glass-card glass-card-hover p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 border border-violet-500/20 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Sleep Duration</span>
                <p className="text-xs text-slate-400 dark:text-slate-500">Goal: {profile.dailySleepTargetHours} hrs</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
              {sleepPercent}%
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {todayLog.sleepHours}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">hours</span>
            </div>
            
            <div className="w-full h-2 bg-slate-200 dark:bg-charcoal-950 rounded-full mt-2 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 rounded-full"
                style={{ width: `${sleepPercent}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => logSleep(Math.max(0, todayLog.sleepHours - 0.5))}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700"
            >
              <Minus className="w-3 h-3" /> 30m
            </button>
            <button
              onClick={() => logSleep(todayLog.sleepHours + 0.5)}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-xs text-violet-700 dark:text-violet-300 font-semibold flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700"
            >
              <Plus className="w-3 h-3" /> 30m
            </button>
          </div>
        </div>

        {/* Metric 4: Calories Burned */}
        <div className="glass-card glass-card-hover p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Active Calories</span>
                <p className="text-xs text-slate-400 dark:text-slate-500">Steps + Workouts</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              Active
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {todayLog.caloriesBurned}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">kcal</span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {todayLog.completedWorkoutIds.length} routine(s) done today
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>BMR: {metrics.bmr} kcal</span>
            <span className="text-emerald-600 dark:text-lime-400 font-semibold">Total: {metrics.bmr + todayLog.caloriesBurned} kcal</span>
          </div>
        </div>

      </div>

      {/* Recommended Routine & Quick Navigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Routine Card (2 cols) */}
        <div className="lg:col-span-2 glass-card p-6 border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 dark:bg-lime-500/15 dark:text-lime-300 dark:border-lime-500/30">
                  Recommended for your Age ({metrics.ageGroup.toUpperCase()})
                </span>
                {recommendedRoutine.equipment === 'home_bodyweight' && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">No Equipment Needed</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">{recommendedRoutine.title}</h3>
            </div>
            
            <button
              onClick={() => toggleWorkoutComplete(
                recommendedRoutine.id,
                recommendedRoutine.durationMinutes,
                recommendedRoutine.caloriesBurnEstimate
              )}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isRoutineDoneToday
                  ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40 dark:text-emerald-300'
                  : 'brand-btn-primary'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isRoutineDoneToday ? 'Workout Completed!' : 'Mark Completed'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {recommendedRoutine.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {recommendedRoutine.exercises.slice(0, 4).map((ex, idx) => (
              <div key={ex.id} className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-800/80 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-700 dark:bg-charcoal-700 dark:text-lime-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{ex.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{ex.suggestedSets} sets × {ex.suggestedReps}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span>⏱️ {recommendedRoutine.durationMinutes} mins</span>
              <span>🔥 ~{recommendedRoutine.caloriesBurnEstimate} kcal</span>
            </div>
            <button
              onClick={() => setActiveTab('workouts')}
              className="text-emerald-600 dark:text-lime-400 hover:underline font-semibold inline-flex items-center gap-1"
            >
              View Full Routine & Instructions <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Action Navigation Grid (1 col) */}
        <div className="glass-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Quick Features</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Jump directly into specialized fitness modules</p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => setActiveTab('metrics')}
              className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3 transition-all text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Scale className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-lime-300 transition-colors">
                  BMI & Body Metrics
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Validated calculator & measurement history</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-lime-400" />
            </button>

            <button
              onClick={() => setActiveTab('nutrition')}
              className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3 transition-all text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-lime-300 transition-colors">
                  High-Protein Nutrition
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Macro balanced recipes & AI kitchen</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-lime-400" />
            </button>

            <button
              onClick={() => setActiveTab('gyms')}
              className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3 transition-all text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-lime-300 transition-colors">
                  Find Nearby Gyms
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">OpenStreetMap locator & directions</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-lime-400" />
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3 transition-all text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-lime-300 transition-colors">
                  Progress Analytics
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">7-day trends & consistency graphs</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-lime-400" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:bg-lime-500/10 dark:border-lime-500/20 dark:text-lime-300 text-[11px] flex items-center gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-lime-400" />
            <span>Fast, private, and local-first storage with cloud sync readiness.</span>
          </div>
        </div>

      </div>

      {/* Mini Activity Chart Preview */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">7-Day Step Consistency</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing your daily steps against your {profile.dailyStepTarget.toLocaleString()} goal
            </p>
          </div>
          <button
            onClick={() => setActiveTab('analytics')}
            className="text-xs font-semibold text-emerald-600 dark:text-lime-400 hover:underline"
          >
            View Full Analytics →
          </button>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#0e141f' : '#ffffff',
                  borderColor: theme === 'dark' ? '#23324a' : '#e2e8f0',
                  borderRadius: '12px',
                  color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                  fontSize: '12px',
                }}
              />
              <Bar
                dataKey="steps"
                fill={theme === 'dark' ? '#a3e635' : '#059669'}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
