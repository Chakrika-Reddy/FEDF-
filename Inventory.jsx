import React, { useEffect } from 'react';
import { useAppState } from '../context/AppStateContext';
import { 
  TrendingUp, 
  Activity, 
  Flame, 
  ChefHat, 
  ChevronRight, 
  Sparkles,
  BarChart4,
  AlertCircle
} from 'lucide-react';

function Analytics() {
  const { patients, fetchPatients } = useAppState();

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">Hospital Clinical Analytics</h2>
          <p className="text-xs text-slate-400">Review calorie delivery compliance, recovery margins, and menu metrics</p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-success-50 dark:bg-success-950/20 text-success-600 dark:text-success-500 border border-success-200/30 rounded-full text-[10px] font-bold">
          <Sparkles size={12} className="animate-pulse" />
          <span>Real-time Sync Active</span>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Curved Calorie Compliance Area Chart */}
        <div className="glass-panel p-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metabolic Compliance</h3>
            <h4 className="text-sm font-extrabold text-slate-850 dark:text-white mt-0.5">Average Daily Calories Served (kcal)</h4>
          </div>

          <div className="h-60 w-full">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              <defs>
                <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0"/>
                </linearGradient>
              </defs>

              <line x1="30" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
              <line x1="30" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
              <line x1="30" y1="130" x2="480" y2="130" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
              <line x1="30" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1.5" className="dark:stroke-slate-700" />

              <path 
                d="M 50,110 Q 120,70 190,95 T 330,60 T 470,80" 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
              <path 
                d="M 50,110 Q 120,70 190,95 T 330,60 T 470,80 L 470,170 L 50,170 Z" 
                fill="url(#calGrad)" 
              />

              <circle cx="330" cy="60" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />

              <text x="50" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">Week 1</text>
              <text x="190" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">Week 2</text>
              <text x="330" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">Week 3</text>
              <text x="470" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">Week 4</text>

              <text x="25" y="35" fill="#94a3b8" fontSize="8" textAnchor="end">2200</text>
              <text x="25" y="85" fill="#94a3b8" fontSize="8" textAnchor="end">1800</text>
              <text x="25" y="135" fill="#94a3b8" fontSize="8" textAnchor="end">1400</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Stacked Recovery segment Indicator */}
        <div className="glass-panel p-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recovery Statistics</h3>
            <h4 className="text-sm font-extrabold text-slate-855 dark:text-white mt-0.5">Therapeutic Recovery Indicators</h4>
          </div>

          <div className="space-y-6 py-4">
            {/* Segmented Stack bar */}
            <div className="w-full h-8 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex shadow-inner">
              <div className="h-full bg-emerald-500 hover:opacity-90 transition-opacity" style={{ width: '60%' }} title="Improving"></div>
              <div className="h-full bg-blue-500 hover:opacity-90 transition-opacity" style={{ width: '35%' }} title="Stable"></div>
              <div className="h-full bg-rose-500 hover:opacity-90 transition-opacity" style={{ width: '5%' }} title="Critical"></div>
            </div>

            {/* Detailed metrics breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
              <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/15 border border-emerald-250/20 rounded-2xl">
                <span className="text-emerald-600 block text-[10px]">Improving</span>
                <span className="text-lg font-black text-slate-800 dark:text-white mt-1 block">60%</span>
              </div>
              <div className="p-3 bg-blue-50/40 dark:bg-blue-950/15 border border-blue-250/20 rounded-2xl">
                <span className="text-blue-600 block text-[10px]">Stable</span>
                <span className="text-lg font-black text-slate-800 dark:text-white mt-1 block">35%</span>
              </div>
              <div className="p-3 bg-rose-50/40 dark:bg-rose-950/15 border border-rose-250/20 rounded-2xl">
                <span className="text-rose-600 block text-[10px]">Critical</span>
                <span className="text-lg font-black text-slate-800 dark:text-white mt-1 block">5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Vertical Compliance Columns */}
        <div className="glass-panel p-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dietary Standards</h3>
            <h4 className="text-sm font-extrabold text-slate-855 dark:text-white mt-0.5">Therapeutic Compliance (Target vs Actual)</h4>
          </div>

          <div className="h-60 w-full flex items-end justify-between px-6 pt-4">
            {/* Low Sodium */}
            <div className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-12 bg-slate-100 dark:bg-slate-800 rounded-t-lg h-48 relative overflow-hidden flex items-end">
                <div className="w-full bg-primary-600 h-5/6 rounded-t-lg"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-500">Low Sodium</span>
            </div>

            {/* Low Carb */}
            <div className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-12 bg-slate-100 dark:bg-slate-800 rounded-t-lg h-48 relative overflow-hidden flex items-end">
                <div className="w-full bg-amber-500 h-3/4 rounded-t-lg"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-500">Low Sugar</span>
            </div>

            {/* Gluten Free */}
            <div className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-12 bg-slate-100 dark:bg-slate-800 rounded-t-lg h-48 relative overflow-hidden flex items-end">
                <div className="w-full bg-emerald-500 h-11/12 rounded-t-lg"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-500">Gluten-Free</span>
            </div>
          </div>
        </div>

        {/* Chart 4: Radial gauge or statistics metrics */}
        <div className="glass-panel p-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catering Metrics</h3>
            <h4 className="text-sm font-extrabold text-slate-855 dark:text-white mt-0.5">Kitchen Fulfillment Performance</h4>
          </div>

          <div className="h-60 flex flex-col justify-center items-center space-y-4">
            <svg viewBox="0 0 100 100" className="w-36 h-36">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="10" className="dark:stroke-slate-850" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent" 
                stroke="#10b981" 
                strokeWidth="10" 
                strokeDasharray="251.2" 
                strokeDashoffset="38" 
                strokeLinecap="round"
                transform="rotate(-90 50 50)" 
              />
              <text x="50" y="55" textAnchor="middle" fill="currentColor" className="text-sm font-black text-slate-850 dark:text-white">85%</text>
            </svg>
            <p className="text-[10px] text-slate-400 font-medium text-center max-w-[200px]">Average order preparation and delivery latency is within 25 minutes bounds.</p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Analytics;
