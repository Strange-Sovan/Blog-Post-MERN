import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    thumbnailUrl: z.string().url('Thumbnail must be a valid URL').optional().or(
      z.string().regex(/^\/api\/v1\/uploads\/[a-f0-9-]+\.(jpg|png|webp|gif)$/i, 'Thumbnail path is invalid')
    ).or(z.literal('')),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    content: z.string().min(10).optional(),
    thumbnailUrl: z.string().url('Thumbnail must be a valid URL').optional().or(
      z.string().regex(/^\/api\/v1\/uploads\/[a-f0-9-]+\.(jpg|png|webp|gif)$/i, 'Thumbnail path is invalid')
    ).or(z.literal('')),
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>['body'];
export type UpdatePostInput = z.infer<typeof updatePostSchema>['body'];
