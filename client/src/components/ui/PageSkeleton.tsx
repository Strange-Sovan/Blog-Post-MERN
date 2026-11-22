import React from 'react';

export const PageSkeleton: React.FC = () => (
  <div className="page-shell" role="status" aria-label="Loading page">
    <span className="sr-only">Loading page...</span>
    <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-violet-100" />
    <div className="mb-10 h-40 animate-pulse rounded-3xl bg-gradient-to-r from-violet-100 to-indigo-100" />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-sm">
          <div className="h-40 animate-pulse bg-gradient-to-br from-slate-100 to-indigo-100" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-1/3 animate-pulse rounded bg-violet-100" />
            <div className="h-6 w-4/5 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
