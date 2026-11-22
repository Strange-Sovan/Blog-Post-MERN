import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiResponse } from '../utils/ApiResponse';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import { IAuthRequest } from '../interfaces/IRequest';
import {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
} from '../services/post.service';

export const createPostController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const { title, content } = req.body;
  const thumbnailUrl = req.file ? `/api/v1/uploads/${req.file.filename}` : req.body.thumbnailUrl;
  const post = await createPost(title, content, req.user!._id, thumbnailUrl);
  ApiResponse.send(res, HttpStatus.CREATED, Messages.POST_CREATED, post);
});

export const getPostsController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
  const { posts, meta } = await getPosts(page, limit);
  ApiResponse.send(res, HttpStatus.OK, Messages.POSTS_FETCHED, posts, meta);
});

export const getPostBySlugController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const post = await getPostBySlug(req.params.slug);
  ApiResponse.send(res, HttpStatus.OK, Messages.POST_FETCHED, post);
});

export const updatePostController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const updates = {
    ...req.body,
    ...(req.file && { thumbnailUrl: `/api/v1/uploads/${req.file.filename}` }),
  };
  const post = await updatePost(req.params.id, updates, req.user!);
  ApiResponse.send(res, HttpStatus.OK, Messages.POST_UPDATED, post);
});

export const deletePostController = catchAsync(async (req: IAuthRequest, res: Response) => {
  await deletePost(req.params.id, req.user!);
  ApiResponse.send(res, HttpStatus.OK, Messages.POST_DELETED);
});
