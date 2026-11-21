import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiResponse } from '../utils/ApiResponse';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import { IAuthRequest } from '../interfaces/IRequest';
import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from '../services/comment.service';

export const createCommentController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const comment = await createComment(req.params.postId, req.body.content, req.user!._id);
  ApiResponse.send(res, HttpStatus.CREATED, Messages.COMMENT_CREATED, comment);
});

export const getCommentsController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
  const { comments, meta } = await getCommentsByPost(req.params.postId, page, limit);
  ApiResponse.send(res, HttpStatus.OK, Messages.COMMENTS_FETCHED, comments, meta);
});

export const updateCommentController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const comment = await updateComment(req.params.id, req.body.content, req.user!);
  ApiResponse.send(res, HttpStatus.OK, Messages.COMMENT_UPDATED, comment);
});

export const deleteCommentController = catchAsync(async (req: IAuthRequest, res: Response) => {
  await deleteComment(req.params.id, req.user!);
  ApiResponse.send(res, HttpStatus.OK, Messages.COMMENT_DELETED);
});

