import React from 'react';
import { Link } from 'react-router-dom';
import { MdArrowForward, MdAutoStories, MdHome } from 'react-icons/md';

export const NotFoundPage: React.FC = () => (
  <div className="page-shell flex min-h-[65vh] items-center justify-center py-12">
    <section className="w-full max-w-2xl rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-xl shadow-primary/5 sm:px-12">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <MdAutoStories size={32} />
      </div>
      <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">Error 404</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        We couldn&apos;t find the page you were looking for. It may have moved or the address may be incorrect.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className="btn-primary justify-center">
          <MdHome size={17} /> Go home
        </Link>
        <Link
          to="/posts"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted"
        >
          Browse stories <MdArrowForward size={16} />
        </Link>
      </div>
    </section>
  </div>
);
