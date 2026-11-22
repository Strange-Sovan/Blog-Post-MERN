import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePost } from '@/hooks/usePosts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MdImage, MdClose, MdSend, MdCreate } from 'react-icons/md';
import { RiSparklingFill } from 'react-icons/ri';
import { HiUpload } from 'react-icons/hi';
import { useToast } from '@/components/ui/toast';
import { getThumbnailFileError } from '@/lib/thumbnail';
import { BackButton } from '@/components/ui/BackButton';

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});
type PostForm = z.infer<typeof postSchema>;

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreatePost();
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    if (!imageFile) { setImagePreview(''); return; }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const onSubmit = (data: PostForm) =>
    createMutation.mutate({ ...data, thumbnail: imageFile || undefined }, {
      onSuccess: (res) => navigate(res.data?.slug ? `/posts/${res.data.slug}` : '/'),
    });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const err = getThumbnailFileError(file);
    if (err) { toast(err, 'error'); return; }
    setImageFile(file);
  };

  return (
    <div className="page-shell max-w-3xl">
      <BackButton label="Back" />

      {/* ── Page card ── */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="hero-panel px-8 py-8 text-white">
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-200">
            <RiSparklingFill size={13} /> Your next story
          </p>
          <h1 className="text-3xl font-black tracking-tight">Create something meaningful</h1>
          <p className="mt-2 text-sm text-indigo-200/90">Share your perspective with a community that loves a good read.</p>
        </div>

        {/* Body */}
        <div className="p-7 sm:p-10">
          <div className="mb-6 flex items-center gap-2 text-primary">
            <MdCreate size={20} />
            <span className="text-sm font-bold">Story editor</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div>
              <label className="form-label">Article title <span className="text-destructive" aria-hidden="true">*</span></label>
              <Input placeholder="Give your article a clear, descriptive title…"
                {...register('title')} className="form-input h-12 text-base" required />
              {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
            </div>

            {/* Content */}
            <div>
              <label className="form-label">Your story <span className="text-destructive" aria-hidden="true">*</span></label>
              <textarea {...register('content')}
                placeholder="Start with the idea that inspired you…"
                className="form-textarea min-h-[300px] leading-7" required />
              {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="form-label inline-flex items-center gap-1.5">
                <MdImage size={16} className="text-primary" /> Story thumbnail
                <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <div className="upload-zone relative grid min-h-40 place-items-center overflow-hidden rounded-2xl">
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  aria-label="Upload thumbnail" />
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute bottom-3 left-3 z-[1] rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow backdrop-blur dark:bg-black/70 dark:text-white">
                      Preview · {imageFile?.name}
                    </span>
                  </>
                ) : (
                  <div className="pointer-events-none px-4 py-8 text-center">
                    <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                      <HiUpload size={20} />
                    </span>
                    <p className="text-sm font-bold text-foreground">Choose a cover image</p>
                    <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, WebP or GIF · up to 5 MB</p>
                  </div>
                )}
              </div>
              {imageFile && (
                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="truncate">{imageFile.name}</span>
                  <button type="button" onClick={() => setImageFile(null)}
                    className="inline-flex items-center gap-1 font-semibold text-destructive hover:underline">
                    <MdClose size={13} /> Remove
                  </button>
                </div>
              )}
            </div>

            {/* API error */}
            {createMutation.error && (
              <p className="text-sm text-destructive">
                {(createMutation.error as any)?.response?.data?.message || 'Failed to create post'}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                <MdSend size={16} />
                {createMutation.isPending ? 'Publishing…' : 'Publish story'}
              </button>
              <Button type="button" variant="cancel" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
