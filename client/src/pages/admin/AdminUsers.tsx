import React, { useState } from 'react';
import { useAdminUsers, useAdminDeleteUser } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { MdPeople, MdDeleteForever, MdShield, MdPerson } from 'react-icons/md';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

export const AdminUsers: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers(page);
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
      <div className="mb-8 flex items-start justify-between gap-4">
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
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-3 text-center text-white shadow-lg shadow-violet-500/20 flex-shrink-0">
          <p className="text-2xl font-black">{meta?.totalDocs ?? '—'}</p>
          <p className="text-xs text-white/65">Total Users</p>
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
            <div className="space-y-3 p-6">
              {[1,2,3,4,5].map((i) => <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['User', 'Email', 'Role', 'Provider', 'Registered', 'Actions'].map((h) => (
                      <th key={h} className="p-4 text-left text-[0.67rem] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-border/60 transition-colors hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-black text-primary">
                            {u.name?.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="font-semibold text-foreground">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{u.email}</td>
                      <td className="p-4">
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
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground capitalize">
                          {providerIcon(u.provider)} {u.provider}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button onClick={() => setPendingDelete({ id: u._id, name: u.name })}
                          disabled={deleteMutation.isPending}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/8 px-3 py-1.5 text-xs font-bold text-destructive transition hover:bg-destructive/16 disabled:opacity-50">
                          <MdDeleteForever size={15} /> Delete
                        </button>
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
        title="Remove this account?"
        description={`"${pendingDelete?.name}" and their data will be permanently removed.`}
        confirmLabel="Remove account"
      />
    </div>
  );
};
