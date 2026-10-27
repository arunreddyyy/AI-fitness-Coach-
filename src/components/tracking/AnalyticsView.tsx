import React from 'react';
import {
  Footprints,
  Droplets,
  Flame,
  Moon,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { profile, allLogs } = useFitness();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Sort logs by date ascending
  const logsList = Object.values(allLogs).sort((a, b) => a.date.localeCompare(b.date));
  const recentLogs = logsList.slice(-7);

  // Calculate aggregates
  const totalSteps = recentLogs.reduce((acc, curr) => acc + curr.steps, 0);
  const avgSteps = Math.round(totalSteps / (recentLogs.length || 1));
  const totalWaterLiters = (recentLogs.reduce((acc, curr) => acc + curr.waterIntakeMl, 0) / 1000).toFixed(1);
  const totalCalories = recentLogs.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
  const totalWorkouts = recentLogs.reduce((acc, curr) => acc + curr.completedWorkoutIds.length, 0);

  const formattedChartData = recentLogs.map((log) => {
    const d = new Date(log.date + 'T00:00:00');
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    return {
      date: dayLabel,
      steps: log.steps,
      water: log.waterIntakeMl,
      sleep: log.sleepHours,
      calories: log.caloriesBurned,
    };
  });

  const gridColor = isDark ? '#1a2436' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipStyle = {
    backgroundColor: isDark ? '#0e141f' : '#ffffff',
    borderColor: isDark ? '#23324a' : '#e2e8f0',
    borderRadius: '12px',
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: '12px',
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-700 border border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-300">
            Performance Analytics
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">7-Day Trajectory & Daily Habits</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Activity Tracking & Consistency
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Visual insights into your step goals, hydration levels, and workout streaks.
        </p>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-lime-400 mb-1">
            <Footprints className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">7-Day Avg Steps</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{avgSteps.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Goal: {profile.dailyStepTarget.toLocaleString()} steps</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-sky-500 mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Hydration</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalWaterLiters} L</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Over past 7 days</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Calories</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCalories.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Burned during routines</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Workouts Logged</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalWorkouts} sessions</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Active consistency</p>
        </div>

      </div>

      {/* Primary Chart: Daily Steps vs Target */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Footprints className="w-4 h-4 text-emerald-600 dark:text-lime-400" /> Daily Steps vs Goal ({profile.dailyStepTarget.toLocaleString()})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tracking daily walking volume</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:bg-lime-500/20 dark:text-lime-300 border border-emerald-500/30 dark:border-lime-500/30">
            Goal: {profile.dailyStepTarget.toLocaleString()} steps/day
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="date" stroke={textColor} fontSize={11} tickLine={false} />
              <YAxis stroke={textColor} fontSize={11} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <ReferenceLine
                y={profile.dailyStepTarget}
                stroke={isDark ? '#a3e635' : '#059669'}
                strokeDasharray="4 4"
                label={{ value: 'Target', fill: isDark ? '#a3e635' : '#059669', fontSize: 10 }}
              />
              <Bar
                dataKey="steps"
                fill={isDark ? '#84cc16' : '#10b981'}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Chart: Hydration & Sleep */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hydration Area Chart */}
        <div className="glass-card p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-500" /> Hydration Curve (ml)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Goal: {profile.dailyWaterTargetMl} ml</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="water" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#waterGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Chart */}
        <div className="glass-card p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Moon className="w-4 h-4 text-violet-500" /> Nightly Sleep (Hours)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Target: {profile.dailySleepTargetHours} hrs / night</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} domain={[0, 12]} />
                <Tooltip contentStyle={tooltipStyle} />
                <ReferenceLine y={profile.dailySleepTargetHours} stroke="#8b5cf6" strokeDasharray="4 4" />
                <Bar dataKey="sleep" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* History Log Table */}
      <div className="glass-card p-6 overflow-hidden">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-lime-400" /> Daily History Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Steps</th>
                <th className="py-2.5 px-3">Water</th>
                <th className="py-2.5 px-3">Sleep</th>
                <th className="py-2.5 px-3">Calories Burned</th>
                <th className="py-2.5 px-3">Workouts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-charcoal-800">
              {recentLogs.slice().reverse().map((log) => (
                <tr key={log.date} className="hover:bg-slate-50/80 dark:hover:bg-charcoal-800/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">{log.date}</td>
                  <td className="py-3 px-3">
                    <span className={`font-semibold ${log.steps >= profile.dailyStepTarget ? 'text-emerald-600 dark:text-lime-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {log.steps.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{log.waterIntakeMl} ml</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{log.sleepHours} hrs</td>
                  <td className="py-3 px-3 text-amber-500 font-semibold">{log.caloriesBurned} kcal</td>
                  <td className="py-3 px-3">
                    {log.completedWorkoutIds.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 font-bold text-[10px]">
                        {log.completedWorkoutIds.length} Done
                      </span>
                    ) : (
                      <span className="text-slate-400">Rest Day</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
