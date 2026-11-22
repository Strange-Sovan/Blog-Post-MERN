import React from 'react';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/posts/PostCard';
import { Link } from 'react-router-dom';
import {
  MdAutoStories, MdArrowForward, MdKeyboardArrowDown, MdTrendingUp,
  MdCreate, MdPeople, MdLightbulb
} from 'react-icons/md';
import { RiSparklingFill } from 'react-icons/ri';

const FeatureBadge: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur-sm">
    {icon} {text}
  </span>
);

export const HomePage: React.FC = () => {
  const { data, isLoading, isError } = usePosts(1, 3);

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="mb-10 h-80 animate-pulse rounded-3xl bg-gradient-to-br from-violet-200 to-indigo-200" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-gradient-to-br from-slate-100 to-indigo-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-shell text-center py-20">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-red-100 text-red-500">
          <MdAutoStories size={32} />
        </div>
        <p className="text-destructive font-semibold text-lg">Failed to load posts.</p>
        <p className="text-muted-foreground text-sm mt-2">Please check your server connection.</p>
      </div>
    );
  }

  const posts = data?.data || [];

  return (
    <div className="page-shell">
      {/* ── Hero Section ── */}
      <section className="relative mb-14 overflow-hidden rounded-[2.5rem] px-8 py-16 text-white sm:px-14 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0e1f] via-[#1e1b55] to-[#4c3ba0]" />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute top-10 left-1/2 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="mb-6 flex flex-wrap gap-3">
            <FeatureBadge icon={<RiSparklingFill size={14} />} text="A home for curious minds" />
            <FeatureBadge icon={<MdTrendingUp size={14} />} text="New stories daily" />
          </div>

          <h1 className="text-5xl font-black leading-[1.07] tracking-[-0.04em] sm:text-7xl">
            Ideas worth <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-pink-300">reading.</span>
            <br />
            <span className="text-white/80">Stories worth sharing.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-indigo-100/90 sm:text-lg">
            Thoughtful perspectives, practical guides, and fresh inspiration from our community of passionate writers.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#stories"
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-6 text-sm font-bold text-indigo-900 shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:bg-violet-50"
            >
              Explore stories <MdKeyboardArrowDown size={18} />
            </a>
            <Link
              to="/posts/create"
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition duration-200 hover:bg-white/20"
            >
              <MdCreate size={16} /> Write a story
            </Link>
          </div>
        </div>

        <MdAutoStories className="absolute bottom-6 right-10 hidden text-white/8 sm:block" size={200} />
      </section>

      {/* ── Stats Row ── */}
      <div className="mb-12 grid grid-cols-3 gap-4">
        {[
          { icon: <MdPeople size={20} />, label: 'Community Members', color: 'from-violet-500 to-indigo-600' },
          { icon: <MdAutoStories size={20} />, label: 'Published Stories', color: 'from-blue-500 to-cyan-600' },
          { icon: <MdLightbulb size={20} />, label: 'Ideas Shared', color: 'from-emerald-500 to-teal-600' },
        ].map(({ icon, label, color }) => (
          <div key={label} className="flex flex-col items-center gap-2 rounded-2xl bg-white/70 px-4 py-5 text-center shadow-sm backdrop-blur-sm border border-white/80">
            <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}>
              {icon}
            </span>
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Posts Section ── */}
      <div id="stories" className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow mb-2">The latest</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Fresh from the community</h2>
          <p className="mt-2 text-sm text-muted-foreground">Discover insights, tutorials, and stories.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white/80 px-5 py-2.5 text-sm font-bold text-violet-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-violet-50"
          >
            View all posts <MdArrowForward size={16} />
          </Link>
          <Link
            to="/posts/create"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition duration-200 hover:-translate-y-0.5"
          >
            Have a story? Write one <MdArrowForward size={16} />
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="surface-card py-20 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-violet-100 text-violet-500">
            <MdAutoStories size={32} />
          </div>
          <p className="text-muted-foreground text-lg mb-2 font-semibold">No posts yet.</p>
          <p className="text-sm text-muted-foreground mb-6">Be the first to publish your story!</p>
          <Link
            to="/posts/create"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25"
          >
            <MdCreate size={16} /> Write first post
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

        </>
      )}
    </div>
  );
};
