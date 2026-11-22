import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdatePost } from '@/hooks/usePosts';
import { useQuery } from '@tanstack/react-query';
import { postApi } from '@/api/post.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagePlus, Save, Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { getThumbnailFileError } from '@/lib/thumbnail';
import { BackButton } from '@/components/ui/BackButton';

const postSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).optional(),
});
type PostForm = z.infer<typeof postSchema>;

export const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateMutation = useUpdatePost();
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['post-by-id', id],
    queryFn: async () => {
      const res = await postApi.getAll(1, 100);
      return res.data?.find((p) => p._id === id);
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    if (data) {
      reset({ title: data.title, content: data.content });
      setThumbnailUrl(data.thumbnailUrl || '');
    }
  }, [data, reset]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('');
      return;
    }
    const preview = URL.createObjectURL(imageFile);
    setImagePreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [imageFile]);

  const onSubmit = (formData: PostForm) => {
    if (!id) return;
    updateMutation.mutate(
      {
        id,
        data: {
          ...formData,
          thumbnailUrl: imageFile ? undefined : thumbnailUrl,
          thumbnail: imageFile || undefined,
        },
      },
      {
        onSuccess: (res) => {
          if (res.data?.slug) {
            navigate(`/posts/${res.data.slug}`);
          } else {
            navigate('/');
          }
        },
      }
    );
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

  if (isLoading) {
    return (
      <div className="page-shell max-w-4xl" role="status" aria-label="Loading post editor">
        <span className="sr-only">Loading post editor...</span>
        <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-violet-100" />
        <div className="rounded-2xl border border-white/80 bg-white/80 p-6 shadow-sm sm:p-8">
          <div className="mb-8 h-7 w-1/2 animate-pulse rounded bg-slate-100" />
          <div className="space-y-6">
            <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-40 animate-pulse rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50" />
            <div className="h-11 w-36 animate-pulse rounded-xl bg-violet-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell max-w-4xl">
      <BackButton label="Back to previous page" />
      <Card className="overflow-hidden rounded-3xl border-0 shadow-xl shadow-slate-900/5">
        <CardHeader className="hero-panel px-7 py-8 text-white sm:px-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">Refine your story</p>
          <CardTitle className="text-3xl font-extrabold text-white">Edit article</CardTitle>
        </CardHeader>
        <CardContent className="pt-8 sm:px-10 sm:pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="form-label">Title</label>
              <Input {...register('title')} className="h-12 rounded-xl" />
              {errors.title && (
                <p className="text-destructive text-xs mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Content</label>
              <textarea
                {...register('content')}
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
                {imagePreview || thumbnailUrl ? (
                  <>
                    <img src={imagePreview || thumbnailUrl} alt="Thumbnail preview" className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute bottom-3 left-3 z-[1] rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow backdrop-blur">
                      {imageFile ? `Preview · ${imageFile.name}` : 'Current thumbnail'}
                    </span>
                  </>
                ) : (
                  <div className="pointer-events-none px-4 py-6 text-center">
                    <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-white text-primary shadow-sm"><Upload size={19} /></span>
                    <p className="text-sm font-bold">Choose a cover image</p>
                    <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, WebP or GIF · up to 5 MB</p>
                  </div>
                )}
              </div>
              {(imageFile || thumbnailUrl) && (
                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="truncate">{imageFile?.name || 'Current thumbnail'}</span>
                  <button type="button" className="inline-flex items-center gap-1 font-semibold text-destructive" onClick={() => { setImageFile(null); setThumbnailUrl(''); }}>
                    <X size={14} /> Remove
                  </button>
                </div>
              )}
            </div>

            {updateMutation.error && (
              <p className="text-destructive text-sm">
                {(updateMutation.error as any)?.response?.data?.message || 'Failed to update post'}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : <><Save size={16} /> Save changes</>}
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
