import { useSideBar } from '@/store/sidebarStore';
import { useMediaQuery } from 'usehooks-ts';

export function useResponsiveSidebarToggle() {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const { isSidebarOpen, isMobileSidebarOpen, setIsSidebarOpen, setIsMobileSidebarOpen } = useSideBar();

    const toggleSidebar = () => {
        if (isDesktop) {
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
        }
    };


    return toggleSidebar;
}
