import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, LogOut, PenLine, Shield, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-indigo-200/70 bg-white/80 shadow-sm shadow-indigo-950/[0.03] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-extrabold tracking-tight text-foreground">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25"><BookOpen size={20} /></span>
          <span>Blog<span className="text-primary">MERN</span></span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="hidden text-sm font-semibold text-muted-foreground transition hover:text-primary sm:block">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/posts/create" className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-primary/5 hover:text-primary sm:px-3">
                <PenLine size={16} /><span className="hidden sm:inline">Write</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-sm">
                  <Badge variant="destructive"><Shield size={12} className="mr-1" />Admin</Badge>
                </Link>
              )}
              <span className="hidden items-center gap-2 text-sm font-semibold text-muted-foreground sm:inline-flex">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{user?.name?.slice(0, 1).toUpperCase()}</span>
                {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl">
                <LogOut size={15} /><span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="rounded-xl">
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/register')} className="rounded-xl">
                <Sparkles size={15} /> Join us
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
