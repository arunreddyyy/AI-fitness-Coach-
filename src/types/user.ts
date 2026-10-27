export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type ActivityLevel = 
  | 'sedentary'          // Desk job, little to no exercise
  | 'lightly_active'     // 1-3 days/week light exercise
  | 'moderately_active'  // 3-5 days/week moderate exercise
  | 'very_active'        // 6-7 days/week hard exercise
  | 'athlete';           // Twice a day or intense athletic training

export type FitnessGoal = 
  | 'weight_loss' 
  | 'muscle_gain' 
  | 'endurance' 
  | 'mobility_flexibility' 
  | 'general_health';

export type AgeGroup = 'teen' | 'adult' | 'senior';

export type Limitation = 
  | 'knee_pain' 
  | 'lower_back' 
  | 'shoulder_mobility' 
  | 'wrist_pain'
  | 'hypertension'
  | 'none';

export type EquipmentPreference = 'gym' | 'home_bodyweight' | 'dumbbells_only';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  fitnessGoals: FitnessGoal[];
  limitations: Limitation[];
  equipment: EquipmentPreference;
  dailyStepTarget: number;
  dailyWaterTargetMl: number;
  dailySleepTargetHours: number;
  customNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BmiCategory = 
  | 'Underweight' 
  | 'Healthy weight' 
  | 'Normal' 
  | 'Overweight' 
  | 'Obesity' 
  | 'Obese' 
  | 'Under 20 (Percentile Required)';

export interface CalculatedMetrics {
  bmi: number;
  bmiCategory: BmiCategory;
  bmr: number;
  dailyCaloriesTarget: number;
  dailyProteinGrams: number;
  ageGroup: AgeGroup;
}

export interface BmiRecord {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  age: number;
  gender: Gender;
  category: string;
  isAdult: boolean;
  notes?: string;
}

export interface DailyActivityLog {
  date: string; // YYYY-MM-DD
  steps: number;
  waterIntakeMl: number;
  sleepHours: number;
  caloriesBurned: number;
  completedWorkoutIds: string[];
  notes?: string;
}
