import React, { useState } from 'react';
import PatientSidebar from './PatientSidebar';
import Navbar from './Navbar';
import NotificationToast from './NotificationToast';

function PatientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <PatientSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-5 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
      <NotificationToast />
    </div>
  );
}

export default PatientLayout;
