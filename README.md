# 📝 MERN Blog Post Application

A production-grade, full-stack Blog Management System built with the **MERN** stack (MongoDB, Express, React 19, Node.js) and **TypeScript** end-to-end. Features robust authentication with **httpOnly cookie sessions**, Role-Based Access Control (**RBAC**), advanced pagination and query indexing, Winston logging, rate limiting, and an Admin dashboard.

---

## 🏗️ Architecture & Production Standards

### 🛡️ Security & Authentication
- **HTTP-Only Cookies**: Access tokens (15m expiry) and refresh tokens (7d expiry) are strictly stored in `httpOnly`, `Secure`, `SameSite=Strict` cookies. No access tokens in `localStorage` or `sessionStorage` preventing XSS theft.
- **Refresh Token Rotation**: Automatic token rotation on 401 response via Axios interceptors.
- **Password Hashing**: Salted hashing via `bcryptjs` (cost factor 12) with pre-save mongoose hooks.
- **Rate Limiting**: Multi-tiered rate limiters via `express-rate-limit`:
  - Auth routes: strict (10 requests / 15 mins)
  - General API: 200 requests / 15 mins
  - Admin routes: 50 requests / 15 mins
- **OAuth 2.0**: Configured Passport.js strategies for Google and Facebook OAuth.

### 📐 Backend Clean Architecture
- **Layer Separation**: `routes` ➔ `middleware` (validation, auth, logging) ➔ `controllers` ➔ `services` (business logic) ➔ `models` (Mongoose).
- **`catchAsync` Wrapper**: Wraps asynchronous controllers to eliminate repetitive `try/catch` boilerplate.
- **`ApiResponse` & `ApiError`**: Standardized response structure across all endpoints (`{ success, statusCode, message, data, meta, errors }`).
- **Centralized Messages**: All client-facing strings stored in `src/constants/messages.ts`.
- **Winston & Morgan Logging**: Structured JSON logging to console and files (`logs/error.log`, `logs/combined.log`) with user activity audits.

### ⚡ Frontend Architecture
- **React 19 + Vite + TypeScript**: Blazing fast compilation with React 19 functional components and custom hooks.
- **TanStack React Query v5**: Server state management with automated caching, invalidation, and background synchronization.
- **Shadcn/ui & TailwindCSS**: Accessible, themeable UI components built on top of Radix UI primitives.
- **Axios Interceptors**: Transparent cookie credential transmission (`withCredentials: true`) and automated token refresh queue.

---

## 📁 Project Structure

The following tree lists the source and configuration files. Generated folders
such as `node_modules`, `dist`, `coverage`, uploads, logs, and local `.env` files
are intentionally excluded.

```
blog_post_mern/
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── admin.api.ts
│   │   │   ├── auth.api.ts
│   │   │   ├── axiosInstance.ts
│   │   │   ├── comment.api.ts
│   │   │   └── post.api.ts
│   │   ├── components/
│   │   │   ├── comments/CommentItem.tsx
│   │   │   ├── layout/
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   ├── posts/PostCard.tsx
│   │   │   └── ui/
│   │   │       ├── BackButton.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── ConfirmDialog.tsx
│   │   │       ├── input.tsx
│   │   │       ├── PageSkeleton.tsx
│   │   │       ├── TableSkeleton.tsx
│   │   │       └── toast.tsx
│   │   ├── hooks/
│   │   │   ├── useAdmin.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useComments.ts
│   │   │   └── usePosts.ts
│   │   ├── interfaces/
│   │   │   ├── IApiResponse.ts
│   │   │   ├── IComment.ts
│   │   │   ├── IPost.ts
│   │   │   └── IUser.ts
│   │   ├── lib/
│   │   │   ├── apiError.ts
│   │   │   ├── thumbnail.ts
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminComments.tsx
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminPosts.tsx
│   │   │   │   └── AdminUsers.tsx
│   │   │   ├── AllPostsPage.tsx
│   │   │   ├── AuthSuccessPage.tsx
│   │   │   ├── CreatePostPage.tsx
│   │   │   ├── EditPostPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── NotFoundPage.tsx
│   │   │   ├── PostDetailPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ResetPasswordPage.tsx
│   │   ├── routes/
│   │   │   ├── AdminRoute.tsx
│   │   │   ├── AppRouter.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── store/
│   │   │   ├── authStore.tsx
│   │   │   └── themeStore.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   ├── env.ts
│   │   │   ├── passport.ts
│   │   │   └── swagger.ts
│   │   ├── constants/
│   │   │   ├── httpStatus.ts
│   │   │   ├── messages.ts
│   │   │   └── roles.ts
│   │   ├── controllers/
│   │   │   ├── admin.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── comment.controller.ts
│   │   │   └── post.controller.ts
│   │   ├── interfaces/
│   │   │   ├── IApiResponse.ts
│   │   │   ├── IComment.ts
│   │   │   ├── IPost.ts
│   │   │   ├── IRequest.ts
│   │   │   └── IUser.ts
│   │   ├── middleware/
│   │   │   ├── activityLogger.ts
│   │   │   ├── authenticate.ts
│   │   │   ├── authorize.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── rateLimiter.ts
│   │   │   ├── uploadThumbnail.ts
│   │   │   └── validate.ts
│   │   ├── models/
│   │   │   ├── Comment.model.ts
│   │   │   ├── Post.model.ts
│   │   │   └── User.model.ts
│   │   ├── routes/
│   │   │   ├── admin.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── comment.routes.ts
│   │   │   ├── index.ts
│   │   │   └── post.routes.ts
│   │   ├── seeders/adminSeeder.ts
│   │   ├── services/
│   │   │   ├── admin.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── comment.service.ts
│   │   │   └── post.service.ts
│   │   ├── tests/
│   │   │   ├── admin.test.ts
│   │   │   ├── auth.test.ts
│   │   │   ├── comments.test.ts
│   │   │   ├── posts.test.ts
│   │   │   └── setup.ts
│   │   ├── types/express.d.ts
│   │   ├── utils/
│   │   │   ├── ApiError.ts
│   │   │   ├── ApiResponse.ts
│   │   │   ├── catchAsync.ts
│   │   │   ├── cookieOptions.ts
│   │   │   ├── email.ts
│   │   │   ├── jwt.ts
│   │   │   ├── logger.ts
│   │   │   └── slugify.ts
│   │   ├── validators/
│   │   │   ├── auth.validator.ts
│   │   │   ├── comment.validator.ts
│   │   │   └── post.validator.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── jest.config.js
│   ├── nodemon.json
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── .gitignore
├── README.md
└── TEST_CASES.md
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (local server or MongoDB Atlas URI)

### 1. Configure and run the server (PowerShell)

From the repository root:

```powershell
Set-Location .\server

