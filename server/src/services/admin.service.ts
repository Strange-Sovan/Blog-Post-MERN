import { UserModel } from '../models/User.model';
import { PostModel } from '../models/Post.model';
import { CommentModel } from '../models/Comment.model';
import { IUser } from '../interfaces/IUser';
import { IPost } from '../interfaces/IPost';
import { IComment } from '../interfaces/IComment';
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

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export interface CommentsResult {
  comments: IComment[];
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

export const getAllUsers = async (page: number, limit: number, search = ''): Promise<UsersResult> => {
  const skip = (page - 1) * limit;
  const searchRegex = new RegExp(escapeRegExp(search), 'i');
  const filter = search
    ? { $or: [{ name: searchRegex }, { email: searchRegex }] }
    : {};
  const [users, totalDocs] = await Promise.all([
    UserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    UserModel.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(totalDocs / limit);
  return {
    users,
    meta: { page, limit, totalDocs, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
  };
};

export const getAllPosts = async (page: number, limit: number, search = ''): Promise<PostsResult> => {
  const skip = (page - 1) * limit;
  const searchRegex = new RegExp(escapeRegExp(search), 'i');
  const filter = search
    ? { $or: [{ title: searchRegex }, { content: searchRegex }] }
    : {};
  const [posts, totalDocs] = await Promise.all([
    PostModel.find(filter).populate('author', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    PostModel.countDocuments(filter),
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

export const getAllComments = async (page: number, limit: number, search = ''): Promise<CommentsResult> => {
  const skip = (page - 1) * limit;
  const filter = search
    ? { content: new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
    : {};
  const [comments, totalDocs] = await Promise.all([
    CommentModel.find(filter)
      .populate('author', 'name email')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    CommentModel.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(totalDocs / limit);
  return {
    comments,
    meta: { page, limit, totalDocs, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
  };
};

export const adminDeleteComment = async (commentId: string): Promise<void> => {
  const comment = await CommentModel.findById(commentId);
  if (!comment) throw new ApiError(HttpStatus.NOT_FOUND, Messages.COMMENT_NOT_FOUND);
  await comment.deleteOne();
};

