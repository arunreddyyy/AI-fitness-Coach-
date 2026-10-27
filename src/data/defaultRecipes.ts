import { NutritionRecipe } from '../types/nutrition';

export const DEFAULT_RECIPES: NutritionRecipe[] = [
  {
    id: 'recipe-chicken-power-bowl',
    title: 'Herb-Grilled Citrus Chicken & Quinoa Bowl',
    description: 'Tender marinated chicken breast with fluffy tri-color quinoa, roasted zucchini, and creamy tzatziki drizzle.',
    mealType: 'lunch',
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 2,
    caloriesPerServing: 485,
    proteinGrams: 46,
    carbsGrams: 42,
    fatsGrams: 12,
    dietaryTags: ['high_protein', 'gluten_free', 'quick_prep'],
    ingredients: [
      '350g boneless skinless chicken breast, cut into strips',
      '1 cup cooked tri-color quinoa',
      '1 medium zucchini, sliced into half-moons',
      '1 cup cherry tomatoes, halved',
      '1 tbsp extra virgin olive oil',
      'Juice of 1 fresh lemon',
      '2 cloves garlic, minced',
      '1 tsp dried oregano & thyme',
      '3 tbsp low-fat Greek yogurt (for drizzle)',
      'Sea salt & black pepper to taste'
    ],
    instructions: [
      'In a bowl, toss chicken strips with lemon juice, minced garlic, oregano, salt, and pepper.',
      'Heat 1/2 tbsp olive oil in a skillet over medium-high heat. Sear chicken 5-6 minutes per side until golden (internal temp 74°C / 165°F).',
      'In the same pan, sauté zucchini slices and cherry tomatoes for 3-4 minutes until tender.',
      'Assemble bowls: base of warm quinoa, topped with sliced chicken, roasted veggies, and a dollop of seasoned Greek yogurt.'
    ],
    chefTip: 'Meal prep friendly: Cook a double batch of chicken and quinoa to store in airtight glass containers for up to 4 days.'
  },
  {
    id: 'recipe-paneer-chickpea-tikka',
    title: 'High-Protein Paneer & Roasted Chickpea Skillet',
    description: 'Protein-packed Indian vegetarian skillet featuring spiced cottage cheese cubes, crispy chickpeas, and spinach.',
    mealType: 'dinner',
    prepTimeMinutes: 12,
    cookTimeMinutes: 18,
    servings: 2,
    caloriesPerServing: 440,
    proteinGrams: 34,
    carbsGrams: 36,
    fatsGrams: 16,
    dietaryTags: ['high_protein', 'vegetarian', 'gluten_free'],
    ingredients: [
      '200g low-fat paneer (or extra firm tofu), cubed',
      '1 can (240g drained) cooked chickpeas',
      '2 cups fresh baby spinach',
      '1 medium onion, diced',
      '2 medium tomatoes, pureed',
      '1 tsp cumin seeds',
      '1 tsp turmeric, garam masala, and smoked paprika',
      '1 tbsp ginger-garlic paste',
      '1 tbsp coconut or olive oil',
      'Fresh cilantro for garnish'
    ],
    instructions: [
      'Lightly pan-sear the paneer cubes in 1 tsp oil until edges turn golden; set aside.',
      'In the same skillet, temper cumin seeds in remaining oil until fragrant. Add diced onions and ginger-garlic paste; sauté until golden brown.',
      'Pour in tomato puree, turmeric, garam masala, and paprika. Cook for 5 minutes until oil slightly separates.',
      'Fold in drained chickpeas and golden paneer cubes. Simmer on low for 6 minutes.',
      'Stir in fresh spinach leaves until wilted. Garnish with fresh cilantro.'
    ],
    chefTip: 'Substitute with low-fat paneer or tofu to maintain high protein while keeping saturated fats in check.'
  },
  {
    id: 'recipe-tofu-edamame-buddha',
    title: 'Sesame Glazed Crispy Tofu & Edamame Bowl',
    description: '100% plant-based powerhouse combining crispy baked tofu, steamed shelled edamame, and broccoli over brown rice.',
    mealType: 'dinner',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 2,
    caloriesPerServing: 420,
    proteinGrams: 33,
    carbsGrams: 40,
    fatsGrams: 14,
    dietaryTags: ['high_protein', 'vegan', 'dairy_free', 'budget_friendly'],
    ingredients: [
      '250g extra-firm organic tofu, pressed and cubed',
      '1 cup shelled edamame beans (steamed)',
      '1.5 cups steamed broccoli florets',
      '1 cup cooked brown basmati rice',
      '1 tbsp cornstarch (for ultra crispiness)',
      '1.5 tbsp low-sodium soy sauce or tamari',
      '1 tsp toasted sesame oil',
      '1 tsp pure maple syrup or honey',
      '1 tsp toasted sesame seeds & sliced green onion'
    ],
    instructions: [
      'Press moisture out of tofu using paper towels for 10 minutes. Cut into bite-sized cubes.',
      'Toss tofu cubes in cornstarch with a pinch of salt until evenly coated.',
      'Air fry at 200°C (390°F) for 14 minutes (or pan-sear with sesame oil) until crunchy.',
      'Whisk soy sauce, maple syrup, and a splash of water in a small ramekin.',
      'Toss crispy tofu with the glaze. Plate over brown rice with edamame and steamed broccoli.'
    ],
    chefTip: 'Edamame is a complete plant protein with all 9 essential amino acids.'
  },
  {
    id: 'recipe-greek-yogurt-crunch',
    title: 'Berry Blitz High-Protein Greek Yogurt Parfait',
    description: '5-minute breakfast or pre-workout bowl with 35g of pure protein, rich in gut-healthy probiotics and antioxidants.',
    mealType: 'breakfast',
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 1,
    caloriesPerServing: 320,
    proteinGrams: 35,
    carbsGrams: 30,
    fatsGrams: 5,
    dietaryTags: ['high_protein', 'vegetarian', 'quick_prep'],
    ingredients: [
      '250g 0% plain Greek yogurt',
      '1 scoop (25g) vanilla whey or plant protein powder',
      '1/2 cup fresh blueberries or strawberries',
      '2 tbsp rolled oats or high-protein granola',
      '1 tbsp chia seeds',
      '1/2 tsp Ceylon cinnamon',
      '1 tsp raw honey or monk fruit sweetener'
    ],
    instructions: [
      'In a wide bowl, vigorously whisk Greek yogurt and protein powder with 1 tbsp almond milk until velvety smooth.',
      'Top with fresh berries, rolled oats, and chia seeds.',
      'Dust with cinnamon and drizzle honey on top.'
    ],
    chefTip: 'Whipping the protein powder directly into thick Greek yogurt creates a dessert-like mousse texture.'
  },
  {
    id: 'recipe-salmon-sweet-potato',
    title: 'Crispy Skin Atlantic Salmon & Sweet Potato Mash',
    description: 'Loaded with muscle-rebuilding omega-3 fatty acids, complex carbohydrates, and lean marine protein.',
    mealType: 'dinner',
    prepTimeMinutes: 10,
    cookTimeMinutes: 18,
    servings: 2,
    caloriesPerServing: 510,
    proteinGrams: 42,
    carbsGrams: 44,
    fatsGrams: 16,
    dietaryTags: ['high_protein', 'gluten_free', 'dairy_free'],
    ingredients: [
      '2 center-cut salmon fillets (approx 160g each)',
      '2 medium sweet potatoes, peeled and cubed',
      '1 bundle fresh asparagus spears, trimmed',
      '1 tbsp olive oil',
      '1 clove garlic, minced',
      '1 wedge fresh lemon',
      'Coarse sea salt and cracked black pepper'
    ],
    instructions: [
      'Boil cubed sweet potatoes in salted water for 12 minutes until fork-tender; drain and mash with garlic, salt, and black pepper.',
      'Pat salmon skin completely dry with paper towels (key for crispy skin). Season with salt.',
      'Heat skillet with 1/2 tbsp olive oil over medium-high heat. Place salmon skin-side down for 5 minutes without moving.',
      'Flip gently and cook for 3-4 minutes. Sauté asparagus in remaining oil for 4 minutes.',
      'Plate mashed sweet potato, top with crispy salmon, and serve with asparagus.'
    ],
    chefTip: 'Dry skin is the secret to restaurant-quality crispy fish without needing extra batter.'
  },
  {
    id: 'recipe-egg-whites-cottage-toast',
    title: 'High-Protein Egg White & Whipped Cottage Toast',
    description: 'Crispy sourdough toast spread with whipped creamy cottage cheese and fluffy scrambled egg whites.',
    mealType: 'breakfast',
    prepTimeMinutes: 8,
    cookTimeMinutes: 6,
    servings: 1,
    caloriesPerServing: 335,
    proteinGrams: 32,
    carbsGrams: 28,
    fatsGrams: 7,
    dietaryTags: ['high_protein', 'vegetarian', 'quick_prep'],
    ingredients: [
      '4 liquid egg whites + 1 whole egg',
      '100g low-fat cottage cheese (whipped smooth in blender)',
      '1 thick slice artisan sourdough bread, toasted',
      '1/4 ripe avocado, thinly sliced',
      '1 tsp chili flakes or Everything Bagel seasoning',
      'Fresh microgreens or chives'
    ],
    instructions: [
      'Blend or vigorously fork-whip cottage cheese until velvety like cream cheese.',
      'Spread whipped cottage cheese across warm toasted sourdough slice.',
      'Whisk eggs in a bowl with a pinch of salt. Scramble over low heat with silicone spatula until soft and fluffy.',
      'Layer sliced avocado on toast, spoon warm egg scramble over top, and sprinkle with bagel seasoning.'
    ],
    chefTip: 'Whipped cottage cheese tastes nearly identical to ricotta cheese while delivering triple the protein content.'
  }
];
