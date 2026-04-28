'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      login(email, password);
      setTimeout(() => {
        router.push('/dashboard');
      }, 150);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto p-6 sm:p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-[4px_4px_0px_0px_rgba(249,115,22,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(249,115,22,0.1)] transition-all">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 mb-2">
          Welcome back.
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm">
          Enter your details to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className="text-sm font-semibold text-stone-700 dark:text-stone-300 ml-1">
            Email Address
          </label>
          <input
            id="login-email"
            data-testid="auth-login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl px-4 py-4 outline-none transition-all placeholder:text-stone-400"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="login-password" className="text-sm font-semibold text-stone-700 dark:text-stone-300 ml-1">
            Password
          </label>
          <input
            id="login-password"
            data-testid="auth-login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl px-4 py-4 outline-none transition-all placeholder:text-stone-400"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        <button
          data-testid="auth-login-submit"
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-4 py-4 font-bold text-lg tracking-wide transition-all active:scale-95 shadow-md flex justify-center items-center gap-2"
        >
          {isLoading ? 'Loading...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
