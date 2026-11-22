export const Messages = {
  // Auth
  AUTH_REGISTER_SUCCESS: 'User registered successfully',
  AUTH_LOGIN_SUCCESS: 'Logged in successfully',
  AUTH_LOGOUT_SUCCESS: 'Logged out successfully',
  AUTH_TOKEN_REFRESHED: 'Token refreshed successfully',
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_EMAIL_EXISTS: 'An account with this email already exists',
  AUTH_UNAUTHORIZED: 'You must be logged in to access this resource',
  AUTH_TOKEN_EXPIRED: 'Session expired. Please log in again',
  AUTH_TOKEN_INVALID: 'Invalid token. Please log in again',
  AUTH_PASSWORD_RESET_REQUESTED: 'If an account exists for that email, a password reset link has been sent.',
  AUTH_PASSWORD_RESET_SUCCESS: 'Password has been reset successfully. Please sign in.',
  AUTH_PASSWORD_RESET_INVALID: 'This password reset link is invalid or has expired.',
  AUTH_EMAIL_NOT_CONFIGURED: 'Password reset email is not configured. Please contact the site administrator.',

  // User
  USER_NOT_FOUND: 'User not found',
  USER_FETCHED: 'User fetched successfully',
  USERS_FETCHED: 'Users fetched successfully',
  USER_DELETED: 'User deleted successfully',
  USER_UPDATED: 'User updated successfully',

  // Post
  POST_CREATED: 'Post created successfully',
  POST_UPDATED: 'Post updated successfully',
  POST_DELETED: 'Post deleted successfully',
  POST_FETCHED: 'Post fetched successfully',
  POSTS_FETCHED: 'Posts fetched successfully',
  POST_NOT_FOUND: 'Post not found',
  POST_FORBIDDEN: 'You are not allowed to modify this post',

  // Comment
  COMMENT_CREATED: 'Comment created successfully',
  COMMENT_UPDATED: 'Comment updated successfully',
  COMMENT_DELETED: 'Comment deleted successfully',
  COMMENT_FETCHED: 'Comment fetched successfully',
  COMMENTS_FETCHED: 'Comments fetched successfully',
  COMMENT_NOT_FOUND: 'Comment not found',
  COMMENT_FORBIDDEN: 'You are not allowed to modify this comment',

  // Admin
  ADMIN_STATS_FETCHED: 'Dashboard stats fetched successfully',
  ADMIN_FORBIDDEN: 'Admin access required',

  // Validation
  VALIDATION_ERROR: 'Validation failed',
  INVALID_ID: 'Invalid resource ID',

  // Server
  INTERNAL_ERROR: 'An internal server error occurred',
  ROUTE_NOT_FOUND: 'The requested route does not exist',
} as const;

