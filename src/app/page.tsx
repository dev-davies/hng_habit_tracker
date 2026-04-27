'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { getSession } from '@/lib/storage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getSession();
      router.replace(session ? '/dashboard' : '/login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
