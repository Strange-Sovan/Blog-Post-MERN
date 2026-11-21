import { UserModel } from '../models/User.model';
import { PostModel } from '../models/Post.model';
import { CommentModel } from '../models/Comment.model';
import { IUser } from '../interfaces/IUser';
import { IPost } from '../interfaces/IPost';
import { IPaginationMeta } from '../interfaces/IApiResponse';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
}

export interface UsersResult {
  users: IUser[];
  meta: IPaginationMeta;
}

export interface PostsResult {
  posts: IPost[];
  meta: IPaginationMeta;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [totalUsers, totalPosts, totalComments] = await Promise.all([
    UserModel.countDocuments(),
    PostModel.countDocuments({ isDeleted: false }),
    CommentModel.countDocuments(),
  ]);
  return { totalUsers, totalPosts, totalComments };
};

export const getAllUsers = async (page: number, limit: number): Promise<UsersResult> => {
  const skip = (page - 1) * limit;
  const [users, totalDocs] = await Promise.all([
    UserModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    UserModel.countDocuments(),
  ]);
  const totalPages = Math.ceil(totalDocs / limit);
  return {
    users,
    meta: { page, limit, totalDocs, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
  };
};

export const getAllPosts = async (page: number, limit: number): Promise<PostsResult> => {
  const skip = (page - 1) * limit;
  const [posts, totalDocs] = await Promise.all([
    PostModel.find().populate('author', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    PostModel.countDocuments(),
  ]);
  const totalPages = Math.ceil(totalDocs / limit);
  return {
    posts,
    meta: { page, limit, totalDocs, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
  };
};

export const adminDeleteUser = async (userId: string): Promise<void> => {
  const user = await UserModel.findById(userId);
  if (!user) throw new ApiError(HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND);
  await user.deleteOne();
};

export const adminDeletePost = async (postId: string): Promise<void> => {
  const post = await PostModel.findById(postId);
  if (!post) throw new ApiError(HttpStatus.NOT_FOUND, Messages.POST_NOT_FOUND);
  post.isDeleted = true;
  post.deletedAt = new Date();
  await post.save();
};

