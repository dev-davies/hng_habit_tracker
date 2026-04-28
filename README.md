# Habit Tracker PWA

A mobile-first Progressive Web App for daily habit tracking, built with Next.js 16, React 19, and TypeScript. This is a Stage 3 frontend task implementing client-side authentication, habit CRUD operations, streak tracking, and offline support — all powered by browser localStorage with zero backend dependencies.

## Setup Instructions

Requires Node.js 20+ and npm.

```bash
git clone <repo-url>
cd hng_habit_tracker
npm install
```

## Run Instructions

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app redirects unauthenticated users to `/login`. After signing up or logging in, you land on `/dashboard` where you can create, edit, complete, and delete daily habits.

For a production build:

```bash
npm run build
npm start
```

## Test Instructions

### Run all tests

```bash
npm test
```

This runs unit, integration, and e2e tests sequentially.

### Unit tests (with coverage)

```bash
npm run test:unit
```

Runs Vitest with V8 coverage against `src/lib/`. Enforces 100% threshold on lines, functions, branches, and statements.

### Integration tests

```bash
npm run test:integration
```

Runs Vitest with jsdom environment against React component integration tests using Testing Library.

### E2E tests

```bash
npm run test:e2e
```

Runs Playwright against the full app. Requires the dev server or a production build to be running, or Playwright's `webServer` config to handle it.

## Local Persistence Structure

All data is stored in the browser's `localStorage` under deterministic, namespaced keys. There is no backend or database.

| Key | Type | Description |
|---|---|---|
| `habit-tracker-users` | `User[]` | All registered user accounts (id, email, password, createdAt) |
| `habit-tracker-session` | `Session \| null` | The currently active session (userId, email), or null if logged out |
| `habit-tracker-habits` | `Habit[]` | All habits across all users (filtered by userId at read time) |

### How it works

- **Signup** creates a new `User` entry in the users array and sets the session.
- **Login** matches email + password against stored users and sets the session.
- **Logout** sets the session key to `null`.
- **Habits** are stored as a flat array. Each habit has a `userId` field. The dashboard filters to show only the logged-in user's habits via `getHabitsByUserId(session.userId)`.
- **Completions** are tracked as an array of ISO date strings (`YYYY-MM-DD`) on each habit. Toggling completion for today adds or removes today's date from the array.
- **Streaks** are calculated on-the-fly by counting consecutive completed days backwards from today using `calculateCurrentStreak()`.
- **Slug generation** converts habit names to URL-safe identifiers (lowercase, hyphenated, alphanumeric only) for use in dynamic `data-testid` attributes.

All reads/writes go through a centralized storage module (`src/lib/storage.ts`) that guards against SSR with an `isClient()` check and wraps JSON parse/stringify in try-catch for safety.

## PWA Support

### Web App Manifest

`public/manifest.json` declares the app as a standalone PWA with:
- App name: "Habit Tracker", short name: "Habits"
- Start URL: `/`
- Display mode: `standalone`
- Icons at 192x192 and 512x512

### Service Worker

A native service worker (`public/sw.js`) is registered on page load via a client component injected into the root layout. No external PWA libraries are used.

**Caching strategy:**

- **Install event**: Pre-caches the core app shell (all route pages, manifest, icons) using `cache.addAll()`.
- **Activate event**: Cleans up old cache versions and claims all clients immediately.
- **Fetch event**: Uses a network-first strategy. On success, the response is cloned into the cache for future offline use. On network failure, falls back to the cached version. If no cached match exists, falls back to the cached root `/` page so the app shell always renders.

After loading the app once while online, the cached app shell allows the app to render offline without crashing.

## UI & Design

### App Icon
The app icon (`public/icons/icon.svg`) represents a habit completion graphic:
- **Background:** White square with rounded corners.
- **Base Circle:** A thick, light grayish-blue circle in the center.
- **Progress Arc:** A thick orange arc layered over the top right quarter of the circle, representing progress.
- **Checkmark:** A thick orange checkmark in the middle, indicating completion.

### Aesthetic: Afro-Minimalist
The application uses a high-fidelity "Afro-Minimalist" design system characterized by:
- **Color Palette:** Warm stone tones (`stone-50` to `stone-950`) accented by vibrant orange (`orange-600`) for primary actions.
- **Visual Depth:** Hard-edged, offset shadows (`shadow-[4px_4px_0px_0px_rgba(249,115,22,0.2)]`) that provide a tactile, "neo-brutalist" feel.
- **Typography:** Bold, tight tracking for headings and semi-bold labels for clarity.
- **Responsive Shapes:** Generous `rounded-2xl` and `rounded-3xl` corners for a modern, friendly interface.

