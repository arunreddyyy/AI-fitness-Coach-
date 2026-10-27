import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile } from '../types/user';
import { NutritionRecipe } from '../types/nutrition';
import { WorkoutRoutine } from '../types/workout';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
if (apiKey && apiKey.trim().length > 5) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('Failed to initialize GoogleGenerativeAI with provided key:', err);
  }
}

export function isGeminiConfigured(): boolean {
  return Boolean(apiKey && apiKey.trim().length > 5);
}

// -------------------------------------------------------------
// 1. AI High-Protein Meal Generator
// -------------------------------------------------------------
export async function generateCustomRecipe(
  userPrompt: string,
  profile?: UserProfile
): Promise<NutritionRecipe> {
  const dietaryHint = profile
    ? `User is ${profile.age} years old, aiming for ${profile.fitnessGoals.join(', ')}.`
    : '';

  if (!genAI) {
    // Realistic fallback for offline / demo mode
    return generateFallbackRecipe(userPrompt);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const systemPrompt = `You are an elite sports nutritionist. Generate a single delicious, high-protein recipe based on the user's request.
Return strictly valid raw JSON only (no markdown code blocks, no backticks, no explanatory text).
JSON format must match this structure:
{
  "title": "string",
  "description": "string",
  "mealType": "breakfast" | "lunch" | "dinner" | "snack" | "post_workout",
  "prepTimeMinutes": number,
  "cookTimeMinutes": number,
  "servings": number,
  "caloriesPerServing": number,
  "proteinGrams": number,
  "carbsGrams": number,
  "fatsGrams": number,
  "dietaryTags": ["high_protein", "quick_prep"],
  "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
  "instructions": ["Step 1", "Step 2", "Step 3"],
  "chefTip": "string"
}`;

    const prompt = `${systemPrompt}\n\n${dietaryHint}\nUser Request: "${userPrompt}"`;
    const response = await model.generateContent(prompt);
    const text = response.response.text().trim();

    // Clean JSON response
    const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      ...parsed,
      id: `ai-recipe-${Date.now()}`,
      isAiGenerated: true,
    };
  } catch (error) {
    console.error('Error generating AI recipe with Gemini, using fallback:', error);
    return generateFallbackRecipe(userPrompt);
  }
}

function generateFallbackRecipe(prompt: string): NutritionRecipe {
  return {
    id: `demo-recipe-${Date.now()}`,
    title: `AI High-Protein Plate (${prompt.slice(0, 30)})`,
    description: 'Custom AI-curated protein creation balancing lean amino acids, micronutrients, and healthy fats.',
    mealType: 'lunch',
    prepTimeMinutes: 12,
    cookTimeMinutes: 15,
    servings: 2,
    caloriesPerServing: 460,
    proteinGrams: 38,
    carbsGrams: 34,
    fatsGrams: 14,
    dietaryTags: ['high_protein', 'quick_prep'],
    ingredients: [
      '200g lean protein of choice (chicken, tofu, or paneer)',
      '1 cup steamed broccoli florets & baby carrots',
      '3/4 cup cooked brown rice or quinoa',
      '1 tbsp cold-pressed olive oil or sesame oil',
      '1 tsp smoked paprika, sea salt & black pepper',
      '1 tbsp tahini or Greek yogurt lime dip'
    ],
    instructions: [
      'Season your protein with smoked paprika, sea salt, and black pepper.',
      'Sear in a hot skillet for 5-7 minutes per side until properly cooked.',
      'Steam vegetables for 4 minutes until vibrant green and tender-crisp.',
      'Plate alongside warm grains and drizzle with the citrus-tahini dressing.'
    ],
    chefTip: 'To enable live custom generation with your exact ingredients, add your free Google Gemini API key to .env!',
    isAiGenerated: true,
  };
}

