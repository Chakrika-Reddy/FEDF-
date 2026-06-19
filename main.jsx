import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const AppStateContext = createContext();

export function AppStateProvider({ children }) {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [meals, setMeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const addToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Fetch Patients
  const fetchPatients = async () => {
    if (!user) return;
    try {
      const res = await API.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err.message);
    }
  };

  // 2. Fetch Meals
  const fetchMeals = async () => {
    if (!user) return;
    try {
      const res = await API.get('/meals');
      setMeals(res.data);
    } catch (err) {
      console.error("Error fetching meals:", err.message);
    }
  };

  // 3. Fetch Kitchen Orders
  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    }
  };

  // 4. Fetch Inventory
  const fetchInventory = async () => {
    if (!user) return;
    try {
      const res = await API.get('/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err.message);
    }
  };

  // 5. Fetch Reports
  const fetchReports = async () => {
    if (!user) return;
    try {
      const res = await API.get('/reports');
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err.message);
    }
  };

  // 6. Fetch Notifications
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await API.get('/system/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err.message);
    }
  };

  // 7. Fetch Audit Logs
  const fetchHistoryLogs = async (filters = {}) => {
    if (!user) return;
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await API.get(`/system/history?${queryParams}`);
      setHistoryLogs(res.data);
    } catch (err) {
      console.error("Error fetching history logs:", err.message);
    }
  };

  // Mark single notification as read
  const markNotificationRead = async (id) => {
    try {
      await API.put(`/system/notifications/${id}/read`);
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error("Error marking notification read:", err.message);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsRead = async () => {
    try {
      await API.put('/system/notifications/read-all');
      setNotifications((prev) => prev.map(n => ({ ...n, is_read: 1 })));
      addToast("All notifications marked as read.", "success");
    } catch (err) {
      console.error("Error marking all notifications read:", err.message);
    }
  };

  // Helper CRUD for Patients
  const addPatient = async (patientData) => {
    try {
      const res = await API.post('/patients', patientData);
      await fetchPatients();
      addToast("Patient profile created successfully.", "success");
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to create patient.";
      addToast(errMsg, "error");
      throw new Error(errMsg);
    }
  };

  const updatePatient = async (id, patientData) => {
    try {
      const res = await API.put(`/patients/${id}`, patientData);
      await fetchPatients();
      addToast("Patient profile updated successfully.", "success");
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to update patient.";
      addToast(errMsg, "error");
      throw new Error(errMsg);
    }
  };

  const deletePatient = async (id) => {
    try {
      await API.delete(`/patients/${id}`);
      await fetchPatients();
      addToast("Patient profile deleted.", "info");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to delete patient.";
      addToast(errMsg, "error");
      throw new Error(errMsg);
    }
  };

  // Synchronize on authentication change
  useEffect(() => {
    if (user) {
      fetchPatients();
      fetchMeals();
      fetchOrders();
      fetchInventory();
      fetchNotifications();
      fetchReports();
      fetchHistoryLogs();

      // Poll notifications every 30 seconds for live feel
      const interval = setInterval(() => {
        fetchNotifications();
        fetchOrders();
        fetchInventory();
      }, 30000);
      
      return () => clearInterval(interval);
    } else {
      setPatients([]);
      setMeals([]);
      setOrders([]);
      setInventory([]);
      setReports([]);
      setNotifications([]);
      setHistoryLogs([]);
    }
  }, [user]);

  return (
    <AppStateContext.Provider value={{
      patients,
      meals,
      orders,
      inventory,
      reports,
      notifications,
      historyLogs,
      toasts,
      addToast,
      removeToast,
      fetchPatients,
      fetchMeals,
      fetchOrders,
      fetchInventory,
      fetchReports,
      fetchNotifications,
      fetchHistoryLogs,
      markNotificationRead,
      markAllNotificationsRead,
      addPatient,
      updatePatient,
      deletePatient
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
