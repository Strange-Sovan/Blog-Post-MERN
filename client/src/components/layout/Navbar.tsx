import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/store/themeStore';
import { MdAutoStories, MdLogout, MdCreate, MdShield, MdLogin, MdPersonAdd, MdDarkMode, MdLightMode } from 'react-icons/md';
import { RiSparklingFill } from 'react-icons/ri';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLinkClass = (isActive: boolean) =>
    `inline-flex items-center rounded-xl border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 ${
      isActive
        ? 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-400/40 dark:bg-sky-400/10 dark:text-sky-200'
        : 'border-transparent text-muted-foreground hover:bg-muted/70 hover:text-primary'
    }`;
  const isWriteActive = pathname === '/posts/create' || pathname.startsWith('/posts/edit/');
  const isLoginActive = pathname === '/login';
  const isRegisterActive = pathname === '/register';

  return (
    <nav className="navbar-surface sticky top-0 z-50">
      <div className="mx-auto flex h-[4.5rem] max-w-screen-2xl items-center justify-between px-4 sm:px-5 lg:px-6">

        {/* ── Logo ── */}
        <Link to="/" className="group flex items-center gap-2.5 text-lg font-black tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl text-white shadow-lg shadow-primary/30 transition duration-200 group-hover:-rotate-6 group-hover:scale-105"
            style={{ background: 'var(--grad-primary)' }}>
            <MdAutoStories size={20} />
          </span>
          <span className="text-foreground">
            Blog<span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--grad-primary)' }}>MERN</span>
          </span>
        </Link>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Admin badge */}
          {isAuthenticated && isAdmin && (
            <NavLink to="/admin" end
              className={({ isActive }) =>
                `hidden items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-primary/25 transition hover:-translate-y-0.5 sm:inline-flex ${
                  isActive ? 'ring-2 ring-sky-300 ring-offset-2 ring-offset-background' : ''
                }`
              }
              style={{ background: 'var(--grad-primary)' }}>
              <MdShield size={14} /> Dashboard
            </NavLink>
          )}

          {/* Home link */}
          <NavLink to="/" end className={({ isActive }) => `hidden sm:inline-flex ${navLinkClass(isActive)}`}>
            Home
          </NavLink>
          <NavLink to="/posts" end className={({ isActive }) => `hidden sm:inline-flex ${navLinkClass(isActive)}`}>
            Posts
          </NavLink>

          {isAuthenticated ? (
            <>
              <Link to="/posts/create"
                aria-current={isWriteActive ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isWriteActive
                    ? 'border border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-400/40 dark:bg-sky-400/10 dark:text-sky-200'
                    : 'text-muted-foreground hover:bg-primary/8 hover:text-primary'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2`}>
                <MdCreate size={18} />
                <span className="hidden sm:inline">Write</span>
              </Link>

              {/* Avatar + dropdown */}
              <div className="group relative">
                <button type="button" aria-label="Profile"
                  className="grid h-9 w-9 place-items-center rounded-xl text-sm font-black text-primary outline-none ring-primary/20 transition hover:ring-4 focus-visible:ring-4"
                  style={{ background: 'hsl(var(--primary)/0.12)' }}>
                  {user?.name?.slice(0, 1).toUpperCase()}
                </button>
                <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-52 translate-y-1 rounded-2xl border border-border bg-card p-4 opacity-0 shadow-xl transition duration-150 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl text-sm font-black text-primary"
                      style={{ background: 'hsl(var(--primary)/0.12)' }}>
                      {user?.name?.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">{user?.name}</p>
                      <p className="truncate text-xs capitalize text-muted-foreground">{user?.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={() => void logout()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:border-destructive/40 hover:text-destructive">
                <MdLogout size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}
                aria-current={isLoginActive ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isLoginActive
                    ? 'border border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-400/40 dark:bg-sky-400/10 dark:text-sky-200'
                    : 'border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2`}>
                <MdLogin size={16} /> Sign In
              </button>
              <button onClick={() => navigate('/register')}
                aria-current={isRegisterActive ? 'page' : undefined}
                className={`btn-primary text-xs sm:text-sm ${isRegisterActive ? 'ring-2 ring-sky-300 ring-offset-2 ring-offset-background' : ''}`}>
                <RiSparklingFill size={14} />
                <span className="hidden sm:inline">Join us</span>
                <span className="sm:hidden">Join</span>
              </button>
            </>
          )}

          {/* Theme toggle */}
          <button onClick={toggleTheme} aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground">
            {theme === 'dark' ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