npm install
Copy-Item .env.example .env
notepad .env
npm run seed
npm run dev
```
The server runs at `http://localhost:5000`, with API routes under
`http://localhost:5000/api/v1`. Edit `server/.env` and set the required variables
before starting the server or running the seeder.

#### Server environment variables

This table documents every variable in [`/.env.example`]

| Variable | Required | Purpose / default |
|---|---|---|
| `NODE_ENV` | No | Runtime mode; defaults to `development`. |
| `PORT` | No | API port; defaults to `5000`. |
| `MONGODB_URI` | Yes | MongoDB connection string, e.g. `mongodb://127.0.0.1:27017/blog_mern`. |
| `JWT_ACCESS_SECRET` | Yes | Private secret used to sign access tokens. |
| `JWT_REFRESH_SECRET` | Yes | Different private secret used to sign refresh tokens. |
| `JWT_ACCESS_EXPIRES_IN` | No | Access-token expiry; defaults to `15m`. |
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh-token expiry; defaults to `7d`. |
| `CLIENT_URL` | No | Client origin used in reset emails; defaults to `http://localhost:5173`. |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID; configure with `GOOGLE_CLIENT_SECRET` to enable Google OAuth. |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret. |
| `GOOGLE_CALLBACK_URL` | No | Google OAuth callback; defaults to `http://localhost:5000/api/v1/auth/google/callback`. |
| `FACEBOOK_APP_ID` | No | Facebook OAuth app ID; configure with `FACEBOOK_APP_SECRET` to enable Facebook OAuth. |
| `FACEBOOK_APP_SECRET` | No | Facebook OAuth app secret. |
| `SMTP_HOST` | For reset email | SMTP server, e.g. `smtp.gmail.com`. |
| `SMTP_PORT` | No | SMTP port; defaults to `587`. |
| `SMTP_SECURE` | No | Set `true` for implicit TLS (commonly port `465`); otherwise `false`. |
| `SMTP_USER` | For authenticated SMTP | Set together with `SMTP_PASSWORD`, or leave both empty. |
| `SMTP_PASSWORD` | For authenticated SMTP | SMTP credential. For Gmail, use a Google App Password, not the regular account password. |
| `SMTP_FROM` | For reset email | Sender address; defaults to `SMTP_USER`. |
| `ADMIN_EMAIL` | For seeding | Email for the seeded administrator. |
| `ADMIN_PASSWORD` | For seeding | Password for the seeded administrator; choose a private strong value. |
| `USER_EMAIL` | For seeding | Email for the seeded regular user. |
| `USER_PASSWORD` | For seeding | Password for the seeded regular user; choose a different private strong value. |

`MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` are required to
start the server. Generate two different JWT secrets locally, for example by
running `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
twice. Never commit your populated `.env` file or share its secrets.

#### Seed login accounts

The template uses these example email addresses:

| Role | Example email | Password |
|---|---|---|
| Admin | `admin@example.com` (`ADMIN_EMAIL`) | Set a private strong value in `ADMIN_PASSWORD`. |
| Regular user | `user@example.com` (`USER_EMAIL`) | Set a different private strong value in `USER_PASSWORD`. |

No reusable passwords are committed to this repository. Choose passwords of at
least 8 characters that include an uppercase letter, a number, and a special
character. The seeder refuses to run if these four account variables are
missing, if both emails are the same, or if either password fails the policy.

Run `npm run seed` from `server/`. It creates the admin and regular user if their
emails do not already exist. It also creates three sample posts and comments
when the database has no active posts. Existing accounts are not given a new
password by rerunning the seeder; for predictable review credentials, use a
fresh local/test database and the values configured in `server/.env`.

Password reset email is optional for local development. To enable it with Gmail,
set `SMTP_USER` and `SMTP_FROM` to the Gmail address and `SMTP_PASSWORD` to a
Google App Password (not the regular Gmail password). Reset links expire after
one hour and can only be used once.

### 2. Run the client

Open a second terminal at the repository root:

```powershell
Set-Location .\client
npm install
npm run dev
```

The client runs at `http://localhost:5173`. No client-side environment variables
are required for the local Vite setup.

