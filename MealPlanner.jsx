import React, { useEffect, useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { 
  History as HistoryIcon, 
  Search, 
  Calendar, 
  User, 
  SlidersHorizontal,
  FileClock,
  Clock
} from 'lucide-react';

function History() {
  const { user } = useAuth();
  const { 
    patients, 
    historyLogs, 
    fetchHistoryLogs 
  } = useAppState();

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // List of possible actions for dropdown
  const actionTypes = [
    { value: '', label: 'All Actions' },
    { value: 'USER_REGISTERED', label: 'User Signup' },
    { value: 'USER_LOGIN', label: 'User Login' },
    { value: 'PATIENT_CREATED', label: 'Patient Registration' },
    { value: 'PATIENT_UPDATED', label: 'Patient Updates' },
    { value: 'MEAL_PLAN_CREATED', label: 'Meal Plan Construction' },
    { value: 'MEAL_PLAN_APPROVED', label: 'Doctor Approvals' },
    { value: 'MEAL_PLAN_REJECTED', label: 'Doctor Rejections' },
    { value: 'ORDER_STATUS_CHANGED', label: 'Kitchen Delivery Updates' },
    { value: 'INVENTORY_UPDATED', label: 'Stock Updates' }
  ];

  // Fetch with filters whenever they change
  useEffect(() => {
    const filters = {};
    if (selectedPatientId) filters.patientId = selectedPatientId;
    if (selectedAction) filters.actionType = selectedAction;
    if (filterDate) filters.date = filterDate;

    fetchHistoryLogs(filters);
  }, [selectedPatientId, selectedAction, filterDate]);

  const handleResetFilters = () => {
    setSelectedPatientId('');
    setSelectedAction('');
    setFilterDate('');
  };

  const getActionBadgeClass = (action) => {
    if (action.includes('APPROVED')) return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-250/20';
    if (action.includes('REJECTED') || action.includes('DELETED')) return 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border-rose-250/20';
    if (action.includes('CREATED') || action.includes('REGISTERED')) return 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border-blue-250/20';
    return 'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400 border-slate-200/50';
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white">Audit History Logs</h2>
        <p className="text-xs text-slate-400">Archived audit logs tracking patient actions, meal construction, approvals, and kitchen pipelines</p>
      </div>

      {/* Filter Row */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-end">
        {/* Patient Selection */}
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1"><User size={10} /> Inpatient filter</label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none"
          >
            <option value="">All Patients</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Action Type */}
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1"><SlidersHorizontal size={10} /> Action Class</label>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none"
          >
            {actionTypes.map(act => (
              <option key={act.value} value={act.value}>{act.label}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1"><Calendar size={10} /> Action Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none"
          />
        </div>

        {/* Reset */}
        <button
          onClick={handleResetFilters}
          className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl w-full md:w-auto"
        >
          Reset
        </button>
      </div>

      {/* Audit timeline table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200/60 dark:border-slate-850/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action Type</th>
                <th className="px-6 py-4">Description Detail</th>
                <th className="px-6 py-4">Patient Reference</th>
                <th className="px-6 py-4">User Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
              {historyLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">No matching audit trail logs recorded.</td>
                </tr>
              ) : (
                historyLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10 transition-colors">
                    {/* Timestamp */}
                    <td className="px-6 py-4 text-slate-500 flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                    </td>
                    {/* Action Class */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 text-[9px] font-bold border rounded-full uppercase ${getActionBadgeClass(log.action_type)}`}>
                        {log.action_type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    {/* Details */}
                    <td className="px-6 py-4 font-semibold text-slate-750 dark:text-slate-200 max-w-sm truncate">{log.details}</td>
                    {/* Patient Reference */}
                    <td className="px-6 py-4">
                      {log.patient_name ? (
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{log.patient_name}</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Global System</span>
                      )}
                    </td>
                    {/* Operator */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{log.user_name || 'System Auto'}</span>
                        <span className="text-[9px] text-slate-400 capitalize">{log.user_role || 'System'}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default History;
