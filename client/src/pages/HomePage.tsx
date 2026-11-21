import React, { useState } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/posts/PostCard';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePosts(page);

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-shell text-center">
        <p className="text-destructive font-medium">Failed to load posts. Please verify server connection.</p>
      </div>
    );
  }

  const posts = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="page-shell">
      <section className="hero-panel relative mb-12 overflow-hidden rounded-[2rem] px-7 py-12 text-white sm:mb-14 sm:px-12 sm:py-16 lg:px-16">
        <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-violet-100">
            <Sparkles size={14} /> A home for curious minds
          </span>
          <h1 className="text-4xl font-black leading-[1.08] tracking-[-0.04em] sm:text-6xl">
            Ideas worth reading. <span className="text-violet-200">Stories worth sharing.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-indigo-100/95 sm:text-lg">
            Thoughtful perspectives, practical guides, and fresh inspiration from our community of writers.
          </p>
          <a href="#stories" className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-indigo-800 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40">
            Explore stories <ArrowDown size={16} />
          </a>
        </div>
        <BookOpen className="absolute bottom-8 right-12 hidden text-white/15 sm:block" size={170} strokeWidth={0.8} />
      </section>

      <div id="stories" className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow mb-2">The latest</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Fresh from the community</h2>
          <p className="mt-2 text-sm text-muted-foreground">Discover insights, tutorials, and stories shared by the community.</p>
        </div>
        <Link to="/posts/create" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          Have a story? Write one <ArrowRight size={16} />
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="surface-card py-16 text-center">
          <p className="text-muted-foreground text-lg mb-2">No posts yet.</p>
          <p className="text-sm text-muted-foreground">Be the first to publish your post!</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasPrevPage}
                onClick={() => setPage((p) => p - 1)}
              >
                &larr; Previous
              </Button>
              <span className="text-sm text-muted-foreground font-medium px-2">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next &rarr;
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