---

## 📖 Interactive Swagger API Documentation

The complete interactive Swagger UI is served automatically by the backend server:
- **Swagger UI**: [http://localhost:5000/docs](http://localhost:5000/docs) (or [http://localhost:5000/api/v1/docs](http://localhost:5000/api/v1/docs))
- **OpenAPI 3.0 Raw JSON Specification**: [http://localhost:5000/api/v1/docs.json](http://localhost:5000/api/v1/docs.json)

You can explore all endpoints, schemas, parameters, and directly test requests via the Swagger UI interface.

---

---

## 📡 API Documentation Overview

All API endpoints are prefixed with `/api/v1`.

### 🔑 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/auth/register` | Register new user account | Public (Rate-limited) |
| `POST` | `/auth/login` | Authenticate with email/password & set cookies | Public (Rate-limited) |
| `POST` | `/auth/forgot-password` | Email a password reset link | Public (Rate-limited) |
| `POST` | `/auth/reset-password` | Set a new password using a reset token | Public (Rate-limited) |
| `POST` | `/auth/refresh` | Rotate access & refresh token cookies | Public (Refresh Cookie) |
| `POST` | `/auth/logout` | Invalidate refresh token & clear cookies | Authenticated |
| `GET` | `/auth/me` | Fetch authenticated user profile | Authenticated |
| `GET` | `/auth/google` | Initiate Google OAuth 2.0 flow | Public |
| `GET` | `/auth/facebook` | Initiate Facebook OAuth 2.0 flow | Public |

### 📰 Posts (`/api/v1/posts`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/posts?page=1&limit=10` | Get paginated active posts | Public |
| `GET` | `/posts/:slug` | Get single post details by URL slug | Public |
| `POST` | `/posts` | Create new blog post (auto slug generated) | Authenticated |
| `PUT` | `/posts/:id` | Update post (Author or Admin only) | Authenticated |
| `DELETE`| `/posts/:id` | Soft-delete post (`isDeleted: true`) | Authenticated (Author/Admin) |

### 💬 Comments (`/api/v1/posts`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/posts/:postId/comments` | Get paginated comments for post | Public |
| `POST` | `/posts/:postId/comments` | Add a comment to post | Authenticated |
| `PUT` | `/posts/comments/:id` | Update comment content | Authenticated (Author/Admin) |
| `DELETE`| `/posts/comments/:id` | Delete comment | Authenticated (Author/Admin) |

### 👑 Admin Management (`/api/v1/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/admin/stats` | Aggregated metrics (users, posts, comments) | Admin Role Only |
| `GET` | `/admin/users?page=1` | Paginated list of all users | Admin Role Only |
| `GET` | `/admin/posts?page=1` | Paginated list of all posts (including deleted) | Admin Role Only |
| `GET` | `/admin/comments?page=1` | Paginated list of comments | Admin Role Only |
| `DELETE`| `/admin/users/:id` | Delete user account | Admin Role Only |
| `DELETE`| `/admin/posts/:id` | Moderate/delete any post | Admin Role Only |
| `DELETE`| `/admin/comments/:id` | Delete any comment | Admin Role Only |

---

## 🧪 Testing

The backend uses **Jest** and **Supertest**. There are currently 42 API test
cases across authentication, posts, comments, and admin/RBAC suites. The complete
test-by-test inventory and expected results are in [TEST_CASES.md](./TEST_CASES.md).
The frontend does not currently have an automated test suite.

Run tests from `server/` against a disposable test database. The test setup
loads `server/.env`, so explicitly override `MONGODB_URI` to avoid using your
development database:

```powershell
Set-Location .\server
$env:MONGODB_URI = "mongodb://127.0.0.1:27017/blog_mern_test"
npm test -- --runInBand
```

Generate a coverage report:

```powershell
$env:MONGODB_URI = "mongodb://127.0.0.1:27017/blog_mern_test"
npm run test:coverage -- --runInBand
```

The report is written to `server/coverage/`, which is ignored by Git. Coverage
collection is configured, but the project does not currently enforce a minimum
coverage percentage. The last measured baseline was 56.70% statements, 55.65%
lines, 35.39% branches, and 40.56% functions. See the coverage gaps in
[TEST_CASES.md](./TEST_CASES.md) for areas needing additional tests. Tests that
query MongoDB require the test database to be available. The multipart post
test removes its inserted post and uploaded file afterward; still, never point
tests at a production database.

