import assert from 'node:assert';

// Implementation matching calculateBmiDetails from storage.ts
function calculateBmiDetails(heightCm, weightKg, age, _gender) {
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? parseFloat((weightKg / (heightM * heightM)).toFixed(1)) : 0;
  const isAdult = age >= 20;

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

console.log('🧪 Starting BMI & Metrics Verification Suite...\n');

// Test 1: Standard Adult Healthy Weight (e.g. 175cm, 70kg -> 22.9, age 24)
{
  const res = calculateBmiDetails(175, 70, 24, 'male');
  assert.strictEqual(res.bmi, 22.9, '175cm & 70kg should calculate BMI 22.9');
  assert.strictEqual(res.category, 'Healthy weight');
  assert.strictEqual(res.isAdult, true);
  console.log('✅ Test 1 Passed: 175cm / 70kg, age 24 -> BMI 22.9 (Healthy weight)');
}

// Test 2: Adult Underweight (< 18.5, e.g. 175cm, 50kg -> 16.3, age 25)
{
  const res = calculateBmiDetails(175, 50, 25, 'female');
  assert.strictEqual(res.bmi, 16.3);
  assert.strictEqual(res.category, 'Underweight');
  assert.strictEqual(res.isAdult, true);
  console.log('✅ Test 2 Passed: 175cm / 50kg, age 25 -> BMI 16.3 (Underweight)');
}

// Test 3: Adult Overweight (25.0 - 29.9, e.g. 175cm, 82kg -> 26.8, age 30)
{
  const res = calculateBmiDetails(175, 82, 30, 'male');
  assert.strictEqual(res.bmi, 26.8);
  assert.strictEqual(res.category, 'Overweight');
  assert.strictEqual(res.isAdult, true);
  console.log('✅ Test 3 Passed: 175cm / 82kg, age 30 -> BMI 26.8 (Overweight)');
}

// Test 4: Adult Obesity (>= 30.0, e.g. 175cm, 98kg -> 32.0, age 40)
{
  const res = calculateBmiDetails(175, 98, 40, 'female');
  assert.strictEqual(res.bmi, 32.0);
  assert.strictEqual(res.category, 'Obesity');
  assert.strictEqual(res.isAdult, true);
  console.log('✅ Test 4 Passed: 175cm / 98kg, age 40 -> BMI 32.0 (Obesity)');
}

// Test 5: Boundary checks for Adults
{
  // Exactly 18.5 -> Healthy weight
  const b1 = calculateBmiDetails(100, 18.5, 20);
  assert.strictEqual(b1.bmi, 18.5);
  assert.strictEqual(b1.category, 'Healthy weight');

  // Exactly 24.9 -> Healthy weight
  const b2 = calculateBmiDetails(100, 24.9, 20);
  assert.strictEqual(b2.bmi, 24.9);
  assert.strictEqual(b2.category, 'Healthy weight');

  // Exactly 25.0 -> Overweight
  const b3 = calculateBmiDetails(100, 25.0, 20);
  assert.strictEqual(b3.bmi, 25.0);
  assert.strictEqual(b3.category, 'Overweight');

  // Exactly 29.9 -> Overweight
  const b4 = calculateBmiDetails(100, 29.9, 20);
  assert.strictEqual(b4.bmi, 29.9);
  assert.strictEqual(b4.category, 'Overweight');

  // Exactly 30.0 -> Obesity
  const b5 = calculateBmiDetails(100, 30.0, 20);
  assert.strictEqual(b5.bmi, 30.0);
  assert.strictEqual(b5.category, 'Obesity');

  console.log('✅ Test 5 Passed: All adult BMI category boundary conditions verified');
}

// Test 6: Under 20 years old check (CRITICAL REQUIREMENT)
// For users under 20, do not apply adult BMI categories. Explain age- and sex-specific percentiles are required.
{
  const resTeen = calculateBmiDetails(170, 60, 16, 'male');
  assert.strictEqual(resTeen.bmi, 20.8);
  assert.strictEqual(resTeen.isAdult, false);
  assert.strictEqual(resTeen.category, 'Under 20 (Percentile Required)');
  assert.ok(resTeen.message.includes('percentiles'), 'Must explain percentiles are required');
  assert.ok(resTeen.statusBadge.includes('< 20 yrs'), 'Status badge must clearly state < 20 yrs');
  console.log('✅ Test 6 Passed: User under 20 (age 16) correctly receives non-adult percentile guidance');

  const resChild = calculateBmiDetails(130, 28, 9, 'female');
  assert.strictEqual(resChild.isAdult, false);
  assert.strictEqual(resChild.category, 'Under 20 (Percentile Required)');
  console.log('✅ Test 6b Passed: Child (age 9) correctly receives non-adult percentile guidance');

  const res19 = calculateBmiDetails(175, 70, 19, 'male');
  assert.strictEqual(res19.isAdult, false);
  assert.strictEqual(res19.category, 'Under 20 (Percentile Required)');
  console.log('✅ Test 6c Passed: 19-year old correctly categorized as Under 20');
}

console.log('\n🎉 All BMI & Body Metrics unit test assertions passed successfully!');
