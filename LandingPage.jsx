import React, { useEffect } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  CalendarDays, 
  ClipboardCheck, 
  ChefHat, 
  Flame, 
  AlertTriangle,
  Activity,
  Bell,
  ArrowRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

import PatientDashboard from './PatientDashboard';

function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'Patient') {
    return <Navigate to="/patient-dashboard" replace />;
  }
  const { 
    patients, 
    orders, 
    notifications, 
    historyLogs, 
    fetchPatients,
    fetchOrders,
    fetchNotifications,
    fetchHistoryLogs
  } = useAppState();

  useEffect(() => {
    fetchPatients();
    fetchOrders();
    fetchNotifications();
    fetchHistoryLogs();
  }, []);

  // Compute stats
  const totalPatients = patients.length;
  const pendingApprovals = orders.filter(o => o.status === 'Pending').length; // Simplification: pending orders
  const activeOrders = orders.filter(o => o.status === 'Preparing' || o.status === 'Ready').length;
  const alertCount = notifications.filter(n => !n.is_read).length;

  // Average Calories served: from patient targets
  const avgCalories = totalPatients > 0 
    ? Math.round(patients.reduce((sum, p) => sum + (p.calorie_target || 2000), 0) / totalPatients)
    : 2000;

  // Recent 5 activities
  const recentLogs = historyLogs.slice(0, 5);

  // Recent 4 notifications
  const recentNotifs = notifications.slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-primary-700 to-primary-900 text-white p-6 rounded-3xl shadow-xl shadow-primary-500/5">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black">Good Day, {user?.name}!</h2>
          <p className="text-xs text-primary-100/80 font-medium">Nutritional operations are running normally. {alertCount} unread system alerts require review.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/meal-planner" className="px-4 py-2 text-xs font-bold bg-white text-primary-800 hover:bg-slate-50 rounded-xl transition-all">
            Plan Meals
          </Link>
          <Link to="/kitchen" className="px-4 py-2 text-xs font-bold bg-primary-800/40 hover:bg-primary-800/60 border border-primary-500/30 text-white rounded-xl transition-all">
            Kitchen Monitor
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Patients */}
        <div className="glass-panel p-4 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Users size={18} />
            </div>
            <span className="text-[10px] font-bold text-success-600 flex items-center gap-0.5">
              +4% <TrendingUp size={10} />
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Patients</h4>
            <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">{totalPatients}</span>
          </div>
        </div>

        {/* Meals Scheduled */}
        <div className="glass-panel p-4 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl">
              <CalendarDays size={18} />
            </div>
            <span className="text-[10px] font-bold text-success-600 flex items-center gap-0.5">
              +12% <TrendingUp size={10} />
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Meals Scheduled</h4>
            <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">{totalPatients * 3}</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="glass-panel p-4 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
              <ClipboardCheck size={18} />
            </div>
            <span className="text-[10px] font-bold text-slate-400">Awaiting</span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending Approvals</h4>
            <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">{pendingApprovals}</span>
          </div>
        </div>

        {/* Kitchen Orders */}
        <div className="glass-panel p-4 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-500 rounded-xl">
              <ChefHat size={18} />
            </div>
            <span className="text-[10px] font-bold text-success-600 flex items-center gap-0.5">
              Active
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Kitchen Orders</h4>
            <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">{activeOrders}</span>
          </div>
        </div>

        {/* Calories Served */}
        <div className="glass-panel p-4 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 rounded-xl">
              <Flame size={18} />
            </div>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-450 flex items-center gap-0.5">
              -1.5% <TrendingDown size={10} />
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Calories Target</h4>
            <span className="text-xl font-black text-slate-800 dark:text-white leading-none truncate block">{avgCalories} <span className="text-xs font-normal text-slate-400">kcal</span></span>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="glass-panel p-4 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400 rounded-xl">
              <AlertTriangle size={18} />
            </div>
            <span className="text-[9px] font-bold bg-red-100 dark:bg-red-950 text-red-600 px-1.5 py-0.5 rounded-full">Alerts</span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Alerts</h4>
            <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">{alertCount}</span>
          </div>
        </div>
      </div>

      {/* Analytics & Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Calories Line Chart */}
        <div className="glass-panel p-5 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Calorie Trends</h3>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">Calorie Delivery Target Compliance</h4>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary-600 rounded-full"></span> Target</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Served</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative h-60 w-full">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              <defs>
                <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.00"/>
                </linearGradient>
                <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.00"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
              <line x1="30" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
              <line x1="30" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
              <line x1="30" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1.5" className="dark:stroke-slate-700" />

              {/* Chart Line - Target (Blue) */}
              <path 
                d="M 50,70 Q 120,60 190,80 T 330,70 T 470,60" 
                fill="none" 
                stroke="#0ea5e9" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />
              <path 
                d="M 50,70 Q 120,60 190,80 T 330,70 T 470,60 L 470,170 L 50,170 Z" 
                fill="url(#primaryGrad)" 
              />

              {/* Chart Line - Served (Green) */}
              <path 
                d="M 50,90 Q 120,70 190,95 T 330,85 T 470,65" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />
              <path 
                d="M 50,90 Q 120,70 190,95 T 330,85 T 470,65 L 470,170 L 50,170 Z" 
                fill="url(#successGrad)" 
              />

              {/* Data points */}
              <circle cx="190" cy="80" r="5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="190" cy="95" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

              {/* X Axis Labels */}
              <text x="50" y="190" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="middle">Mon</text>
              <text x="120" y="190" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="middle">Tue</text>
              <text x="190" y="190" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="middle">Wed</text>
              <text x="260" y="190" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="middle">Thu</text>
              <text x="330" y="190" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="middle">Fri</text>
              <text x="400" y="190" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="middle">Sat</text>
              <text x="470" y="190" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="middle">Sun</text>
            </svg>
          </div>
        </div>

        {/* Recovery Indicators & Meals donut mockup */}
        <div className="glass-panel p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kitchen Performance</h3>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">Meal Delivery Status</h4>
          </div>

          <div className="flex justify-center items-center py-2">
            {/* SVG Donut Chart */}
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" className="dark:stroke-slate-850" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent" 
                stroke="#10b981" 
                strokeWidth="8" 
                strokeDasharray="251.2" 
                strokeDashoffset="65" 
                strokeLinecap="round"
                transform="rotate(-90 50 50)" 
              />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent" 
                stroke="#0ea5e9" 
                strokeWidth="8" 
                strokeDasharray="251.2" 
                strokeDashoffset="180" 
                strokeLinecap="round"
                transform="rotate(25 50 50)" 
              />
              <text x="50" y="53" textAnchor="middle" fill="currentColor" className="text-xs font-black text-slate-800 dark:text-white">74%</text>
              <text x="50" y="63" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="bold">Completed</text>
            </svg>
          </div>

          {/* Legend stats */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Served / Delivered</span>
              <span className="text-slate-850 dark:text-slate-200">74%</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 bg-primary-500 rounded-full"></span> In Preparation</span>
              <span className="text-slate-850 dark:text-slate-200">18%</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full"></span> Remaining</span>
              <span className="text-slate-850 dark:text-slate-200">8%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid of Alert Center & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Alerts widget */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="text-rose-500" size={18} />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent System Alerts</h3>
            </div>
            <Link to="/settings?tab=notifications" className="text-[10px] font-bold text-primary-600 hover:text-primary-700">View Configuration</Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {recentNotifs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">All quiet. No notifications found.</div>
            ) : (
              recentNotifs.map((notif) => (
                <div key={notif.id} className="py-3 flex items-start gap-3 text-xs">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.is_read ? 'bg-slate-200 dark:bg-slate-700' : 'bg-primary-600'}`}></div>
                  <div className="flex-1">
                    <p className={`font-semibold ${notif.is_read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{notif.message}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{new Date(notif.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit activity logs */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="text-emerald-500" size={18} />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hospital Log ledger</h3>
            </div>
            <Link to="/history" className="text-[10px] font-bold text-primary-600 hover:text-primary-700">Audit Trails</Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {recentLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No logs captured yet.</div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="py-3 flex justify-between items-center text-xs gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{log.details}</p>
                    <span className="text-[10px] text-slate-400">{log.user_name || 'System'} • {log.action_type}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 shrink-0 font-semibold">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
