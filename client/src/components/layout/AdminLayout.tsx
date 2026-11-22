import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout: React.FC = () => (
  <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-violet-50/40 to-indigo-50/30 dark:from-[#07060f] dark:via-[#0d0b1e] dark:to-[#0a0918]">
    <AdminSidebar />
    <div className="flex-1 overflow-auto">
      <main className="p-4 sm:p-5 lg:p-6">
        <Outlet />
      </main>
    </div>
  </div>
);
