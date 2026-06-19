import React, { useEffect, useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  ClipboardCheck, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  FileCheck,
  User,
  Activity,
  Bed,
  CheckCircle2,
  Clock
} from 'lucide-react';

function Approvals() {
  const { user } = useAuth();
  const { addToast } = useAppState();

  const [pendingPlans, setPendingPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // Doctor Notes State Map (planId -> notes)
  const [doctorNotes, setDoctorNotes] = useState({});

  const fetchPendingPlans = async () => {
    setLoading(true);
    try {
      const res = await API.get('/meals/meal-plans/pending');
      setPendingPlans(res.data);
    } catch (err) {
      addToast("Failed to retrieve pending meal plans.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPlans();
  }, []);

  const handleNoteChange = (planId, val) => {
    setDoctorNotes(prev => ({
      ...prev,
      [planId]: val
    }));
  };

  const handleAction = async (planId, actionStatus) => {
    try {
      const notes = doctorNotes[planId] || '';
      await API.put(`/meals/meal-plans/${planId}/approve`, {
        status: actionStatus, // Approved or Rejected
        doctorNotes: notes
      });

      addToast(`Meal plan successfully ${actionStatus.toLowerCase()}d!`, "success");
      // Remove from list
      setPendingPlans(prev => prev.filter(p => p.id !== planId));
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update approval action.", "error");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white">Clinical Approvals</h2>
        <p className="text-xs text-slate-400">Doctor review panel for custom patient dietary charts</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : pendingPlans.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-450 dark:text-slate-500">
          <ClipboardCheck className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
          <h3 className="text-sm font-bold text-slate-750 dark:text-slate-350">All Clear</h3>
          <p className="text-xs text-slate-400 mt-1">No custom meal plans are currently awaiting medical signature.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingPlans.map((plan) => (
            <div key={plan.id} className="glass-panel p-5 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              
              {/* Left Column: Patient & Planner Metadata */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Inpatient Details</span>
                  <h3 className="text-sm font-black text-slate-850 dark:text-white flex items-center gap-1.5 mt-1">
                    <User size={14} className="text-primary-500" />
                    {plan.patient_name}
                  </h3>
                  <div className="flex gap-4 mt-2 text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1"><Bed size={12} /> {plan.room_number}</span>
                    <span>Date: {plan.plan_date}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-905/30 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1.5 text-[10px]">
                  <span className="font-bold text-slate-400 uppercase block tracking-wider">Plan Nutrition Targets</span>
                  <div className="flex justify-between font-semibold">
                    <span>Calories total:</span>
                    <span className="text-primary-600 font-bold">{plan.calorie_total} kcal</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-slate-500 font-bold">
                    <div>P: {plan.breakfast?.protein + (plan.lunch?.protein || 0) + (plan.dinner?.protein || 0)}g</div>
                    <div>C: {plan.breakfast?.carbs + (plan.lunch?.carbs || 0) + (plan.dinner?.carbs || 0)}g</div>
                    <div>F: {plan.breakfast?.fat + (plan.lunch?.fat || 0) + (plan.dinner?.fat || 0)}g</div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400">
                  Plan constructed by: <span className="font-semibold text-slate-600 dark:text-slate-350">{plan.creator_name}</span>
                </div>
              </div>

              {/* Middle Column: Scheduled Meals List */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Scheduled Menu Items</span>
                
                {/* Breakfast */}
                {plan.breakfast && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Breakfast:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{plan.breakfast.name}</span>
                  </div>
                )}
                
                {/* Lunch */}
                {plan.lunch && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Lunch:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{plan.lunch.name}</span>
                  </div>
                )}

                {/* Dinner */}
                {plan.dinner && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Dinner:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{plan.dinner.name}</span>
                  </div>
                )}

                {/* Snacks */}
                {plan.snacks && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Snacks:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{plan.snacks.name}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Timeline & Approval Action Box */}
              <div className="space-y-4 flex flex-col justify-between">
                
                {/* Visual Timeline Component */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Workflow Timeline</span>
                  <div className="flex items-center gap-2.5">
                    {/* Step 1 */}
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-450 font-bold text-[10px]">
                      <CheckCircle2 size={12} />
                      <span>Planner</span>
                    </div>
                    <div className="h-0.5 w-6 bg-emerald-500"></div>
                    {/* Step 2 */}
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px] animate-pulse">
                      <Clock size={12} />
                      <span>Doctor Review</span>
                    </div>
                    <div className="h-0.5 w-6 bg-slate-200 dark:bg-slate-800"></div>
                    {/* Step 3 */}
                    <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px]">
                      <Clock size={12} />
                      <span>Kitchen Delivery</span>
                    </div>
                  </div>
                </div>

                {/* Decision / Notes */}
                {user?.role === 'Doctor' || user?.role === 'Admin' ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-2.5 text-slate-400" size={14} />
                      <textarea
                        value={doctorNotes[plan.id] || ''}
                        onChange={(e) => handleNoteChange(plan.id, e.target.value)}
                        placeholder="Add review feedback notes..."
                        rows="2"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleAction(plan.id, 'Rejected')}
                        className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-rose-200/40 dark:border-rose-900/40 rounded-xl"
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleAction(plan.id, 'Approved')}
                        className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
                      >
                        <FileCheck size={14} />
                        <span>Sign & Approve</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 dark:bg-slate-905/30 border border-slate-100 rounded-xl text-[10px] text-slate-400 italic">
                    Awaiting clinical authorization signature. Doctors only.
                  </div>
                )}

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Approvals;
