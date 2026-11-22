# Automated Test Case Inventory

The project currently has 42 backend Jest/Supertest test cases across four test
suites. These are integration-focused API tests; the frontend does not currently
have an automated test suite.

Run them from `server/` using a disposable MongoDB database:

```powershell
$env:MONGODB_URI = "mongodb://127.0.0.1:27017/blog_mern_test"
npm test -- --runInBand
```

Generate a coverage report with:

```powershell
$env:MONGODB_URI = "mongodb://127.0.0.1:27017/blog_mern_test"
npm run test:coverage -- --runInBand
```

The Jest setup connects to `MONGODB_URI`. The successful multipart post test
creates a post and removes it and its uploaded image in a `finally` block. Use a
test database, never a development or production database. Coverage is collected
under `server/coverage/`; no minimum coverage threshold is configured yet.

## Authentication — `server/src/tests/auth.test.ts`

| # | Test case | Expected result |
|---|---|---|
| 1 | Registration with missing fields | HTTP 422; validation failure |
| 2 | Registration with malformed email | HTTP 422; validation failure |
| 3 | Registration with a name containing numbers or special characters | HTTP 422; validation failure |
| 4 | Registration with a short password lacking uppercase/digit requirements | HTTP 422; validation failure |
| 5 | Registration password with no special character | HTTP 422; password field error |
| 6 | Login with an empty request body | HTTP 422; validation failure |
| 7 | Forgot-password request with malformed email | HTTP 422; validation failure |
| 8 | Reset-password request with an invalid token | HTTP 422; validation failure |
| 9 | Reset password with no special character | HTTP 422; password field error |
| 10 | Fetch current user without an access cookie | HTTP 401 |
| 11 | Create a post with a thumbnail without authentication | HTTP 401 |
| 12 | Health endpoint | HTTP 200; healthy response |
| 13 | OpenAPI JSON documentation endpoint | HTTP 200; OpenAPI 3.0 document |
| 14 | Swagger UI endpoint | HTTP 200; Swagger UI served |

## Admin and RBAC — `server/src/tests/admin.test.ts`

| # | Test case | Expected result |
|---|---|---|
| 15 | Fetch admin statistics without authentication | HTTP 401 |
| 16 | Fetch admin statistics as a regular user | HTTP 403 |
| 17 | Fetch admin statistics as an admin | HTTP 200; user, post, and comment counts |
| 18 | Fetch admin user list without authentication | HTTP 401 |
| 19 | Fetch admin user list as a regular user | HTTP 403 |
| 20 | Fetch admin user list as an admin | HTTP 200; user array and pagination metadata |
| 21 | Fetch admin user list with `limit=100` | HTTP 200; page limit is 100 |
| 22 | Fetch admin post list without authentication | HTTP 401 |
| 23 | Fetch admin post list as a regular user | HTTP 403 |
| 24 | Fetch admin post list as an admin | HTTP 200; post array |
| 25 | Fetch admin post list with `limit=100` | HTTP 200; page limit is 100 |
| 26 | Delete a user as a regular user | HTTP 403 |
| 27 | Delete an arbitrary admin post as a regular user | HTTP 403 |

## Posts — `server/src/tests/posts.test.ts`

| # | Test case | Expected result |
|---|---|---|
| 28 | Fetch public posts with default pagination | HTTP 200; array and page/limit metadata |
| 29 | Fetch public posts with custom page and limit | HTTP 200; requested pagination metadata |
| 30 | Fetch public posts with `limit=100` | HTTP 200; page limit is 100 |
| 31 | Create a post without an authentication cookie | HTTP 401 |
| 32 | Create a post with a title shorter than 3 characters | HTTP 422 |
| 33 | Create a post with content shorter than 10 characters | HTTP 422 |
| 34 | Create a post with a thumbnail in one multipart request | HTTP 201; image is saved and served; test data is cleaned up |
| 35 | Fetch a non-existent post slug | HTTP 404 |
| 36 | Update a post without an authentication cookie | HTTP 401 |
| 37 | Delete a post without an authentication cookie | HTTP 401 |

## Comments — `server/src/tests/comments.test.ts`

| # | Test case | Expected result |
|---|---|---|
| 38 | Fetch comments for a non-existent post | HTTP 404 |
| 39 | Create a comment without authentication | HTTP 401 |
| 40 | Create a comment with empty content | HTTP 422; validation errors returned |
| 41 | Update a comment without authentication | HTTP 401 |
| 42 | Delete a comment without authentication | HTTP 401 |

## Coverage gaps

The current inventory emphasizes request validation, authorization, pagination,
and selected public API behavior. It does not yet cover successful registration
and login flows, refresh-token rotation, reset-email delivery, post/comment
ownership success and denial cases, seed-script behavior, or frontend behavior.
Add focused tests for these paths as those areas are expanded.
