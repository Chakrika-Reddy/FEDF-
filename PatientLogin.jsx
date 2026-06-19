import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertTriangle,
  Play,
  Check,
  PackageOpen,
  UtensilsCrossed
} from 'lucide-react';

function Kitchen() {
  const location = useLocation();
  const { user } = useAuth();
  const { 
    orders, 
    addToast, 
    fetchOrders, 
    fetchInventory 
  } = useAppState();

  const [filterType, setFilterType] = useState('All');
  const [highlightOrderId, setHighlightOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Highlight order from search (?id=123)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id && orders.length > 0) {
      setHighlightOrderId(parseInt(id));
      const match = orders.find(o => o.id === parseInt(id));
      if (match) {
        addToast(`Highlighting Ticket #${id} - ${match.meal_name}`, "info");
      }
    }
  }, [location.search, orders]);

  // Update status (Pending -> Preparing -> Ready -> Delivered)
  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: nextStatus });
      addToast(`Order #${orderId} marked as ${nextStatus}!`, "success");
      fetchOrders();
      // Sync stock indicators if ingredients were deducted
      if (nextStatus === 'Preparing') {
        fetchInventory();
      }
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update order status.", "error");
    }
  };

  // Sort orders into columns
  const pending = orders.filter(o => o.status === 'Pending' && (filterType === 'All' || o.meal_type === filterType));
  const preparing = orders.filter(o => o.status === 'Preparing' && (filterType === 'All' || o.meal_type === filterType));
  const ready = orders.filter(o => o.status === 'Ready' && (filterType === 'All' || o.meal_type === filterType));
  const delivered = orders.filter(o => o.status === 'Delivered' && (filterType === 'All' || o.meal_type === filterType));

  const mealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const renderOrderCard = (order) => {
    const isHighlighted = order.id === highlightOrderId;
    const hasAllergies = order.allergies && order.allergies.length > 0;

    return (
      <div 
        key={order.id} 
        className={`
          p-4 bg-white dark:bg-slate-800 border-2 rounded-2xl shadow-sm space-y-3 transition-all duration-200
          ${isHighlighted ? 'border-primary-500 scale-[1.01] ring-2 ring-primary-500/25' : 'border-slate-100 dark:border-slate-700/50 hover:border-slate-200'}
        `}
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">TICKET #{order.id} • {order.meal_type.toUpperCase()}</span>
            <h4 className="text-xs font-black text-slate-800 dark:text-white mt-0.5">{order.meal_name}</h4>
          </div>
          <span className="text-[10px] font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">{order.room_number}</span>
        </div>

        {/* Patient Name */}
        <p className="text-[10px] text-slate-500 font-semibold">Patient: <span className="text-slate-750 dark:text-slate-200">{order.patient_name}</span></p>

        {/* Allergy Danger Box */}
        {hasAllergies && (
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/20 rounded-xl flex gap-1.5 items-start text-[9px] text-rose-600 dark:text-rose-400 font-extrabold animate-pulse">
            <AlertTriangle size={14} className="shrink-0" />
            <div>
              <span className="uppercase tracking-wider">ALLERGY WARNING</span>
              <p className="font-semibold">{order.allergies.join(', ')}</p>
            </div>
          </div>
        )}

        {/* Ingredients list */}
        {order.ingredients && order.ingredients.length > 0 && (
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Ingredients</span>
            <div className="flex flex-wrap gap-1">
              {order.ingredients.map(ing => (
                <span key={ing} className="px-1.5 py-0.5 text-[9px] font-medium bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 rounded-md">{ing}</span>
              ))}
            </div>
          </div>
        )}

        {/* Workflow actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex justify-end gap-2">
          {order.status === 'Pending' && (
            <button
              onClick={() => handleUpdateStatus(order.id, 'Preparing')}
              className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-white bg-slate-850 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg active:scale-95 transition-all"
            >
              <Play size={10} />
              <span>Start Preparing</span>
            </button>
          )}
          {order.status === 'Preparing' && (
            <button
              onClick={() => handleUpdateStatus(order.id, 'Ready')}
              className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg active:scale-95 transition-all"
            >
              <Check size={10} />
              <span>Mark Ready</span>
            </button>
          )}
          {order.status === 'Ready' && (
            <button
              onClick={() => handleUpdateStatus(order.id, 'Delivered')}
              className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg active:scale-95 transition-all"
            >
              <Truck size={10} />
              <span>Mark Served</span>
            </button>
          )}
          {order.status === 'Delivered' && (
            <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-450 flex items-center gap-1"><Check size={12} /> SERVED</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">Kitchen Operations Board</h2>
          <p className="text-xs text-slate-400">Monitor and track meal preparation tickets from dietician plans</p>
        </div>

        {/* Filter Selection Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          {mealTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${filterType === type ? 'bg-white dark:bg-slate-800 text-slate-850 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Column 1: Pending */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b-2 border-slate-200 dark:border-slate-850 pb-2">
            <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <Clock className="text-slate-400" size={14} /> Pending
            </span>
            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded-full">{pending.length}</span>
          </div>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {pending.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 rounded-2xl">No tickets pending.</div>
            ) : (
              pending.map(renderOrderCard)
            )}
          </div>
        </div>

        {/* Column 2: Preparing */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b-2 border-slate-200 dark:border-slate-850 pb-2">
            <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <ChefHat className="text-blue-500 animate-pulse" size={14} /> Preparing
            </span>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{preparing.length}</span>
          </div>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {preparing.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 rounded-2xl">No active preparation.</div>
            ) : (
              preparing.map(renderOrderCard)
            )}
          </div>
        </div>

        {/* Column 3: Ready */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b-2 border-slate-200 dark:border-slate-850 pb-2">
            <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="text-emerald-500 animate-bounce" size={14} /> Ready
            </span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{ready.length}</span>
          </div>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {ready.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 rounded-2xl">No orders ready to go.</div>
            ) : (
              ready.map(renderOrderCard)
            )}
          </div>
        </div>

        {/* Column 4: Delivered */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b-2 border-slate-200 dark:border-slate-850 pb-2">
            <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <Truck className="text-slate-500" size={14} /> Delivered
            </span>
            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded-full">{delivered.length}</span>
          </div>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {delivered.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 rounded-2xl">No meals served today.</div>
            ) : (
              delivered.map(renderOrderCard)
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Kitchen;
