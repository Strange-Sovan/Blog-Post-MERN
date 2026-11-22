import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { MdAutoStories, MdLogout, MdCreate, MdShield, MdLogin, MdPersonAdd } from 'react-icons/md';
import { RiSparklingFill } from 'react-icons/ri';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); };

  return (
    <nav className="navbar-surface sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3 text-lg font-black tracking-tight text-foreground">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-lg shadow-violet-500/30 transition duration-200 group-hover:-rotate-6 group-hover:scale-105">
            <MdAutoStories size={22} />
          </span>
          <span>
            Blog<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">MERN</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-700 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-500/25 transition hover:-translate-y-0.5"
            >
              <MdShield size={14} /> Dashboard
            </Link>
          )}

          <Link to="/" className="hidden text-sm font-semibold text-muted-foreground transition hover:text-primary sm:block">
            Home
          </Link>
          <Link to="/posts" className="hidden text-sm font-semibold text-muted-foreground transition hover:text-primary sm:block">
            All Posts
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/posts/create"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-violet-50 hover:text-violet-600"
              >
                <MdCreate size={18} />
                <span className="hidden sm:inline">Write</span>
              </Link>

              {/* Avatar dropdown */}
              <div className="group relative">
                <button
                  type="button"
                  aria-label="User profile"
                  className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-sm font-black text-violet-700 outline-none ring-violet-300 transition hover:ring-4 focus-visible:ring-4"
                >
                  {user?.name?.slice(0, 1).toUpperCase()}
                </button>
                <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-52 translate-y-1 rounded-2xl border border-border/80 bg-white p-4 text-card-foreground opacity-0 shadow-xl transition duration-150 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-base font-black text-violet-700">
                      {user?.name?.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{user?.name}</p>
                      <p className="truncate text-xs capitalize text-muted-foreground">{user?.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl gap-1.5">
                <MdLogout size={15} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="rounded-xl gap-1.5">
                <MdLogin size={16} /> Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/register')} className="rounded-xl gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:-translate-y-0.5">
                <RiSparklingFill size={15} /> Join us
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
