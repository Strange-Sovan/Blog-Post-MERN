import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdPeople, MdArticle, MdHome, MdMenu, MdClose, MdShield } from 'react-icons/md';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  gradient: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: MdDashboard, gradient: 'from-violet-500 to-indigo-600' },
  { label: 'User Management', href: '/admin/users', icon: MdPeople, gradient: 'from-blue-500 to-cyan-600' },
  { label: 'Post Management', href: '/admin/posts', icon: MdArticle, gradient: 'from-emerald-500 to-teal-600' },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-violet-500/40 lg:hidden"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col bg-gradient-to-b from-[#0f0e1f] via-[#161436] to-[#1b1950] text-white shadow-2xl transition-all duration-300
          ${collapsed ? '-translate-x-full' : 'translate-x-0'} lg:sticky lg:top-0 lg:translate-x-0
          ${collapsed ? 'w-0 lg:w-20' : 'w-64'} lg:w-64`}
      >
        {/* Logo */}
        <div className="flex h-[4.5rem] items-center gap-3 border-b border-white/10 px-5">
          <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
            <MdShield size={20} />
          </span>
          <span className="text-base font-black tracking-tight">Admin Panel</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-2 text-[0.6rem] font-bold uppercase tracking-widest text-white/30">Navigation</p>
          <div className="space-y-1">
            {navItems.map(({ label, href, icon: Icon, gradient }) => {
              const active = location.pathname === href || (href !== '/admin' && location.pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  to={href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200
                    ${active
                      ? 'bg-white/15 text-white shadow-inner'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                    }`}
                >
                  <span className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br ${gradient} shadow-md transition-transform duration-200 group-hover:scale-105 ${active ? 'scale-105' : ''}`}>
                    <Icon size={18} />
                  </span>
                  {label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="mb-3 px-2 text-[0.6rem] font-bold uppercase tracking-widest text-white/30">Quick Links</p>
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/60 transition-all hover:bg-white/8 hover:text-white"
            >
              <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-white/10">
                <MdHome size={18} />
              </span>
              Back to Site
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-[0.65rem] text-white/25">BlogMERN Admin • v1.0</p>
        </div>
      </aside>
    </>
  );
};
