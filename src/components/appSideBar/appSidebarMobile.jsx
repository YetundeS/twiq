'use client';

import { useSideBar } from '@/store/sidebarStore';
import { Sheet, SheetContent } from '../ui/sheet';
import { AppSidebarDesktopStatic } from './mobileStaticSidebar';

export function AppSidebarMobile() {
  const {isMobileSidebarOpen, setIsMobileSidebarOpen} = useSideBar();

  const openSidebar = () => setIsMobileSidebarOpen(true);
  const closeSidebar = () => setIsMobileSidebarOpen(false);

  return (
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="z-[999] bg-[black] p-0 h-[100vh] w-[270px]">
          <div className="h-full">
            <AppSidebarDesktopStatic mobile />
          </div>
        </SheetContent>
      </Sheet>
  );
}
