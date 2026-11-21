import { CommentModel } from '../models/Comment.model';
import { PostModel } from '../models/Post.model';
import { IComment } from '../interfaces/IComment';
import { IPaginationMeta } from '../interfaces/IApiResponse';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import { Role } from '../constants/roles';
import { IUserPayload } from '../interfaces/IUser';

export interface CommentsResult {
  comments: IComment[];
  meta: IPaginationMeta;
}

export const createComment = async (
  postId: string,
  content: string,
  authorId: string
): Promise<IComment> => {
  const post = await PostModel.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new ApiError(HttpStatus.NOT_FOUND, Messages.POST_NOT_FOUND);

  const comment = await CommentModel.create({ content, author: authorId, post: postId });
  return comment.populate('author', 'name email');
};

export const getCommentsByPost = async (
  postId: string,
  page: number,
  limit: number
): Promise<CommentsResult> => {
  const post = await PostModel.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new ApiError(HttpStatus.NOT_FOUND, Messages.POST_NOT_FOUND);

  const skip = (page - 1) * limit;
  const filter = { post: postId };

  const [comments, totalDocs] = await Promise.all([
    CommentModel.find(filter)
      .populate('author', 'name email')
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

export const updateComment = async (
  commentId: string,
  content: string,
  user: IUserPayload
): Promise<IComment> => {
  const comment = await CommentModel.findById(commentId);
  if (!comment) throw new ApiError(HttpStatus.NOT_FOUND, Messages.COMMENT_NOT_FOUND);

  if (user.role !== Role.ADMIN && comment.author.toString() !== user._id) {
    throw new ApiError(HttpStatus.FORBIDDEN, Messages.COMMENT_FORBIDDEN);
  }

  comment.content = content;
  await comment.save();
  return comment.populate('author', 'name email');
};

export const deleteComment = async (commentId: string, user: IUserPayload): Promise<void> => {
  const comment = await CommentModel.findById(commentId);
  if (!comment) throw new ApiError(HttpStatus.NOT_FOUND, Messages.COMMENT_NOT_FOUND);

  if (user.role !== Role.ADMIN && comment.author.toString() !== user._id) {
    throw new ApiError(HttpStatus.FORBIDDEN, Messages.COMMENT_FORBIDDEN);
  }

  await comment.deleteOne();
};

