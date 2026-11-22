import React from 'react';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/posts/PostCard';
import { Link } from 'react-router-dom';
import { MdAutoStories, MdArrowForward, MdKeyboardArrowDown, MdCreate, MdPeople, MdLightbulb, MdTrendingUp } from 'react-icons/md';
import { RiSparklingFill } from 'react-icons/ri';

export const HomePage: React.FC = () => {
  const { data, isLoading, isError } = usePosts(1, 3);

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="mb-10 h-80 animate-pulse rounded-3xl bg-gradient-to-br from-primary/20 to-secondary" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-shell py-20 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <MdAutoStories size={32} />
        </div>
        <p className="font-semibold text-lg text-foreground">Failed to load posts.</p>
        <p className="text-muted-foreground text-sm mt-1">Please check your server connection.</p>
      </div>
    );
  }

  const posts = data?.data || [];

  return (
    <div className="page-shell">
      {/* ── Hero ── */}
      <section className="hero-panel relative mb-10 overflow-hidden rounded-[2.5rem] px-5 py-8 text-white sm:px-8 sm:py-10">
        {/* Blobs */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-500/18 blur-3xl" />
        <div className="absolute bottom-0 left-8 h-56 w-56 rounded-full bg-indigo-500/12 blur-3xl" />
        <div className="absolute top-8 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-pink-500/8 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          {/* Badges */}
          <div className="mb-4 flex flex-wrap justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
              <RiSparklingFill size={13} /> A home for curious minds
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
              <MdTrendingUp size={13} /> New stories daily
            </span>
          </div>

          <h1 className="text-4xl font-black leading-[1.07] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Ideas worth{' '}
            <span className="bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
              reading.
            </span>
            <br />
            <span className="text-white/75">Stories worth sharing.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-indigo-100/85 sm:text-lg">
            Thoughtful perspectives, practical guides, and fresh inspiration from our community of passionate writers.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href="#stories"
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-6 text-sm font-bold text-indigo-900 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-violet-50">
              Explore stories <MdKeyboardArrowDown size={18} />
            </a>
            <Link to="/posts/create"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/18">
              <MdCreate size={16} /> Write a story
            </Link>
          </div>
        </div>

      </section>

      {/* ── Stats Row ── */}
      <div className="mb-12 grid grid-cols-3 gap-4">
        {[
          { icon: <MdPeople size={22} />, label: 'Community Members', from: 'from-violet-500', to: 'to-indigo-600' },
          { icon: <MdAutoStories size={22} />, label: 'Published Stories', from: 'from-blue-500', to: 'to-cyan-600' },
          { icon: <MdLightbulb size={22} />, label: 'Ideas Shared', from: 'from-emerald-500', to: 'to-teal-600' },
        ].map(({ icon, label, from, to }) => (
          <div key={label}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-5 text-center shadow-sm transition hover:shadow-md">
            <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${from} ${to} text-white shadow-md`}>
              {icon}
            </span>
            <p className="text-xs font-semibold text-muted-foreground leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Posts Header ── */}
      <div id="stories" className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow mb-2">The latest</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Fresh from the community</h2>
          <p className="mt-1 text-sm text-muted-foreground">Discover insights, tutorials, and stories.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/posts" className="btn-ghost self-start">
            Browse all posts <MdArrowForward size={15} />
          </Link>
          <Link to="/posts/create" className="btn-primary self-start">
            Have a story? Write one <MdArrowForward size={15} />
          </Link>
        </div>
      </div>

      {/* ── Posts Grid ── */}
      {posts.length === 0 ? (
        <div className="surface-card flex flex-col items-center py-20 text-center">
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <MdAutoStories size={32} />
          </div>
          <p className="mb-1 text-lg font-semibold text-foreground">No posts yet.</p>
          <p className="mb-6 text-sm text-muted-foreground">Be the first to publish your story!</p>
          <Link to="/posts/create" className="btn-primary">
            <MdCreate size={16} /> Write first post
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>

        </>
      )}
    </div>
  );
};
