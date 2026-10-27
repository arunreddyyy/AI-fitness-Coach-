import React, { useState } from 'react';
import {
  Utensils,
  Flame,
  Clock,
  Sparkles,
  Search,
  Check,
  ChevronRight,
  X,
  BookOpen,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { NutritionRecipe, DietaryTag } from '../../types/nutrition';
import { generateCustomRecipe } from '../../services/gemini';

export const NutritionView: React.FC = () => {
  const { profile, metrics, recipes, addCustomRecipe } = useFitness();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeRecipeModal, setActiveRecipeModal] = useState<NutritionRecipe | null>(null);
  const [aiMealPrompt, setAiMealPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedTag === 'all') return true;
    if (selectedTag === 'ai') return r.isAiGenerated;
    if (selectedTag === 'high_protein') return r.proteinGrams >= 35;
    return r.dietaryTags.includes(selectedTag as DietaryTag);
  });

  const handleGenerateAiMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMealPrompt.trim()) return;

    setIsGenerating(true);
    setGenerateError(null);
    try {
      const newRecipe = await generateCustomRecipe(aiMealPrompt, profile);
      addCustomRecipe(newRecipe);
      setActiveRecipeModal(newRecipe);
      setAiMealPrompt('');
    } catch (err) {
      console.error(err);
      setGenerateError('Could not generate meal. Please verify connection or API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleIngredientCheck = (ing: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [ing]: !prev[ing],
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:bg-lime-500/15 dark:text-lime-300 dark:border-lime-500/30">
              High-Protein Kitchen
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Nutrient-Dense • Macro-Balanced</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Nutrition & High-Protein Recipes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Targeting ~<strong className="text-emerald-600 dark:text-lime-400">{metrics.dailyProteinGrams}g protein</strong> daily to support {profile.fitnessGoals.map((g) => g.replace('_', ' ')).join(', ')}.
          </p>
        </div>

        {/* Daily Macros Pill */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Calories</span>
            <span className="font-extrabold text-slate-900 dark:text-white">{metrics.dailyCaloriesTarget} kcal</span>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Protein</span>
            <span className="font-extrabold text-emerald-600 dark:text-lime-400">{metrics.dailyProteinGrams}g</span>
          </div>
        </div>
      </div>

      {/* AI Recipe Generator Bar */}
      <div className="glass-card p-5 border-emerald-500/30 dark:border-lime-500/20 bg-slate-50/50 dark:bg-charcoal-900/60">
        <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-lime-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> AI Chef & Recipe Creator (Google Gemini)
        </div>
        <form onSubmit={handleGenerateAiMeal} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={aiMealPrompt}
            onChange={(e) => setAiMealPrompt(e.target.value)}
            placeholder="e.g. 'Post-workout dinner with salmon, sweet potatoes, and 40g+ protein'"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={isGenerating || !aiMealPrompt.trim()}
            className="brand-btn-primary px-6 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap shadow-sm"
          >
            {isGenerating ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white dark:border-charcoal-950 border-t-transparent rounded-full animate-spin" />
                Cooking Recipe...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Create Recipe
              </>
            )}
          </button>
        </form>

        {generateError && (
          <p className="mt-2 text-xs text-rose-500">{generateError}</p>
        )}
      </div>

      {/* Search & Dietary Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, ingredients (e.g. chicken, oats)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-lime-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Recipes' },
            { id: 'high_protein', label: '🔥 35g+ Protein' },
            { id: 'ai', label: '✨ AI Generated' },
            { id: 'quick_prep', label: '⚡ Quick Prep' },
            { id: 'vegetarian', label: '🌱 Veg' },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTag === tag.id
                  ? 'bg-emerald-600 text-white dark:bg-lime-400 dark:text-charcoal-950 shadow-sm'
                  : 'bg-white hover:bg-slate-100 dark:bg-charcoal-900 dark:hover:bg-charcoal-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecipes.length === 0 ? (
          <div className="col-span-full p-12 text-center glass-card">
            <Utensils className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">No recipes match your criteria</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try clearing filters or generate a custom meal with AI above!</p>
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setActiveRecipeModal(recipe)}
              className="glass-card glass-card-hover p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-charcoal-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {recipe.mealType}
                  </span>
                  {recipe.isAiGenerated && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:bg-lime-500/15 dark:text-lime-300">
                      AI Recipe
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-lime-300 transition-colors line-clamp-1">
                  {recipe.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Macro Strip */}
                <div className="grid grid-cols-4 gap-2 my-4 p-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200/80 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Protein</span>
                    <span className="text-xs font-black text-emerald-600 dark:text-lime-400">{recipe.proteinGrams}g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Calories</span>
                    <span className="text-xs font-black text-amber-500">{recipe.caloriesPerServing}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Carbs</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{recipe.carbsGrams}g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Fats</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{recipe.fatsGrams}g</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" />
                  {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins
                </span>
                <span className="text-emerald-600 dark:text-lime-400 font-semibold inline-flex items-center gap-1">
                  View Recipe <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detailed Recipe Modal */}
      {activeRecipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-charcoal-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <button
              onClick={() => setActiveRecipeModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:bg-lime-500/15 dark:text-lime-300">
                  {activeRecipeModal.mealType}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ⏱️ Prep: {activeRecipeModal.prepTimeMinutes}m • Cook: {activeRecipeModal.cookTimeMinutes}m • {activeRecipeModal.servings} Servings
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{activeRecipeModal.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{activeRecipeModal.description}</p>
            </div>

            {/* Macro Breakdown Strip */}
            <div className="grid grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-slate-800 text-center mb-6">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">Protein</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-lime-400">{activeRecipeModal.proteinGrams}g</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">Calories</span>
                <span className="text-base font-extrabold text-amber-500">{activeRecipeModal.caloriesPerServing} kcal</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">Carbs</span>
                <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">{activeRecipeModal.carbsGrams}g</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">Fats</span>
                <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">{activeRecipeModal.fatsGrams}g</span>
              </div>
            </div>

            {/* Ingredients Checklist */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-lime-400" /> Ingredients ({activeRecipeModal.ingredients.length})
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">Tap an item to mark off as you prep:</p>
              <div className="space-y-1.5">
                {activeRecipeModal.ingredients.map((ing, i) => {
                  const isChecked = Boolean(checkedIngredients[ing]);
                  return (
                    <div
                      key={i}
                      onClick={() => toggleIngredientCheck(ing)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-3 transition-all ${
                        isChecked
                          ? 'bg-slate-100 dark:bg-charcoal-950/40 border-slate-200 dark:border-charcoal-800 text-slate-400 line-through'
                          : 'bg-slate-50 dark:bg-charcoal-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-lime-400 dark:border-lime-400 dark:text-charcoal-950'
                          : 'border-slate-400'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{ing}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step-by-step Instructions */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Preparation Steps</h4>
              <div className="space-y-2.5">
                {activeRecipeModal.instructions.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-700 dark:bg-charcoal-800 dark:text-lime-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chef Tip */}
            {activeRecipeModal.chefTip && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:bg-lime-500/10 dark:border-lime-500/20 dark:text-lime-300 leading-relaxed mb-4">
                👨‍🍳 <strong>Chef's Pro Tip:</strong> {activeRecipeModal.chefTip}
              </div>
            )}

            <button
              onClick={() => setActiveRecipeModal(null)}
              className="w-full brand-btn-primary py-2.5 text-xs font-bold"
            >
              Done / Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
