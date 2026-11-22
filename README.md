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

```
blog_post_mern/
├── server/                        # Express + TypeScript Backend
│   ├── src/
│   │   ├── config/                # DB connection, env parser, OAuth passport
│   │   ├── constants/             # HTTP status codes, messages, roles
│   │   ├── controllers/           # HTTP handlers
│   │   ├── interfaces/            # TypeScript interfaces (IUser, IPost, etc.)
│   │   ├── middleware/            # Auth, RBAC, Rate limiter, Logger, Zod validator
│   │   ├── models/                # Mongoose schemas (User, Post, Comment)
│   │   ├── routes/                # API versioned routes (/api/v1)
│   │   ├── services/              # Business logic layer
│   │   ├── utils/                 # ApiError, ApiResponse, catchAsync, JWT, logger
│   │   ├── validators/            # Zod validation schemas
│   │   ├── app.ts                 # Express application configuration
│   │   └── server.ts              # Server bootstrap and lifecycle
│   ├── tests/                     # Unit and integration test suites
│   ├── package.json
│   └── tsconfig.json
│
└── client/                        # React 19 + Vite + TypeScript Frontend
    ├── src/
    │   ├── api/                   # Axios instance with interceptors & endpoints
    │   ├── components/
    │   │   ├── ui/                # Button, Input, Card, Badge (Shadcn style)
    │   │   ├── layout/            # Navbar, footer
    │   │   ├── posts/             # PostCard, PostList
    │   │   └── comments/          # CommentItem, comment forms
    │   ├── hooks/                 # React Query custom hooks
    │   ├── interfaces/            # Shared data contracts
    │   ├── pages/
    │   │   ├── HomePage.tsx       # Paginated posts display
    │   │   ├── LoginPage.tsx      # Sign in & OAuth buttons
    │   │   ├── RegisterPage.tsx   # Sign up with Zod validation
    │   │   ├── PostDetailPage.tsx # Post view with comments section
    │   │   ├── CreatePostPage.tsx # Article authoring
    │   │   ├── EditPostPage.tsx   # Article editing
    │   │   └── admin/             # Dashboard, Users & Posts management
    │   ├── routes/                # ProtectedRoute, AdminRoute, AppRouter
    │   ├── store/                 # Auth Context Provider (user state in memory)
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.ts
    └── vite.config.ts
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (local community server running at `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 1. Server Setup
```bash
cd server

# Install dependencies
npm install

# Copy environment template, then replace the example values with unique secrets
cp .env.example .env

# Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.
# Use a unique, strong password; the seeder has no built-in admin credentials.

# Run database seeder (creates the configured admin and sample posts/comments)
npm run seed

# Start development server
npm run dev
```
The server will start on `http://localhost:5000` with API root at `http://localhost:5000/api/v1`.

The seeder creates an admin account using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from
`server/.env`. It also adds sample posts and comments if no active posts exist.
No default account password is shipped with the project.

Password recovery emails use Gmail SMTP. In `server/.env`, set
`SMTP_USER` and `SMTP_FROM` to your Gmail address and `SMTP_PASSWORD` to a
Google App Password (not your regular Gmail password). To create one, enable
2-Step Verification on the Google account, then create an App Password under
Google Account → Security. The SMTP host, port, and TLS settings are shown in
`server/.env.example`. Restart the server after changing the settings.

Reset links expire after one hour and can only be used once. Keep the App
Password private and never commit `server/.env`.

---

## 📖 Interactive Swagger API Documentation

The complete interactive Swagger UI is served automatically by the backend server:
- **Swagger UI**: [http://localhost:5000/docs](http://localhost:5000/docs) (or [http://localhost:5000/api/v1/docs](http://localhost:5000/api/v1/docs))
- **OpenAPI 3.0 Raw JSON Specification**: [http://localhost:5000/api/v1/docs.json](http://localhost:5000/api/v1/docs.json)

You can explore all endpoints, schemas, parameters, and directly test requests via the Swagger UI interface.

---

### 2. Client Setup
```bash
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend application will be live at `http://localhost:5173`.

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
| `DELETE`| `/admin/users/:id` | Delete user account | Admin Role Only |
| `DELETE`| `/admin/posts/:id` | Moderate/delete any post | Admin Role Only |

---

## 🧪 Testing & Scenarios

Run the full automated backend test suite (32 unit & integration test scenarios):
```bash
cd server
npm test
```

### Tested Scenarios:
1. **Authentication Suite (`auth.test.ts`)**:
   - Validation failures on missing required registration fields (`422`)
   - Validation failure on malformed email address (`422`)
   - Validation failure on weak password missing uppercase or digit (`422`)
   - Validation failure on empty login payload (`422`)
   - Auth rejection when access cookie is absent (`401`)
   - Health check endpoint (`200 OK`)
   - Swagger OpenAPI JSON specification endpoint validation (`200 OK`)
   - Swagger UI endpoint validation (`200 OK`)
2. **Posts Suite (`posts.test.ts`)**:
   - Public retrieval of paginated articles with page/limit metadata (`200 OK`)
   - Pagination parameter customization (`?page=2&limit=5`)
   - Protected creation rejection without cookie (`401`)
   - Zod validation for short title (`< 3` chars) (`422`)
   - Zod validation for short content (`< 10` chars) (`422`)
   - Non-existent article slug handling (`404 Not Found`)
   - Protected update rejection without auth (`401`)
   - Protected delete rejection without auth (`401`)
3. **Comments Suite (`comments.test.ts`)**:
   - Query comments on non-existent post (`404 Not Found`)
   - Unauthenticated comment creation attempt (`401`)
   - Empty comment content validation rejection (`422`)
   - Unauthenticated comment update rejection (`401`)
   - Unauthenticated comment deletion rejection (`401`)
4. **Admin Panel & RBAC Suite (`admin.test.ts`)**:
   - Unauthenticated stats access rejection (`401`)
   - **RBAC verification**: Regular user access rejection to admin stats (`403 Forbidden`)
   - **Admin access**: Verified admin role token accessing platform stats (`200 OK`)
   - Unauthenticated user list retrieval (`401`)
   - **RBAC verification**: Regular user access rejection to user list (`403 Forbidden`)
   - **Admin access**: Admin token successfully retrieving all users list (`200 OK`)
   - Unauthenticated posts moderation list (`401`)
   - **RBAC verification**: Regular user access rejection to all posts list (`403 Forbidden`)
   - **Admin access**: Admin token successfully retrieving all posts list (`200 OK`)
   - Regular user prohibited from deleting user accounts (`403 Forbidden`)
   - Regular user prohibited from deleting arbitrary posts (`403 Forbidden`)

