'use client';

import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Log In</h1>
        <LoginForm />
        <p className="text-sm text-zinc-600">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="font-medium text-foreground underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
