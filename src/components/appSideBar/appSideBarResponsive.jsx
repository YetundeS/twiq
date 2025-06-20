'use client';

import { useMediaQuery } from 'usehooks-ts';
import { AppSidebarDesktop } from './appSidebarDesktop';
import { AppSidebarMobile } from './appSidebarMobile';

export function AppSidebar() {
  const isDesktop = useMediaQuery('(min-width: 768px)', { initializeWithValue: false });

  return isDesktop ? <AppSidebarDesktop /> : <AppSidebarMobile />;
}
