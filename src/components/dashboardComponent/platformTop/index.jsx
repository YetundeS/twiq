import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ui/theme-provider';
import useAuthStore from '@/store/authStore';
import { CircleUserRound, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import './platformTop.css';


import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { accountPopMenu } from '@/constants/dahsboard';
import { generateSignString } from '@/lib/utils';
import { useEffect, useState } from 'react';

const PlatformTop = () => {
    const { theme, setTheme } = useTheme();
    const { user } = useAuthStore();
    const [organization, setOrganization] = useState("");

    useEffect(() => {
        if (!user) return;
        const signString = generateSignString(user?.organization_name);
        setOrganization(signString);
    }, [user]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const FALLBACK_IMG = 'https://api.dicebear.com/7.x/identicon/svg?seed=mufutau'

    return (
        <div className="platformTop">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="cursor-pointer text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
                {theme === "dark" ? (
                    <Sun className="size-6" />
                ) : (
                    <Moon className="size-6" />
                )}
            </Button>

            <Menubar className="menuBar platformTop">
                <MenubarMenu>
                    <MenubarTrigger className="menubarTrigger platformTop">
                        <HoverCard>
                            <HoverCardTrigger>
                                <div className="pt_imageBox">
                                    {user?.avatar_url ? (
                                        <Image
                                            src={user?.avatar_url || FALLBACK_IMG}
                                            width={60}
                                            height={60}
                                            alt="profile Image"
                                            className="profileImg"
                                        />
                                    ) : (
                                        <CircleUserRound />
                                    )}
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className={`newchat_hoverCardContent`}>
                                <span>Account</span>
                            </HoverCardContent>
                        </HoverCard>
                    </MenubarTrigger>
                    <MenubarContent className="menubarContent">
                        {accountPopMenu?.map((item, i) => (
                            <MenubarItem key={i} className="menubarItem platformTop">
                                <a
                                    href={`/platform/${organization}/${item.url}/`}
                                    className="menu_sideBarItem"
                                >
                                    <item.icon />
                                    <span>{item.name}</span>
                                </a>
                            </MenubarItem>
                        ))}
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    )
}

export default PlatformTop