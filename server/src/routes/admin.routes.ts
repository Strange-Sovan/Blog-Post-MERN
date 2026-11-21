import { Router } from 'express';
import {
  getDashboardStatsController,
  getAllUsersController,
  getAllPostsController,
  deleteUserController,
  deletePostController,
} from '../controllers/admin.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { adminLimiter } from '../middleware/rateLimiter';
import { Role } from '../constants/roles';

const router = Router();

router.use(adminLimiter, authenticate, authorize(Role.ADMIN));

router.get('/stats', getDashboardStatsController);
router.get('/users', getAllUsersController);
router.get('/posts', getAllPostsController);
router.delete('/users/:id', deleteUserController);
router.delete('/posts/:id', deletePostController);

export default router;

