'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

async function loadFlyonUI() {
  return import('flyonui/flyonui');
}

export default function FlyonuiScript() {
  const path = usePathname();

  useEffect(() => {
    const initFlyonUI = async () => {
      try {
        await loadFlyonUI();
      } catch (error) {
        console.warn('Failed to load FlyonUI:', error);
      }
    };

    initFlyonUI();
  }, []);

  useEffect(() => {
    const initializeOverlays = () => {
      if (
        typeof window !== 'undefined' &&
        window.HSStaticMethods &&
        typeof window.HSStaticMethods.autoInit === 'function'
      ) {
        try {
          window.HSStaticMethods.autoInit();
        } catch (error) {
          console.warn('FlyonUI autoInit failed:', error);
        }
      }
    };

    // Try initialization with increasing delays to ensure DOM is ready
    const timeouts = [100, 300, 500].map(delay =>
      setTimeout(initializeOverlays, delay)
    );

    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, [path]);

  return null;
}
