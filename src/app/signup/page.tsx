'use client';

import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <SignupForm />
        <p className="text-sm text-zinc-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-foreground underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
