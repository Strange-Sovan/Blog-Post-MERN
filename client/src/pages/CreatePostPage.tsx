import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePost } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ImagePlus, PenLine, Sparkles, Upload, X } from 'lucide-react';
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('');
      return;
    }
    const preview = URL.createObjectURL(imageFile);
    setImagePreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [imageFile]);

  const onSubmit = (data: PostForm) => {
    createMutation.mutate({ ...data, thumbnail: imageFile || undefined }, {
      onSuccess: (res) => {
        if (res.data?.slug) {
          navigate(`/posts/${res.data.slug}`);
        } else {
          navigate('/');
        }
      },
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const error = getThumbnailFileError(file);
    if (error) {
      toast(error, 'error');
      return;
    }
    setImageFile(file);
  };

  return (
    <div className="page-shell max-w-4xl">
      <BackButton label="Back to previous page" />
      <Card className="overflow-hidden rounded-3xl border-0 shadow-xl shadow-slate-900/5">
        <div className="hero-panel px-7 py-8 text-white sm:px-10">
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200"><Sparkles size={14} /> Your next story</p>
          <CardTitle className="text-3xl font-extrabold">Create something meaningful</CardTitle>
          <CardDescription className="mt-2 text-indigo-100">Share your perspective with a community that loves a good read.</CardDescription>
        </div>
        <CardHeader className="pb-0 pt-8">
          <div className="flex items-center gap-3 text-primary"><PenLine size={19} /><span className="text-sm font-bold">Story editor</span></div>
        </CardHeader>
        <CardContent className="pt-6 sm:px-10 sm:pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="form-label">Article title</label>
              <Input
                placeholder="Give your article a clear, descriptive title..."
                {...register('title')}
                className="h-12 rounded-xl"
              />
              {errors.title && (
                <p className="text-destructive text-xs mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Your story</label>
              <textarea
                {...register('content')}
                placeholder="Start with the idea that inspired you..."
                className="form-textarea min-h-[320px] resize-y leading-7"
              />
              {errors.content && (
                <p className="text-destructive text-xs mt-1">{errors.content.message}</p>
              )}
            </div>
            <div>
              <label className="form-label inline-flex items-center gap-2"><ImagePlus size={16} /> Story thumbnail <span className="font-normal text-muted-foreground">(optional)</span></label>
              <div className="upload-zone relative grid min-h-40 place-items-center overflow-hidden rounded-2xl">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  aria-label="Upload a story thumbnail"
                />
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Thumbnail preview" className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute bottom-3 left-3 z-[1] rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow backdrop-blur">Preview · {imageFile?.name}</span>
                  </>
                ) : (
                  <div className="pointer-events-none px-4 py-6 text-center">
                    <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-white text-primary shadow-sm"><Upload size={19} /></span>
                    <p className="text-sm font-bold">Choose a cover image</p>
                    <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, WebP or GIF · up to 5 MB</p>
                  </div>
                )}
              </div>
              {imageFile && (
                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="truncate">{imageFile.name}</span>
                  <button type="button" className="inline-flex items-center gap-1 font-semibold text-destructive" onClick={() => setImageFile(null)}>
                    <X size={14} /> Remove
                  </button>
                </div>
              )}
            </div>

            {createMutation.error && (
              <p className="text-destructive text-sm">
                {(createMutation.error as any)?.response?.data?.message || 'Failed to create post'}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={createMutation.isPending} className="rounded-xl px-6">
                {createMutation.isPending ? 'Publishing...' : <><Sparkles size={16} /> Publish story</>}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
