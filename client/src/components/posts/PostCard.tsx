import React from 'react';
import { Link } from 'react-router-dom';
import { IPost } from '@/interfaces/IPost';
import { MdArrowForward, MdImage, MdAccessTime } from 'react-icons/md';
import { RiUserSmileLine } from 'react-icons/ri';

interface PostCardProps {
  post: IPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const excerpt = post.content.length > 140 ? `${post.content.slice(0, 140)}...` : post.content;
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="post-card group flex h-full flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-[0_8px_28px_rgba(27,31,59,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(91,73,211,0.13)]">
      {/* Thumbnail */}
      <Link
        to={`/posts/${post.slug}`}
        aria-label={`Read ${post.title}`}
        className="relative block overflow-hidden"
      >
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt=""
            loading="lazy"
            className="thumbnail-image w-full"
          />
        ) : (
          <div className="thumbnail-image flex w-full items-center justify-center bg-gradient-to-br from-violet-100 via-indigo-100 to-sky-100 text-indigo-300">
            <MdImage size={40} strokeWidth={1} />
          </div>
        )}
        {/* Category badge */}
        <span className="absolute bottom-2.5 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur">
          Journal
        </span>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Meta row */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
            <RiUserSmileLine size={13} />
            {post.author?.name || 'Anonymous'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MdAccessTime size={13} /> {date}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold leading-snug line-clamp-2 text-slate-800 group-hover:text-violet-700 transition-colors">
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="mb-4 flex-1 text-sm leading-5 text-muted-foreground line-clamp-3">{excerpt}</p>

        {/* Read more */}
        <Link
          to={`/posts/${post.slug}`}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-violet-500/40"
        >
          Read story <MdArrowForward size={15} />
        </Link>
      </div>
    </article>
  );
};
