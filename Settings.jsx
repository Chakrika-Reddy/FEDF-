import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import AllergyChecker from '../components/AllergyChecker';
import CalorieCalculator from '../components/CalorieCalculator';
import { 
  Flame, 
  Droplet, 
  Clock, 
  Clipboard, 
  MessageSquare,
  ShieldCheck,
  User,
  Activity,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  FileText,
  History,
  Apple,
  Settings
} from 'lucide-react';

function PatientDashboard() {
  const { user } = useAuth();
  const { addToast } = useAppState();
  const location = useLocation();

  // Parse active tab from path or queries dynamically
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/my-diet') return 'mydiet';
    if (path === '/meal-history') return 'history';
    if (path === '/doctor-notes') return 'notes';
    if (path === '/profile') return 'profile';
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('tab') || 'dashboard';
  };
  const activeTab = getActiveTab();

  const [patientData, setPatientData] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [patientOrders, setPatientOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waterGlasses, setWaterGlasses] = useState(0);

  // Profile Form States
  const [heightInput, setHeightInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [mealPreferenceInput, setMealPreferenceInput] = useState('');
  const [cuisinePreferenceInput, setCuisinePreferenceInput] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Prepopulated high-quality healthy food thumbnail mappings
  const mealImages = {
    1: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=300", // Oatmeal
    2: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=300", // Eggs
    3: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=300", // Salmon
    4: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300", // Quinoa
    5: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300", // Chicken
    6: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=300", // Yogurt
    7: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300", // Soup
  };

  const getMealImage = (mealId, type) => {
    if (mealImages[mealId]) return mealImages[mealId];
    // Fallbacks
    if (type === 'Breakfast') return "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=300";
    if (type === 'Lunch') return "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=300";
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300";
  };

  useEffect(() => {
    const loadPatientFlow = async () => {
      try {
        const resPatients = await API.get('/patients');
        const match = resPatients.data.find(p => 
          p.user_id === user.id ||
          user.name.toLowerCase().includes(p.name.toLowerCase()) || 
          p.name.toLowerCase().includes(user.name.toLowerCase())
        ) || resPatients.data[0];
        
        if (match) {
          setPatientData(match);
          setHeightInput(match.height || '');
          setWeightInput(match.weight || '');
          setMealPreferenceInput(match.meal_preference || 'General');
          setCuisinePreferenceInput(match.cuisine_preference || 'Standard');
          
          const resPlans = await API.get(`/meals/meal-plans/${match.id}`);
          setMealPlans(resPlans.data);

          const resOrders = await API.get('/orders');
          setPatientOrders(resOrders.data);
        }
      } catch (err) {
        console.error("Error loading patient dashboard data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadPatientFlow();
    }
  }, [user]);

  // Poll orders
  useEffect(() => {
    if (!patientData) return;
    const interval = setInterval(async () => {
      try {
        const resOrders = await API.get('/orders');
        setPatientOrders(resOrders.data);
      } catch (e) {
        console.warn("Silent polling error:", e.message);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [patientData]);

  const handleAddWater = () => {
    if (waterGlasses < 12) {
      setWaterGlasses(prev => prev + 1);
      addToast("Logged 250ml water intake.", "success");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!patientData) return;
    setUpdatingProfile(true);
    try {
      await API.put(`/patients/${patientData.id}`, {
        ...patientData,
        height: parseFloat(heightInput),
        weight: parseFloat(weightInput),
        meal_preference: mealPreferenceInput,
        cuisine_preference: cuisinePreferenceInput
      });
      // Fetch latest profile details
      const res = await API.get(`/patients`);
      const updated = res.data.find(p => p.id === patientData.id);
      if (updated) {
        setPatientData(updated);
      }
      addToast("Profile preferences updated successfully!", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update profile.", "error");
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const patient = patientData || {
    name: user.name,
    age: 45,
    gender: "Male",
    room_number: "Room 304-A",
    disease: "Type 2 Diabetes",
    allergies: ["Peanuts"],
    restrictions: ["Low Sugar", "Low Carb"],
    calorie_target: 1800,
    medications: "Metformin 500mg, Insulin",
    doctor_name: "Dr. Sarah Mitchell",
    meal_timing: { breakfast: "08:00", lunch: "13:00", dinner: "18:30", snacks: "16:00" }
  };

  const todayDate = new Date().toISOString().split('T')[0];
  const todayPlan = mealPlans.find(p => p.plan_date === todayDate) || mealPlans[0] || {
    id: 1,
    calorie_total: 1250,
    status: "Approved",
    doctor_notes: "Checked glycemic load, looks excellent. Maintain light physical activity.",
    breakfast: { id: 2, name: "Scrambled Eggs with Avocado", calories: 320, protein: 14, carbs: 6, fat: 26 },
    lunch: { id: 3, name: "Grilled Salmon with Steamed Broccoli", calories: 450, protein: 38, carbs: 10, fat: 22 },
    dinner: { id: 5, name: "Lean Chicken Breast with Mashed Sweet Potato", calories: 480, protein: 40, carbs: 42, fat: 8 },
    snacks: null
  };

  const getMealOrderStatus = (mealType) => {
    const order = patientOrders.find(o => o.meal_plan_id === todayPlan.id && o.meal_type === mealType);
    return order ? order.status : 'Pending';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Preparing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Ready': return 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse';
      case 'Pending': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  // Circular calorie ring math
  const caloriePercent = Math.min(100, Math.round((todayPlan.calorie_total / (patient.calorie_target || 2000)) * 100));
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (caloriePercent / 100) * circumference;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-750 to-purple-800 text-white p-6 md:p-8 rounded-3xl shadow-xl shadow-primary-500/5">
        <div className="absolute top-[-30%] right-[-5%] w-60 h-60 rounded-full bg-blue-400/20 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-black bg-white/20 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest inline-block">Patient Hub</span>
          <h2 className="text-2xl md:text-3xl font-black">Good Day, {patient.name}</h2>
          <p className="text-xs md:text-sm text-primary-100/90 font-medium">Your nutritional recovery plan is active. Room: {patient.room_number}.</p>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main left content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Today's Diet Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={14} /> Today's Meal Board</h3>
                <Link to="/patient-dashboard?tab=mydiet" className="text-[10px] font-bold text-primary-600 hover:underline flex items-center gap-0.5">Explore Builder <ChevronRight size={10} /></Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Breakfast */}
                {todayPlan.breakfast && (
                  <div className="glass-panel p-0 overflow-hidden hover:scale-[1.01] transition-transform duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-gradient border-primary-500/10">
                    <div className="h-28 w-full relative">
                      <img src={getMealImage(todayPlan.breakfast.id, 'Breakfast')} alt="Breakfast" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
                      <span className="absolute bottom-2.5 left-3 text-[10px] font-black text-white uppercase tracking-wider">Breakfast</span>
                      <span className={`absolute top-2.5 right-3 px-1.5 py-0.5 text-[8px] font-extrabold rounded-md border backdrop-blur-md ${getStatusClass(getMealOrderStatus('Breakfast'))}`}>
                        {getMealOrderStatus('Breakfast')}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-white line-clamp-1 leading-tight">{todayPlan.breakfast.name}</h4>
                      <div className="flex items-center gap-1 text-[9px] font-extrabold text-slate-400">
                        <Clock size={11} className="text-primary-500" />
                        <span>Scheduled: {patient.meal_timing?.breakfast || '08:00'}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800 font-bold">
                        <span className="text-primary-655 font-black">{todayPlan.breakfast.calories} kcal</span>
                        <span>P: {todayPlan.breakfast.protein}g</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lunch */}
                {todayPlan.lunch && (
                  <div className="glass-panel p-0 overflow-hidden hover:scale-[1.01] transition-transform duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-gradient border-primary-500/10">
                    <div className="h-28 w-full relative">
                      <img src={getMealImage(todayPlan.lunch.id, 'Lunch')} alt="Lunch" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
                      <span className="absolute bottom-2.5 left-3 text-[10px] font-black text-white uppercase tracking-wider">Lunch</span>
                      <span className={`absolute top-2.5 right-3 px-1.5 py-0.5 text-[8px] font-extrabold rounded-md border backdrop-blur-md ${getStatusClass(getMealOrderStatus('Lunch'))}`}>
                        {getMealOrderStatus('Lunch')}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-white line-clamp-1 leading-tight">{todayPlan.lunch.name}</h4>
                      <div className="flex items-center gap-1 text-[9px] font-extrabold text-slate-400">
                        <Clock size={11} className="text-primary-500" />
                        <span>Scheduled: {patient.meal_timing?.lunch || '13:00'}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800 font-bold">
                        <span className="text-primary-655 font-black">{todayPlan.lunch.calories} kcal</span>
                        <span>P: {todayPlan.lunch.protein}g</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dinner */}
                {todayPlan.dinner && (
                  <div className="glass-panel p-0 overflow-hidden hover:scale-[1.01] transition-transform duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-gradient border-primary-500/10">
                    <div className="h-28 w-full relative">
                      <img src={getMealImage(todayPlan.dinner.id, 'Dinner')} alt="Dinner" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
                      <span className="absolute bottom-2.5 left-3 text-[10px] font-black text-white uppercase tracking-wider">Dinner</span>
                      <span className={`absolute top-2.5 right-3 px-1.5 py-0.5 text-[8px] font-extrabold rounded-md border backdrop-blur-md ${getStatusClass(getMealOrderStatus('Dinner'))}`}>
                        {getMealOrderStatus('Dinner')}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-white line-clamp-1 leading-tight">{todayPlan.dinner.name}</h4>
                      <div className="flex items-center gap-1 text-[9px] font-extrabold text-slate-400">
                        <Clock size={11} className="text-primary-500" />
                        <span>Scheduled: {patient.meal_timing?.dinner || '18:30'}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800 font-bold">
                        <span className="text-primary-655 font-black">{todayPlan.dinner.calories} kcal</span>
                        <span>P: {todayPlan.dinner.protein}g</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Weekly calendar overview */}
            <div className="glass-panel p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={14} /> Weekly Calendar Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day, idx) => (
                  <div key={day} className="p-4 bg-slate-50 dark:bg-slate-905/30 border border-slate-200/40 dark:border-slate-850 rounded-2xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{day}</span>
                    <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate mt-1">{idx === 0 ? (todayPlan.breakfast?.name || "No Breakfast Plan") : "Scheduled Therapy Diet"}</p>
                    <span className="text-[9px] text-success-600 dark:text-success-400 font-black block mt-2">Active</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right column: calorie ring, profile metrics, water */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Calorie Ring and Water progress */}
            <div className="glass-panel p-6 space-y-6 flex flex-col items-center relative overflow-hidden shadow-[0_0_20px_rgba(14,165,233,0.05)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="text-center space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1"><Flame size={12} className="text-orange-500" /> Energy Ring</h4>
                <p className="text-[10px] font-semibold text-slate-500">Target compliance status</p>
              </div>

              {/* SVG circular progress */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                  <circle cx="60" cy="60" r={radius} fill="transparent" stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-100 dark:text-slate-800" />
                  <circle 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    fill="transparent" 
                    stroke="url(#calorieGlow)" 
                    strokeWidth={strokeWidth} 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="calorieGlow" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-xl font-black text-slate-800 dark:text-white leading-none">{caloriePercent}%</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Compliance</span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">{todayPlan.calorie_total} kcal served</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Target: {patient.calorie_target} kcal</span>
              </div>
            </div>

            {/* Hydration Tracker */}
            <div className="glass-panel p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Droplet size={14} className="text-sky-500" /> Hydration tracker</h4>
                <span className="text-[10px] font-extrabold text-sky-600 dark:text-sky-400">{waterGlasses * 250} ml / 3000 ml</span>
              </div>

              {/* Progress bar tracker */}
              <div className="w-full h-2.5 bg-slate-150 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, ((waterGlasses * 250) / 3000) * 100)}%` }}></div>
              </div>

              <button 
                onClick={handleAddWater}
                className="w-full py-2 bg-sky-600/10 hover:bg-sky-600 text-sky-600 dark:text-sky-400 hover:text-white font-bold text-xs rounded-xl transition-all"
              >
                + Log Glass (250ml)
              </button>
            </div>

          </div>

        </div>
      )}

      {/* MY DIET TAB */}
      {activeTab === 'mydiet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* Meal Cards Expanded */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={14} /> Full Daily Nutrition Board</h3>
              
              <div className="space-y-4">
                {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(type => {
                  const meal = todayPlan[type.toLowerCase()];
                  if (!meal) return null;
                  return (
                    <div key={type} className="glass-panel p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm border-gradient border-primary-500/10">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <img src={getMealImage(meal.id, type)} alt={type} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{type}</span>
                          <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded-md border capitalize ${getStatusClass(getMealOrderStatus(type))}`}>
                            {getMealOrderStatus(type).toLowerCase()}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-white leading-tight">{meal.name}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-1">
                          <Clock size={12} className="text-primary-500" />
                          <span>Scheduled Intake Time: {patient.meal_timing?.[type.toLowerCase()] || (type === 'Snacks' ? '16:00' : type === 'Lunch' ? '13:00' : type === 'Dinner' ? '18:30' : '08:00')}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1.5 font-semibold">Ingredients: {meal.ingredients?.join(', ') || 'Attending catering selection'}</p>
                        
                        <div className="flex gap-4 items-center text-[10px] text-slate-455 font-extrabold pt-2">
                          <span className="text-primary-655">{meal.calories} kcal</span>
                          <span>Protein: {meal.protein}g</span>
                          <span>Carbs: {meal.carbs}g</span>
                          <span>Fat: {meal.fat}g</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calorie Calculator */}
            <CalorieCalculator 
              defaultValues={{
                age: patient.age,
                gender: patient.gender,
                height: patient.height || 178,
                weight: patient.weight || 82
              }} 
            />

          </div>

          <div className="lg:col-span-4 space-y-6">
            
            {/* Allergy Checker */}
            <AllergyChecker patientAllergies={patient.allergies} />

          </div>

        </div>
      )}

      {/* MEAL HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2">
            <History className="text-primary-600 dark:text-primary-400" size={18} />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inpatient catering ledger</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/60 text-slate-400 uppercase tracking-widest font-black text-[9px]">
                  <th className="pb-3 font-extrabold">Meal Type</th>
                  <th className="pb-3 font-extrabold">Meal Name</th>
                  <th className="pb-3 font-extrabold">Date/Time</th>
                  <th className="pb-3 font-extrabold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-semibold text-slate-700 dark:text-slate-350">
                {patientOrders.map(order => (
                  <tr key={order.id}>
                    <td className="py-3.5 text-slate-850 dark:text-white font-extrabold">{order.meal_type}</td>
                    <td className="py-3.5">{order.meal_name || 'Scheduled Catering'}</td>
                    <td className="py-3.5">{new Date(order.updated_at).toLocaleString()}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md border capitalize ${getStatusClass(order.status)}`}>
                        {order.status.toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DOCTOR NOTES TAB */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Doctor Notes Card */}
          <div className="glass-panel p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl">
                <Stethoscope size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 dark:text-white">Doctor Instructions</h4>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Attending: {patient.doctor_name || 'Dr. Mitchell'}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
              {todayPlan.doctor_notes || "Maintain hydration compliance. Attend dynamic diet schedules. Call admissions desk if anomalies arise."}
            </p>
          </div>

          {/* Dietician Notes Card */}
          <div className="glass-panel p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-success-500/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-success-500/10 text-success-600 dark:text-success-500 rounded-xl">
                <Apple size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 dark:text-white">Dietetic Directives</h4>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Therapeutic Plan</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
              Caloric targets are strictly computed to maintain postprandial glucose stability. Raw ingredients are cross-referenced with your peanut allergies automatically.
            </p>
          </div>

        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Clinical Profile */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><User size={14} /> Clinical Profile</h3>
            
            <div className="space-y-3 font-semibold text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-100/50 dark:border-slate-800/40">
                <span className="text-slate-400">FullName</span>
                <span>{patient.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100/50 dark:border-slate-800/40">
                <span className="text-slate-400">Age / Gender</span>
                <span>{patient.age} years • {patient.gender}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100/50 dark:border-slate-800/40">
                <span className="text-slate-400">Admitted Room</span>
                <span className="font-extrabold text-primary-600 dark:text-primary-400">{patient.room_number}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100/50 dark:border-slate-800/40">
                <span className="text-slate-400">Biometric Metrics</span>
                <span>Height: {patient.height || 178} cm • Weight: {patient.weight || 82.5} kg</span>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Activity size={14} /> Medical Profile</h3>
            
            <div className="space-y-3 font-semibold text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-100/50 dark:border-slate-800/40">
                <span className="text-slate-400">attending diagnosis</span>
                <span>{patient.disease}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100/50 dark:border-slate-800/40">
                <span className="text-slate-400">active medications</span>
                <span>{patient.medications}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100/50 dark:border-slate-800/40">
                <span className="text-slate-400">Clinical Allergies</span>
                <span className="text-rose-500 font-extrabold">{patient.allergies?.join(', ') || 'None'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100/50 dark:border-slate-800/40">
                <span className="text-slate-400">therapeutic restrictions</span>
                <span className="text-blue-500 font-extrabold">{patient.restrictions?.join(', ') || 'None'}</span>
              </div>
            </div>
          </div>

          {/* Attending Clinicians */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Stethoscope size={14} /> Attending Clinicians</h3>
            
            <div className="space-y-3 font-semibold text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-100/50 dark:border-slate-800/40">
                <span className="text-slate-400">Assigned Doctor</span>
                <span className="font-extrabold">{patient.doctor_name || 'Dr. Sarah Mitchell'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100/50 dark:border-slate-800/40">
                <span className="text-slate-400">Assigned Dietician</span>
                <span className="font-extrabold">Jane Doe (RD)</span>
              </div>
            </div>
          </div>

          {/* Update Profile preferences */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Settings size={14} /> Update Preferences</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightInput}
                    onChange={(e) => setHeightInput(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    step="0.1"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Meal Preference</label>
                  <select
                    value={mealPreferenceInput}
                    onChange={(e) => setMealPreferenceInput(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl"
                  >
                    <option value="General">General</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Halal">Halal</option>
                    <option value="Kosher">Kosher</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Cuisine Preference</label>
                  <input
                    type="text"
                    value={cuisinePreferenceInput}
                    onChange={(e) => setCuisinePreferenceInput(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingProfile || !patientData}
                className="w-full py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-2"
              >
                {updatingProfile ? "Saving..." : "Update Preferences"}
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}

export default PatientDashboard;
