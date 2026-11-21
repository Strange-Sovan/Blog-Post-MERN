import React, { useState } from 'react';
import { useAdminPosts, useAdminDeletePost } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Trash2 } from 'lucide-react';

export const AdminPosts: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminPosts(page);
  const deleteMutation = useAdminDeletePost();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const posts = data?.data || [];
  const meta = data?.meta;

  const handleDelete = () => {
    if (pendingDelete) {
      deleteMutation.mutate(pendingDelete.id, {
        onSuccess: () => setPendingDelete(null),
      });
    }
  };

  return (
    <div className="page-shell max-w-6xl">
      <div className="mb-8">
        <p className="eyebrow mb-2">Administration</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Post management</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Inspect and moderate all articles submitted across the platform
        </p>
      </div>

      <Card className="surface-card overflow-hidden">
        <CardHeader>
          <CardTitle>All Platform Articles</CardTitle>
          <CardDescription>Total articles: {meta?.totalDocs || 0}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-left">
                    <th className="p-3">Title</th>
                    <th className="p-3">Author</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Created</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p._id} className="border-b hover:bg-muted/40 transition-colors">
                      <td className="p-3 font-semibold max-w-[240px] truncate">{p.title}</td>
                      <td className="p-3 text-muted-foreground">{p.author?.name || 'Anonymous'}</td>
                      <td className="p-3">
                        <Badge variant={p.isDeleted ? 'destructive' : 'secondary'}>
                          {p.isDeleted ? 'Deleted' : 'Active'}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground text-xs">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {!p.isDeleted && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setPendingDelete({ id: p._id, title: p.title })}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 size={14} /> Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!meta.hasPrevPage}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground px-2">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!meta.hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
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
