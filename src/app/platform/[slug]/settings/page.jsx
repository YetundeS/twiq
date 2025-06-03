"use client";


import NewChatBtn from '@/components/dashboardComponent/newChatBtn';
import PlatformTop from '@/components/dashboardComponent/platformTop';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSidebar } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import useAuthStore from '@/store/authStore';
import { useSideBar } from '@/store/sidebarStore';
import "@/styles/platformStyles.css";
import { PanelRightOpen } from "lucide-react";
import Image from "next/image";
import "./settings.css";

const Settings = () => {
  const isMobile = useIsMobile();
   const { isSidebarOpen, setIsSidebarOpen } = useSideBar();

  const { toggleSidebar: mainToggle } = useSidebar();
  const { user } = useAuthStore()

  const toggleSidebar = () => {
    mainToggle()
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="page_content">
      <div className="pageTop">
        {(!isSidebarOpen || isMobile) && (
          <>
            <div
              onClick={toggleSidebar}
              className="pageTop_iconWrapper"
            >
              <PanelRightOpen className="pageIcon" size="22px" />
            </div>
            <NewChatBtn alt />
          </>
        )}
        <PlatformTop />
      </div>
      <div className="settings_content">
        <Tabs defaultValue="profile" className="settingsTab">
          <TabsList className="grid w-full grid-cols-2 tabsList">
            <TabsTrigger className="tabsTrigger" value="profile">
              Profile
            </TabsTrigger>
            <TabsTrigger className="tabsTrigger" value="subscription">
              Subscription
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card className="tabsContent">
              <CardHeader>
                <CardTitle className="text-black">Profile</CardTitle>
                <CardDescription>
                  Displays your profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="tabCardContent space-y-5">
                <div className="space-y-1 mb-4">
                  <div className="userLetter">
                    <Image
                      src={
                        user?.avatar_url ||
                        "https://api.dicebear.com/7.x/identicon/svg?seed=mufutau"
                      }
                      width={50}
                      height={50}
                      alt="user avatar"
                      className="userAvatar"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="name">Name</Label>
                  <Input id="name" className="settingProfileInput" defaultValue={user?.user_name} disabled />
                </div>
                <div className="space-y-1">
                  <Label className="text-black" htmlFor="username">E-mail</Label>
                  <Input id="username" className="settingProfileInput" defaultValue={user?.email} disabled />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="subscription">
            <Card className="tabsContent">
              <CardHeader>
                <CardTitle className="text-black">Subscription</CardTitle>
                <CardDescription>
                  Update your subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent className="settings_cardContent">
                <div className="settings_cardRow">
                  <Label htmlFor="current">Current Plan</Label>
                  <p className="settings_cardRow_content">
                    {user?.subscription_status === "inactive"
                      ? "Inactive"
                      : `${user?.subscription_plan} plan`}

                  </p>
                </div>
              </CardContent>
              <CardFooter>
                {user?.subscription_status == "inactive" ? (
                  <Button className="fogBtn">Subscribe</Button>
                ) : (
                  <Button className="fogBtn">
                    {user?.subscription_plan === "starter"
                      ? "Upgrade"
                      : "Downgrade"}{" "}
                    to{" "}
                    {user?.subscription_plan === "starter"
                      ? "Starter"
                      : "Creator"}{" "}
                    plan
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


export default Settings;