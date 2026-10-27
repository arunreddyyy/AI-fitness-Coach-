import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile, CalculatedMetrics, DailyActivityLog, BmiRecord } from '../types/user';
import { WorkoutRoutine } from '../types/workout';
import { NutritionRecipe } from '../types/nutrition';
import {
  loadUserProfile,
  saveUserProfile,
  calculateMetrics,
  calculateBmiDetails,
  loadDailyLogs,
  saveDailyLogs,
  updateTodayLog,
  getTodayDateString,
  loadBmiHistory,
  addBmiRecord,
  deleteBmiRecord,
  DEFAULT_USER_PROFILE,
} from '../services/storage';
import { DEFAULT_WORKOUT_ROUTINES } from '../data/defaultWorkouts';
import { DEFAULT_RECIPES } from '../data/defaultRecipes';
import { syncProfileToSupabase, syncDailyLogToSupabase } from '../services/supabase';

interface FitnessContextType {
  profile: UserProfile;
  metrics: CalculatedMetrics;
  todayLog: DailyActivityLog;
  allLogs: Record<string, DailyActivityLog>;
  workouts: WorkoutRoutine[];
  recipes: NutritionRecipe[];
  bmiHistory: BmiRecord[];
  updateProfile: (updates: Partial<UserProfile>) => void;
  addWater: (amountMl: number) => void;
  resetWater: () => void;
  setSteps: (steps: number) => void;
  addSteps: (steps: number) => void;
  logSleep: (hours: number) => void;
  toggleWorkoutComplete: (routineId: string, durationMinutes?: number, calories?: number) => void;
  addCustomRecipe: (recipe: NutritionRecipe) => void;
  addCustomWorkout: (routine: WorkoutRoutine) => void;
  addBmiEntry: (heightCm: number, weightKg: number, notes?: string) => BmiRecord;
  deleteBmiEntry: (id: string) => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [metrics, setMetrics] = useState<CalculatedMetrics>(() => calculateMetrics(DEFAULT_USER_PROFILE));
  const [allLogs, setAllLogs] = useState<Record<string, DailyActivityLog>>({});
  const [bmiHistory, setBmiHistory] = useState<BmiRecord[]>([]);
  const [todayLog, setTodayLog] = useState<DailyActivityLog>({
    date: getTodayDateString(),
    steps: 4200,
    waterIntakeMl: 1250,
    sleepHours: 7.5,
    caloriesBurned: 220,
    completedWorkoutIds: [],
  });

  const [workouts, setWorkouts] = useState<WorkoutRoutine[]>(DEFAULT_WORKOUT_ROUTINES);
  const [recipes, setRecipes] = useState<NutritionRecipe[]>(DEFAULT_RECIPES);

