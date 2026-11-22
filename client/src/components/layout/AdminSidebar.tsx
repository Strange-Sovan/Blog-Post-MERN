import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdPeople, MdArticle, MdComment, MdHome, MdMenu, MdClose, MdShield } from 'react-icons/md';

const navItems = [
  { label: 'Dashboard',      href: '/admin',          icon: MdDashboard, grad: 'from-violet-500 to-indigo-600' },
  { label: 'User Management', href: '/admin/users',   icon: MdPeople,    grad: 'from-blue-500 to-cyan-600' },
  { label: 'Post Management', href: '/admin/posts',   icon: MdArticle,   grad: 'from-emerald-500 to-teal-600' },
  { label: 'Comments',        href: '/admin/comments', icon: MdComment,  grad: 'from-orange-500 to-amber-600' },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full text-white shadow-xl lg:hidden"
        style={{ background: 'var(--grad-primary)' }}
        aria-label="Toggle navigation">
        {open ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Overlay (mobile) */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar fixed left-0 top-0 z-40 flex h-screen min-h-screen w-64 flex-col text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className="flex h-[4.5rem] items-center gap-3 border-b border-white/10 px-5">
          <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl text-white shadow-lg"
            style={{ background: 'var(--grad-primary)' }}>
            <MdShield size={18} />
          </span>
          <span className="text-base font-black tracking-tight">Admin Panel</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-2 text-[0.6rem] font-bold uppercase tracking-widest text-white/30">Navigation</p>
          <div className="space-y-1">
            {navItems.map(({ label, href, icon: Icon, grad }) => {
              const active = href === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(href);
              return (
                <Link key={href} to={href} onClick={() => setOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all
                    ${active ? 'bg-sky-400/10 text-white ring-1 ring-inset ring-sky-300/35' : 'text-white/55 hover:bg-white/8 hover:text-white'}`}>
                  <span className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br ${grad} shadow transition-transform group-hover:scale-105 ${active ? 'scale-105' : ''}`}>
                    <Icon size={17} />
                  </span>
                  {label}
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-300" />}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="mb-3 px-2 text-[0.6rem] font-bold uppercase tracking-widest text-white/30">Quick Links</p>
            <Link to="/" onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/55 transition hover:bg-white/8 hover:text-white">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10">
                <MdHome size={17} />
              </span>
              Back to Site
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-[0.62rem] text-white/25">BlogMERN Admin · v1.0</p>
        </div>
      </aside>
    </>
  );
};
