'use client';

import { useSideBar } from '@/store/sidebarStore';
import { Sheet, SheetContent } from '../ui/sheet';
import { AppSidebarDesktopStatic } from './mobileStaticSidebar';

export function AppSidebarMobile() {
  const {isMobileSidebarOpen, setIsMobileSidebarOpen} = useSideBar();

  return (
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="z-[999] bg-[black] p-0 h-[100vh] w-[270px]">
          <div className="h-full">
            <AppSidebarDesktopStatic />
          </div>
        </SheetContent>
      </Sheet>
  );
}
