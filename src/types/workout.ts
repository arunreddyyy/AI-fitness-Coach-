import { AgeGroup, FitnessGoal, Limitation, EquipmentPreference } from './user';

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'legs' 
  | 'shoulders' 
  | 'arms' 
  | 'core' 
  | 'full_body' 
  | 'cardio';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  targetMuscles: MuscleGroup[];
  equipmentNeeded: EquipmentPreference[];
  suggestedSets: number;
  suggestedReps: string; // e.g., "10-12 reps" or "45 secs"
  restPeriodSeconds: number;
  instructions: string[];
  safetyTips: string;
  contraindications: Limitation[]; // If user has this limitation, exclude or warn
  animationUrl?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  description: string;
  ageCategory: AgeGroup; // 'teen' | 'adult' | 'senior'
  goal: FitnessGoal;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  caloriesBurnEstimate: number;
  equipment: EquipmentPreference;
  exercises: Exercise[];
  isCustomAI?: boolean;
}

export interface WorkoutSessionLog {
  id: string;
  date: string;
  routineId?: string;
  routineTitle: string;
  durationMinutes: number;
  caloriesBurned: number;
  completedExercises: {
    exerciseName: string;
    setsCompleted: number;
    repsCompleted: string;
    weightUsedKg?: number;
  }[];
  userRating?: 1 | 2 | 3 | 4 | 5;
  feedbackNotes?: string;
}