### Dashboard: Bento Grid
The main dashboard utilizes an asymmetrical bento grid layout:
- **Visual Hierarchy:** The first habit card in the list spans multiple columns and rows (`md:col-span-2 md:row-span-2`), creating a dynamic focal point.
- **Responsive Grid:** Automatically adapts from a single column on mobile to a multi-column grid on desktop, maximizing screen utilization.
- **Header Structure:** A 3-column CSS grid perfectly centers the elongated "+ New Habit" button, providing a balanced and premium desktop experience.

### Authentication & Habit Forms
Forms are designed for consistency and high-speed interaction:
- **Mobile-First:** Optimized for touch with oversized inputs (`py-4`) and large action buttons.
- **Micro-Interactions:** Subtle `active:scale-95` animations on buttons and smooth 150ms transitions during redirects.
- **Accessibility (WCAG 2.1 AA):** 
  - **High-Contrast Focus:** Global 4px orange focus rings with generous offsets for keyboard navigation.
  - **ARIA Standards:** Programmatically linked error messages (`aria-invalid`, `aria-describedby`) and live regions (`aria-live="polite"`) for screen readers.
  - **Contextual Labels:** Buttons include descriptive `aria-label` attributes (e.g., "Toggle completion for Drink water") and `aria-pressed` states.
  - **Theme Support:** Full support for system-level dark mode, transitioning smoothly between light stone and deep charcoal backgrounds.

## Trade-offs and Limitations

- **No real authentication**: Passwords are stored as plain text in localStorage. This is a client-side demo, not production-grade auth.
- **No cross-device sync**: All data lives in the browser. Clearing localStorage or switching browsers loses everything.
- **No server-side validation**: All validation (habit name length, duplicate emails) happens client-side only.
- **Single-browser isolation**: Different browsers on the same machine have separate data stores with no way to sync.
- **localStorage size limits**: Browsers typically cap localStorage at 5-10MB. Heavy usage could eventually hit this limit.
- **No conflict resolution**: If the same user signs up in two browser tabs simultaneously, race conditions are possible.
- **Frequency locked to daily**: The habit frequency is fixed to "daily" with no support for weekly or custom schedules.
- **Offline writes not queued**: While the app shell loads offline, any habit changes made offline are written to localStorage but there is no server to sync them to.

## Test File Mapping

Each test file maps to specific TRD behaviors:

### Unit Tests

| Test File | Describe Block | Verifies |
|---|---|---|
| `tests/unit/slug.test.ts` | `getHabitSlug` | Slug generation: lowercasing, space-to-hyphen conversion, trimming, collapsing repeated spaces, stripping non-alphanumeric characters |
| `tests/unit/validators.test.ts` | `validateHabitName` | Habit name validation: rejects empty names, rejects names exceeding 60 characters, trims and accepts valid names |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` | Completion toggling: adds date when not present, removes date when already present, immutability of original habit, deduplication of completion dates |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` | Streak calculation: returns 0 for empty completions, returns 0 when today is not completed, counts consecutive days correctly, ignores duplicates, breaks streak on missing days |

### Integration Tests

| Test File | Describe Block | Verifies |
|---|---|---|
| `tests/integration/auth-flow.test.tsx` | `auth flow` | End-to-end auth form behavior: signup creates session and redirects to dashboard, duplicate email shows error, login stores session and redirects, invalid credentials show error message |
| `tests/integration/habit-form.test.tsx` | `habit form` | Dashboard habit management: empty name shows validation error, creating a habit renders it in the list and persists to storage, editing preserves immutable fields (id, createdAt, completions), deleting requires explicit confirmation before removal, toggling completion updates streak display bidirectionally |

### E2E Tests

| Test File | Describe Block | Verifies |
|---|---|---|
| `tests/e2e/app.spec.ts` | `Habit Tracker app` | Full user journey: splash screen redirect, authenticated redirect to dashboard, unauthenticated route protection, signup flow, login with user-scoped habit isolation, habit creation from dashboard, completion and streak update, data persistence across page reload, logout and redirect, offline app shell loading via service worker cache |
