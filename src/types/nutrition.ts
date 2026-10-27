export type DietaryTag = 
  | 'high_protein' 
  | 'vegetarian' 
  | 'vegan' 
  | 'keto' 
  | 'dairy_free' 
  | 'gluten_free' 
  | 'quick_prep'
  | 'budget_friendly';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'post_workout';

export interface NutritionRecipe {
  id: string;
  title: string;
  description: string;
  mealType: MealType;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  caloriesPerServing: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  dietaryTags: DietaryTag[];
  ingredients: string[];
  instructions: string[];
  chefTip?: string;
  imageUrl?: string;
  isAiGenerated?: boolean;
}

export interface MealLogItem {
  id: string;
  date: string;
  mealType: MealType;
  title: string;
  calories: number;
  proteinGrams: number;
  loggedAt: string;
}

export interface NutritionMacroGoals {
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatsGrams: number;
}
