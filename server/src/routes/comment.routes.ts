import { Router } from 'express';
import {
  createCommentController,
  getCommentsController,
  updateCommentController,
  deleteCommentController,
} from '../controllers/comment.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createCommentSchema, updateCommentSchema } from '../validators/comment.validator';

const router = Router();

router.get('/:postId/comments', getCommentsController);
router.post('/:postId/comments', authenticate, validate(createCommentSchema), createCommentController);
router.put('/comments/:id', authenticate, validate(updateCommentSchema), updateCommentController);
router.delete('/comments/:id', authenticate, deleteCommentController);

export default router;

