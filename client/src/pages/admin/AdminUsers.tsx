import React, { useState } from 'react';
import { useAdminUsers, useAdminDeleteUser } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { useTheme } from '@/store/themeStore';
import { MdPeople, MdDeleteForever, MdShield, MdPerson, MdDarkMode, MdLightMode } from 'react-icons/md';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

export const AdminUsers: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useAdminUsers(page, limit);
  const deleteMutation = useAdminDeleteUser();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const users = data?.data || [];
  const meta = data?.meta;

  const providerIcon = (p: string) =>
    p === 'google' ? <FaGoogle size={12} className="text-blue-500" /> :
    p === 'facebook' ? <FaFacebook size={12} className="text-blue-700" /> :
    <MdPerson size={14} className="text-muted-foreground" />;

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
              <MdPeople size={19} />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Administration</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">User Management</h1>
          <p className="mt-2 text-muted-foreground">Inspect and moderate all registered users.</p>
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
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-3 text-center text-white shadow-lg shadow-violet-500/20">
            <p className="text-2xl font-black">{meta?.totalDocs ?? '—'}</p>
            <p className="text-xs text-white/65">Total Users</p>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border bg-muted/40 pb-4">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MdPeople size={19} className="text-primary" /> All Platform Accounts
          </CardTitle>
          <CardDescription>Total: <strong>{meta?.totalDocs || 0}</strong> accounts</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <TableSkeleton
              headers={['User', 'Email', 'Role', 'Provider', 'Registered', 'Actions']}
              tableClassName="min-w-[980px] table-fixed"
              columnWidths={['18%', '28%', '12%', '15%', '14%', '13%']}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] table-fixed text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="w-[18%] p-4 text-left text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">User</th>
                    <th scope="col" className="w-[28%] p-4 text-left text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">Email</th>
                    <th scope="col" className="w-[12%] p-4 text-left text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                    <th scope="col" className="w-[15%] p-4 text-left text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">Provider</th>
                    <th scope="col" className="w-[14%] p-4 text-left text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">Registered</th>
                    <th scope="col" className="w-[13%] p-4 text-center text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">No users found.</td>
                    </tr>
                  )}
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-border/60 transition-colors hover:bg-muted/30">
                      <td className="p-4 align-middle">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-black text-primary">
                            {u.name?.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="truncate font-semibold text-foreground" title={u.name}>{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        <span className="block truncate" title={u.email}>{u.email}</span>
                      </td>
                      <td className="p-4 align-middle">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                            <MdShield size={12} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                            <MdPerson size={12} /> User
                          </span>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground capitalize">
                          {providerIcon(u.provider)} {u.provider}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 align-middle text-center">
                        <Button variant="destructive" size="icon"
                          onClick={() => setPendingDelete({ id: u._id, name: u.name })}
                          disabled={deleteMutation.isPending}
                          aria-label={`Delete user: ${u.name}`}
                          title="Delete user">
                          <MdDeleteForever size={17} />
                        </Button>
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
                      aria-label="Users per page"
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
        title="Remove this account?"
        description={`"${pendingDelete?.name}" and their data will be permanently removed.`}
        confirmLabel="Remove account"
      />
    </div>
  );
};
