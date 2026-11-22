import React, { useState } from 'react';
import { useAdminPosts, useAdminDeletePost } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { MdArticle, MdDeleteForever, MdCheckCircle } from 'react-icons/md';

export const AdminPosts: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminPosts(page);
  const deleteMutation = useAdminDeletePost();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const posts = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25">
              <MdArticle size={19} />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Administration</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Post Management</h1>
          <p className="mt-2 text-muted-foreground">Inspect and moderate all articles on the platform.</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-700 px-5 py-3 text-center text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
          <p className="text-2xl font-black">{meta?.totalDocs ?? '—'}</p>
          <p className="text-xs text-white/65">Total Posts</p>
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border bg-muted/40 pb-4">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MdArticle size={19} className="text-blue-500" /> All Platform Articles
          </CardTitle>
          <CardDescription>Total: <strong>{meta?.totalDocs || 0}</strong> articles</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {[1,2,3,4,5].map((i) => <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Title', 'Author', 'Status', 'Created', 'Actions'].map((h) => (
                      <th key={h} className="p-4 text-left text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p._id} className="border-b border-border/60 transition-colors hover:bg-muted/30">
                      <td className="p-4 max-w-[240px]">
                        <span className="line-clamp-1 font-semibold text-foreground">{p.title}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg bg-blue-100 text-xs font-black text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            {(p.author?.name || 'A').slice(0, 1).toUpperCase()}
                          </span>
                          <span className="text-muted-foreground">{p.author?.name || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {p.isDeleted ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">Deleted</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <MdCheckCircle size={12} /> Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        {!p.isDeleted && (
                          <button onClick={() => setPendingDelete({ id: p._id, title: p.title })}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/8 px-3 py-1.5 text-xs font-bold text-destructive transition hover:bg-destructive/16 disabled:opacity-50">
                            <MdDeleteForever size={15} /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 border-t border-border p-5">
                  <Button variant="outline" size="sm" disabled={!meta.hasPrevPage} onClick={() => setPage((p) => p - 1)} className="rounded-xl">← Prev</Button>
                  <span className="rounded-xl border border-border bg-muted px-4 py-1.5 text-xs font-bold text-muted-foreground">
                    {meta.page} / {meta.totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={!meta.hasNextPage} onClick={() => setPage((p) => p + 1)} className="rounded-xl">Next →</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => { if (!o) setPendingDelete(null); }}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })}
        isPending={deleteMutation.isPending}
        title="Remove this post?"
        description={`"${pendingDelete?.title}" will be removed from the public feed.`}
        confirmLabel="Remove post"
      />
    </div>
  );
};
