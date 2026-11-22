import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowForward, MdAutoStories } from 'react-icons/md';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/posts/PostCard';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 9;

export const AllPostsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePosts(page, PAGE_SIZE);
  const posts = data?.data || [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="mb-8 h-24 animate-pulse rounded-2xl bg-gradient-to-r from-violet-100 to-indigo-100" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-2xl bg-gradient-to-br from-slate-100 to-indigo-100" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-shell py-20 text-center">
        <p className="text-lg font-semibold text-destructive">Failed to load posts.</p>
        <p className="mt-2 text-sm text-muted-foreground">Please check your server connection.</p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow mb-2">From the community</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">All stories</h1>
          <p className="mt-2 text-sm text-muted-foreground">Browse the latest stories and ideas from our writers.</p>
        </div>
        <Link
          to="/posts/create"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition duration-200 hover:-translate-y-0.5 sm:self-auto"
        >
          Write a story <MdArrowForward size={16} />
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="surface-card py-20 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-violet-100 text-violet-500">
            <MdAutoStories size={32} />
          </div>
          <p className="mb-2 text-lg font-semibold text-muted-foreground">No posts yet.</p>
          <p className="mb-6 text-sm text-muted-foreground">Be the first to publish your story!</p>
          <Link
            to="/posts/create"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25"
          >
            Write the first post <MdArrowForward size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
          {meta && meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasPrevPage}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                className="rounded-xl px-5"
              >
                ← Previous
              </Button>
              <span className="rounded-xl border border-white/80 bg-white/80 px-4 py-1.5 text-sm font-semibold text-muted-foreground shadow-sm">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasNextPage}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="rounded-xl px-5"
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
