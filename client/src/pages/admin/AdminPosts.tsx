import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminPosts, useAdminDeletePost } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { useTheme } from '@/store/themeStore';
import { MdArticle, MdDeleteForever, MdCheckCircle, MdEdit, MdVisibility, MdDarkMode, MdLightMode } from 'react-icons/md';

export const AdminPosts: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useAdminPosts(page, limit);
  const deleteMutation = useAdminDeletePost();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const posts = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
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
        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'dark'}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {theme === 'dark' ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
          </button>
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-700 px-5 py-3 text-center text-white shadow-lg shadow-blue-500/20">
            <p className="text-2xl font-black">{meta?.totalDocs ?? '—'}</p>
            <p className="text-xs text-white/65">Total Posts</p>
          </div>
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
            <TableSkeleton
              headers={['Title', 'Author', 'Status', 'Created', 'Actions']}
              tableClassName="min-w-[1040px] table-fixed"
              columnWidths={['30%', '20%', '13%', '17%', '18%']}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] table-fixed text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="w-[30%] p-4 text-left text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">Title</th>
                    <th scope="col" className="w-[20%] p-4 text-left text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">Author</th>
                    <th scope="col" className="w-[13%] p-4 text-left text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th scope="col" className="w-[17%] p-4 text-left text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">Created</th>
                    <th scope="col" className="w-[18%] p-4 text-center text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">No posts found.</td>
                    </tr>
                  )}
                  {posts.map((p) => (
                    <tr key={p._id} className="border-b border-border/60 transition-colors hover:bg-muted/30">
                      <td className="max-w-0 p-4 align-middle">
                        <span className="block truncate font-semibold text-foreground" title={p.title}>{p.title}</span>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg bg-blue-100 text-xs font-black text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            {(p.author?.name || 'A').slice(0, 1).toUpperCase()}
                          </span>
                          <span className="truncate text-muted-foreground" title={p.author?.name || 'Anonymous'}>{p.author?.name || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {p.isDeleted ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">Deleted</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <MdCheckCircle size={12} /> Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 align-middle text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 align-middle text-center">
                        {!p.isDeleted && (
                          <div className="flex items-center justify-center gap-2">
                            <Button asChild variant="outline" size="icon" className="border-border bg-card text-card-foreground hover:bg-muted hover:text-foreground">
                              <Link to={`/posts/${p.slug}`} aria-label={`View post: ${p.title}`} title="View post">
                                <MdVisibility size={17} />
                              </Link>
                            </Button>
                            <Button asChild size="icon">
                              <Link to={`/posts/edit/${p._id}`} aria-label={`Edit post: ${p.title}`} title="Edit post">
                                <MdEdit size={17} />
                              </Link>
                            </Button>
                            <Button variant="destructive" size="icon"
                              onClick={() => setPendingDelete({ id: p._id, title: p.title })}
                              disabled={deleteMutation.isPending}
                              aria-label={`Delete post: ${p.title}`}
                              title="Delete post">
                              <MdDeleteForever size={17} />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {meta && (
                <div className="flex flex-col items-center justify-between gap-4 border-t border-border p-5 sm:flex-row">
                  <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    Rows per page
                    <select
                      aria-label="Posts per page"
                      value={limit}
                      onChange={(event) => {
                        setLimit(Number(event.currentTarget.value));
                        setPage(1);
                      }}
                      className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm font-semibold text-card-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:[color-scheme:dark]"
                    >
                      {[5, 10, 20, 50, 100].map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" disabled={!meta.hasPrevPage} onClick={() => setPage((p) => p - 1)} className="rounded-xl border-blue-600 bg-blue-600 text-white hover:border-blue-500 hover:bg-blue-500 hover:text-white dark:border-blue-500 dark:bg-blue-600 dark:text-white dark:hover:border-blue-400 dark:hover:bg-blue-500 dark:hover:text-white disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100 dark:disabled:border-slate-700 dark:disabled:bg-slate-800 dark:disabled:text-slate-500">← Prev</Button>
                    <span className="rounded-xl border border-blue-500 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-500 dark:bg-blue-900/70 dark:text-blue-100">
                      {meta.page} / {Math.max(meta.totalPages, 1)}
                    </span>
                    <Button variant="outline" size="sm" disabled={!meta.hasNextPage} onClick={() => setPage((p) => p + 1)} className="rounded-xl border-blue-600 bg-blue-600 text-white hover:border-blue-500 hover:bg-blue-500 hover:text-white dark:border-blue-500 dark:bg-blue-600 dark:text-white dark:hover:border-blue-400 dark:hover:bg-blue-500 dark:hover:text-white disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100 dark:disabled:border-slate-700 dark:disabled:bg-slate-800 dark:disabled:text-slate-500">Next →</Button>
                  </div>
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
