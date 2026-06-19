import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CookingPot, 
  CheckSquare, 
  Boxes, 
  FileText, 
  History, 
  TrendingUp, 
  Settings, 
  LogOut,
  HeartPulse,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function Sidebar({ isOpen, toggleSidebar }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  // Define navigation links and role authorizations
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Doctor', 'Dietician', 'Kitchen Staff', 'Patient'] },
    { name: 'Patients', path: '/patients', icon: Users, roles: ['Admin', 'Doctor', 'Dietician'] },
    { name: 'Meal Planner', path: '/meal-planner', icon: Calendar, roles: ['Admin', 'Dietician'] },
    { name: 'Kitchen', path: '/kitchen', icon: CookingPot, roles: ['Admin', 'Kitchen Staff', 'Dietician'] },
    { name: 'Approvals', path: '/approvals', icon: CheckSquare, roles: ['Admin', 'Doctor', 'Dietician'] },
    { name: 'Inventory', path: '/inventory', icon: Boxes, roles: ['Admin', 'Kitchen Staff', 'Dietician'] },
    { name: 'Reports', path: '/reports', icon: FileText, roles: ['Admin', 'Doctor', 'Dietician'] },
    { name: 'History', path: '/history', icon: History, roles: ['Admin', 'Doctor', 'Dietician'] },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp, roles: ['Admin', 'Doctor', 'Dietician'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Admin', 'Doctor', 'Dietician', 'Kitchen Staff', 'Patient'] },
  ];

  // Filter links based on user role
  const allowedItems = menuItems.filter(item => !user || item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60 transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header Brand */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary-600 text-white rounded-lg shadow-md shadow-primary-500/20">
              <HeartPulse size={20} />
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-800 dark:text-white leading-none tracking-tight">NUTRIPLANNER</h1>
              <span className="text-[10px] font-medium text-success-600 dark:text-success-500">DIETARY SYSTEM</span>
            </div>
          </div>
          
          {/* Close button for mobile views */}
          <button 
            onClick={toggleSidebar}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg lg:hidden"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {allowedItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-150
                ${isActive 
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400 shadow-sm shadow-primary-100/10' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100'}
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

        {/* Sidebar User Card Footer */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20">
          {user && (
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 font-bold shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">{user.name}</h4>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{user.role}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border border-rose-200/40 dark:border-rose-900/30 rounded-xl transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
