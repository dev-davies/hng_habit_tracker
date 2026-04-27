import { test, expect, type Page } from '@playwright/test';

type StoredUser = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};

type StoredSession = {
  userId: string;
  email: string;
};

type StoredHabit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  createdAt: string;
  completions: string[];
};

const STORAGE_KEYS = {
  users: 'habit-tracker-users',
  session: 'habit-tracker-session',
  habits: 'habit-tracker-habits',
} as const;

async function seedStorage(
  page: Page,
  {
    users = [],
    session = null,
    habits = [],
  }: {
    users?: StoredUser[];
    session?: StoredSession | null;
    habits?: StoredHabit[];
  } = {}
) {
  await page.addInitScript(
    ({ storageKeys, seededUsers, seededSession, seededHabits }) => {
      window.localStorage.clear();
      window.localStorage.setItem(storageKeys.users, JSON.stringify(seededUsers));
      window.localStorage.setItem(storageKeys.session, JSON.stringify(seededSession));
      window.localStorage.setItem(storageKeys.habits, JSON.stringify(seededHabits));
    },
    {
      storageKeys: STORAGE_KEYS,
      seededUsers: users,
      seededSession: session,
      seededHabits: habits,
    }
  );
}

async function waitForServiceWorker(page: Page) {
  await page.waitForLoadState('load');
  await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return;
    await navigator.serviceWorker.ready;
  });
}

test.describe('Habit Tracker app', () => {
  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await seedStorage(page);

    await page.goto('/');

    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/login');
    await expect(page.getByTestId('auth-login-email')).toBeVisible();
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    const user = {
      id: 'user-1',
      email: 'ada@example.com',
      password: 'secret123',
      createdAt: '2026-04-27T08:00:00.000Z',
    };

    await seedStorage(page, {
      users: [user],
      session: { userId: user.id, email: user.email },
    });

    await page.goto('/');

    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await seedStorage(page);

    await page.goto('/dashboard');

    await page.waitForURL('**/login');
    await expect(page.getByTestId('auth-login-email')).toBeVisible();
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await seedStorage(page);

    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('newuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('empty-state')).toBeVisible();

    const session = await page.evaluate<StoredSession | null>((key) => {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as StoredSession) : null;
    }, STORAGE_KEYS.session);

    expect(session?.email).toBe('newuser@example.com');
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    const createdAt = '2026-04-27T08:00:00.000Z';
    const users = [
      { id: 'user-1', email: 'owner@example.com', password: 'secret123', createdAt },
      { id: 'user-2', email: 'other@example.com', password: 'secret456', createdAt },
    ];
    const habits = [
      {
        id: 'habit-1',
        userId: 'user-1',
        name: 'Drink Water',
        description: 'Eight glasses',
        frequency: 'daily' as const,
        createdAt,
        completions: [],
      },
      {
        id: 'habit-2',
        userId: 'user-2',
        name: 'Practice Piano',
        description: 'Scales and chords',
        frequency: 'daily' as const,
        createdAt,
        completions: [],
      },
    ];

    await seedStorage(page, { users, habits });

    await page.goto('/login');

    await page.getByTestId('auth-login-email').fill('owner@example.com');
    await page.getByTestId('auth-login-password').fill('secret123');
    await page.getByTestId('auth-login-submit').click();

    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    await expect(page.getByTestId('habit-card-practice-piano')).toHaveCount(0);
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    const user = {
      id: 'user-1',
      email: 'creator@example.com',
      password: 'secret123',
      createdAt: '2026-04-27T08:00:00.000Z',
    };

    await seedStorage(page, {
      users: [user],
      session: { userId: user.id, email: user.email },
    });

    await page.goto('/dashboard');

    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Morning Run');
    await page.getByTestId('habit-description-input').fill('Run for 20 minutes');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-morning-run')).toBeVisible();
    await expect(page.getByTestId('habit-streak-morning-run')).toHaveText('0d streak');
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    const createdAt = '2026-04-27T08:00:00.000Z';
    const user = {
      id: 'user-1',
      email: 'reader@example.com',
      password: 'secret123',
      createdAt,
    };
    const habit = {
      id: 'habit-1',
      userId: user.id,
      name: 'Read',
      description: 'Ten pages',
      frequency: 'daily' as const,
      createdAt,
      completions: [],
    };

    await seedStorage(page, {
      users: [user],
      session: { userId: user.id, email: user.email },
      habits: [habit],
    });

    await page.goto('/dashboard');

    await expect(page.getByTestId('habit-streak-read')).toHaveText('0d streak');
    await page.getByTestId('habit-complete-read').click();
    await expect(page.getByTestId('habit-streak-read')).toHaveText('1d streak');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    const user = {
      id: 'user-1',
      email: 'persist@example.com',
      password: 'secret123',
      createdAt: '2026-04-27T08:00:00.000Z',
    };

    await seedStorage(page, {
      users: [user],
      session: { userId: user.id, email: user.email },
    });

    await page.goto('/dashboard');

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Meditate');
    await page.getByTestId('habit-description-input').fill('Ten quiet minutes');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-meditate')).toBeVisible();

    await page.reload();

    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-meditate')).toBeVisible();
    await expect(page.getByTestId('auth-logout-button')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    const user = {
      id: 'user-1',
      email: 'logout@example.com',
      password: 'secret123',
      createdAt: '2026-04-27T08:00:00.000Z',
    };

    await seedStorage(page, {
      users: [user],
      session: { userId: user.id, email: user.email },
    });

    await page.goto('/dashboard');

    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await page.getByTestId('auth-logout-button').click();

    await page.waitForURL('**/login');
    await expect(page.getByTestId('auth-login-email')).toBeVisible();

    const session = await page.evaluate<StoredSession | null>((key) => {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as StoredSession) : null;
    }, STORAGE_KEYS.session);

    expect(session).toBeNull();
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    await seedStorage(page);

    await page.goto('/login');
    await expect(page.getByTestId('auth-login-email')).toBeVisible();
    await waitForServiceWorker(page);

    await context.setOffline(true);
    await page.reload();

    await expect(page.getByTestId('auth-login-email')).toBeVisible();
    await expect(page.getByTestId('auth-login-submit')).toBeVisible();

    await context.setOffline(false);
  });
});
