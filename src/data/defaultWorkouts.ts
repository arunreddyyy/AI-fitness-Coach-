import { WorkoutRoutine } from '../types/workout';

export const DEFAULT_WORKOUT_ROUTINES: WorkoutRoutine[] = [
  // ================= TEEN ROUTINES (13-17) =================
  {
    id: 'teen-foundations-1',
    title: 'Teen Athletic Foundations & Posture',
    description: 'Designed specifically for younger bodies to develop core stability, joint health, and athletic coordination without dangerous spinal compression.',
    ageCategory: 'teen',
    goal: 'general_health',
    difficulty: 'beginner',
    durationMinutes: 30,
    caloriesBurnEstimate: 180,
    equipment: 'home_bodyweight',
    exercises: [
      {
        id: 'tf-1',
        name: 'Bodyweight Wall Slides (Posture)',
        targetMuscles: ['back', 'shoulders'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '12 reps',
        restPeriodSeconds: 45,
        instructions: [
          'Stand with upper back, head, and glutes against a flat wall.',
          'Bring arms into a "W" shape touching the wall.',
          'Slide forearms smoothly upward into a "Y" position without arching lower back.'
        ],
        safetyTips: 'Keep your core braced and chin slightly tucked.',
        contraindications: []
      },
      {
        id: 'tf-2',
        name: 'Controlled Box / Chair Squats',
        targetMuscles: ['legs', 'core'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '15 reps',
        restPeriodSeconds: 60,
        instructions: [
          'Stand in front of a chair with feet shoulder-width apart.',
          'Hinge hips back and bend knees until glutes gently brush the chair.',
          'Drive through your heels to stand back upright.'
        ],
        safetyTips: 'Do not let knees collapse inward. Keep chest tall.',
        contraindications: ['knee_pain']
      },
      {
        id: 'tf-3',
        name: 'Incline Push-ups (Bench / Table)',
        targetMuscles: ['chest', 'arms', 'core'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '10-12 reps',
        restPeriodSeconds: 60,
        instructions: [
          'Place hands on an elevated sturdy surface wider than shoulders.',
          'Keep your body in a rigid straight plank line.',
          'Lower chest to edge, then push back with control.'
        ],
        safetyTips: 'Great for building chest strength without straining wrists or shoulders.',
        contraindications: ['wrist_pain']
      },
      {
        id: 'tf-4',
        name: 'Dead Bug Core Stabilizer',
        targetMuscles: ['core'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '10 reps per side',
        restPeriodSeconds: 45,
        instructions: [
          'Lie flat on back with arms straight up and knees bent at 90 degrees.',
          'Press lower back into the floor.',
          'Slowly lower right arm back and extend left leg forward hovering above floor.',
          'Return and repeat opposite side.'
        ],
        safetyTips: 'Never allow lower back to lift off the floor.',
        contraindications: []
      }
    ]
  },
  {
    id: 'teen-calisthenics-2',
    title: 'Teen Speed & Calisthenic Power',
    description: 'Dynamic bodyweight workout focusing on agility, push-pull strength, and cardiovascular stamina.',
    ageCategory: 'teen',
    goal: 'muscle_gain',
    difficulty: 'intermediate',
    durationMinutes: 35,
    caloriesBurnEstimate: 240,
    equipment: 'home_bodyweight',
    exercises: [
      {
        id: 'tc-1',
        name: 'Walking Lunges with Torso Twist',
        targetMuscles: ['legs', 'core'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '12 steps total',
        restPeriodSeconds: 60,
        instructions: ['Step forward into a controlled lunge', 'Rotate torso toward front knee', 'Step forward with other leg'],
        safetyTips: 'Keep torso upright. Do not slam back knee into floor.',
        contraindications: ['knee_pain']
      },
      {
        id: 'tc-2',
        name: 'Standard Floor Push-ups',
        targetMuscles: ['chest', 'arms'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '8-15 reps',
        restPeriodSeconds: 60,
        instructions: ['Plank position, hands under shoulders', 'Lower chest until 2 inches from floor', 'Press up firmly'],
        safetyTips: 'Do not sag hips.',
        contraindications: ['wrist_pain', 'shoulder_mobility']
      },
      {
        id: 'tc-3',
        name: 'Side Plank Hip Lifts',
        targetMuscles: ['core'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '10 per side',
        restPeriodSeconds: 45,
        instructions: ['Prop on forearm, stack feet', 'Dip hip slightly down then raise high to engage obliques'],
        safetyTips: 'Keep neck aligned with spine.',
        contraindications: ['shoulder_mobility']
      }
    ]
  },

  // ================= ADULT ROUTINES (18-49) =================
  {
    id: 'adult-hypertrophy-ppl',
    title: 'Adult Upper Body Hypertrophy (Chest & Back)',
    description: 'Targeted muscle builder combining compound presses and rows for balanced upper body posture and growth.',
    ageCategory: 'adult',
    goal: 'muscle_gain',
    difficulty: 'intermediate',
    durationMinutes: 45,
    caloriesBurnEstimate: 320,
    equipment: 'gym',
    exercises: [
      {
        id: 'ah-1',
        name: 'Dumbbell Incline Bench Press',
        targetMuscles: ['chest', 'shoulders', 'arms'],
        equipmentNeeded: ['gym', 'dumbbells_only'],
        suggestedSets: 4,
        suggestedReps: '8-12 reps',
        restPeriodSeconds: 90,
        instructions: [
          'Set bench to 30 degrees angle.',
          'Hold dumbbells at chest height, elbows at 45-degree angle.',
          'Press upwards in a slight arc until arms are extended without locking elbows.'
        ],
        safetyTips: 'Do not flare elbows out wide to 90 degrees.',
        contraindications: ['shoulder_mobility']
      },
      {
        id: 'ah-2',
        name: 'Chest-Supported Dumbbell Rows',
        targetMuscles: ['back', 'arms'],
        equipmentNeeded: ['gym', 'dumbbells_only'],
        suggestedSets: 4,
        suggestedReps: '10-12 reps',
        restPeriodSeconds: 75,
        instructions: [
          'Lie prone on an incline bench at 45 degrees.',
          'Hold dumbbells with neutral grip.',
          'Pull elbows toward hips, squeezing shoulder blades together at top.'
        ],
        safetyTips: 'Eliminates lower back strain completely by supporting chest.',
        contraindications: []
      },
      {
        id: 'ah-3',
        name: 'Cable / Band Face Pulls',
        targetMuscles: ['shoulders', 'back'],
        equipmentNeeded: ['gym'],
        suggestedSets: 3,
        suggestedReps: '15 reps',
        restPeriodSeconds: 60,
        instructions: [
          'Attach rope to upper pulley.',
          'Pull toward forehead while rotating hands back so knuckles face ceiling.'
        ],
        safetyTips: 'Crucial for shoulder health and counteracting computer slouch.',
        contraindications: []
      },
      {
        id: 'ah-4',
        name: 'Overhead Tricep Rope Extension',
        targetMuscles: ['arms'],
        equipmentNeeded: ['gym', 'dumbbells_only'],
        suggestedSets: 3,
        suggestedReps: '12 reps',
        restPeriodSeconds: 60,
        instructions: ['Extend arms overhead keeping elbows tucked in', 'Squeeze triceps at full extension'],
        safetyTips: 'Keep core engaged so lower back does not hyperextend.',
        contraindications: ['shoulder_mobility']
      }
    ]
  },
  {
    id: 'adult-fat-burner-hiit',
    title: 'High-Energy Fat Shred & Core HIIT',
    description: 'Interval workout alternating between multi-joint movements and core stability to maximize caloric afterburn (EPOC).',
    ageCategory: 'adult',
    goal: 'weight_loss',
    difficulty: 'intermediate',
    durationMinutes: 30,
    caloriesBurnEstimate: 360,
    equipment: 'home_bodyweight',
    exercises: [
      {
        id: 'af-1',
        name: 'Low-Impact Mountain Climbers',
        targetMuscles: ['core', 'cardio'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 4,
        suggestedReps: '40 seconds work',
        restPeriodSeconds: 20,
        instructions: ['High plank position', 'Drive knee towards chest with controlled pace without bouncing'],
        safetyTips: 'Maintain flat hips throughout.',
        contraindications: ['wrist_pain']
      },
      {
        id: 'af-2',
        name: 'Goblet Squats or Tempo Air Squats',
        targetMuscles: ['legs', 'core'],
        equipmentNeeded: ['home_bodyweight', 'dumbbells_only'],
        suggestedSets: 4,
        suggestedReps: '12-15 reps',
        restPeriodSeconds: 30,
        instructions: ['Squat down taking 3 seconds, pause 1 second at bottom, explode up in 1 second'],
        safetyTips: 'Tempo builds muscle burn without needing massive weights.',
        contraindications: ['knee_pain']
      },
      {
        id: 'af-3',
        name: 'Plank Shoulder Taps',
        targetMuscles: ['core', 'shoulders'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '16 taps total',
        restPeriodSeconds: 30,
        instructions: ['Plank with wide feet stance', 'Tap left shoulder with right hand without swaying hips'],
        safetyTips: 'Wider feet prevent hip rocking.',
        contraindications: ['wrist_pain']
      }
    ]
  },

  // ================= SENIOR ROUTINES (50+) =================
  {
    id: 'senior-mobility-balance',
    title: 'Senior Joint Mobility & Fall Prevention',
    description: 'Gentle, joint-friendly movements specifically formulated to strengthen hips, knees, and ankles while improving single-leg balance.',
    ageCategory: 'senior',
    goal: 'mobility_flexibility',
    difficulty: 'beginner',
    durationMinutes: 25,
    caloriesBurnEstimate: 120,
    equipment: 'home_bodyweight',
    exercises: [
      {
        id: 'sm-1',
        name: 'Chair Sit-to-Stand Squats',
        targetMuscles: ['legs', 'core'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '10 reps',
        restPeriodSeconds: 60,
        instructions: [
          'Sit on a sturdy dining chair with feet flat on the floor.',
          'Cross arms over chest.',
          'Lean slightly forward and stand up using leg strength.',
          'Slowly lower back down with control.'
        ],
        safetyTips: 'Have a sturdy table or walker in front if extra balance support is needed.',
        contraindications: []
      },
      {
        id: 'sm-2',
        name: 'Standing Calf Raises with Counter Support',
        targetMuscles: ['legs'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '12-15 reps',
        restPeriodSeconds: 45,
        instructions: [
          'Stand facing kitchen counter or sturdy wall, lightly resting fingertips for balance.',
          'Slowly rise up onto balls of feet, hold 2 seconds, lower slowly.'
        ],
        safetyTips: 'Strengthens ankles and calves, significantly lowering trip risk.',
        contraindications: []
      },
      {
        id: 'sm-3',
        name: 'Bird-Dog Floor or Standing Wall Version',
        targetMuscles: ['core', 'back'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '8 reps per side',
        restPeriodSeconds: 45,
        instructions: [
          'On hands and knees (or hands against wall).',
          'Extend one arm forward and opposite leg straight back.',
          'Hold for 2 seconds and switch.'
        ],
        safetyTips: 'Stabilizes spine without any spinal compression or twisting.',
        contraindications: []
      },
      {
        id: 'sm-4',
        name: 'Seated Torso Rotation & Shoulder Rolls',
        targetMuscles: ['core', 'shoulders'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 2,
        suggestedReps: '10 gentle reps each',
        restPeriodSeconds: 30,
        instructions: ['Sit tall in chair', 'Roll shoulders backwards 10 times', 'Gently look over right shoulder, then left'],
        safetyTips: 'Never force range of motion.',
        contraindications: []
      }
    ]
  },
  {
    id: 'senior-bone-density',
    title: 'Senior Bone Density & Functional Strength',
    description: 'Low-impact resistance training using light dumbbells or bands to maintain bone density and muscle mass (sarcopenia prevention).',
    ageCategory: 'senior',
    goal: 'general_health',
    difficulty: 'beginner',
    durationMinutes: 30,
    caloriesBurnEstimate: 150,
    equipment: 'dumbbells_only',
    exercises: [
      {
        id: 'sb-1',
        name: 'Light Dumbbell Bicep Curl to Neutral Press',
        targetMuscles: ['arms', 'shoulders'],
        equipmentNeeded: ['dumbbells_only'],
        suggestedSets: 3,
        suggestedReps: '10 reps',
        restPeriodSeconds: 60,
        instructions: ['Use 1-3 kg weights', 'Curl to shoulders, then gently press overhead in neutral palms-in grip'],
        safetyTips: 'Can be performed seated on a chair.',
        contraindications: ['shoulder_mobility']
      },
      {
        id: 'sb-2',
        name: 'Standing Hip Abduction (Side Leg Raise)',
        targetMuscles: ['legs', 'core'],
        equipmentNeeded: ['home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '10 per leg',
        restPeriodSeconds: 45,
        instructions: ['Hold onto wall or chair back', 'Lift leg out to side keeping toes pointed forward'],
        safetyTips: 'Crucial for hip stability and gait.',
        contraindications: []
      },
      {
        id: 'sb-3',
        name: 'Seated Resistance Band Chest Press',
        targetMuscles: ['chest', 'arms'],
        equipmentNeeded: ['dumbbells_only', 'home_bodyweight'],
        suggestedSets: 3,
        suggestedReps: '12 reps',
        restPeriodSeconds: 45,
        instructions: ['Loop band behind chair back', 'Push handles forward and squeeze chest softly'],
        safetyTips: 'Zero risk of dropping weights.',
        contraindications: []
      }
    ]
  }
];
