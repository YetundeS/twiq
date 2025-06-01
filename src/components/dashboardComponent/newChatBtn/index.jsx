"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { models } from '@/constants/sidebar';
import { generateSignString } from '@/lib/utils';
import useAuthStore from '@/store/authStore';
import { SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../../appSideBar/appSideBar.css';

const NewChatBtn = ({ alt }) => {
  const [organization, setOrganization] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    const signString = generateSignString(user?.organization_name);
    setOrganization(signString);
  }, [user]);



    return (
        <div>
            <Menubar className="menuBar">
                <MenubarMenu>
                      <MenubarTrigger className="menubarTrigger">
                    <HoverCard>
                        <HoverCardTrigger>
                            <div className="sidebar_pageTop_iconWrapper">
                                <SquarePen size="22px" />
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent className={`newchat_hoverCardContent ${alt && 'alt'}`}>
                            <span>New chat</span>
                        </HoverCardContent>
                    </HoverCard>
                    </MenubarTrigger>
                    <MenubarContent className="menubarContent">
                        {models?.map((item, i) => (
                            <MenubarItem key={i} className="menubarItem">
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

export default NewChatBtn