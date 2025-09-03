import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ui/theme-provider';
import useAuthStore from '@/store/authStore';
import "@/styles/platformStyles.css";
import { ArrowLeft, Moon, Sun, Settings, Hourglass } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './platformTop.css';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Menubar, MenubarContent, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { accountPopMenu } from '@/constants/dahsboard';
import { generateSignString } from '@/lib/utils';
import useLogOutDialogStore from '@/store/useLogOutDialogStore';
import useSusbcriptionDialogStore from '@/store/useSusbcriptionDialogStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LogOutDialog from '../logOutDialog';

const PlatformTop = ({ hideAccount, db, twiqDefinition, setTwiqDefinition }) => {
    const { theme, setTheme } = useTheme();
    const { user } = useAuthStore();
    const [organization, setOrganization] = useState("");
    const { openDialog } = useLogOutDialogStore();
    const { openSubDialog } = useSusbcriptionDialogStore();
    const router = useRouter();

    useEffect(() => {
        if (!user?.organization_name) {
            setOrganization("");
            return;
        }
        const signString = generateSignString(user.organization_name);
        setOrganization(signString);
    }, [user?.organization_name]);

    // Beta status calculation
    const getBetaStatus = () => {
        if (!user?.is_beta_user || !user?.beta_end_date) return null;
        
        const endDate = new Date(user.beta_end_date);
        const now = new Date();
        const timeDiff = endDate - now;
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        return {
            daysRemaining: Math.max(0, daysRemaining),
            isActive: daysRemaining > 0,
            urgency: daysRemaining <= 3 ? 'critical' : daysRemaining <= 7 ? 'warning' : 'safe'
        };
    };

    const betaStatus = getBetaStatus();


    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    // Check if current user is admin - now from backend only
    const isAdmin = () => {
        if (!user) return false;
        return user.is_admin === true;
    };

    const handleGoToAdmin = () => {
        if (organization) {
            router.push(`/platform/${organization}/admin`);
        }
    };

    const handleBetaClick = () => {
        if (organization) {
            openSubDialog();
            router.push(`/platform/${organization}/settings`);
        }
    };

    const FALLBACK_IMG = '/images/user-avatar.png'

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

            {/* Beta Trial Icon - Only visible to beta users */}
            {betaStatus && betaStatus.isActive && (
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleBetaClick}
                            className={`cursor-pointer text-white hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 beta-trial-icon ${betaStatus.urgency}`}
                        >
                            <Hourglass className="size-6" />
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64">
                        <div className="space-y-2">
                            <div className={`text-sm font-semibold ${
                                betaStatus.urgency === 'critical' 
                                    ? 'text-red-600 dark:text-red-400' 
                                    : betaStatus.urgency === 'warning' 
                                        ? 'text-orange-600 dark:text-orange-400' 
                                        : 'text-blue-600 dark:text-blue-400'
                            }`}>
                                Beta Trial: {betaStatus.daysRemaining} day{betaStatus.daysRemaining !== 1 ? 's' : ''} remaining
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                {user?.beta_plan} plan access expires soon. Click to upgrade and keep your features.
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            )}

            {/* Admin Panel Button - Only visible to admins */}
            {isAdmin() && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleGoToAdmin}
                    className="cursor-pointer text-white hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    title="Admin Panel"
                >
                    <Settings className="size-6" />
                </Button>
            )}

            {!hideAccount && (
                <Menubar className="menuBar platformMenu">
                <MenubarMenu>
                    <MenubarTrigger className="menubarTrigger platformMenu">
                        <HoverCard>
                            <HoverCardTrigger>
                                <div className="pt_imageBox">
                                    {user?.avatar_url ? (
                                        <Image
                                            src={user?.avatar_url}
                                            width={60}
                                            height={60}
                                            alt="profile Image"
                                            className="profileImg"
                                            onError={(e) => {
                                                e.target.src = FALLBACK_IMG;
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            src={FALLBACK_IMG}
                                            width={60}
                                            height={60}
                                            alt="profile Image"
                                            className="profileImg"
                                            onError={(e) => {
                                                console.error('Failed to load fallback avatar:', e);
                                            }}
                                        />
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
                                    <div
                                        key={i}
                                        onClick={openDialog}
                                        className="menu_sideBarItem cursor-pointer"
                                    >
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </div>
                                )
                            }
                            else if (item?.name === "Help") {
                                return (
                                    <Link
                                        key={i}
                                        href={`/help`}
                                        className="menu_sideBarItem"
                                    >
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            }
                            else {
                                return (
                                    <Link
                                        key={i}
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
            )}
            <LogOutDialog />
        </div>
    )
}

export default PlatformTop