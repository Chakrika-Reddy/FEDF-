import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import AllergyChecker from '../components/AllergyChecker';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Utensils, 
  Calendar, 
  Flame, 
  Cpu,
  Plus,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';

function MealPlanner() {
  const location = useLocation();
  const { user } = useAuth();
  const { 
    patients, 
    meals, 
    addToast,
    fetchPatients,
    fetchMeals
  } = useAppState();

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [planDate, setPlanDate] = useState(new Date().toISOString().split('T')[0]);

  // Selected meal template IDs
  const [breakfastId, setBreakfastId] = useState('');
  const [lunchId, setLunchId] = useState('');
  const [dinnerId, setDinnerId] = useState('');
  const [snacksId, setSnacksId] = useState('');

  // AI Recommendation State
  const [aiRecs, setAiRecs] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Totals calculations
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [overrideWarnings, setOverrideWarnings] = useState(false);
  const [restrictionWarnings, setRestrictionWarnings] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchMeals();
  }, []);

  // Update selected patient info
  useEffect(() => {
    if (selectedPatientId) {
      const match = patients.find(p => p.id === parseInt(selectedPatientId));
      setSelectedPatient(match || null);
      setAiRecs(null); // Clear recommendations on patient change
      resetPlanner();
    } else {
      setSelectedPatient(null);
      setAiRecs(null);
    }
  }, [selectedPatientId, patients]);

  // Handle URL highlights from Global Search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const highlight = params.get('highlight');
    if (highlight && meals.length > 0) {
      const match = meals.find(m => m.id === parseInt(highlight));
      if (match) {
        addToast(`Highlighted search meal: "${match.name}"`, "info");
      }
    }
  }, [location.search, meals]);

  // Calculate macro totals whenever selections change
  useEffect(() => {
    let cal = 0, prot = 0, carb = 0, fat = 0;
    const ids = [breakfastId, lunchId, dinnerId, snacksId];

    ids.forEach(id => {
      if (id) {
        const meal = meals.find(m => m.id === parseInt(id));
        if (meal) {
          cal += meal.calories;
          prot += meal.protein;
          carb += meal.carbs;
          fat += meal.fat;
        }
      }
    });

    setTotals({ calories: cal, protein: Math.round(prot), carbs: Math.round(carb), fat: Math.round(fat) });
  }, [breakfastId, lunchId, dinnerId, snacksId, meals]);

  const resetPlanner = () => {
    setBreakfastId('');
    setLunchId('');
    setDinnerId('');
    setSnacksId('');
    setRestrictionWarnings(null);
    setOverrideWarnings(false);
  };

  // Trigger AI recommendation lookup
  const handleFetchAiRecs = async () => {
    if (!selectedPatientId) return;
    setAiLoading(true);
    setAiRecs(null);
    try {
      const res = await API.get(`/meals/recommendations/${selectedPatientId}`);
      setAiRecs(res.data.recommendations);
      addToast("AI Recommendations computed successfully.", "success");
    } catch (err) {
      addToast("Failed to fetch AI recommendations.", "error");
    } finally {
      setAiLoading(false);
    }
  };

  // Load recommended meals into builder slots
  const applyAiMeal = (slot, id) => {
    if (slot === 'breakfast') setBreakfastId(id);
    else if (slot === 'lunch') setLunchId(id);
    else if (slot === 'dinner') setDinnerId(id);
    else if (slot === 'snacks') setSnacksId(id);
  };

  const applyAllAiMeals = () => {
    if (!aiRecs) return;
    if (aiRecs.breakfast?.meal) setBreakfastId(aiRecs.breakfast.meal.id);
    if (aiRecs.lunch?.meal) setLunchId(aiRecs.lunch.meal.id);
    if (aiRecs.dinner?.meal) setDinnerId(aiRecs.dinner.meal.id);
    if (aiRecs.snacks?.meal) setSnacksId(aiRecs.snacks.meal.id);
    addToast("Applied all recommended therapeutic meals.", "success");
  };

  // Submit Plan
  const handleSubmitPlan = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    setLoading(true);
    try {
      const res = await API.post('/meals/meal-plans', {
        patientId: parseInt(selectedPatientId),
        planDate,
        breakfastId: breakfastId ? parseInt(breakfastId) : null,
        lunchId: lunchId ? parseInt(lunchId) : null,
        dinnerId: dinnerId ? parseInt(dinnerId) : null,
        snacksId: snacksId ? parseInt(snacksId) : null,
        overrideRestrictions: overrideWarnings
      });

      if (res.data.warnType === "RestrictionWarning") {
        setRestrictionWarnings(res.data.violatedRestrictions);
        addToast("Restriction alert. Review warning details below.", "warning");
      } else {
        addToast("Meal plan submitted for Doctor approval.", "success");
        resetPlanner();
        setSelectedPatientId('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit meal plan.";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white">Meal Planning Station</h2>
        <p className="text-xs text-slate-400">Design therapeutic meal plans matching patient biometric restrictions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Planning Form Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-5 space-y-4">
            
            {/* Patient Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Select Inpatient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs md:text-sm bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary-500 focus:outline-none"
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.room_number})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Plan Date</label>
                <input
                  type="date"
                  value={planDate}
                  onChange={(e) => setPlanDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {selectedPatient && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-850 flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-slate-500">
                <div>Diagnosis: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedPatient.disease}</span></div>
                <div>Allergies: <span className="font-semibold text-rose-500">{selectedPatient.allergies?.join(', ') || 'None'}</span></div>
                <div>Restrictions: <span className="font-semibold text-blue-500">{selectedPatient.restrictions?.join(', ') || 'None'}</span></div>
                <div>Calorie Target: <span className="font-bold text-primary-600">{selectedPatient.calorie_target} kcal</span></div>
              </div>
            )}

            {/* Meal Slot Builders */}
            <form onSubmit={handleSubmitPlan} className="space-y-4">
              
              {/* Breakfast Slot */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><Utensils size={14} className="text-blue-500" /> Breakfast</span>
                  {breakfastId && (
                    <button type="button" onClick={() => setBreakfastId('')} className="text-[9px] font-bold text-slate-400 hover:text-slate-650">Clear</button>
                  )}
                </div>
                <select
                  value={breakfastId}
                  onChange={(e) => setBreakfastId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl"
                  disabled={!selectedPatientId}
                >
                  <option value="">-- Select Breakfast Meal --</option>
                  {meals.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.calories} kcal)</option>
                  ))}
                </select>
              </div>

              {/* Lunch Slot */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><Utensils size={14} className="text-amber-500" /> Lunch</span>
                  {lunchId && (
                    <button type="button" onClick={() => setLunchId('')} className="text-[9px] font-bold text-slate-400 hover:text-slate-650">Clear</button>
                  )}
                </div>
                <select
                  value={lunchId}
                  onChange={(e) => setLunchId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl"
                  disabled={!selectedPatientId}
                >
                  <option value="">-- Select Lunch Meal --</option>
                  {meals.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.calories} kcal)</option>
                  ))}
                </select>
              </div>

              {/* Dinner Slot */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><Utensils size={14} className="text-emerald-500" /> Dinner</span>
                  {dinnerId && (
                    <button type="button" onClick={() => setDinnerId('')} className="text-[9px] font-bold text-slate-400 hover:text-slate-650">Clear</button>
                  )}
                </div>
                <select
                  value={dinnerId}
                  onChange={(e) => setDinnerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl"
                  disabled={!selectedPatientId}
                >
                  <option value="">-- Select Dinner Meal --</option>
                  {meals.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.calories} kcal)</option>
                  ))}
                </select>
              </div>

              {/* Snacks Slot */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><Utensils size={14} className="text-purple-500" /> Snacks</span>
                  {snacksId && (
                    <button type="button" onClick={() => setSnacksId('')} className="text-[9px] font-bold text-slate-400 hover:text-slate-650">Clear</button>
                  )}
                </div>
                <select
                  value={snacksId}
                  onChange={(e) => setSnacksId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl"
                  disabled={!selectedPatientId}
                >
                  <option value="">-- Select Snacks Meal --</option>
                  {meals.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.calories} kcal)</option>
                  ))}
                </select>
              </div>

              {/* Restriction Violation Warnings Override Dialogue */}
              {restrictionWarnings && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 rounded-xl space-y-3 animate-fade-in">
                  <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                    <AlertTriangle size={18} className="shrink-0" />
                    <div>
                      <h4 className="font-bold">Therapeutic Restriction Warnings</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Some selected meals are not marked as complying with patient restrictions:</p>
                      <ul className="list-disc list-inside text-[9px] text-slate-500 mt-1 font-medium">
                        {restrictionWarnings.map((w, i) => (
                          <li key={i}>{w.mealName} does not comply with '{w.restriction}' restriction</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={overrideWarnings}
                      onChange={(e) => setOverrideWarnings(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-800 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-500">I confirm these details and request clinical override.</span>
                  </label>
                </div>
              )}

              {/* Submit plan */}
              <button
                type="submit"
                disabled={loading || !selectedPatientId}
                className="w-full py-2.5 font-bold text-xs md:text-sm text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 rounded-xl shadow-lg transition-all flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                ) : "Submit for Doctor Approval"}
              </button>
            </form>

          </div>
        </div>

        {/* Right sidebar: AI recommendations panel & live macro check */}
        <div className="space-y-6">
          
          {/* Live Nutrition Target Breakdown */}
          {selectedPatient && (
            <div className="p-5 glass-panel space-y-4">
              <div className="flex items-center gap-1.5 text-slate-850 dark:text-white">
                <Flame size={16} className="text-orange-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Nutrition targets tracker</h3>
              </div>

              {/* Calorie target progression */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Calories Total</span>
                  <span className={`${totals.calories > selectedPatient.calorie_target ? 'text-rose-500 font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}>{totals.calories} / {selectedPatient.calorie_target} kcal</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${totals.calories > selectedPatient.calorie_target ? 'bg-rose-500' : 'bg-primary-600'}`}
                    style={{ width: `${Math.min(100, (totals.calories / selectedPatient.calorie_target) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Protein, Carbs, Fat macro indicator totals */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Protein</span>
                  <span className="block font-black text-blue-500 mt-1">{totals.protein} g</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Carbs</span>
                  <span className="block font-black text-amber-500 mt-1">{totals.carbs} g</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Fat</span>
                  <span className="block font-black text-emerald-500 mt-1">{totals.fat} g</span>
                </div>
              </div>
            </div>
          )}

          {/* AI Meal Recommendation Widget */}
          <div className="p-5 glass-panel space-y-4">
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-white">
              <Cpu size={16} className="text-primary-600 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider">AI Recommendation Assistant</h3>
            </div>
            
            <p className="text-[10px] text-slate-400">
              Generate optimal clinical diets based on disease history, calorie counts, and allergy constraints.
            </p>

            <button
              onClick={handleFetchAiRecs}
              disabled={aiLoading || !selectedPatientId}
              className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-bold text-primary-600 hover:text-white hover:bg-primary-600 disabled:hover:text-primary-600 disabled:hover:bg-transparent border border-primary-500/30 disabled:border-slate-200 dark:disabled:border-slate-800 rounded-xl transition-all"
            >
              {aiLoading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Compute AI Recommendations</span>
                </>
              )}
            </button>

            {aiRecs && (
              <div className="space-y-3 pt-3 border-t border-slate-150 dark:border-slate-800 animate-fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Suggested Therapeutic Menu</span>
                  <button onClick={applyAllAiMeals} className="text-[9px] font-bold text-primary-600 hover:text-primary-750 flex items-center gap-0.5">
                    Apply All <Check size={10} />
                  </button>
                </div>

                {/* Recommendations slide scroll lists */}
                {Object.keys(aiRecs).map((slot) => {
                  const item = aiRecs[slot];
                  if (!item || !item.meal) return null;
                  return (
                    <div key={slot} className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-200/40 rounded-xl flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 capitalize">{slot}</span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.meal.name}</h4>
                        <p className="text-[9px] text-slate-450 dark:text-slate-450 leading-relaxed mt-1 font-medium">{item.explanation}</p>
                      </div>
                      <button
                        onClick={() => applyAiMeal(slot, item.meal.id)}
                        className="px-2 py-1 bg-slate-800 text-white hover:bg-slate-700 text-[9px] font-bold rounded-lg shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Allergy Checker Widget */}
          {selectedPatient && (
            <AllergyChecker patientAllergies={selectedPatient.allergies} />
          )}

        </div>

      </div>

    </div>
  );
}

export default MealPlanner;
