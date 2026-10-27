import { UserProfile, CalculatedMetrics, DailyActivityLog, AgeGroup, BmiRecord, Gender } from '../types/user';

const PROFILE_KEY = 'aurafit_user_profile';
const LOGS_KEY = 'aurafit_daily_logs';
const CUSTOM_RECIPES_KEY = 'aurafit_custom_recipes';
const BMI_HISTORY_KEY = 'aurafit_bmi_history';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'guest_user_default',
  name: 'Alex Rivera',
  age: 24,
  gender: 'male',
  heightCm: 175,
  weightKg: 70,
  activityLevel: 'moderately_active',
  fitnessGoals: ['muscle_gain', 'general_health'],
  limitations: ['none'],
  equipment: 'gym',
  dailyStepTarget: 8000,
  dailyWaterTargetMl: 2500,
  dailySleepTargetHours: 8,
  customNotes: 'Looking to stay lean while building upper body strength.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export interface BmiAnalysis {
  bmi: number;
  category: string;
  isAdult: boolean;
  colorClass: string;
  statusBadge: string;
  message: string;
  healthyWeightRange: { min: number; max: number };
}

export function calculateBmiDetails(
  heightCm: number,
  weightKg: number,
  age: number,
  _gender?: Gender
): BmiAnalysis {
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? parseFloat((weightKg / (heightM * heightM)).toFixed(1)) : 0;
  const isAdult = age >= 20;

  // Healthy weight range for height based on adult standard 18.5 - 24.9
  const healthyMin = parseFloat((18.5 * heightM * heightM).toFixed(1));
  const healthyMax = parseFloat((24.9 * heightM * heightM).toFixed(1));

  if (!isAdult) {
    return {
      bmi,
      category: 'Under 20 (Percentile Required)',
      isAdult: false,
      colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      statusBadge: 'Percentile Required (< 20 yrs)',
      message:
        'Standard adult BMI categories do NOT apply to individuals under 20. In children and teens (ages 2–19), BMI must be interpreted using age- and sex-specific growth percentiles (CDC/WHO growth charts) because body fat levels shift significantly during natural growth spurts.',
      healthyWeightRange: { min: healthyMin, max: healthyMax },
    };
  }

  if (bmi < 18.5) {
    return {
      bmi,
      category: 'Underweight',
      isAdult: true,
      colorClass: 'text-sky-500 bg-sky-500/10 border-sky-500/30',
      statusBadge: 'Underweight (< 18.5)',
      message:
        'Your BMI is below the standard healthy-weight range for adults. Ensure adequate caloric and protein intake to support immune function, bone density, and energy levels.',
      healthyWeightRange: { min: healthyMin, max: healthyMax },
    };
  } else if (bmi < 25.0) {
    return {
      bmi,
      category: 'Healthy weight',
      isAdult: true,
      colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      statusBadge: 'Healthy weight (18.5–24.9)',
      message:
        'Your BMI falls within the standard healthy weight screening range for adults aged 20 and older. Maintain your active lifestyle and balanced nutrition.',
      healthyWeightRange: { min: healthyMin, max: healthyMax },
    };
  } else if (bmi < 30.0) {
    return {
      bmi,
      category: 'Overweight',
      isAdult: true,
      colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      statusBadge: 'Overweight (25.0–29.9)',
      message:
        'Your BMI falls in the overweight screening range. Note that muscular individuals often register here without excess adiposity because BMI does not distinguish between lean mass and fat mass.',
      healthyWeightRange: { min: healthyMin, max: healthyMax },
    };
  } else {
    return {
      bmi,
      category: 'Obesity',
      isAdult: true,
      colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
      statusBadge: 'Obesity (≥ 30.0)',
      message:
        'Your BMI falls in the obesity screening range. Prioritize sustainable lifestyle habits including daily movement, nutrient-dense whole foods, quality sleep, and consulting a healthcare professional.',
      healthyWeightRange: { min: healthyMin, max: healthyMax },
    };
  }
}

export function calculateMetrics(profile: UserProfile): CalculatedMetrics {
  const analysis = calculateBmiDetails(profile.heightCm, profile.weightKg, profile.age, profile.gender);
  const bmi = analysis.bmi;
  const bmiCategory = analysis.category as CalculatedMetrics['bmiCategory'];

  // Mifflin-St Jeor BMR formula
  let bmr = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  if (profile.gender === 'male') {
    bmr += 5;
  } else if (profile.gender === 'female') {
    bmr -= 161;
  } else {
    bmr -= 78; // average
  }
  bmr = Math.round(bmr);

  // Activity multiplier
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    athlete: 1.9,
  };
  const maintenance = Math.round(bmr * (multipliers[profile.activityLevel] || 1.375));

  // Goal calorie adjustment
  let dailyCaloriesTarget = maintenance;
  if (profile.fitnessGoals.includes('weight_loss')) {
    dailyCaloriesTarget -= 400;
  } else if (profile.fitnessGoals.includes('muscle_gain')) {
    dailyCaloriesTarget += 350;
  }

  // Daily protein target (approx 1.8g to 2.2g per kg for muscle gain/weight loss)
  let proteinMultiplier = 1.6;
  if (profile.fitnessGoals.includes('muscle_gain')) proteinMultiplier = 2.0;
  if (profile.fitnessGoals.includes('weight_loss')) proteinMultiplier = 2.2;
  const dailyProteinGrams = Math.round(profile.weightKg * proteinMultiplier);

  // Age grouping
  let ageGroup: AgeGroup = 'adult';
  if (profile.age < 18) ageGroup = 'teen';
  else if (profile.age >= 50) ageGroup = 'senior';

  return {
    bmi,
    bmiCategory,
    bmr,
    dailyCaloriesTarget,
    dailyProteinGrams,
    ageGroup,
  };
}

