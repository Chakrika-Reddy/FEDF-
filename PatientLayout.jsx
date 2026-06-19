import React, { useState } from 'react';
import { Calculator, Flame, ChevronRight } from 'lucide-react';

function CalorieCalculator({ defaultValues = {}, onCalculate }) {
  const [age, setAge] = useState(defaultValues.age || 35);
  const [gender, setGender] = useState(defaultValues.gender || 'Male');
  const [height, setHeight] = useState(defaultValues.height || 170); // cm
  const [weight, setWeight] = useState(defaultValues.weight || 70); // kg
  const [activity, setActivity] = useState('Sedentary');
  const [results, setResults] = useState(null);

  const calculateTarget = (e) => {
    e.preventDefault();

    // 1. Calculate BMR (Harris-Benedict equation)
    let bmr = 0;
    if (gender === 'Male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // 2. TDEE Multipliers
    const multipliers = {
      'Sedentary': 1.2,
      'Light': 1.375,
      'Moderate': 1.55,
      'Active': 1.725,
      'Very Active': 1.9
    };

    const tdee = Math.round(bmr * multipliers[activity]);

    // 3. Macronutrient Distribution (40% Carbs, 30% Protein, 30% Fat)
    // 1g Carb = 4 kcal, 1g Protein = 4 kcal, 1g Fat = 9 kcal
    const carbsKcal = tdee * 0.40;
    const proteinKcal = tdee * 0.30;
    const fatKcal = tdee * 0.30;

    const carbsGrams = Math.round(carbsKcal / 4);
    const proteinGrams = Math.round(proteinKcal / 4);
    const fatGrams = Math.round(fatKcal / 9);

    const calcResults = {
      bmr: Math.round(bmr),
      tdee,
      macros: {
        carbs: carbsGrams,
        protein: proteinGrams,
        fat: fatGrams
      }
    };

    setResults(calcResults);
    if (onCalculate) onCalculate(calcResults);
  };

  return (
    <div className="p-5 glass-panel">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="text-primary-600 dark:text-primary-400" size={20} />
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Clinical Energy target calculator</h3>
      </div>
      
      <p className="text-[11px] text-slate-400 dark:text-slate-400 mb-4">
        Calculate BMR & TDEE based on inpatient biometric factors.
      </p>

      <form onSubmit={calculateTarget} className="grid grid-cols-2 gap-3">
        {/* Gender */}
        <div className="col-span-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Gender</label>
          <div className="flex gap-2">
            {['Male', 'Female'].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-all ${gender === g ? 'bg-primary-600 border-primary-600 text-white shadow-sm' : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Age (Years)</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            min="1"
            max="120"
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl"
            required
          />
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl"
          >
            <option value="Sedentary">Sedentary (Bedrest)</option>
            <option value="Light">Light Exercise</option>
            <option value="Moderate">Moderate</option>
            <option value="Active">Active</option>
            <option value="Very Active">Hyperactive</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            min="50"
            max="250"
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl"
            required
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            min="10"
            max="300"
            step="0.1"
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl"
            required
          />
        </div>

        <button
          type="submit"
          className="col-span-2 py-2 mt-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-[0.98] rounded-xl transition-all"
        >
          Calculate Targets
        </button>
      </form>

      {results && (
        <div className="mt-4 p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800 animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame size={16} className="text-orange-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Recommended Intake</span>
            </div>
            <span className="text-sm font-black text-primary-600 dark:text-primary-400">{results.tdee} kcal/day</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
            <div>Basal Metabolic Rate: <span className="font-semibold text-slate-700 dark:text-slate-300">{results.bmr} kcal</span></div>
            <div>TDEE target: <span className="font-semibold text-slate-700 dark:text-slate-300">{results.tdee} kcal</span></div>
          </div>

          {/* Macro Breakdown */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Macros target distribution</h4>
            
            {/* Protein */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-semibold text-slate-500">
                <span>Protein (30%)</span>
                <span>{results.macros.protein} g</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            {/* Carbs */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-semibold text-slate-500">
                <span>Carbs (40%)</span>
                <span>{results.macros.carbs} g</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            {/* Fat */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-semibold text-slate-500">
                <span>Fat (30%)</span>
                <span>{results.macros.fat} g</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalorieCalculator;
