import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminStats } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getApiErrorMessage } from '@/lib/apiError';
import { ArrowUpRight, FileText, MessageCircle, RefreshCw, Users } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useAdminStats();
  const stats = data?.data;
  const statCards = [
    {
      label: 'Total users',
      value: stats?.totalUsers,
      description: 'Registered accounts',
      icon: Users,
      href: '/admin/users',
      linkText: 'View all users',
      iconClass: 'bg-violet-100 text-violet-700',
    },
    {
      label: 'Total posts',
      value: stats?.totalPosts,
      description: 'Published posts',
      icon: FileText,
      href: '/admin/posts',
      linkText: 'View all posts',
      iconClass: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Total comments',
      value: stats?.totalComments,
      description: 'Community responses',
      icon: MessageCircle,
      iconClass: 'bg-emerald-100 text-emerald-700',
    },
  ];

  return (
    <div className="page-shell max-w-6xl">
      <div className="hero-panel mb-9 rounded-3xl p-8 text-white sm:p-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">Administration</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Dashboard overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          <span className="text-indigo-100">Your community, at a glance.</span>
        </p>
      </div>

      {isError && (
        <div className="surface-card mb-6 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Dashboard statistics could not be loaded</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {getApiErrorMessage(error, 'Please check your connection and try again.')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map(({ label, value, description, icon: Icon, href, linkText, iconClass }) => (
          <Card key={label} className="surface-card overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardDescription>{label}</CardDescription>
                  <CardTitle className="mt-3 text-4xl font-bold tabular-nums" aria-live="polite">
                    {isLoading ? (
                      <span className="inline-block h-9 w-20 animate-pulse rounded bg-muted" aria-label="Loading" />
                    ) : isError ? (
                      '—'
                    ) : (
                      (value ?? 0).toLocaleString()
                    )}
                  </CardTitle>
                </div>
                <span className={`rounded-xl p-3 ${iconClass}`}>
                  <Icon size={22} aria-hidden="true" />
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardHeader>
            {href && linkText && (
              <CardContent>
                <Link to={href} className="text-xs font-semibold text-primary hover:underline">
                  {linkText} <ArrowUpRight size={14} className="inline" />
                </Link>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-10">
        <Link
          to="/admin/users"
          className="p-6 border rounded-lg hover:border-primary transition-all bg-card shadow-sm hover:shadow"
        >
          <h3 className="font-bold text-lg mb-1">Manage Users &rarr;</h3>
          <p className="text-sm text-muted-foreground">
            Browse all user accounts, inspect roles, providers, and remove accounts if necessary.
          </p>
        </Link>
        <Link
          to="/admin/posts"
          className="p-6 border rounded-lg hover:border-primary transition-all bg-card shadow-sm hover:shadow"
        >
          <h3 className="font-bold text-lg mb-1">Manage Posts &rarr;</h3>
          <p className="text-sm text-muted-foreground">
            Review all articles across the platform, monitor deleted posts, and execute admin moderation.
          </p>
        </Link>
      </div>
    </div>
  );
};
