import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';
import { getSession, setSession, setUsers } from '@/lib/storage';

const pushMock = vi.fn();
const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));

beforeEach(() => {
  localStorage.clear();
  pushMock.mockClear();
  replaceMock.mockClear();
});

describe('auth flow', () => {
  test('submits the signup form and creates a session', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    const session = getSession();
    expect(session).not.toBeNull();
    expect(session!.email).toBe('test@example.com');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  test('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup();

    setUsers([
      { id: 'existing', email: 'dup@example.com', password: 'pass', createdAt: new Date().toISOString() },
    ]);

    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'dup@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    expect(screen.getByText('User already exists')).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  test('submits the login form and stores the active session', async () => {
    const user = userEvent.setup();

    setUsers([
      { id: 'user-1', email: 'login@example.com', password: 'secret', createdAt: new Date().toISOString() },
    ]);

    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'login@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'secret');
    await user.click(screen.getByTestId('auth-login-submit'));

    const session = getSession();
    expect(session).not.toBeNull();
    expect(session!.userId).toBe('user-1');
    expect(session!.email).toBe('login@example.com');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  test('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup();

    setUsers([
      { id: 'user-1', email: 'login@example.com', password: 'secret', createdAt: new Date().toISOString() },
    ]);

    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'login@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'wrong');
    await user.click(screen.getByTestId('auth-login-submit'));

    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
