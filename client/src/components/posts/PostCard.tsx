import React from 'react';
import { Link } from 'react-router-dom';
import { IPost } from '@/interfaces/IPost';
import { MdArrowForward, MdImage, MdAccessTime } from 'react-icons/md';
import { RiUserSmileLine } from 'react-icons/ri';

interface PostCardProps { post: IPost; }

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const excerpt = post.content.length > 130 ? `${post.content.slice(0, 130)}…` : post.content;
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <article className="post-card group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_40px_rgba(15,23,42,0.14)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.24)] dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.34)]">

      {/* Thumbnail */}
      <Link to={`/posts/${post.slug}`} aria-label={`Read ${post.title}`}
        className="relative block overflow-hidden">
        {post.thumbnailUrl ? (
          <img src={post.thumbnailUrl} alt="" loading="lazy" className="thumbnail-image w-full" />
        ) : (
          <div className="thumbnail-image flex w-full items-center justify-center bg-gradient-to-br from-primary/10 via-secondary to-accent text-primary/30">
            <MdImage size={48} />
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-white/85 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur-sm dark:border-white/20 dark:bg-black/50 dark:text-white/90">
          Journal
        </span>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Meta */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            <RiUserSmileLine size={12} /> {post.author?.name || 'Anonymous'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MdAccessTime size={12} /> {date}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-[1.1rem] font-bold leading-snug line-clamp-2 text-foreground transition-colors group-hover:text-primary">
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="mb-5 flex-1 text-sm leading-6 text-muted-foreground line-clamp-3">{excerpt}</p>

        {/* CTA */}
        <Link to={`/posts/${post.slug}`}
          className="btn-primary self-start text-xs py-2 px-4">
          Read story <MdArrowForward size={14} />
        </Link>
      </div>
    </article>
  );
};