// -------------------------------------------------------------
// 2. AI Age-Appropriate Workout Generator
// -------------------------------------------------------------
export async function generateCustomWorkout(
  profile: UserProfile,
  focusArea: string
): Promise<WorkoutRoutine> {
  const ageCategory = profile.age < 18 ? 'teen' : profile.age >= 50 ? 'senior' : 'adult';

  if (!genAI) {
    return generateFallbackWorkout(profile, focusArea, ageCategory);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a certified master fitness trainer. Generate an age-appropriate workout routine for a ${profile.age}-year-old ${profile.gender}.
Fitness Goal: ${profile.fitnessGoals.join(', ')}
Equipment: ${profile.equipment}
Limitations/Injuries to avoid: ${profile.limitations.join(', ')}
Requested Focus: "${focusArea}"

Return strictly valid JSON only (no markdown, no backticks):
{
  "title": "string",
  "description": "string",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "durationMinutes": number,
  "caloriesBurnEstimate": number,
  "exercises": [
    {
      "id": "ex-1",
      "name": "string",
      "targetMuscles": ["chest", "core"],
      "equipmentNeeded": ["${profile.equipment}"],
      "suggestedSets": number,
      "suggestedReps": "10-12 reps",
      "restPeriodSeconds": number,
      "instructions": ["Step 1", "Step 2"],
      "safetyTips": "Specific caution for safety",
      "contraindications": []
    }
  ]
}`;

    const response = await model.generateContent(prompt);
    const text = response.response.text().trim();
    const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      ...parsed,
      id: `ai-workout-${Date.now()}`,
      ageCategory,
      goal: profile.fitnessGoals[0] || 'general_health',
      equipment: profile.equipment,
      isCustomAI: true,
    };
  } catch (error) {
    console.error('Error with Gemini workout generation, using smart fallback:', error);
    return generateFallbackWorkout(profile, focusArea, ageCategory);
  }
}

function generateFallbackWorkout(
  profile: UserProfile,
  focusArea: string,
  ageCategory: 'teen' | 'adult' | 'senior'
): WorkoutRoutine {
  return {
    id: `demo-workout-${Date.now()}`,
    title: `${profile.age < 18 ? 'Teen' : profile.age >= 50 ? 'Senior Friendly' : 'Targeted'} ${focusArea || 'Conditioning'} Routine`,
    description: `Tailored for age ${profile.age} taking into account safety, mobility, and goals (${profile.fitnessGoals.join(', ')}).`,
    ageCategory,
    goal: profile.fitnessGoals[0] || 'general_health',
    difficulty: profile.age >= 50 ? 'beginner' : 'intermediate',
    durationMinutes: 35,
    caloriesBurnEstimate: 240,
    equipment: profile.equipment,
    isCustomAI: true,
    exercises: [
      {
        id: 'fe-1',
        name: profile.age >= 50 ? 'Supported Chair Squats' : 'Controlled Tempo Goblet Squats',
        targetMuscles: ['legs', 'core'],
        equipmentNeeded: [profile.equipment],
        suggestedSets: 3,
        suggestedReps: '10-12 reps',
        restPeriodSeconds: 60,
        instructions: [
          'Brace core and lower hips backwards with controlled descent.',
          'Keep chest tall and drive upward through heels.'
        ],
        safetyTips: 'Do not let knees cave inward.',
        contraindications: ['knee_pain']
      },
      {
        id: 'fe-2',
        name: 'Incline Wall or Bench Push-ups',
        targetMuscles: ['chest', 'arms', 'shoulders'],
        equipmentNeeded: [profile.equipment],
        suggestedSets: 3,
        suggestedReps: '10 reps',
        restPeriodSeconds: 45,
        instructions: [
          'Maintain rigid spine from head to heels.',
          'Lower chest smoothly and press back up without locking joints.'
        ],
        safetyTips: 'Keep neck aligned with spine.',
        contraindications: ['wrist_pain']
      },
      {
        id: 'fe-3',
        name: 'Dead Bug / Standing Knee to Opposite Elbow',
        targetMuscles: ['core'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '8 reps per side',
        restPeriodSeconds: 45,
        instructions: [
          'Engage deep transverse abdominal muscles without holding your breath.',
          'Alternate sides smoothly with 2-second hold at peak.'
        ],
        safetyTips: 'Eliminates lower back shear forces completely.',
        contraindications: []
      }
    ]
  };
}

// -------------------------------------------------------------
// 3. AI Fitness Coach Assistant (Chat)
// -------------------------------------------------------------
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export async function askFitnessCoach(
  userQuery: string,
  history: ChatMessage[],
  profile: UserProfile
): Promise<string> {
  const heightM = profile.heightCm / 100;
  const currentBmi = heightM > 0 ? (profile.weightKg / (heightM * heightM)).toFixed(1) : '22.0';

  if (!genAI) {
    return simulateCoachResponse(userQuery, profile);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const profileContext = `
USER CONTEXT:
- Name: ${profile.name}
- Age: ${profile.age} (${profile.age < 18 ? 'Teenager' : profile.age < 20 ? 'Youth (<20)' : profile.age >= 50 ? 'Senior adult' : 'Adult'})
- Gender: ${profile.gender}
- Weight: ${profile.weightKg} kg, Height: ${profile.heightCm} cm
- BMI: ${currentBmi} kg/m² (${profile.age < 20 ? 'Pediatric growth percentiles required' : 'Adult screening category'})
- Activity Level: ${profile.activityLevel}
- Goals: ${profile.fitnessGoals.join(', ')}
- Injuries / Physical Limitations: ${profile.limitations.join(', ')}
- Daily Targets: ${profile.dailyStepTarget} steps, ${profile.dailyWaterTargetMl}ml water, ${profile.dailySleepTargetHours}hrs sleep.
`;

    const systemPrompt = `You are AuraFit AI, an encouraging, science-backed personal fitness trainer and sports nutritionist.
${profileContext}
GUIDELINES:
- Provide clear, direct, and empathetic advice.
- Always calibrate advice to the user's age (${profile.age}) and safety limitations (${profile.limitations.join(', ')}).
- If discussing BMI, reinforce that BMI is a population screening measure, not a diagnosis, and does not directly measure body fat or fitness. For users under 20, emphasize that age- and sex-specific growth percentiles are required.
- Use bullet points and clean formatting.
- Keep responses concise (under 200 words) so they are easy to read on mobile.`;

    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: `Hello ${profile.name}! I am your personal AI Fitness & Nutrition Coach. How can I help you crush your goals today?` }] },
        ...chatHistory.slice(-8) // keep recent context
      ]
    });

    const result = await chat.sendMessage(userQuery);
    return result.response.text();
  } catch (error) {
    console.error('Gemini chat error, using simulator:', error);
    return simulateCoachResponse(userQuery, profile);
  }
}

function simulateCoachResponse(query: string, profile: UserProfile): string {
  const q = query.toLowerCase();
  const heightM = profile.heightCm / 100;
  const currentBmi = heightM > 0 ? (profile.weightKg / (heightM * heightM)).toFixed(1) : '22.0';

  if (q.includes('bmi') || q.includes('body mass') || q.includes('ideal weight')) {
    if (profile.age < 20) {
      return `For your age of ${profile.age}, adult BMI screening categories do not apply, ${profile.name}. In individuals under 20, BMI is interpreted using clinical **age- and sex-specific growth percentiles** (CDC/WHO growth charts) because body composition changes rapidly during development.\n\nAlso remember: BMI is purely a screening measure, not a diagnosis, and does not directly measure body fat or physical fitness!`;
    }
    const healthyMin = Math.round(18.5 * heightM * heightM);
    const healthyMax = Math.round(24.9 * heightM * heightM);
    return `Your calculated BMI is currently **${currentBmi} kg/m²**, ${profile.name}.\n\n- **Screening Scope:** BMI is a general screening guideline, not a diagnosis of body fatness or overall fitness. It does not differentiate muscle mass from fat mass.\n- **Standard Adult Reference Range:** For your height of ${profile.heightCm} cm, the standard adult healthy weight screening range is **${healthyMin} kg – ${healthyMax} kg**.\n\nCheck out the dedicated **BMI & Metrics** tab in the sidebar for full dated history and range visualizations!`;
  }

  if (q.includes('water') || q.includes('hydrate')) {
    return `Staying hydrated is critical for muscle recovery and metabolic rate, ${profile.name}! Based on your weight of ${profile.weightKg}kg, your target is ${profile.dailyWaterTargetMl}ml daily. Drink a full glass right upon waking and sip consistently throughout workouts!`;
  }

  if (q.includes('protein') || q.includes('food') || q.includes('snack') || q.includes('diet')) {
    return `For your goal of ${profile.fitnessGoals.join(' & ')}, aim for roughly ${Math.round(profile.weightKg * 1.8)}g to ${Math.round(profile.weightKg * 2.2)}g of protein daily. Great high-protein choices include Greek yogurt (15-20g/cup), eggs, chicken breast, paneer/tofu, and lentils. Check our **Nutrition** tab for full chef-crafted recipes!`;
  }

  if (q.includes('sore') || q.includes('pain') || q.includes('hurt') || q.includes('knee') || q.includes('back')) {
    return `Listen to your body! Since you have ${profile.limitations.join(', ')} noted, never push through sharp joint pain. Switch to low-impact movements like walking, swimming, or isometric holds, apply warm compresses, and ensure you hit your ${profile.dailySleepTargetHours} hours of sleep tonight for tissue repair.`;
  }

  return `Great question, ${profile.name}! Consistent progressive overload, balanced protein intake, and getting your ${profile.dailyStepTarget} daily steps will make a huge difference in your ${profile.fitnessGoals.join(', ')} journey.\n\n*Tip:* To enable live interactive responses for any custom question, paste your Google Gemini API key into the app's \`.env\` file!`;
}
