'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function LayoutControl() {
  const pathname = usePathname();

  useEffect(() => {
    const isAdmin = pathname?.startsWith('/admin');
    if (isAdmin) {
      document.documentElement.classList.add('is-admin');
    } else {
      document.documentElement.classList.remove('is-admin');
    }
  }, [pathname]);

  return null;
}
