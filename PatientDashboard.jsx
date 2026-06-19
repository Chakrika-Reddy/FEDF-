import React, { useEffect, useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  Boxes, 
  AlertTriangle, 
  Plus, 
  Edit2, 
  TrendingUp, 
  X,
  PackagePlus,
  RefreshCw,
  FolderSync
} from 'lucide-react';

function Inventory() {
  const { user } = useAuth();
  const { 
    inventory, 
    addToast, 
    fetchInventory 
  } = useAppState();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    ingredient_name: '',
    stock_quantity: '',
    unit: 'kg',
    expiration_date: '',
    low_stock_threshold: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const resetForm = () => {
    setFormData({
      ingredient_name: '',
      stock_quantity: '',
      unit: 'kg',
      expiration_date: '',
      low_stock_threshold: ''
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      ingredient_name: item.ingredient_name,
      stock_quantity: item.stock_quantity,
      unit: item.unit,
      expiration_date: item.expiration_date,
      low_stock_threshold: item.low_stock_threshold
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        await API.put(`/inventory/${editingItem.id}`, formData);
        addToast(`Successfully restocked '${editingItem.ingredient_name}'!`, "success");
      } else {
        await API.post('/inventory', formData);
        addToast(`New ingredient tracker '${formData.ingredient_name}' created!`, "success");
      }
      setModalOpen(false);
      resetForm();
      fetchInventory();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update inventory.", "error");
    } finally {
      setLoading(false);
    }
  };

  const lowStockCount = inventory.filter(item => item.stock_quantity <= item.low_stock_threshold).length;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">Kitchen Stock Inventory</h2>
          <p className="text-xs text-slate-400">Track and manage raw food resources and low-stock alerts</p>
        </div>

        {user?.role !== 'Patient' && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition-all"
          >
            <Plus size={16} />
            <span>Add Ingredient</span>
          </button>
        )}
      </div>

      {/* Low Stock Indicator bar */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-250/20 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-pulse">
          <AlertTriangle size={18} />
          <span>Warning: {lowStockCount} ingredient items are currently below safety stock thresholds! Kitchen operations might experience delays.</span>
        </div>
      )}

      {/* Inventory Table card */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200/60 dark:border-slate-850/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Ingredient Name</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Measurement Unit</th>
                <th className="px-6 py-4">Expiration Date</th>
                <th className="px-6 py-4">Low Stock Safety Limit</th>
                <th className="px-6 py-4 text-center">Status</th>
                {user?.role !== 'Patient' && <th className="px-6 py-4 text-center">Update</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">No inventory trackers configured.</td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const isLow = item.stock_quantity <= item.low_stock_threshold;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white capitalize">{item.ingredient_name}</td>
                      <td className="px-6 py-4">
                        <span className={`font-extrabold ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>{item.stock_quantity}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-500 uppercase">{item.unit}</td>
                      <td className="px-6 py-4 text-slate-500">{item.expiration_date}</td>
                      <td className="px-6 py-4 font-semibold text-slate-500">{item.low_stock_threshold} {item.unit}</td>
                      <td className="px-6 py-4 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 text-[9px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/30 rounded-full">
                            <AlertTriangle size={10} /> LOW STOCK
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/30 rounded-full">SAFE</span>
                        )}
                      </td>
                      {user?.role !== 'Patient' && (
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                            title="Restock Item"
                          >
                            <Edit2 size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl animate-fade-in overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                <PackagePlus size={18} />
                <h3 className="font-bold text-sm">{editingItem ? `Restock: ${editingItem.ingredient_name}` : "Add New Stock Item"}</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-650">
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Ingredient Name (disabled if editing) */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Ingredient Name</label>
                <input
                  type="text"
                  value={formData.ingredient_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, ingredient_name: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl focus:border-primary-500 focus:outline-none capitalize"
                  disabled={!!editingItem}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Stock Quantity */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{editingItem ? "New Stock Level" : "Initial Stock"}</label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                    step="0.1"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl focus:border-primary-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none"
                    disabled={!!editingItem}
                  >
                    <option value="kg">kilograms (kg)</option>
                    <option value="L">liters (L)</option>
                    <option value="pcs">pieces (pcs)</option>
                    <option value="g">grams (g)</option>
                  </select>
                </div>

                {/* Expiration Date */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={formData.expiration_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiration_date: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl focus:border-primary-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Low Stock Limit */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Safety Threshold</label>
                  <input
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, low_stock_threshold: e.target.value }))}
                    step="0.1"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl focus:border-primary-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl flex items-center gap-1"
                >
                  {loading && <RefreshCw size={12} className="animate-spin" />}
                  <span>{editingItem ? "Update Stock" : "Create Tracker"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Inventory;
