import React, { useEffect, useState } from 'react';
import { useAdminPosts, useAdminDeletePost } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { MdArticle, MdDeleteForever, MdCheckCircle, MdSearch } from 'react-icons/md';

export const AdminPosts: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminPosts(page, limit, search);
  const deleteMutation = useAdminDeletePost();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const posts = data?.data || [];
  const meta = data?.meta;

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(searchTerm.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  const handleDelete = () => {
    if (pendingDelete) {
      deleteMutation.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30">
              <MdArticle size={20} />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Administration</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Post Management</h1>
          <p className="mt-2 text-muted-foreground">Inspect and moderate all articles submitted across the platform.</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-700 px-5 py-3 text-center text-white shadow-lg shadow-blue-500/25">
          <p className="text-2xl font-black">{meta?.totalDocs ?? '—'}</p>
          <p className="text-xs font-semibold text-white/70">Total Posts</p>
        </div>
      </div>

      <label className="mb-6 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm">
        <MdSearch size={20} className="text-muted-foreground" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.currentTarget.value);
            setPage(1);
          }}
          placeholder="Search posts by title or content"
          aria-label="Search posts by title or content"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>

      <Card className="overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-xl backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <MdArticle size={20} className="text-blue-600" /> All Platform Articles
          </CardTitle>
          <CardDescription>Total articles: <strong>{meta?.totalDocs || 0}</strong></CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <TableSkeleton headers={['Title', 'Author', 'Status', 'Created', 'Actions']} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
                    {['Title', 'Author', 'Status', 'Created', 'Actions'].map((h) => (
                      <th key={h} className="p-4 text-left text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">
                        {search ? 'No posts matched your search.' : 'No posts to display.'}
                      </td>
                    </tr>
                  ) : posts.map((p) => (
                    <tr key={p._id} className="border-b border-slate-50 transition-colors hover:bg-blue-50/30">
                      <td className="p-4 max-w-[260px]">
                        <span className="line-clamp-1 font-semibold text-slate-800">{p.title}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 text-xs font-black text-blue-700">
                            {(p.author?.name || 'A').slice(0, 1).toUpperCase()}
                          </span>
                          <span className="text-muted-foreground">{p.author?.name || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {p.isDeleted ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-600">Deleted</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                            <MdCheckCircle size={13} /> Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        {!p.isDeleted && (
                          <button
                            onClick={() => setPendingDelete({ id: p._id, title: p.title })}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            <MdDeleteForever size={15} /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 p-4 sm:flex-row">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  Rows per page
                  <select
                    value={limit}
                    onChange={(event) => {
                      setLimit(Number(event.currentTarget.value));
                      setPage(1);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700"
                  >
                    {[5, 10, 20, 50, 100].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" disabled={!meta?.hasPrevPage} onClick={() => setPage((p) => p - 1)} className="rounded-xl">← Previous</Button>
                  <span className="rounded-xl bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 border border-blue-200">
                    Page {meta?.page ?? page} of {meta?.totalPages ?? 1}
                  </span>
                  <Button variant="outline" size="sm" disabled={!meta?.hasNextPage} onClick={() => setPage((p) => p + 1)} className="rounded-xl">Next →</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => { if (!open) setPendingDelete(null); }}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title="Remove this post?"
        description={`"${pendingDelete?.title || ''}" will be removed from the public feed.`}
        confirmLabel="Remove post"
      />
    </div>
  );
};