export function loadUserProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading user profile from localStorage', e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving user profile to localStorage', e);
  }
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function loadDailyLogs(): Record<string, DailyActivityLog> {
  try {
    const saved = localStorage.getItem(LOGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading logs from localStorage', e);
  }

  // Generate realistic 7-day starter log for charts
  const starterLogs: Record<string, DailyActivityLog> = {};
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Seed realistic variations
    const stepMultiplier = i === 0 ? 0.75 : 0.85 + ((i * 17) % 30) / 100;
    starterLogs[dateStr] = {
      date: dateStr,
      steps: Math.round(8000 * stepMultiplier),
      waterIntakeMl: Math.round(2500 * (0.8 + ((i * 13) % 40) / 100)),
      sleepHours: parseFloat((7.0 + ((i * 7) % 20) / 10).toFixed(1)),
      caloriesBurned: Math.round(350 * (0.7 + ((i * 23) % 50) / 100)),
      completedWorkoutIds: i % 2 === 0 ? ['seed-workout'] : [],
    };
  }

  saveDailyLogs(starterLogs);
  return starterLogs;
}

export function saveDailyLogs(logs: Record<string, DailyActivityLog>): void {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving logs to localStorage', e);
  }
}

export function updateTodayLog(partial: Partial<DailyActivityLog>): DailyActivityLog {
  const logs = loadDailyLogs();
  const today = getTodayDateString();
  const current = logs[today] || {
    date: today,
    steps: 0,
    waterIntakeMl: 0,
    sleepHours: 0,
    caloriesBurned: 0,
    completedWorkoutIds: [],
  };

  const updated: DailyActivityLog = {
    ...current,
    ...partial,
  };

  logs[today] = updated;
  saveDailyLogs(logs);
  return updated;
}

export function loadBmiHistory(): BmiRecord[] {
  try {
    const saved = localStorage.getItem(BMI_HISTORY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading BMI history from localStorage', e);
  }

  // Seed with realistic starter history entries based on default profile
  const today = new Date();
  const d1 = new Date(today);
  d1.setDate(today.getDate() - 30);
  const d2 = new Date(today);
  d2.setDate(today.getDate() - 14);

  const starterHistory: BmiRecord[] = [
    {
      id: 'bmi-seed-1',
      date: d1.toISOString().split('T')[0],
      timestamp: d1.getTime(),
      heightCm: 175,
      weightKg: 72.5,
      bmi: 23.7,
      age: 24,
      gender: 'male',
      category: 'Healthy weight',
      isAdult: true,
      notes: 'Initial baseline check-in.',
    },
    {
      id: 'bmi-seed-2',
      date: d2.toISOString().split('T')[0],
      timestamp: d2.getTime(),
      heightCm: 175,
      weightKg: 71.2,
      bmi: 23.2,
      age: 24,
      gender: 'male',
      category: 'Healthy weight',
      isAdult: true,
      notes: 'Mid-month tracking progress.',
    },
    {
      id: 'bmi-seed-3',
      date: today.toISOString().split('T')[0],
      timestamp: today.getTime(),
      heightCm: 175,
      weightKg: 70.0,
      bmi: 22.9,
      age: 24,
      gender: 'male',
      category: 'Healthy weight',
      isAdult: true,
      notes: 'Current profile measurement.',
    },
  ];

  saveBmiHistory(starterHistory);
  return starterHistory;
}

export function saveBmiHistory(records: BmiRecord[]): void {
  try {
    localStorage.setItem(BMI_HISTORY_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving BMI history to localStorage', e);
  }
}

export function addBmiRecord(
  entry: Omit<BmiRecord, 'id' | 'timestamp'>
): BmiRecord {
  const records = loadBmiHistory();
  const newRecord: BmiRecord = {
    ...entry,
    id: `bmi-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
  };

  const updated = [newRecord, ...records];
  saveBmiHistory(updated);
  return newRecord;
}

export function deleteBmiRecord(id: string): BmiRecord[] {
  const records = loadBmiHistory();
  const updated = records.filter(r => r.id !== id);
  saveBmiHistory(updated);
  return updated;
}