  // Initialize from storage on mount
  useEffect(() => {
    const loadedProfile = loadUserProfile();
    setProfile(loadedProfile);
    setMetrics(calculateMetrics(loadedProfile));

    const loadedLogs = loadDailyLogs();
    setAllLogs(loadedLogs);

    const loadedBmiHistory = loadBmiHistory();
    setBmiHistory(loadedBmiHistory);

    const todayStr = getTodayDateString();
    if (loadedLogs[todayStr]) {
      setTodayLog(loadedLogs[todayStr]);
    } else {
      const initialToday: DailyActivityLog = {
        date: todayStr,
        steps: 4500,
        waterIntakeMl: 1500,
        sleepHours: 7.5,
        caloriesBurned: 240,
        completedWorkoutIds: [],
      };
      setTodayLog(initialToday);
      updateTodayLog(initialToday);
    }

    // Load custom recipes if any
    try {
      const storedCustomRecipes = localStorage.getItem('aurafit_custom_recipes');
      if (storedCustomRecipes) {
        const parsed = JSON.parse(storedCustomRecipes);
        setRecipes([...parsed, ...DEFAULT_RECIPES]);
      }
      const storedCustomWorkouts = localStorage.getItem('aurafit_custom_workouts');
      if (storedCustomWorkouts) {
        const parsed = JSON.parse(storedCustomWorkouts);
        setWorkouts([...parsed, ...DEFAULT_WORKOUT_ROUTINES]);
      }
    } catch (e) {
      console.error('Error loading custom items', e);
    }
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#00f2fe', '#06b6d4', '#10b981', '#3b82f6'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    const newMetrics = calculateMetrics(updated);
    setMetrics(newMetrics);
    saveUserProfile(updated);
    syncProfileToSupabase(updated);
  };

  const addWater = (amountMl: number) => {
    const current = todayLog.waterIntakeMl;
    const newTotal = Math.max(0, current + amountMl);
    const updated = updateTodayLog({ waterIntakeMl: newTotal });
    setTodayLog(updated);
    setAllLogs(prev => ({ ...prev, [updated.date]: updated }));
    syncDailyLogToSupabase(updated);

    if (current < profile.dailyWaterTargetMl && newTotal >= profile.dailyWaterTargetMl) {
      triggerConfetti();
    }
  };

  const resetWater = () => {
    const updated = updateTodayLog({ waterIntakeMl: 0 });
    setTodayLog(updated);
    setAllLogs(prev => ({ ...prev, [updated.date]: updated }));
    syncDailyLogToSupabase(updated);
  };

  const setSteps = (steps: number) => {
    const updated = updateTodayLog({ steps: Math.max(0, steps) });
    setTodayLog(updated);
    setAllLogs(prev => ({ ...prev, [updated.date]: updated }));
    syncDailyLogToSupabase(updated);

    if (steps >= profile.dailyStepTarget && todayLog.steps < profile.dailyStepTarget) {
      triggerConfetti();
    }
  };

  const addSteps = (amount: number) => {
    setSteps(todayLog.steps + amount);
  };

  const logSleep = (hours: number) => {
    const updated = updateTodayLog({ sleepHours: Math.max(0, Math.min(24, hours)) });
    setTodayLog(updated);
    setAllLogs(prev => ({ ...prev, [updated.date]: updated }));
    syncDailyLogToSupabase(updated);
  };

  const toggleWorkoutComplete = (
    routineId: string,
    durationMinutes = 30,
    calories = 200
  ) => {
    const exists = todayLog.completedWorkoutIds.includes(routineId);
    let newCompleted: string[];
    let newCalories = todayLog.caloriesBurned;

    if (exists) {
      newCompleted = todayLog.completedWorkoutIds.filter(id => id !== routineId);
      newCalories = Math.max(0, newCalories - calories);
    } else {
      newCompleted = [...todayLog.completedWorkoutIds, routineId];
      newCalories += calories;
      triggerConfetti();
    }

    const updated = updateTodayLog({
      completedWorkoutIds: newCompleted,
      caloriesBurned: newCalories,
    });
    setTodayLog(updated);
    setAllLogs(prev => ({ ...prev, [updated.date]: updated }));
    syncDailyLogToSupabase(updated);
  };

  const addCustomRecipe = (newRecipe: NutritionRecipe) => {
    const updated = [newRecipe, ...recipes];
    setRecipes(updated);
    try {
      const customOnly = updated.filter(r => r.isAiGenerated);
      localStorage.setItem('aurafit_custom_recipes', JSON.stringify(customOnly));
    } catch (e) {
      console.error(e);
    }
  };

  const addCustomWorkout = (newRoutine: WorkoutRoutine) => {
    const updated = [newRoutine, ...workouts];
    setWorkouts(updated);
    try {
      const customOnly = updated.filter(w => w.isCustomAI);
      localStorage.setItem('aurafit_custom_workouts', JSON.stringify(customOnly));
    } catch (e) {
      console.error(e);
    }
  };

  const addBmiEntry = (heightCm: number, weightKg: number, notes?: string): BmiRecord => {
    const analysis = calculateBmiDetails(heightCm, weightKg, profile.age, profile.gender);
    const newRecord = addBmiRecord({
      date: getTodayDateString(),
      heightCm,
      weightKg,
      bmi: analysis.bmi,
      age: profile.age,
      gender: profile.gender,
      category: analysis.category,
      isAdult: analysis.isAdult,
      notes: notes || undefined,
    });

    const updatedHistory = [newRecord, ...bmiHistory];
    setBmiHistory(updatedHistory);

    // Keep profile height and weight in sync with latest measurement
    updateProfile({ heightCm, weightKg });

    if (analysis.isAdult && analysis.category === 'Healthy weight') {
      triggerConfetti();
    }

    return newRecord;
  };

  const deleteBmiEntry = (id: string) => {
    const remaining = deleteBmiRecord(id);
    setBmiHistory(remaining);
  };

  return (
    <FitnessContext.Provider
      value={{
        profile,
        metrics,
        todayLog,
        allLogs,
        workouts,
        recipes,
        bmiHistory,
        updateProfile,
        addWater,
        resetWater,
        setSteps,
        addSteps,
        logSleep,
        toggleWorkoutComplete,
        addCustomRecipe,
        addCustomWorkout,
        addBmiEntry,
        deleteBmiEntry,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
