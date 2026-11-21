import React from 'react';
import { Link } from 'react-router-dom';
import { IPost } from '@/interfaces/IPost';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Clock3, Image as ImageIcon } from 'lucide-react';

interface PostCardProps {
  post: IPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const excerpt = post.content.length > 150 ? `${post.content.slice(0, 150)}...` : post.content;
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="post-card surface-card flex h-full flex-col overflow-hidden">
      <Link to={`/posts/${post.slug}`} className="group relative block overflow-hidden bg-gradient-to-br from-violet-100 via-indigo-100 to-sky-100">
        {post.thumbnailUrl ? (
          <img src={post.thumbnailUrl} alt="" loading="lazy" className="thumbnail-image w-full" />
        ) : (
          <div className="thumbnail-image grid w-full place-items-center text-primary/35">
            <ImageIcon size={42} strokeWidth={1.2} />
          </div>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
          Journal
        </span>
      </Link>
      <CardHeader className="flex-1 pb-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge variant="secondary">{post.author?.name || 'Anonymous'}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock3 size={13} />{date}</span>
        </div>
        <CardTitle className="text-xl leading-snug line-clamp-2">
          <Link to={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="mb-5 text-sm leading-6 text-muted-foreground">{excerpt}</p>
        <Link
          to={`/posts/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:gap-3"
        >
          Read story <ArrowUpRight size={16} />
        </Link>
      </CardContent>
    </Card>
  );
};
