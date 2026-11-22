import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminStats } from '@/hooks/useAdmin';
import { getApiErrorMessage } from '@/lib/apiError';
import {
  MdPeople, MdArticle, MdComment, MdArrowForward,
  MdRefresh, MdTrendingUp, MdDashboard
} from 'react-icons/md';
import { RiSparklingFill } from 'react-icons/ri';

interface StatCardProps {
  label: string;
  value: number | undefined;
  description: string;
  icon: React.ElementType;
  gradient: string;
  glow: string;
  href?: string;
  linkText?: string;
  isLoading: boolean;
  isError: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label, value, description, icon: Icon, gradient, glow, href, linkText, isLoading, isError,
}) => (
  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-xl ${glow}`}>
    <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
    <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5 blur-xl" />
    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">{label}</p>
        <p className="mt-3 text-5xl font-black tabular-nums" aria-live="polite">
          {isLoading ? (
            <span className="inline-block h-11 w-20 animate-pulse rounded-xl bg-white/20" />
          ) : isError ? '—' : (value ?? 0).toLocaleString()}
        </p>
        <p className="mt-2 text-sm text-white/70">{description}</p>
      </div>
      <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner">
        <Icon size={26} />
      </span>
    </div>
    {href && linkText && (
      <Link
        to={href}
        className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
      >
        {linkText} <MdArrowForward size={14} />
      </Link>
    )}
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useAdminStats();
  const stats = data?.data;

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers,
      description: 'Registered community accounts',
      icon: MdPeople,
      gradient: 'from-violet-600 via-violet-700 to-indigo-700',
      glow: 'shadow-violet-500/30',
      href: '/admin/users',
      linkText: 'Manage Users',
    },
    {
      label: 'Total Posts',
      value: stats?.totalPosts,
      description: 'Articles published on the platform',
      icon: MdArticle,
      gradient: 'from-blue-600 via-blue-700 to-cyan-700',
      glow: 'shadow-blue-500/30',
      href: '/admin/posts',
      linkText: 'Manage Posts',
    },
    {
      label: 'Total Comments',
      value: stats?.totalComments,
      description: 'Community responses & discussions',
      icon: MdComment,
      gradient: 'from-emerald-500 via-emerald-600 to-teal-700',
      glow: 'shadow-emerald-500/30',
    },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30">
              <MdDashboard size={20} />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Administration</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="mt-2 text-muted-foreground">
            Your community, at a glance.{' '}
            <span className="inline-flex items-center gap-1 text-violet-500 font-semibold">
              <RiSparklingFill size={14} /> Real-time stats
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5"
        >
          <MdRefresh size={16} /> Refresh
        </button>
      </div>

      {isError && (
        <div className="mb-8 flex flex-col items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-red-700">Could not load statistics</h2>
            <p className="mt-1 text-sm text-red-500">{getApiErrorMessage(error, 'Check your connection and try again.')}</p>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
          >
            <MdRefresh size={15} /> Retry
          </button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} isLoading={isLoading} isError={isError} />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700">
        <MdTrendingUp size={18} />
        Platform is healthy — all systems operational
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          {
            href: '/admin/users',
            icon: MdPeople,
            title: 'User Management',
            desc: 'Browse, inspect, and moderate all registered user accounts and their roles.',
            gradient: 'from-violet-50 to-indigo-50',
            border: 'border-violet-200',
            iconBg: 'from-violet-500 to-indigo-600',
          },
          {
            href: '/admin/posts',
            icon: MdArticle,
            title: 'Post Management',
            desc: 'Review, moderate, and manage all articles submitted across the platform.',
            gradient: 'from-blue-50 to-cyan-50',
            border: 'border-blue-200',
            iconBg: 'from-blue-500 to-cyan-600',
          },
          {
            href: '/admin/comments',
            icon: MdComment,
            title: 'Comment Moderation',
            desc: 'Monitor community responses, flag inappropriate content, keep discussions healthy.',
            gradient: 'from-emerald-50 to-teal-50',
            border: 'border-emerald-200',
            iconBg: 'from-emerald-500 to-teal-600',
          },
        ].map(({ href, icon: Icon, title, desc, gradient, border, iconBg }) => (
          <Link
            key={href}
            to={href}
            className={`group flex flex-col gap-4 rounded-2xl bg-gradient-to-br ${gradient} border ${border} p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
          >
            <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${iconBg} text-white shadow-md transition-transform duration-200 group-hover:scale-110`}>
              <Icon size={22} />
            </span>
            <div>
              <h3 className="font-bold text-slate-800">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
              Go to {title} <MdArrowForward size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
