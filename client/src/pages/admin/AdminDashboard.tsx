import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminStats } from '@/hooks/useAdmin';
import { useTheme } from '@/store/themeStore';
import { getApiErrorMessage } from '@/lib/apiError';
import { MdPeople, MdArticle, MdComment, MdArrowForward, MdRefresh, MdTrendingUp, MdDashboard, MdDarkMode, MdLightMode } from 'react-icons/md';
import { RiSparklingFill } from 'react-icons/ri';

interface StatCardProps {
  label: string; value?: number; desc: string;
  icon: React.ElementType; grad: string; glow: string;
  href?: string; linkText?: string;
  loading: boolean; error: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, desc, icon: Icon, grad, glow, href, linkText, loading, error }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${grad} p-6 text-white shadow-lg ${glow}`}>
    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
    <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5 blur-xl" />
    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-widest text-white/65">{label}</p>
        <p className="mt-3 text-5xl font-black tabular-nums" aria-live="polite">
          {loading ? <span className="inline-block h-11 w-20 animate-pulse rounded-xl bg-white/20" />
            : error ? '—'
            : (value ?? 0).toLocaleString()}
        </p>
        <p className="mt-1.5 text-sm text-white/65">{desc}</p>
      </div>
      <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-sm">
        <Icon size={26} />
      </span>
    </div>
    {href && linkText && (
      <Link to={href}
        className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/25">
        {linkText} <MdArrowForward size={13} />
      </Link>
    )}
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useAdminStats();
  const { theme, toggleTheme } = useTheme();
  const stats = data?.data;

  const cards = [
    { label: 'Total Users',    value: stats?.totalUsers,    desc: 'Registered accounts',       icon: MdPeople,  grad: 'from-violet-600 via-violet-700 to-indigo-700', glow: 'shadow-violet-500/25', href: '/admin/users',  linkText: 'Manage Users' },
    { label: 'Total Posts',    value: stats?.totalPosts,    desc: 'Published articles',         icon: MdArticle, grad: 'from-blue-600 via-blue-700 to-cyan-700',       glow: 'shadow-blue-500/25',   href: '/admin/posts',  linkText: 'Manage Posts' },
    { label: 'Total Comments', value: stats?.totalComments, desc: 'Community discussions',      icon: MdComment, grad: 'from-emerald-500 via-emerald-600 to-teal-700',  glow: 'shadow-emerald-500/25' },
  ];

  const quickLinks = [
    { href: '/admin/users',    icon: MdPeople,  title: 'User Management',      desc: 'Browse, inspect, and moderate all registered user accounts.',           grad: 'from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20', border: 'border-violet-200 dark:border-violet-800', bg: 'from-violet-500 to-indigo-600' },
    { href: '/admin/posts',    icon: MdArticle, title: 'Post Management',       desc: 'Review and moderate all articles submitted across the platform.',       grad: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',         border: 'border-blue-200 dark:border-blue-800',     bg: 'from-blue-500 to-cyan-600' },
    { href: '/admin/comments', icon: MdComment, title: 'Comment Moderation',    desc: 'Monitor community responses and keep discussions healthy.',             grad: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',   border: 'border-emerald-200 dark:border-emerald-800', bg: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl text-white shadow-lg" style={{ background: 'var(--grad-primary)' }}>
              <MdDashboard size={19} />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Administration</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="mt-2 text-muted-foreground flex items-center gap-1.5">
            Your community at a glance.
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              <RiSparklingFill size={13} /> Real-time
            </span>
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'dark'}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {theme === 'dark' ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
          </button>
          <button onClick={() => void refetch()}
            className="btn-primary flex-shrink-0 text-xs sm:text-sm">
            <MdRefresh size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {isError && (
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-destructive/25 bg-destructive/8 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-destructive">Could not load statistics</h2>
            <p className="mt-1 text-sm text-destructive/75">{getApiErrorMessage(error, 'Check connection and try again.')}</p>
          </div>
          <button onClick={() => void refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2 text-sm font-bold text-white hover:opacity-90">
            <MdRefresh size={15} /> Retry
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((c) => <StatCard key={c.label} {...c} loading={isLoading} error={isError} />)}
      </div>

      {/* Health banner */}
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
        <MdTrendingUp size={18} /> Platform healthy — all systems operational
      </div>

      {/* Quick links */}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {quickLinks.map(({ href, icon: Icon, title, desc, grad, border, bg }) => (
          <Link key={href} to={href}
            className={`group flex flex-col gap-4 rounded-2xl bg-gradient-to-br ${grad} border ${border} p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}>
            <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${bg} text-white shadow-md transition-transform duration-200 group-hover:scale-110`}>
              <Icon size={22} />
            </span>
            <div>
              <h3 className="font-bold text-foreground">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
              Go to {title} <MdArrowForward size={13} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
