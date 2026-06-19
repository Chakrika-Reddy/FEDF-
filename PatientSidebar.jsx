import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  Menu, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  User, 
  CheckCheck,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  PackageCheck,
  Settings
} from 'lucide-react';

function Navbar({ toggleSidebar }) {
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Global search trigger
  useEffect(() => {
    const triggerSearch = async () => {
      if (!searchQuery || searchQuery.trim() === '') {
        setSearchResults(null);
        return;
      }
      try {
        const res = await API.get(`/system/search?q=${searchQuery}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Global search error:", err.message);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      triggerSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click outside handlers to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'Allergy': return <AlertTriangle className="text-amber-500" size={16} />;
      case 'Approval': return <ClipboardList className="text-blue-500" size={16} />;
      case 'Order': return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'Inventory': return <PackageCheck className="text-rose-500" size={16} />;
      default: return <Bell className="text-slate-400" size={16} />;
    }
  };

  const handleSearchResultClick = (type, id) => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults(null);

    if (type === 'patient') navigate(`/patients?id=${id}`);
    else if (type === 'meal') navigate(`/meal-planner?highlight=${id}`);
    else if (type === 'order') navigate(`/kitchen?id=${id}`);
    else if (type === 'report') navigate(`/reports?id=${id}`);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm shadow-slate-100/10">
      
      {/* Brand & Toggle */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Global Search Bar */}
      <div className="relative flex-1 max-w-md mx-6" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search patients, meals, kitchen tickets, reports..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:outline-none rounded-xl transition-all"
          />
        </div>

        {/* Global Search Dropdown */}
        {searchOpen && searchResults && (
          <div className="absolute left-0 right-0 mt-2 p-2 max-h-96 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50">
            {/* Patients section */}
            {searchResults.patients?.length > 0 && (
              <div className="mb-3">
                <h5 className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Patients</h5>
                {searchResults.patients.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSearchResultClick('patient', p.id)}
                    className="flex flex-col w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{p.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400">{p.room_number} • {p.disease}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Meals Section */}
            {searchResults.meals?.length > 0 && (
              <div className="mb-3">
                <h5 className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Meals</h5>
                {searchResults.meals.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleSearchResultClick('meal', m.id)}
                    className="flex flex-col w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{m.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400">{m.calories} kcal</span>
                  </button>
                ))}
              </div>
            )}

            {/* Orders Section */}
            {searchResults.orders?.length > 0 && (
              <div className="mb-3">
                <h5 className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Kitchen Tickets</h5>
                {searchResults.orders.map(o => (
                  <button
                    key={o.id}
                    onClick={() => handleSearchResultClick('order', o.id)}
                    className="flex flex-col w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Ticket #{o.id} - {o.meal_type}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400">{o.patient_name} ({o.room_number}) • {o.status}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Reports Section */}
            {searchResults.reports?.length > 0 && (
              <div>
                <h5 className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Reports</h5>
                {searchResults.reports.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSearchResultClick('report', r.id)}
                    className="flex flex-col w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{r.report_name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400">{r.report_type} • Compiled {new Date(r.created_at).toLocaleDateString()}</span>
                  </button>
                ))}
              </div>
            )}

            {searchResults.patients?.length === 0 && 
             searchResults.meals?.length === 0 && 
             searchResults.orders?.length === 0 && 
             searchResults.reports?.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500">No results found for "{searchQuery}"</div>
            )}
          </div>
        )}
      </div>

      {/* Header Utilities */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Dark Mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center bg-rose-500 text-white text-[9px] font-bold rounded-full border border-white dark:border-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Alert Center</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotificationsRead}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors"
                  >
                    <CheckCheck size={12} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">All clear! No alerts.</div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => !notif.is_read && markNotificationRead(notif.id)}
                      className={`flex gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${!notif.is_read ? 'bg-primary-50/20 dark:bg-primary-950/10' : ''}`}
                    >
                      <div className="shrink-0 mt-0.5">{getNotifIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${!notif.is_read ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1">
                          {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {!notif.is_read && (
                        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-1.5 shrink-0"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

        {/* Profile Navigation */}
        <Link 
          to="/settings?tab=profile"
          className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-1 pr-2 rounded-xl transition-colors"
          title="Account Profile"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 font-bold rounded-full">
            {user?.name?.substring(0,2).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:flex flex-col text-left leading-none">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>
            <span className="text-[9px] font-medium text-slate-400 capitalize">{user?.role}</span>
          </div>
        </Link>

      </div>
    </header>
  );
}

export default Navbar;
