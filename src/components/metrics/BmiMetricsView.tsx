import React, { useState } from 'react';
import {
  Scale,
  Ruler,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Trash2,
  Info,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  RotateCcw,
  PlusCircle,
  Database,
  Download,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { calculateBmiDetails, BmiAnalysis } from '../../services/storage';
import { Gender } from '../../types/user';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';

export const BmiMetricsView: React.FC = () => {
  const { profile, bmiHistory, addBmiEntry, deleteBmiEntry } = useFitness();
  const { isCloudConnected } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Form states initialized with profile values
  const [heightVal, setHeightVal] = useState<string>(profile.heightCm ? profile.heightCm.toString() : '175');
  const [weightVal, setWeightVal] = useState<string>(profile.weightKg ? profile.weightKg.toString() : '70');
  const [ageVal, setAgeVal] = useState<string>(profile.age ? profile.age.toString() : '24');
  const [genderVal, setGenderVal] = useState<Gender>(profile.gender || 'male');
  const [notesVal, setNotesVal] = useState<string>('');

  // Unit toggle helpers (for user convenience, while validating and storing in cm and kg)
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [heightFt, setHeightFt] = useState<string>('5');
  const [heightIn, setHeightIn] = useState<string>('9');
  const [weightLbs, setWeightLbs] = useState<string>('154');

  // Validation errors
  const [errors, setErrors] = useState<{ height?: string; weight?: string; age?: string }>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Live calculation based on current form inputs
  const parseNum = (v: string) => {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  };

  const parsedHeight = parseNum(heightVal);
  const parsedWeight = parseNum(weightVal);
  const parsedAge = parseInt(ageVal, 10) || 0;

  const liveAnalysis: BmiAnalysis | null =
    parsedHeight >= 50 && parsedWeight >= 20 && parsedAge > 0
      ? calculateBmiDetails(parsedHeight, parsedWeight, parsedAge, genderVal)
      : null;

  // Handle imperial unit change helpers
  const handleImperialHeightChange = (ftStr: string, inStr: string) => {
    setHeightFt(ftStr);
    setHeightIn(inStr);
    const ft = parseFloat(ftStr) || 0;
    const inch = parseFloat(inStr) || 0;
    const totalInches = ft * 12 + inch;
    const cm = Math.round(totalInches * 2.54);
    setHeightVal(cm > 0 ? cm.toString() : '');
  };

  const handleImperialWeightChange = (lbsStr: string) => {
    setWeightLbs(lbsStr);
    const lbs = parseFloat(lbsStr) || 0;
    const kg = parseFloat((lbs * 0.45359237).toFixed(1));
    setWeightVal(kg > 0 ? kg.toString() : '');
  };

  const handleMetricHeightChange = (val: string) => {
    setHeightVal(val);
    const cm = parseFloat(val) || 0;
    if (cm > 0) {
      const totalInches = cm / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inch = Math.round(totalInches % 12);
      setHeightFt(ft.toString());
      setHeightIn(inch.toString());
    }
  };

  const handleMetricWeightChange = (val: string) => {
    setWeightVal(val);
    const kg = parseFloat(val) || 0;
    if (kg > 0) {
      setWeightLbs(Math.round(kg * 2.20462).toString());
    }
  };

  const validate = (): boolean => {
    const newErrors: { height?: string; weight?: string; age?: string } = {};

    if (!heightVal.trim()) {
      newErrors.height = 'Height is required.';
    } else {
      const h = parseFloat(heightVal);
      if (isNaN(h) || h < 50 || h > 260) {
        newErrors.height = 'Height must be between 50 cm and 260 cm.';
      }
    }

    if (!weightVal.trim()) {
      newErrors.weight = 'Weight is required.';
    } else {
      const w = parseFloat(weightVal);
      if (isNaN(w) || w < 20 || w > 350) {
        newErrors.weight = 'Weight must be between 20 kg and 350 kg.';
      }
    }

    if (!ageVal.trim()) {
      newErrors.age = 'Age is required.';
    } else {
      const a = parseInt(ageVal, 10);
      if (isNaN(a) || a < 2 || a > 120) {
        newErrors.age = 'Age must be between 2 and 120 years.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const h = parseFloat(heightVal);
    const w = parseFloat(weightVal);

    addBmiEntry(h, w, notesVal.trim() || undefined);
    setSuccessMsg('Measurement saved to history and profile updated!');
    setNotesVal('');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleResetForm = () => {
    setHeightVal(profile.heightCm ? profile.heightCm.toString() : '175');
    setWeightVal(profile.weightKg ? profile.weightKg.toString() : '70');
    setAgeVal(profile.age ? profile.age.toString() : '24');
    setGenderVal(profile.gender || 'male');
    setNotesVal('');
    setErrors({});
  };

  const chartHistoryData = [...bmiHistory]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({
      date: item.date.slice(5),
      fullDate: item.date,
      bmi: item.bmi,
      weight: item.weightKg,
    }));

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bmiHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aurafit_bmi_history_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Helper for needle position on the 10 - 40 BMI scale
  const getScalePercentage = (bmi: number): number => {
    const minScale = 14;
    const maxScale = 38;
    const clamped = Math.max(minScale, Math.min(maxScale, bmi));
    return ((clamped - minScale) / (maxScale - minScale)) * 100;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:bg-lime-500/15 dark:text-lime-300 dark:border-lime-500/30">
              Biometric Intelligence
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              WHO & CDC Aligned • Validated Standards
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            BMI Calculator & Body Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
            Calculate your Body Mass Index (BMI) using validated metric standards, track dated measurements, and view age-specific health screening ranges.
          </p>
        </div>

        {/* Storage State Indicator */}
        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
          {isCloudConnected ? (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Supabase Cloud Sync Ready</span>
            </>
          ) : (
            <>
              <Database className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">Local Storage Fallback (Active)</span>
            </>
          )}
        </div>
      </div>

      {/* Mandatory Medical & Screening Scope Notice Banner */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 text-amber-900 dark:text-amber-200 flex items-start gap-3.5 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
          <p className="font-bold text-amber-950 dark:text-amber-100">
            Clinical Screening Measure Disclaimer:
          </p>
          <p className="text-amber-900/90 dark:text-amber-200/90">
            Body Mass Index (BMI) is an anthropometric population screening tool, <strong>not a medical diagnosis</strong> of disease or body composition. BMI <strong>does not directly measure body fat</strong>, visceral adiposity, muscle mass, bone density, or metabolic fitness. Highly muscular athletes may be classified as &quot;overweight&quot; despite low body fat, while older adults may lose muscle without BMI changes. BMI alone does not determine overall health or physical fitness.
          </p>
        </div>
      </div>

      {/* Main Grid: Calculator Form & Visual Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Input Form (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600 dark:text-lime-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Measurement Inputs</h2>
              </div>

              {/* Metric / Imperial Convenience Toggle */}
              <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-charcoal-800 border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    unitSystem === 'metric'
                      ? 'bg-white dark:bg-charcoal-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Metric (cm / kg)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    unitSystem === 'imperial'
                      ? 'bg-white dark:bg-charcoal-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Imperial (ft / lbs)
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveMeasurement} className="space-y-4">
              
              {/* Height Input (Validated in cm) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Height in Centimetres (cm) <span className="text-rose-500">*</span>
                </label>
                {unitSystem === 'metric' ? (
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="50"
                      max="260"
                      value={heightVal}
                      onChange={(e) => handleMetricHeightChange(e.target.value)}
                      placeholder="e.g. 175"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-800 border text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.height
                          ? 'border-rose-500 focus:ring-rose-500/30'
                          : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:ring-emerald-500/20'
                      }`}
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">
                      cm
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="2"
                        max="8"
                        value={heightFt}
                        onChange={(e) => handleImperialHeightChange(e.target.value, heightIn)}
                        placeholder="Feet"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                      />
                      <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">ft</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={heightIn}
                        onChange={(e) => handleImperialHeightChange(heightFt, e.target.value)}
                        placeholder="Inches"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                      />
                      <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">in</span>
                    </div>
                  </div>
                )}
                {errors.height ? (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.height}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Standard range: 50 – 260 cm. (Stored: {parsedHeight} cm)
                  </p>
                )}
              </div>

              {/* Weight Input (Validated in kg) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Weight in Kilograms (kg) <span className="text-rose-500">*</span>
                </label>
                {unitSystem === 'metric' ? (
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="20"
                      max="350"
                      value={weightVal}
                      onChange={(e) => handleMetricWeightChange(e.target.value)}
                      placeholder="e.g. 70.0"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-800 border text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.weight
                          ? 'border-rose-500 focus:ring-rose-500/30'
                          : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:ring-emerald-500/20'
                      }`}
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">
                      kg
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="44"
                      max="770"
                      value={weightLbs}
                      onChange={(e) => handleImperialWeightChange(e.target.value)}
                      placeholder="e.g. 154"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 pointer-events-none">
                      lbs
                    </span>
                  </div>
                )}
                {errors.weight ? (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.weight}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Standard range: 20 – 350 kg. (Stored: {parsedWeight} kg)
                  </p>
                )}
              </div>

              {/* Age & Sex Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Age (Years) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="120"
                    value={ageVal}
                    onChange={(e) => setAgeVal(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-800 border text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 ${
                      errors.age
                        ? 'border-rose-500 focus:ring-rose-500/30'
                        : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:ring-emerald-500/20'
                    }`}
                  />
                  {errors.age && (
                    <p className="mt-1 text-xs text-rose-500">{errors.age}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Biological Sex
                  </label>
                  <select
                    value={genderVal}
                    onChange={(e) => setGenderVal(e.target.value as Gender)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-lime-400"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Non-binary</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Measurement Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notesVal}
                  onChange={(e) => setNotesVal(e.target.value)}
                  placeholder="e.g. Morning weigh-in after fasting"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-lime-400"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 brand-btn-primary py-2.5 text-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Log & Save to History</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
                  title="Reset to current profile"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Formula applied: <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-charcoal-800 font-mono text-emerald-700 dark:text-lime-400">weightKg / (heightCm / 100)²</code>
          </div>
        </div>

        {/* Right Column: Visual Analysis & Gauge (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Result Card */}
          <div className="glass-card p-6 border-slate-200 dark:border-slate-800">
            {liveAnalysis ? (
              <div className="space-y-6">
                
                {/* Top Metric Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                      Calculated Body Mass Index
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        {liveAnalysis.bmi.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        kg/m²
                      </span>
                    </div>
                  </div>

                  {/* Screening Category Badge */}
                  <div className="sm:text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                      Screening Classification
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm border ${liveAnalysis.colorClass}`}>
                      {liveAnalysis.statusBadge}
                    </span>
                  </div>
                </div>

                {/* Range Gauge Visualization */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>BMI Range Scale</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">Current: {liveAnalysis.bmi.toFixed(1)}</span>
                  </div>

                  {/* Horizontal Segmented Bar */}
                  <div className="relative w-full h-4 rounded-full overflow-hidden flex bg-slate-200 dark:bg-charcoal-800 shadow-inner">
                    {/* Underweight: < 18.5 (~18% of scale) */}
                    <div
                      style={{ width: '18.75%' }}
                      className="h-full bg-sky-400 dark:bg-sky-500"
                      title="Underweight (< 18.5)"
                    />
                    {/* Healthy Weight: 18.5 - 24.9 (~27% of scale) */}
                    <div
                      style={{ width: '26.67%' }}
                      className="h-full bg-emerald-500 dark:bg-lime-400"
                      title="Healthy Weight (18.5 - 24.9)"
                    />
                    {/* Overweight: 25.0 - 29.9 (~21% of scale) */}
                    <div
                      style={{ width: '20.83%' }}
                      className="h-full bg-amber-400 dark:bg-amber-500"
                      title="Overweight (25.0 - 29.9)"
                    />
                    {/* Obesity: >= 30.0 (~33.75% of scale) */}
                    <div
                      style={{ width: '33.75%' }}
                      className="h-full bg-rose-500 dark:bg-rose-600"
                      title="Obesity (≥ 30.0)"
                    />
                  </div>

                  {/* Needle Pointer */}
                  <div className="relative w-full h-4">
                    <div
                      className="absolute top-0 -ml-2 flex flex-col items-center transition-all duration-300"
                      style={{ left: `${getScalePercentage(liveAnalysis.bmi)}%` }}
                    >
                      <div className="w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-slate-900 dark:border-t-white" />
                      <span className="text-[10px] font-bold text-slate-800 dark:text-white mt-0.5">
                        {liveAnalysis.bmi.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Legend Labels */}
                  <div className="grid grid-cols-4 gap-1 pt-1 text-[10px] text-center font-medium">
                    <div className="text-sky-600 dark:text-sky-400 truncate">
                      &lt;18.5 Underweight
                    </div>
                    <div className="text-emerald-700 dark:text-lime-400 truncate">
                      18.5–24.9 Healthy
                    </div>
                    <div className="text-amber-600 dark:text-amber-400 truncate">
                      25–29.9 Overweight
                    </div>
                    <div className="text-rose-600 dark:text-rose-400 truncate">
                      ≥30.0 Obesity
                    </div>
                  </div>
                </div>

                {/* Age Differentiation Explanation Box */}
                {!liveAnalysis.isAdult ? (
                  /* Under-20 Pediatric Warning & Explanation */
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-100">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <span>Notice for Users Under 20 Years Old</span>
                    </div>
                    <p className="leading-relaxed">
                      Standard adult BMI categories (such as 18.5–24.9) <strong>do not apply</strong> to individuals under 20. In children and teenagers, body mass index must be compared against clinical <strong>age- and sex-specific growth percentiles</strong> (e.g. CDC Pediatric Growth Charts). During youth, body composition and fat distribution fluctuate rapidly with pubertal development. Please consult your family physician or pediatrician for individual evaluation.
                    </p>
                  </div>
                ) : (
                  /* Adult Screening Explanation */
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-charcoal-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                      <Info className="w-4 h-4 text-emerald-600 dark:text-lime-400 flex-shrink-0" />
                      <span>Adult Screening Insights ({parsedAge} years)</span>
                    </div>
                    <p className="leading-relaxed">{liveAnalysis.message}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Theoretical healthy weight range for your height ({parsedHeight} cm):{' '}
                      <strong className="text-slate-800 dark:text-slate-200">
                        {liveAnalysis.healthyWeightRange.min} kg – {liveAnalysis.healthyWeightRange.max} kg
                      </strong>.
                    </p>
                  </div>
                )}

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500">
                <Scale className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                <p className="text-sm">Enter valid height and weight to calculate your BMI details.</p>
              </div>
            )}
          </div>

          {/* Quick Body Metrics Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="glass-card p-4">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Height</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{parsedHeight}</span>
              <span className="text-xs text-slate-500 ml-1">cm</span>
            </div>
            <div className="glass-card p-4">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Weight</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{parsedWeight}</span>
              <span className="text-xs text-slate-500 ml-1">kg</span>
            </div>
            <div className="glass-card p-4 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Age Group</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                {parsedAge < 20 ? 'Youth (< 20)' : parsedAge >= 50 ? 'Senior Adult' : 'Adult (20+)'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Dated History of Measurements Section */}
      <div className="glass-card p-6 border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-lime-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Measurement History</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chronological log of your weight and BMI measurements over time
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Total entries: <strong className="text-slate-900 dark:text-white">{bmiHistory.length}</strong>
            </span>
            {bmiHistory.length > 0 && (
              <button
                type="button"
                onClick={handleExportData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Export BMI data to JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            )}
          </div>
        </div>

        {/* Trend Line Chart (renders when 2 or more records exist) */}
        {chartHistoryData.length >= 2 && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-50/70 dark:bg-charcoal-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-lime-400" />
                BMI Progression Curve
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Green dashed reference: 18.5 – 24.9 Healthy standard
              </span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%" key={theme}>
                <LineChart data={chartHistoryData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1a2436' : '#e2e8f0'} vertical={false} />
                  <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} tickLine={false} />
                  <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0e141f' : '#ffffff',
                      borderColor: isDark ? '#23324a' : '#e2e8f0',
                      borderRadius: '12px',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '12px',
                    }}
                  />
                  <ReferenceLine y={18.5} stroke={isDark ? '#a3e635' : '#10b981'} strokeDasharray="3 3" />
                  <ReferenceLine y={24.9} stroke={isDark ? '#a3e635' : '#10b981'} strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="bmi"
                    stroke={isDark ? '#a3e635' : '#059669'}
                    strokeWidth={2.5}
                    dot={{ fill: isDark ? '#a3e635' : '#059669', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {bmiHistory.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            <Scale className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
            <p className="text-sm font-medium">No previous measurements recorded yet.</p>
            <p className="text-xs text-slate-400 mt-1">Use the form above to record your first entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Height</th>
                  <th className="pb-3 font-semibold">Weight</th>
                  <th className="pb-3 font-semibold">BMI</th>
                  <th className="pb-3 font-semibold">Classification</th>
                  <th className="pb-3 font-semibold hidden md:table-cell">Trend</th>
                  <th className="pb-3 font-semibold hidden lg:table-cell">Notes</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-charcoal-800">
                {bmiHistory.map((item, idx) => {
                  const prevItem = bmiHistory[idx + 1];
                  const bmiDiff = prevItem ? parseFloat((item.bmi - prevItem.bmi).toFixed(1)) : null;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-charcoal-800/40 transition-colors">
                      <td className="py-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {item.heightCm} cm
                      </td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300 font-semibold whitespace-nowrap">
                        {item.weightKg} kg
                      </td>
                      <td className="py-3.5 whitespace-nowrap">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {item.bmi.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-charcoal-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 whitespace-nowrap hidden md:table-cell">
                        {bmiDiff !== null ? (
                          bmiDiff === 0 ? (
                            <span className="text-slate-400 text-xs">0.0 (Unchanged)</span>
                          ) : bmiDiff > 0 ? (
                            <span className="text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-0.5">
                              <TrendingUp className="w-3.5 h-3.5" /> +{bmiDiff}
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-lime-400 text-xs font-semibold flex items-center gap-0.5">
                              <TrendingDown className="w-3.5 h-3.5" /> {bmiDiff}
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400 text-xs">Baseline</span>
                        )}
                      </td>
                      <td className="py-3.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate hidden lg:table-cell">
                        {item.notes || '—'}
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => deleteBmiEntry(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
