import { Router } from 'express';
import passport from 'passport';
import {
  register,
  login,
  forgotPassword,
  resetPasswordHandler,
  refresh,
  logout,
  getMe,
  googleCallback,
  facebookCallback,
} from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { activityLogger } from '../middleware/activityLogger';
import { authLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';
import { env } from '../config/env';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), activityLogger('LOGIN'), login);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPasswordHandler);
router.post('/refresh', refresh);
router.post('/logout', authenticate, activityLogger('LOGOUT'), logout);
router.get('/me', authenticate, getMe);

// Google OAuth
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
  router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleCallback);
} else {
  router.get('/google', (_req, res) => {
    res.status(501).json({ success: false, message: 'Google OAuth not configured in environment variables' });
  });
}

// Facebook OAuth
if (env.FACEBOOK_APP_ID && env.FACEBOOK_APP_SECRET && env.FACEBOOK_APP_ID !== 'your_facebook_app_id_here') {
  router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));
  router.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: '/login' }), facebookCallback);
} else {
  router.get('/facebook', (_req, res) => {
    res.status(501).json({ success: false, message: 'Facebook OAuth not configured in environment variables' });
  });
}

export default router;

