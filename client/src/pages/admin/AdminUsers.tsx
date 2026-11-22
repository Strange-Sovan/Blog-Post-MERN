import React, { useEffect, useState } from 'react';
import { useAdminUsers, useAdminDeleteUser } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { MdPeople, MdDeleteForever, MdShield, MdPerson, MdSearch } from 'react-icons/md';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

export const AdminUsers: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminUsers(page, limit, search);
  const deleteMutation = useAdminDeleteUser();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const users = data?.data || [];
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

  const getProviderIcon = (provider: string) => {
    if (provider === 'google') return <FaGoogle size={13} className="text-blue-500" />;
    if (provider === 'facebook') return <FaFacebook size={13} className="text-blue-700" />;
    return <MdPerson size={15} className="text-slate-500" />;
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30">
              <MdPeople size={20} />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Administration</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">User Management</h1>
          <p className="mt-2 text-muted-foreground">Inspect and moderate all registered users across the platform.</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-3 text-center text-white shadow-lg shadow-violet-500/25">
          <p className="text-2xl font-black">{meta?.totalDocs ?? '—'}</p>
          <p className="text-xs font-semibold text-white/70">Total Users</p>
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
          placeholder="Search users by name or email"
          aria-label="Search users by name or email"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>

      <Card className="overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-xl backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/40 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <MdPeople size={20} className="text-violet-600" /> All Platform Accounts
          </CardTitle>
          <CardDescription>Total accounts: <strong>{meta?.totalDocs || 0}</strong></CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <TableSkeleton headers={['User', 'Email', 'Role', 'Provider', 'Registered', 'Actions']} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30">
                    {['User', 'Email', 'Role', 'Provider', 'Registered', 'Actions'].map((h) => (
                      <th key={h} className="p-4 text-left text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                        {search ? 'No users matched your search.' : 'No users to display.'}
                      </td>
                    </tr>
                  ) : users.map((u) => (
                    <tr key={u._id} className="border-b border-slate-50 transition-colors hover:bg-violet-50/40">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-sm font-black text-violet-700">
                            {u.name?.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="font-semibold text-slate-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{u.email}</td>
                      <td className="p-4">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-violet-100 to-indigo-100 px-3 py-1 text-xs font-bold text-violet-700">
                            <MdShield size={13} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            <MdPerson size={13} /> User
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 capitalize">
                          {getProviderIcon(u.provider)} {u.provider}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button
                          onClick={() => setPendingDelete({ id: u._id, name: u.name })}
                          disabled={deleteMutation.isPending}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          <MdDeleteForever size={15} /> Delete
                        </button>
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
                  <span className="rounded-xl bg-violet-50 px-4 py-1.5 text-xs font-bold text-violet-700 border border-violet-200">
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
        title="Remove this account?"
        description={`"${pendingDelete?.name || ''}" and their account data will be permanently removed.`}
        confirmLabel="Remove account"
      />
    </div>
  );
};
