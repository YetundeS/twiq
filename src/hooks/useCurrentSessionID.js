'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export const useCurrentSessionID = () => {
  const pathname = usePathname();

  const sessionId = useMemo(() => {
    if (!pathname) return null;
    const segments = pathname.split('/');
    const maybeUUID = segments[segments.length - 1];
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(maybeUUID);
    return isUUID ? maybeUUID : null;
  }, [pathname]);

  return sessionId;
};
