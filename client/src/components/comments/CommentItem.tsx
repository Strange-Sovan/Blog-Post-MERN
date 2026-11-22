import React, { useState } from 'react';
import { IComment } from '@/interfaces/IComment';
import { useAuthStore } from '@/store/authStore';
import { useUpdateComment, useDeleteComment } from '@/hooks/useComments';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { MdEdit, MdDelete, MdCheck, MdClose } from 'react-icons/md';
import { RiUserSmileLine } from 'react-icons/ri';

interface CommentItemProps { comment: IComment; }

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
    updateMutation.mutate({ id: comment._id, content: editContent }, {
      onSuccess: () => setIsEditing(false),
    });
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-all duration-200 hover:border-sky-200 hover:shadow-md dark:hover:border-sky-400/30">
      {/* Author row */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-xs font-black text-primary">
            {(comment.author?.name || 'A').slice(0, 1).toUpperCase()}
          </span>
          <div>
            <span className="text-sm font-semibold text-foreground">
              {comment.author?.name || 'Anonymous'}
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {canModify && !isEditing && (
          <div className="flex flex-shrink-0 gap-2">
            {isOwner && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              >
                <MdEdit size={14} /> Edit
              </button>
            )}
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={deleteMutation.isPending}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-1.5 text-xs font-semibold text-destructive shadow-sm transition hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MdDelete size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Content / Edit */}
      {isEditing ? (
        <div className="space-y-2">
          <label htmlFor={`edit-comment-${comment._id}`} className="form-label">
            Edit comment <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <textarea
            id={`edit-comment-${comment._id}`}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="form-textarea min-h-[80px] text-sm"
            required
          />
          <div className="flex gap-2">
            <button onClick={handleUpdate} disabled={updateMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition hover:opacity-90">
              <MdCheck size={14} /> {updateMutation.isPending ? 'Saving…' : 'Save'}
            </button>
            <Button type="button" variant="cancel" size="sm" className="text-xs" onClick={() => setIsEditing(false)}>
              <MdClose size={14} /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-foreground/85">{comment.content}</p>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={() => deleteMutation.mutate(comment._id, { onSuccess: () => setConfirmDelete(false) })}
        isPending={deleteMutation.isPending}
        title="Delete this comment?"
        description="This comment will be permanently removed from the discussion."
        confirmLabel="Delete comment"
      />
    </div>
  );
};
