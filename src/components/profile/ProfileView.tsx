import React, { useState } from 'react';
import {
  User,
  Heart,
  Scale,
  Ruler,
  Activity,
  Target,
  AlertTriangle,
  Dumbbell,
  Check,
  Save,
  Sparkles,
  Info,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import {
  Gender,
  ActivityLevel,
  FitnessGoal,
  Limitation,
  EquipmentPreference,
} from '../../types/user';

export const ProfileView: React.FC = () => {
  const { profile, metrics, updateProfile } = useFitness();

  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age,
    gender: profile.gender,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    activityLevel: profile.activityLevel,
    fitnessGoals: [...profile.fitnessGoals],
    limitations: [...profile.limitations],
    equipment: profile.equipment,
    dailyStepTarget: profile.dailyStepTarget,
    dailyWaterTargetMl: profile.dailyWaterTargetMl,
    dailySleepTargetHours: profile.dailySleepTargetHours,
    customNotes: profile.customNotes || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const goalOptions: { id: FitnessGoal; label: string; desc: string }[] = [
    { id: 'weight_loss', label: 'Weight & Fat Loss', desc: 'Caloric deficit, cardio & muscle preservation' },
    { id: 'muscle_gain', label: 'Muscle Building & Hypertrophy', desc: 'Higher protein, progressive overload' },
    { id: 'endurance', label: 'Stamina & Cardio Endurance', desc: 'Aerobic base, metabolic conditioning' },
    { id: 'mobility_flexibility', label: 'Mobility & Joint Health', desc: 'Active stretching, posture, longevity' },
    { id: 'general_health', label: 'General Fitness & Energy', desc: 'Balanced lifestyle, wellness & consistency' },
  ];

  const limitationOptions: { id: Limitation; label: string }[] = [
    { id: 'none', label: 'No Injuries / Healthy' },
    { id: 'knee_pain', label: 'Knee Discomfort / Runner’s Knee' },
    { id: 'lower_back', label: 'Lower Back Sensitivity' },
    { id: 'shoulder_mobility', label: 'Shoulder Impingement / Mobility' },
    { id: 'wrist_pain', label: 'Wrist Tenderness' },
    { id: 'hypertension', label: 'Hypertension / High BP' },
  ];

  const toggleGoal = (g: FitnessGoal) => {
    setFormData((prev) => {
      const exists = prev.fitnessGoals.includes(g);
      const next = exists ? prev.fitnessGoals.filter((item) => item !== g) : [...prev.fitnessGoals, g];
      return { ...prev, fitnessGoals: next.length > 0 ? next : ['general_health'] };
    });
  };

  const toggleLimitation = (lim: Limitation) => {
    setFormData((prev) => {
      if (lim === 'none') {
        return { ...prev, limitations: ['none'] };
      }
      const withoutNone = prev.limitations.filter((item) => item !== 'none');
      const exists = withoutNone.includes(lim);
      const next = exists ? withoutNone.filter((item) => item !== lim) : [...withoutNone, lim];
      return { ...prev, limitations: next.length > 0 ? next : ['none'] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isAdult = formData.age >= 20;

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-5xl mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:bg-lime-500/15 dark:text-lime-300 dark:border-lime-500/30">
              User Profile
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Customized Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            User Profile & Biometrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Personalize your age, targets, limitations, and fitness persona.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-fade-in shadow-sm">
            <Check className="w-4 h-4" /> Profile Updated Successfully!
          </div>
        )}
      </div>

      {/* Calculated Health Metrics Dashboard Banner */}
      <div className="glass-card p-6 border-emerald-500/30 dark:border-lime-500/20 bg-slate-50/50 dark:bg-charcoal-900/60">
        <h3 className="text-xs font-bold text-emerald-700 dark:text-lime-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Real-time Calculated Metrics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* BMI */}
          <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Body Mass Index</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{metrics.bmi.toFixed(1)}</span>
              <span className={`text-xs font-bold ${
                isAdult && (metrics.bmiCategory === 'Healthy weight' || metrics.bmiCategory === 'Normal')
                  ? 'text-emerald-600 dark:text-lime-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {isAdult ? metrics.bmiCategory : 'Pediatric'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {isAdult ? 'Adult 18.5 – 24.9' : 'Percentiles required'}
            </p>
          </div>

          {/* BMR */}
          <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Basal Metabolic Rate</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{metrics.bmr}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">kcal/day</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Resting energy burn</p>
          </div>

          {/* Calorie Target */}
          <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Target Calories</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-lime-400">{metrics.dailyCaloriesTarget}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">kcal</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Goal adjusted intake</p>
          </div>

          {/* Protein Target */}
          <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Target Protein</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-lime-400">{metrics.dailyProteinGrams}g</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">per day</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">~2.0g per kg body weight</p>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Basic Demographics */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600 dark:text-lime-400" /> Basic Demographics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Age ({formData.age < 18 ? 'Teenager' : formData.age < 20 ? 'Youth (18–19)' : formData.age >= 50 ? 'Senior (50+)' : 'Adult'})
              </label>
              <input
                type="number"
                min="2"
                max="120"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 18 })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Height (cm)</label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  max="260"
                  required
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: parseFloat(e.target.value) || 170 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-white pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">cm</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Weight (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  min="20"
                  max="350"
                  step="0.1"
                  required
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 70 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-white pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">kg</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Activity Level</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-white"
              >
                <option value="sedentary">Sedentary (Desk job / Little exercise)</option>
                <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                <option value="very_active">Very Active (6-7 days/week)</option>
                <option value="athlete">Athlete / Heavy physical labor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Goals & Equipment */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600 dark:text-lime-400" /> Primary Fitness Goals (Select All That Apply)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {goalOptions.map((g) => {
              const isSelected = formData.fitnessGoals.includes(g.id);
              return (
                <div
                  key={g.id}
                  onClick={() => toggleGoal(g.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 dark:bg-lime-500/15 dark:border-lime-400 dark:text-white shadow-sm'
                      : 'bg-white dark:bg-charcoal-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{g.label}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-lime-400 dark:border-lime-400 dark:text-charcoal-950' : 'border-slate-400'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{g.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Workout Environment / Equipment</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'gym', label: 'Commercial Gym', desc: 'Barbells, cables & machines' },
                { id: 'home_bodyweight', label: 'Home Bodyweight', desc: 'Zero equipment needed' },
                { id: 'dumbbells_only', label: 'Dumbbells / Bands', desc: 'Compact home setup' },
              ].map((eq) => (
                <div
                  key={eq.id}
                  onClick={() => setFormData({ ...formData, equipment: eq.id as EquipmentPreference })}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.equipment === eq.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-lime-500/15 dark:border-lime-400 dark:text-white'
                      : 'bg-white dark:bg-charcoal-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">{eq.label}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{eq.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Physical Limitations / Injury Considerations */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Physical Limitations & Safety Filters
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Workouts automatically adapt to exclude contraindications</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {limitationOptions.map((lim) => {
              const isSelected = formData.limitations.includes(lim.id);
              return (
                <button
                  type="button"
                  key={lim.id}
                  onClick={() => toggleLimitation(lim.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? lim.id === 'none'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500 text-amber-800 dark:text-amber-200'
                      : 'bg-white dark:bg-charcoal-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <span className="text-xs font-semibold block">{lim.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Daily Habits & Targets */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600 dark:text-lime-400" /> Daily Habits & Target Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Daily Step Target</label>
              <input
                type="number"
                min="1000"
                max="50000"
                step="500"
                value={formData.dailyStepTarget}
                onChange={(e) => setFormData({ ...formData, dailyStepTarget: parseInt(e.target.value, 10) || 8000 })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Recommended: 8,000 – 10,000 steps</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Daily Water Intake Target (ml)</label>
              <input
                type="number"
                min="500"
                max="10000"
                step="250"
                value={formData.dailyWaterTargetMl}
                onChange={(e) => setFormData({ ...formData, dailyWaterTargetMl: parseInt(e.target.value, 10) || 2500 })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">~35ml per kg of body weight</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Target Sleep (hours/night)</label>
              <input
                type="number"
                min="4"
                max="14"
                step="0.5"
                value={formData.dailySleepTargetHours}
                onChange={(e) => setFormData({ ...formData, dailySleepTargetHours: parseFloat(e.target.value) || 8 })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Recommended: 7.0 – 9.0 hours</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="brand-btn-primary px-8 py-3 text-sm font-bold shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Profile & Recalculate
          </button>
        </div>

      </form>
    </div>
  );
};
