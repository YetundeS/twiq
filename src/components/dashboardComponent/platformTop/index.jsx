import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ui/theme-provider';
import useAuthStore from '@/store/authStore';
import "@/styles/platformStyles.css";
import { ArrowLeft, CircleUserRound, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import './platformTop.css';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Menubar, MenubarContent, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { accountPopMenu } from '@/constants/dahsboard';
import { generateSignString } from '@/lib/utils';
import useLogOutDialogStore from '@/store/useLogOutDialogStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LogOutDialog from '../logOutDialog';

const PlatformTop = ({ db, twiqDefinition, setTwiqDefinition }) => {
    const { theme, setTheme } = useTheme();
    const { user } = useAuthStore();
    const [organization, setOrganization] = useState("");
    const { openDialog } = useLogOutDialogStore();

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
        <div className={`${db ? 'db' : ''} platformTop `}>

            {/* Header with Back Button */}
            {twiqDefinition && (
                <Button
                    onClick={() => setTwiqDefinition(false)}
                    className="mr-auto flex items-center bg-[transparent] gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:border-gray-400 hover:text-black dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            )}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="cursor-pointer text-white hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
                {theme === "dark" ? (
                    <Sun className="size-6" />
                ) : (
                    <Moon className="size-6" />
                )}
            </Button>

            <Menubar className="menuBar platformMenu">
                <MenubarMenu>
                    <MenubarTrigger className="menubarTrigger platformMenu">
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
                            <HoverCardContent className="newchat_hoverCardContent">
                                <span>Account</span>
                            </HoverCardContent>
                        </HoverCard>
                    </MenubarTrigger>
                    <MenubarContent className="menubarContent">
                        {accountPopMenu?.map((item, i) => {

                            if (item?.name === "Log Out") {
                                return (
                                        <div onClick={openDialog}
                                            className="menu_sideBarItem cursor-pointer"
                                        >
                                            <item.icon />
                                            <span>{item.name}</span>
                                        </div>
                                )
                            }
                            else if (item?.name === "Help") {
                                return (<Link
                                    href={`/help`}
                                    className="menu_sideBarItem"
                                >
                                    <item.icon />
                                    <span>{item.name}</span>
                                </Link>
                                )
                            }
                            else {
                                return (<Link
                                    href={`/platform/${organization}/${item.url}/`}
                                    className="menu_sideBarItem"
                                >
                                    <item.icon />
                                    <span>{item.name}</span>
                                </Link>
                                )
                            }
                        })}
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            <LogOutDialog />
        </div>
    )
}

export default PlatformTop