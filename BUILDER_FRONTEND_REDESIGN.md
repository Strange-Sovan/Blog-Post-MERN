# Builder.io Frontend Redesign Brief

## Goal

Redesign the BlogMERN frontend as a polished, responsive editorial blog. This is a visual and interaction-design refresh only. The existing application behavior must continue to work exactly as it does now.

## Non-negotiable: frontend only

Do not modify, replace, or bypass:

- The backend, database, schemas, API routes, or server configuration.
- Authentication, authorization, OAuth, session handling, or protected-route behavior.
- API request/response shapes, API clients, React Query hooks, or existing data/state logic.
- Existing route paths, form validation, permissions, pagination behavior, search behavior, upload behavior, or mutation handlers.
- Existing environment variables or credentials.

Use the current application data and callbacks. Do not add mock content, hard-coded API data, or new API endpoints. Do not introduce a second authentication or data-fetching system. Keep changes to the presentation layer: React markup, Tailwind/CSS, and reusable visual components.

## Existing frontend

- React + TypeScript, Vite, Tailwind CSS.
- React Router for navigation.
- React Query hooks and existing API modules provide data.
- Existing UI primitives are under `client/src/components/ui`.
- Main page and layout code is under `client/src/pages` and `client/src/components/layout`.

Treat existing component props, hooks, and event handlers as the source of truth. If generated Builder.io code does not match these interfaces, adapt the generated presentation rather than changing the interfaces or behavior.

## Visual direction

Create a distinctive, premium editorial style: modern digital magazine, approachable and calm, with clear reading hierarchy.

- Use warm off-white or very light neutral page backgrounds, deep ink/navy text, and a restrained violet/indigo accent.
- Use one display typeface for large editorial headings and a highly readable sans-serif for body text. Prefer the fonts already available unless adding a font is explicitly approved.
- Use generous whitespace, consistent spacing, subtle borders, soft shadows, and moderate corner radii.
- Make post imagery feel intentional: consistent aspect ratios, good cropping, and graceful placeholders when no image exists.
- Keep gradients as small accents rather than the background for every component.
- Avoid excessive animation, glass effects, tiny text, dense layouts, and generic dashboard template styling.

## Shared design system

Create consistent visual rules and reusable components for:

- Page width, responsive gutters, vertical spacing, and section headings.
- Primary, secondary, outline, destructive, and text buttons, including disabled/loading states.
- Inputs, textareas, selects, labels, validation errors, and focus states.
- Post cards, admin cards, tables, pagination controls, badges, dialogs, and alerts.
- Loading skeletons that match the shape of the content being loaded.
- Empty states and error states that explain what happened and retain the existing retry or navigation actions.

Maintain keyboard access, visible focus, sufficient contrast, semantic headings, and accessible names for icon-only controls.

## Page-by-page design

### Public navigation and footer

- Keep the BlogMERN identity and existing navigation destinations.
- Make Home, All Posts, Write, Sign In/Join, and the admin Dashboard entry easy to find at relevant screen sizes and authentication states.
- Preserve the current account/profile and logout behavior.
- Use a compact mobile navigation that does not hide essential actions.
- Keep the footer understated and consistent with the new visual system.

### Home (`/`)

- Design a clear editorial hero with a concise value proposition and links to browse stories and write a post.
- Keep the existing community/stat highlights.
- Feature the latest three posts in a responsive card grid.
- Include a visible link to All Posts (`/posts`).
- Preserve existing post-card links and the empty/error/loading states.

### All Posts (`/posts`)

- Make this the browsable archive for all published posts, using the existing post cards and API data.
- Keep pagination and the existing per-page choices: 5, 10, 20, 50, and 100.
- Make pagination controls usable on narrow screens and show the selected page size clearly.
- Preserve the existing empty, error, and loading states.

### Post detail (`/posts/:slug`)

- Prioritize title, author, publication date, cover image, and readable article content.
- Preserve edit/delete actions and their existing permission visibility.
- Keep the discussion, comment form, comment pagination, and confirmation dialog behavior.
- Keep existing sign-in prompts for unauthenticated commenting.

### Create and edit post

- Use a distraction-free writing layout with clearly labeled fields and helpful validation feedback.
- Keep thumbnail selection, preview, removal, and upload behavior.
- Preserve all form validation, submission, success, and error handling.

### Sign in and registration

- Use consistent, welcoming authentication layouts with clear form hierarchy.
- Preserve all field validation, password visibility controls, OAuth options, loading states, and navigation after success.
- Do not alter auth requests, token/session behavior, or auth-store integration.

### Admin (`/admin`)

- Make statistics easy to scan and provide clear links into management pages.
- Keep the existing admin-only access behavior and stats data.

### User management (`/admin/users`)

- Make the table readable and responsive, with an appropriate horizontal-scroll or compact mobile treatment.
- Preserve server-backed search, the 5/10/20/50/100 page-size options, pagination, role/provider display, delete confirmation, and loading/error/empty states.

### Post management (`/admin/posts`)

- Use a clear moderation table with visible title, author, status, date, and actions.
- Preserve server-backed search, the 5/10/20/50/100 page-size options, pagination, delete confirmation, and loading/error/empty states.

### Comment administration

- Do not add a Comments item to the admin sidebar. Preserve existing route and access behavior unless separately requested.

## Responsive behavior

- Start with mobile layouts, then enhance for tablet and desktop.
- Prevent horizontal page overflow. Admin tables may scroll inside their own container.
- Keep controls and tap targets comfortable on touch screens.
- Check long post titles, long user names/emails, empty images, and large text.
- Ensure navigation, dialogs, forms, cards, and pagination remain usable at narrow widths.

## Builder.io implementation instructions

Use Builder.io to create and refine the visual design, but integrate its output into the existing React application. Before replacing a component, inspect its current props and behavior. Preserve existing handlers and data bindings; change only structure and styling as needed.

Do not replace working pages with static Builder previews. Do not remove existing accessibility, validation, loading, empty, or error behavior. Do not add dependencies or edit files outside the frontend without explicit approval.

## Definition of done

- All existing routes and user flows still work.
- No backend, database, auth, API, or business-logic changes are included.
- Home shows the latest three posts; All Posts retains its page-size options and pagination.
- Admin search, pagination, moderation actions, and permission behavior remain intact.
- Loading, error, and empty states are designed rather than omitted.
- The site works at mobile, tablet, and desktop sizes.
- The client TypeScript/build checks pass.

## Prompt to give Builder.io

> Redesign the BlogMERN website as a polished, responsive editorial blog using the design brief in `BUILDER_FRONTEND_REDESIGN.md`. This is a frontend-only visual refresh. Do not change backend code, database models, APIs, authentication, authorization, React Query hooks, route paths, validation, state logic, or existing event handlers. Reuse the current React + TypeScript + Tailwind application and its real data. Preserve every existing flow, permission check, pagination option, search, upload, loading state, error state, and empty state. Adapt generated UI to the existing component interfaces; never replace the working app with static mockups or sample data.
