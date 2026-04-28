# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Habit Tracker app >> signs up a new user and lands on the dashboard
- Location: tests\e2e\app.spec.ts:109:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - heading "Create Account" [level=1] [ref=e4]
      - generic [ref=e5]:
        - generic [ref=e6]:
          - generic [ref=e7]: Email
          - textbox "Email" [active] [ref=e8]
        - generic [ref=e9]:
          - generic [ref=e10]: Password
          - textbox "Password" [ref=e11]
        - button "Sign Up" [ref=e12]
      - paragraph [ref=e13]:
        - text: Already have an account?
        - link "Log in" [ref=e14] [cursor=pointer]:
          - /url: /login
  - button "Open Next.js Dev Tools" [ref=e20] [cursor=pointer]:
    - img [ref=e21]
  - alert [ref=e24]
```

# Test source

```ts
  18  |   name: string;
  19  |   description: string;
  20  |   frequency: 'daily';
  21  |   createdAt: string;
  22  |   completions: string[];
  23  | };
  24  | 
  25  | const STORAGE_KEYS = {
  26  |   users: 'habit-tracker-users',
  27  |   session: 'habit-tracker-session',
  28  |   habits: 'habit-tracker-habits',
  29  | } as const;
  30  | 
  31  | async function seedStorage(
  32  |   page: Page,
  33  |   {
  34  |     users = [],
  35  |     session = null,
  36  |     habits = [],
  37  |   }: {
  38  |     users?: StoredUser[];
  39  |     session?: StoredSession | null;
  40  |     habits?: StoredHabit[];
  41  |   } = {}
  42  | ) {
  43  |   await page.addInitScript(
  44  |     ({ storageKeys, seededUsers, seededSession, seededHabits }) => {
  45  |       if (window.localStorage.getItem('__seeded__')) return;
  46  |       window.localStorage.clear();
  47  |       window.localStorage.setItem('__seeded__', 'true');
  48  |       window.localStorage.setItem(storageKeys.users, JSON.stringify(seededUsers));
  49  |       window.localStorage.setItem(storageKeys.session, JSON.stringify(seededSession));
  50  |       window.localStorage.setItem(storageKeys.habits, JSON.stringify(seededHabits));
  51  |     },
  52  |     {
  53  |       storageKeys: STORAGE_KEYS,
  54  |       seededUsers: users,
  55  |       seededSession: session,
  56  |       seededHabits: habits,
  57  |     }
  58  |   );
  59  | }
  60  | 
  61  | async function waitForServiceWorker(page: Page) {
  62  |   await page.waitForLoadState('load');
  63  |   await page.evaluate(async () => {
  64  |     if (!('serviceWorker' in navigator)) return;
  65  |     await navigator.serviceWorker.ready;
  66  |   });
  67  | }
  68  | 
  69  | test.describe('Habit Tracker app', () => {
  70  |   test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
  71  |     await seedStorage(page);
  72  | 
  73  |     await page.goto('/');
  74  | 
  75  |     await expect(page.getByTestId('splash-screen')).toBeVisible();
  76  |     await page.waitForURL('**/login');
  77  |     await expect(page.getByTestId('auth-login-email')).toBeVisible();
  78  |   });
  79  | 
  80  |   test('redirects authenticated users from / to /dashboard', async ({ page }) => {
  81  |     const user = {
  82  |       id: 'user-1',
  83  |       email: 'ada@example.com',
  84  |       password: 'secret123',
  85  |       createdAt: '2026-04-27T08:00:00.000Z',
  86  |     };
  87  | 
  88  |     await seedStorage(page, {
  89  |       users: [user],
  90  |       session: { userId: user.id, email: user.email },
  91  |     });
  92  | 
  93  |     await page.goto('/');
  94  | 
  95  |     await expect(page.getByTestId('splash-screen')).toBeVisible();
  96  |     await page.waitForURL('**/dashboard');
  97  |     await expect(page.getByTestId('dashboard-page')).toBeVisible();
  98  |   });
  99  | 
  100 |   test('prevents unauthenticated access to /dashboard', async ({ page }) => {
  101 |     await seedStorage(page);
  102 | 
  103 |     await page.goto('/dashboard');
  104 | 
  105 |     await page.waitForURL('**/login');
  106 |     await expect(page.getByTestId('auth-login-email')).toBeVisible();
  107 |   });
  108 | 
  109 |   test('signs up a new user and lands on the dashboard', async ({ page }) => {
  110 |     await seedStorage(page);
  111 | 
  112 |     await page.goto('/signup');
  113 | 
  114 |     await page.getByTestId('auth-signup-email').fill('newuser@example.com');
  115 |     await page.getByTestId('auth-signup-password').fill('password123');
  116 |     await page.getByTestId('auth-signup-submit').click();
  117 | 
> 118 |     await page.waitForURL('**/dashboard');
      |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  119 |     await expect(page.getByTestId('dashboard-page')).toBeVisible();
  120 |     await expect(page.getByTestId('empty-state')).toBeVisible();
  121 | 
  122 |     const session = await page.evaluate<StoredSession | null>((key) => {
  123 |       const raw = window.localStorage.getItem(key);
  124 |       return raw ? (JSON.parse(raw) as StoredSession) : null;
  125 |     }, STORAGE_KEYS.session);
  126 | 
  127 |     expect(session?.email).toBe('newuser@example.com');
  128 |   });
  129 | 
  130 |   test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
  131 |     const createdAt = '2026-04-27T08:00:00.000Z';
  132 |     const users = [
  133 |       { id: 'user-1', email: 'owner@example.com', password: 'secret123', createdAt },
  134 |       { id: 'user-2', email: 'other@example.com', password: 'secret456', createdAt },
  135 |     ];
  136 |     const habits = [
  137 |       {
  138 |         id: 'habit-1',
  139 |         userId: 'user-1',
  140 |         name: 'Drink Water',
  141 |         description: 'Eight glasses',
  142 |         frequency: 'daily' as const,
  143 |         createdAt,
  144 |         completions: [],
  145 |       },
  146 |       {
  147 |         id: 'habit-2',
  148 |         userId: 'user-2',
  149 |         name: 'Practice Piano',
  150 |         description: 'Scales and chords',
  151 |         frequency: 'daily' as const,
  152 |         createdAt,
  153 |         completions: [],
  154 |       },
  155 |     ];
  156 | 
  157 |     await seedStorage(page, { users, habits });
  158 | 
  159 |     await page.goto('/login');
  160 | 
  161 |     await page.getByTestId('auth-login-email').fill('owner@example.com');
  162 |     await page.getByTestId('auth-login-password').fill('secret123');
  163 |     await page.getByTestId('auth-login-submit').click();
  164 | 
  165 |     await page.waitForURL('**/dashboard');
  166 |     await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  167 |     await expect(page.getByTestId('habit-card-practice-piano')).toHaveCount(0);
  168 |   });
  169 | 
  170 |   test('creates a habit from the dashboard', async ({ page }) => {
  171 |     const user = {
  172 |       id: 'user-1',
  173 |       email: 'creator@example.com',
  174 |       password: 'secret123',
  175 |       createdAt: '2026-04-27T08:00:00.000Z',
  176 |     };
  177 | 
  178 |     await seedStorage(page, {
  179 |       users: [user],
  180 |       session: { userId: user.id, email: user.email },
  181 |     });
  182 | 
  183 |     await page.goto('/dashboard');
  184 | 
  185 |     await expect(page.getByTestId('dashboard-page')).toBeVisible();
  186 |     await page.getByTestId('create-habit-button').click();
  187 |     await page.getByTestId('habit-name-input').fill('Morning Run');
  188 |     await page.getByTestId('habit-description-input').fill('Run for 20 minutes');
  189 |     await page.getByTestId('habit-save-button').click();
  190 | 
  191 |     await expect(page.getByTestId('habit-card-morning-run')).toBeVisible();
  192 |     await expect(page.getByTestId('habit-streak-morning-run')).toHaveText('0d streak');
  193 |   });
  194 | 
  195 |   test('completes a habit for today and updates the streak', async ({ page }) => {
  196 |     const createdAt = '2026-04-27T08:00:00.000Z';
  197 |     const user = {
  198 |       id: 'user-1',
  199 |       email: 'reader@example.com',
  200 |       password: 'secret123',
  201 |       createdAt,
  202 |     };
  203 |     const habit = {
  204 |       id: 'habit-1',
  205 |       userId: user.id,
  206 |       name: 'Read',
  207 |       description: 'Ten pages',
  208 |       frequency: 'daily' as const,
  209 |       createdAt,
  210 |       completions: [],
  211 |     };
  212 | 
  213 |     await seedStorage(page, {
  214 |       users: [user],
  215 |       session: { userId: user.id, email: user.email },
  216 |       habits: [habit],
  217 |     });
  218 | 
```