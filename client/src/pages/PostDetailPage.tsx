import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePost, useDeletePost } from '@/hooks/usePosts';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { useAuthStore } from '@/store/authStore';
import { CommentItem } from '@/components/comments/CommentItem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Edit3, MessageCircle, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { BackButton } from '@/components/ui/BackButton';

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
  const canModifyPost = isOwner || isAdmin;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    createCommentMutation.mutate(commentContent, {
      onSuccess: () => setCommentContent(''),
    });
  };

  const handleDeletePost = () => {
    if (!post) return;
    deletePostMutation.mutate(post._id, {
      onSuccess: () => {
        setConfirmDelete(false);
        navigate('/');
      },
    });
  };

  if (postLoading) {
    return (
      <div className="page-shell max-w-4xl" role="status" aria-label="Loading post">
        <span className="sr-only">Loading post...</span>
        <div className="mb-10 overflow-hidden rounded-2xl bg-white/80 shadow-sm">
          <div className="h-64 animate-pulse bg-gradient-to-br from-violet-100 to-indigo-100" />
          <div className="animate-pulse space-y-5 p-6 sm:p-10">
            <div className="h-4 w-1/4 rounded bg-slate-100" />
            <div className="h-10 w-3/4 rounded bg-slate-100" />
            <div className="h-4 w-1/3 rounded bg-violet-100" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
        <div className="animate-pulse space-y-4 rounded-3xl bg-white/75 p-6 shadow-sm">
          <div className="h-7 w-40 rounded bg-slate-100" />
          <div className="h-20 rounded-xl bg-slate-100" />
          <div className="h-16 rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="page-shell max-w-xl text-center">
        <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
        <p className="text-muted-foreground mb-6">The post you are looking for has been removed or does not exist.</p>
        <Button onClick={() => navigate('/')}>Return to Homepage</Button>
      </div>
    );
  }

  return (
    <div className="page-shell max-w-4xl">
      <article className="surface-card mb-10 overflow-hidden border-0 shadow-lg shadow-slate-900/5">
        {post.thumbnailUrl && (
          <div className="max-h-[28rem] overflow-hidden bg-muted">
            <img src={post.thumbnailUrl} alt={`Cover image for ${post.title}`} className="max-h-[28rem] w-full object-cover" />
          </div>
        )}
        <div className="p-5 sm:p-10 lg:px-14">
        <BackButton label="Back to previous page" fallback="/" className="mb-7" />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-5">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{post.author?.name || 'Anonymous'}</Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays size={14} />
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {canModifyPost && (
            <div className="flex gap-2">
              {isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/posts/edit/${post._id}`)}
                  className="rounded-xl"
                >
                  <Edit3 size={14} /> Edit
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setConfirmDelete(true)}
                disabled={deletePostMutation.isPending}
                className="rounded-xl"
              >
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          )}
        </div>

        <p className="eyebrow mb-3">Community story</p>
        <h1 className="mb-8 max-w-3xl text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">{post.title}</h1>
        <div className="prose max-w-none whitespace-pre-wrap text-base leading-8 text-foreground/90 sm:text-lg sm:leading-9">
          {post.content}
        </div>
        </div>
      </article>

      <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[0_8px_28px_rgba(27,31,59,0.05)] sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <MessageCircle className="text-primary" size={22} />
          Discussion ({commentMeta?.totalDocs || comments.length})
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Leave your comment or response..."
              className="form-textarea min-h-[110px] resize-y"
            />
            <Button
              type="submit"
              size="sm"
              className="mt-2"
              disabled={createCommentMutation.isPending || !commentContent.trim()}
            >
              {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        ) : (
          <div className="p-4 bg-muted/50 rounded-lg text-center mb-8 border">
            <p className="text-sm text-muted-foreground">
              Please{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                sign in
              </button>{' '}
              to participate in the conversation.
            </p>
          </div>
        )}

        {commentsLoading ? (
          <div className="space-y-3" role="status" aria-label="Loading comments">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-3 h-4 w-1/4 rounded bg-slate-200" />
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-6 text-sm">No comments yet. Join the conversation!</p>
        ) : (
          <>
            <div className="space-y-3">
              {comments.map((c) => (
                <CommentItem key={c._id} comment={c} />
              ))}
            </div>

            {commentMeta && commentMeta.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!commentMeta.hasPrevPage}
                  onClick={() => setCommentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!commentMeta.hasNextPage}
                  onClick={() => setCommentPage((p) => p + 1)}
                >
                  Next
                </Button>
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
