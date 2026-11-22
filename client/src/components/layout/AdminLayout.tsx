import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
