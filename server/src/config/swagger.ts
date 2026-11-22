export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'MERN Blog System REST API',
    version: '1.0.0',
    description: `
### Production-Grade MERN Blog System API
Built with **Node.js, Express, TypeScript, and MongoDB Mongoose**.

#### Key Features:
- **Cookie-Based Sessions**: JWT access and refresh tokens stored in secure, \`httpOnly\` cookies.
- **Role-Based Access Control (RBAC)**: Distinguishes between \`user\` and \`admin\` roles.
- **Post & Comment CRUD**: Slugs, soft deletes, nested relationships, and pagination.
- **Admin Dashboard**: Platform-wide metrics, user management, and article moderation.
- **Centralized Error Handling**: Standardized response format across all endpoints.
    `,
    contact: {
      name: 'API Support',
      url: 'http://localhost:5173',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API Version 1',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
        description: 'HTTP-only JWT access token cookie set on login/register.',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6b0005a21443a28aaba724cc' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          provider: { type: 'string', enum: ['local', 'google', 'facebook'], example: 'local' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Post: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6b0005f41443a28aaba724d7' },
          title: { type: 'string', example: 'Getting Started with MERN Stack' },
          content: { type: 'string', example: 'Comprehensive guide to modern full-stack development...' },
          slug: { type: 'string', example: 'getting-started-with-mern-stack' },
          author: { $ref: '#/components/schemas/User' },
          isDeleted: { type: 'boolean', example: false },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Comment: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6b00062a1443a28aaba724e1' },
          content: { type: 'string', example: 'Great article, thanks for sharing!' },
          author: { $ref: '#/components/schemas/User' },
          post: { type: 'string', example: '6b0005f41443a28aaba724d7' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 50, example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          password: {
            type: 'string',
            minLength: 8,
            description: 'Min 8 characters, must contain at least 1 uppercase letter and 1 number',
            example: 'Password123!',
          },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          password: { type: 'string', example: 'Password123!' },
        },
      },
      ForgotPasswordInput: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'john@example.com' },
        },
      },
      ResetPasswordInput: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: { type: 'string', minLength: 64, maxLength: 64, example: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' },
          password: {
            type: 'string',
            minLength: 8,
            description: 'At least 8 characters, including one uppercase letter and one number',
            example: 'Password123!',
          },
        },
      },
      CreatePostInput: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', minLength: 3, maxLength: 200, example: 'Modern Web Architecture' },
          content: { type: 'string', minLength: 10, example: 'Detailed article content explaining modern architectural patterns...' },
          thumbnailUrl: { type: 'string', description: 'Uploaded image path or a public image URL', example: '/api/v1/uploads/550e8400-e29b-41d4-a716-446655440000.jpg' },
        },
      },
      UpdatePostInput: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 3, maxLength: 200, example: 'Updated Article Title' },
          content: { type: 'string', minLength: 10, example: 'Updated article content...' },
          thumbnailUrl: { type: 'string', description: 'Uploaded image path or a public image URL', example: '/api/v1/uploads/550e8400-e29b-41d4-a716-446655440000.jpg' },
        },
      },
      CreateCommentInput: {
        type: 'object',
        required: ['content'],
        properties: {
          content: { type: 'string', minLength: 1, maxLength: 1000, example: 'Insightful perspective on this topic.' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          statusCode: { type: 'integer', example: 200 },
          message: { type: 'string', example: 'Request completed successfully' },
          data: { type: 'object' },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 10 },
              totalDocs: { type: 'integer', example: 42 },
              totalPages: { type: 'integer', example: 5 },
              hasNextPage: { type: 'boolean', example: true },
              hasPrevPage: { type: 'boolean', example: false },
            },
          },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          statusCode: { type: 'integer', example: 400 },
          message: { type: 'string', example: 'Error description' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'Invalid email address' },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user account',
        description: 'Creates a new user record and sets httpOnly authentication cookies.',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } },
          },
        },
        responses: {
          201: { description: 'User successfully created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          409: { description: 'Email already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
          422: { description: 'Validation failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Sign in with email and password',
        description: 'Authenticates credentials and sets access and refresh token cookies.',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } },
          },
        },
        '/auth/forgot-password': {
          post: {
            tags: ['Authentication'],
            summary: 'Request a password reset email',
            description: 'Sends a single-use password reset link when a local account exists for the email address.',
            requestBody: {
              required: true,
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordInput' } },
              },
            },
            responses: {
              200: { description: 'A reset email was sent if an account exists' },
              422: { description: 'Invalid email address' },
              503: { description: 'Email delivery is not configured' },
            },
          },
        },
        '/auth/reset-password': {
          post: {
            tags: ['Authentication'],
            summary: 'Set a new password using a reset token',
            requestBody: {
              required: true,
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordInput' } },
              },
            },
            responses: {
              200: { description: 'Password successfully updated' },
              400: { description: 'Reset token is invalid or expired' },
              422: { description: 'Invalid token or password' },
            },
          },
        },
        responses: {
          200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Invalid email or password', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Authentication'],
        summary: 'Rotate authentication session tokens',
        description: 'Validates the current refresh token cookie and issues a fresh pair of cookies.',
        responses: {
          200: { description: 'Tokens successfully refreshed' },
          401: { description: 'Invalid or expired refresh token' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Log out current session',
        security: [{ cookieAuth: [] }],
        description: 'Invalidates database refresh token and clears both authentication cookies.',
        responses: {
          200: { description: 'Successfully logged out' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current authenticated user profile',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'Authenticated user profile returned' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/posts': {
      get: {
        tags: ['Posts'],
        summary: 'Get paginated list of published articles',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Number of items per page' },
        ],
        responses: {
          200: { description: 'List of posts with pagination metadata' },
        },
      },
      post: {
        tags: ['Posts'],
        summary: 'Create a new blog article',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreatePostInput' } },
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['title', 'content'],
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                  thumbnail: { type: 'string', format: 'binary', description: 'Optional JPEG, PNG, WebP, or GIF image (max 5 MB)' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Article created successfully' },
          401: { description: 'Unauthorized' },
          422: { description: 'Validation failed' },
        },
      },
    },
    '/posts/{slug}': {
      get: {
        tags: ['Posts'],
        summary: 'Get single article by URL slug',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' }, description: 'URL-friendly slug' },
        ],
        responses: {
          200: { description: 'Article details' },
          404: { description: 'Post not found' },
        },
      },
    },
    '/posts/{id}': {
      put: {
        tags: ['Posts'],
        summary: 'Update an article (Author or Admin only)',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'MongoDB ObjectId' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdatePostInput' } },
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                  thumbnail: { type: 'string', format: 'binary', description: 'Optional JPEG, PNG, WebP, or GIF image (max 5 MB)' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Article updated successfully' },
          403: { description: 'Forbidden (Not the author or admin)' },
          404: { description: 'Post not found' },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: 'Soft-delete an article (Author or Admin only)',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Article soft-deleted successfully' },
          403: { description: 'Forbidden' },
          404: { description: 'Post not found' },
        },
      },
    },
    '/posts/{postId}/comments': {
      get: {
        tags: ['Comments'],
        summary: 'Get paginated comments for a specific post',
        parameters: [
          { name: 'postId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'List of comments' },
          404: { description: 'Post not found' },
        },
      },
      post: {
        tags: ['Comments'],
        summary: 'Add a comment to an article',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'postId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateCommentInput' } },
          },
        },
        responses: {
          201: { description: 'Comment created successfully' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/posts/comments/{id}': {
      put: {
        tags: ['Comments'],
        summary: 'Update comment (Author or Admin only)',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateCommentInput' } },
          },
        },
        responses: {
          200: { description: 'Comment updated successfully' },
          403: { description: 'Forbidden' },
          404: { description: 'Comment not found' },
        },
      },
      delete: {
        tags: ['Comments'],
        summary: 'Delete comment (Author or Admin only)',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Comment deleted successfully' },
          403: { description: 'Forbidden' },
          404: { description: 'Comment not found' },
        },
      },
    },
    '/admin/stats': {
      get: {
        tags: ['Admin Management'],
        summary: 'Get platform aggregated metrics',
        security: [{ cookieAuth: [] }],
        description: 'Returns total registered users, active articles, and comments.',
        responses: {
          200: { description: 'Admin statistics returned' },
          403: { description: 'Admin access required' },
        },
      },
    },
    '/admin/users': {
      get: {
        tags: ['Admin Management'],
        summary: 'List all registered platform users',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'List of users' },
          403: { description: 'Admin access required' },
        },
      },
    },
    '/admin/users/{id}': {
      delete: {
        tags: ['Admin Management'],
        summary: 'Permanently remove a user account',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'User deleted successfully' },
          403: { description: 'Admin access required' },
          404: { description: 'User not found' },
        },
      },
    },
    '/admin/posts': {
      get: {
        tags: ['Admin Management'],
        summary: 'List all posts across the platform (including soft-deleted)',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'List of posts' },
          403: { description: 'Admin access required' },
        },
      },
    },
    '/admin/posts/{id}': {
      delete: {
        tags: ['Admin Management'],
        summary: 'Moderate and soft-delete any article',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Post moderated/deleted successfully' },
          403: { description: 'Admin access required' },
          404: { description: 'Post not found' },
        },
      },
    },
  },
};
