'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Prevent the auto-reload from interrupting Playwright E2E tests
        if (!navigator.webdriver) {
          window.location.reload();
        }
      });
    }
  }, []);

  return null;
}
