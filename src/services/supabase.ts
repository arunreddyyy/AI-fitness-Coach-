import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, DailyActivityLog } from '../types/user';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// ==============================================================
// SQL Schema Setup Guide for User (Beginner-Friendly)
// ==============================================================
export const SUPABASE_SQL_SCHEMA = `
-- Run this in your Supabase Project -> SQL Editor to create tables:

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  activity_level TEXT,
  fitness_goals TEXT[],
  limitations TEXT[],
  equipment TEXT,
  daily_step_target INT DEFAULT 8000,
  daily_water_target_ml INT DEFAULT 2500,
  daily_sleep_target_hours NUMERIC DEFAULT 8,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update their own profile"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = id);

-- 2. Create Daily Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  log_date DATE NOT NULL,
  steps INT DEFAULT 0,
  water_ml INT DEFAULT 0,
  sleep_hours NUMERIC DEFAULT 0,
  calories_burned INT DEFAULT 0,
  completed_workouts JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, log_date)
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own activity logs"
  ON public.activity_logs
  FOR ALL
  USING (auth.uid() = user_id);
`;

// ==============================================================
// Sync functions with Graceful Local Fallback
// ==============================================================

export async function syncProfileToSupabase(profile: UserProfile): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      height_cm: profile.heightCm,
      weight_kg: profile.weightKg,
      activity_level: profile.activityLevel,
      fitness_goals: profile.fitnessGoals,
      limitations: profile.limitations,
      equipment: profile.equipment,
      daily_step_target: profile.dailyStepTarget,
      daily_water_target_ml: profile.dailyWaterTargetMl,
      daily_sleep_target_hours: profile.dailySleepTargetHours,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Supabase profile sync error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Unexpected Supabase error:', err);
    return false;
  }
}

export async function syncDailyLogToSupabase(log: DailyActivityLog): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('activity_logs').upsert({
      user_id: user.id,
      log_date: log.date,
      steps: log.steps,
      water_ml: log.waterIntakeMl,
      sleep_hours: log.sleepHours,
      calories_burned: log.caloriesBurned,
      completed_workouts: log.completedWorkoutIds,
    }, { onConflict: 'user_id,log_date' });

    if (error) {
      console.error('Supabase daily log sync error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Unexpected Supabase log error:', err);
    return false;
  }
}
