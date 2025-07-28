"use client";

import { hasAccess } from '@/components/appSideBar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { models } from '@/constants/sidebar';
import { generateSignString } from '@/lib/utils';
import useAuthStore from '@/store/authStore';
import "@/styles/platformStyles.css";
import { SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import '../../appSideBar/appSideBar.css';
import CrownIcon from '../crown';

const NewChatBtn = ({ alt, mobile }) => {
  const [organization, setOrganization] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.organization_name) {
      setOrganization("");
      return;
    }
    const signString = generateSignString(user.organization_name);
    setOrganization(signString);
  }, [user?.organization_name]);


  const handleClick = (e, userHasAccess, title) => {
    if (!userHasAccess) {
      e.preventDefault();
      toast.error(`Upgrade to access "${title}" model`, {
        style: {
          border: "none",
          color: "red",
        },
      });
    }
  };

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
                        <HoverCardContent className={`newchat_hoverCardContent z-[999999999] ${alt && 'alt'}`}>
                            <span>New chat</span>
                        </HoverCardContent>
                    </HoverCard>
                    </MenubarTrigger>
                    <MenubarContent
                        align="start"
                        side={mobile ? "bottom" : "right"}
                        alignOffset={4}
                        sideOffset={8} className="menubarContent z-[999999999]">
                        {models?.map((item, i) => {
                          const userHasAccess = hasAccess(user?.subscription_plan, item.name);
                          return (
                            <MenubarItem key={i} className="menubarItem">
                                <a
                                    href={`/platform/${organization}/${item.url}/`}
                                    className="menu_sideBarItem"
                                    onClick={(e) => handleClick(e, userHasAccess, item.name)}
                                >
                                {userHasAccess ? (<item.icon />) : (<CrownIcon fill="gold" stroke="gold" />)}
                                    <span>{item.name}</span>
                                </a>
                            </MenubarItem>
                          )
                        })}
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    )
}

export default NewChatBtn