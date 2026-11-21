import React, { useState } from 'react';
import { IComment } from '@/interfaces/IComment';
import { useAuthStore } from '@/store/authStore';
import { useUpdateComment, useDeleteComment } from '@/hooks/useComments';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Pencil, Trash2 } from 'lucide-react';

interface CommentItemProps {
  comment: IComment;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const { user, isAdmin } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateMutation = useUpdateComment();
  const deleteMutation = useDeleteComment();

  const isOwner = user?._id === comment.author?._id;
  const canModify = isOwner || isAdmin;

  const handleUpdate = () => {
    if (!editContent.trim()) return;
    updateMutation.mutate(
      { id: comment._id, content: editContent },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(comment._id, {
      onSuccess: () => setConfirmDelete(false),
    });
  };

  return (
    <Card className="mb-3">
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">{comment.author?.name || 'Anonymous'}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border rounded-md p-2 text-sm min-h-[70px] resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUpdate} disabled={updateMutation.isPending}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
            {canModify && (
              <div className="flex gap-2 mt-3 pt-2 border-t">
                {canModify && (
                  <Button size="sm" variant="ghost" className="h-8 rounded-lg text-xs" onClick={() => setIsEditing(true)}>
                    <Pencil size={13} /> Edit
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-destructive hover:text-destructive"
                  onClick={() => setConfirmDelete(true)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 size={13} /> Delete
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title="Delete this comment?"
        description="This comment will be permanently removed from the discussion."
        confirmLabel="Delete comment"
      />
    </Card>
  );
};
