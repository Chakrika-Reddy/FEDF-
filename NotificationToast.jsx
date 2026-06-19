import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

function AllergyChecker({ patientAllergies = [], onCheck }) {
  const [ingredientsText, setIngredientsText] = useState('');
  const [checkResult, setCheckResult] = useState(null);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!ingredientsText.trim()) return;

    // Split and sanitize inputs
    const ingredients = ingredientsText
      .split(',')
      .map(i => i.trim().toLowerCase())
      .filter(i => i !== '');

    const detected = [];
    const safe = [];

    ingredients.forEach(ingredient => {
      // Cross check patient allergies
      const isAllergic = patientAllergies.some(allergy => {
        const checkTerm = allergy.toLowerCase().trim();
        return ingredient.includes(checkTerm) || checkTerm.includes(ingredient);
      });

      if (isAllergic) {
        detected.push(ingredient);
      } else {
        safe.push(ingredient);
      }
    });

    const result = {
      safe,
      detected,
      isSafe: detected.length === 0
    };

    setCheckResult(result);
    if (onCheck) onCheck(result);
  };

  return (
    <div className="p-5 glass-panel">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="text-primary-600 dark:text-primary-400" size={20} />
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Active Ingredient Allergy Check</h3>
      </div>
      
      <p className="text-[11px] text-slate-400 dark:text-slate-400 mb-4">
        Validate raw food ingredients against this patient's registered allergies: <span className="font-semibold text-rose-500">{patientAllergies.length > 0 ? patientAllergies.join(', ') : 'None'}</span>.
      </p>

      <form onSubmit={handleCheck} className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Enter Ingredients</label>
          <textarea
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="e.g. Oats, Almond milk, Peanuts, Blueberries"
            rows="2"
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-[0.98] rounded-xl shadow-md shadow-primary-500/10 transition-all"
        >
          Check Safety
        </button>
      </form>

      {checkResult && (
        <div className="mt-4 p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800 animate-fade-in">
          {checkResult.isSafe ? (
            <div className="flex gap-2.5 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="shrink-0 mt-0.5" size={16} />
              <div>
                <h4 className="text-xs font-bold">All Ingredients Clear</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Meal is safe to schedule. No matching allergens detected.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2.5 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="text-xs font-bold">Allergen Triggered!</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Do not serve! The following ingredients conflict with patient allergies:</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                {checkResult.detected.map(ing => (
                  <span key={ing} className="px-2 py-0.5 text-[9px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/40 rounded-full capitalize">
                    {ing}
                  </span>
                ))}
                {checkResult.safe.map(ing => (
                  <span key={ing} className="px-2 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/40 rounded-full capitalize">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AllergyChecker;
