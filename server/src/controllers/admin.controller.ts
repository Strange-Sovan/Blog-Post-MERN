import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiResponse } from '../utils/ApiResponse';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import { IAuthRequest } from '../interfaces/IRequest';
import {
  getDashboardStats,
  getAllUsers,
  getAllPosts,
  adminDeleteUser,
  adminDeletePost,
} from '../services/admin.service';

export const getDashboardStatsController = catchAsync(async (_req: IAuthRequest, res: Response) => {
  const stats = await getDashboardStats();
  ApiResponse.send(res, HttpStatus.OK, Messages.ADMIN_STATS_FETCHED, stats);
});

export const getAllUsersController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
  const { users, meta } = await getAllUsers(page, limit);
  ApiResponse.send(res, HttpStatus.OK, Messages.USERS_FETCHED, users, meta);
});

export const getAllPostsController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
  const { posts, meta } = await getAllPosts(page, limit);
  ApiResponse.send(res, HttpStatus.OK, Messages.POSTS_FETCHED, posts, meta);
});

export const deleteUserController = catchAsync(async (req: IAuthRequest, res: Response) => {
  await adminDeleteUser(req.params.id);
  ApiResponse.send(res, HttpStatus.OK, Messages.USER_DELETED);
});

export const deletePostController = catchAsync(async (req: IAuthRequest, res: Response) => {
  await adminDeletePost(req.params.id);
  ApiResponse.send(res, HttpStatus.OK, Messages.POST_DELETED);
});

