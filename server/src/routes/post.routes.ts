import { Router } from 'express';
import {
  createPostController,
  getPostsController,
  getPostBySlugController,
  updatePostController,
  deletePostController,
} from '../controllers/post.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { activityLogger } from '../middleware/activityLogger';
import { createPostSchema, updatePostSchema } from '../validators/post.validator';
import { uploadThumbnail } from '../middleware/uploadThumbnail';

const router = Router();

router.get('/', getPostsController);
router.post('/', authenticate, uploadThumbnail, validate(createPostSchema), activityLogger('POST_CREATED'), createPostController);
router.get('/:slug', getPostBySlugController);
router.put('/:id', authenticate, uploadThumbnail, validate(updatePostSchema), activityLogger('POST_UPDATED'), updatePostController);
router.delete('/:id', authenticate, activityLogger('POST_DELETED'), deletePostController);

export default router;
