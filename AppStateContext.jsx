import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Apple, 
  History, 
  FileText, 
  User, 
  Settings, 
  LogOut,
  HeartPulse,
  ChevronLeft
} from 'lucide-react';

function PatientSidebar({ isOpen, toggleSidebar }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/patient-login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/patient-dashboard', icon: LayoutDashboard },
    { name: 'My Diet', path: '/my-diet', icon: Apple },
    { name: 'Meal History', path: '/meal-history', icon: History },
    { name: 'Doctor Notes', path: '/doctor-notes', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-45 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary-500 text-white rounded-lg shadow-md shadow-primary-500/20">
              <HeartPulse size={20} />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white leading-none tracking-tight">NUTRIPLANNER</h1>
              <span className="text-[10px] font-medium text-success-400">PATIENT PORTAL</span>
            </div>
          </div>
          
          <button 
            onClick={toggleSidebar}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-150
                ${isActive 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'}
              `}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
            >
              <item.icon size={18} className="shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-850 bg-slate-950/40">
          {user && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 text-white font-bold shrink-0">
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-semibold text-white truncate leading-tight">{user.name}</h4>
                <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">Inpatient</span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-semibold text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 rounded-xl transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default PatientSidebar;
