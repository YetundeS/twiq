"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { models } from '@/constants/sidebar';
import { generateSignString } from '@/lib/utils';
import useAuthStore from '@/store/authStore';
import "@/styles/platformStyles.css";
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
        <div className='z-[12]'>
            <Menubar className="menuBar">
                <MenubarMenu>
                      <MenubarTrigger className="menubarTrigger">
                    <HoverCard>
                        <HoverCardTrigger>
                            <div className="sidebar_pageTop_iconWrapper">
                                <SquarePen className="pageIcon" size="22px" />
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent className={`newchat_hoverCardContent ${alt && 'alt'}`}>
                            <span>New chat</span>
                        </HoverCardContent>
                    </HoverCard>
                    </MenubarTrigger>
                    <MenubarContent
                        align="start"
                        side="right"
                        alignOffset={4}
                        sideOffset={8} className="menubarContent">
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