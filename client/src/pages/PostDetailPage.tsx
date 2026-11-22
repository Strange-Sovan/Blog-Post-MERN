import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePost, useDeletePost } from '@/hooks/usePosts';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { useAuthStore } from '@/store/authStore';
import { CommentItem } from '@/components/comments/CommentItem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { BackButton } from '@/components/ui/BackButton';
import { MdEdit, MdDelete, MdMessage, MdCalendarToday, MdSend, MdLogin } from 'react-icons/md';
import { RiUserSmileLine } from 'react-icons/ri';

export const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const [commentContent, setCommentContent] = useState('');
  const [commentPage, setCommentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: postData, isLoading: postLoading, isError } = usePost(slug!);
  const post = postData?.data;
  const { data: commentsData, isLoading: commentsLoading } = useComments(post?._id || '', commentPage);
  const comments = commentsData?.data || [];
  const commentMeta = commentsData?.meta;

  const createCommentMutation = useCreateComment(post?._id || '');
  const deletePostMutation = useDeletePost();

  const isOwner = user?._id === post?.author?._id;
  const canModify = isOwner || isAdmin;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    createCommentMutation.mutate(commentContent, { onSuccess: () => setCommentContent('') });
  };

  const handleDeletePost = () => {
    if (!post) return;
    deletePostMutation.mutate(post._id, {
      onSuccess: () => { setConfirmDelete(false); navigate('/'); },
    });
  };

  /* ── Loading ── */
  if (postLoading) {
    return (
      <div className="page-shell max-w-4xl">
        <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="h-64 animate-pulse bg-gradient-to-br from-primary/10 to-secondary" />
          <div className="animate-pulse space-y-4 p-8">
            <div className="h-4 w-1/4 rounded-lg bg-muted" />
            <div className="h-9 w-3/4 rounded-lg bg-muted" />
            <div className="h-4 w-full rounded-lg bg-muted" />
            <div className="h-4 w-5/6 rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (isError || !post) {
    return (
      <div className="page-shell max-w-xl py-20 text-center">
        <div className="mb-4 grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <MdMessage size={32} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">Article Not Found</h2>
        <p className="mb-6 text-muted-foreground">This post has been removed or does not exist.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Return to Homepage</button>
      </div>
    );
  }

  return (
    <div className="page-shell max-w-4xl">
      {/* ── Article card ── */}
      <article className="mb-10 overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-slate-900/5 dark:shadow-black/25">
        {post.thumbnailUrl && (
          <div className="max-h-[28rem] overflow-hidden">
            <img src={post.thumbnailUrl} alt={`Cover for ${post.title}`}
              className="w-full object-cover max-h-[28rem]" />
          </div>
        )}

        <div className="p-6 sm:p-10 lg:px-14">
          <BackButton label="Back" fallback="/" className="mb-7" />

          {/* Meta row */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <RiUserSmileLine size={13} /> {post.author?.name || 'Anonymous'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <MdCalendarToday size={13} />
                {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            {canModify && (
              <div className="flex gap-2">
                {isOwner && (
                  <button onClick={() => navigate(`/posts/edit/${post._id}`)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted">
                    <MdEdit size={14} /> Edit
                  </button>
                )}
                <button onClick={() => setConfirmDelete(true)} disabled={deletePostMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/20">
                  <MdDelete size={14} /> Delete
                </button>
              </div>
            )}
          </div>

          <p className="eyebrow mb-3">Community story</p>
          <h1 className="mb-8 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          <div className="prose max-w-none whitespace-pre-wrap text-base leading-8 text-foreground/88 sm:text-lg sm:leading-9">
            {post.content}
          </div>
        </div>
      </article>

      {/* ── Discussion ── */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-slate-900/5 sm:p-8 dark:shadow-black/25">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
          <MdMessage className="text-primary" size={24} />
          Discussion ({commentMeta?.totalDocs ?? comments.length})
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8 rounded-2xl border border-border bg-muted/40 p-4 shadow-md sm:p-5">
            <label htmlFor="comment-content" className="form-label">
              Your comment <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <textarea
              id="comment-content"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Leave your comment or response…"
              className="form-textarea min-h-[110px] bg-card shadow-sm focus:border-sky-400 focus:ring-sky-300/30"
              required
            />
            <button type="submit"
              disabled={createCommentMutation.isPending || !commentContent.trim()}
              className="btn-primary mt-3 disabled:opacity-50">
              <MdSend size={15} />
              {createCommentMutation.isPending ? 'Posting…' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-8 rounded-xl border border-border bg-muted/50 p-5 text-center">
            <MdLogin size={28} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Please{' '}
              <button type="button" onClick={() => navigate('/login')}
                className="font-semibold text-primary hover:underline">sign in</button>
              {' '}to participate in the conversation.
            </p>
          </div>
        )}

        {commentsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-border bg-muted/40 p-4">
                <div className="mb-3 h-4 w-1/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No comments yet. Join the conversation!</p>
        ) : (
          <>
            <div className="space-y-3">
              {comments.map((c) => <CommentItem key={c._id} comment={c} />)}
            </div>
            {commentMeta && commentMeta.totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-3">
                <button disabled={!commentMeta.hasPrevPage}
                  onClick={() => setCommentPage((p) => p - 1)}
                  className="btn-ghost disabled:opacity-40">← Previous</button>
                <button disabled={!commentMeta.hasNextPage}
                  onClick={() => setCommentPage((p) => p + 1)}
                  className="btn-ghost disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )}
      </section>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={handleDeletePost}
        isPending={deletePostMutation.isPending}
        title="Delete this story?"
        description="This story will be removed from the public feed. This action cannot be undone."
        confirmLabel="Delete story"
      />
    </div>
  );
};
