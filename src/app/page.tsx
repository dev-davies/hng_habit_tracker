'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { STORAGE_KEYS } from '@/lib/constants';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // TRD Requirement: Splash must be visible for 800ms - 2000ms
    const timer = setTimeout(() => {
      const session = localStorage.getItem(STORAGE_KEYS.session);
      
      if (session && session !== 'null') {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
