"use client";


import { saveProfilePicAPI } from '@/apiCalls/authAPI';
import DeleteAccountDialog from '@/components/dashboardComponent/deleteAccountDialog';
import NewChatBtn from '@/components/dashboardComponent/newChatBtn';
import PlatformTop from '@/components/dashboardComponent/platformTop';
import SubscriptionDialog from '@/components/dashboardComponent/subscriptionDialog';
import TwiqBg from '@/components/dashboardComponent/twiqBg';
import { SubscriptionTab } from '@/components/settingsComps/SubscriptionTab';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAssistantChat from '@/hooks/useAssistantChat';
import useAuthStore from '@/store/authStore';
import useDeleteAccountStore from '@/store/useDeleteAccountStore';
import { useResponsiveSidebarToggle } from '@/store/useResponsiveSidebarToggle';
import useSusbcriptionDialogStore from '@/store/useSusbcriptionDialogStore';
import "@/styles/platformStyles.css";
import { CircularProgress } from '@mui/material';
import { createClient } from "@supabase/supabase-js";
import { Lock, PanelRightOpen } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import "./settings.css";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);


const Settings = () => {
  const { openSubDialog } = useSusbcriptionDialogStore();
  const { user, updateUser } = useAuthStore();

  const toggleSidebar = useResponsiveSidebarToggle();
  const { showToggleChat } = useAssistantChat();

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { openDialog } = useDeleteAccountStore();
  const router = useRouter();

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleSaveProfilePic = async () => {
    if (!selectedImage) return;

    setLoading(true);

    try {
      const avatarUrl = await saveProfilePicAPI(
        selectedImage,
        () => router.push("/sign-off") // onUnauthorized
      );

      toast.success("Upload successful", {
        description: "How'd you like your new look?",
        style: {
          border: "none",
          color: "green",
        },
      });

      setSelectedImage(null);
      setPreviewUrl(null);
      // update avatar in auth store
      updateUser({ ...user, avatar_url: avatarUrl });

    } catch (error) {
      toast.error("Error saving new pic.", {
        description:
          error?.response?.data?.error || error?.message || "Something went wrong.",
        style: {
          border: "none",
          color: "red",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setPasswordLoading(true);

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("Update error:", error);
        toast.error("Failed to update password.", {
          description: error.message,
          style: {
            border: "none",
            color: "red",
          },
        });
      } else {
        toast.success("Password updated successfully!", {
          style: {
            border: "none",
            color: "green",
          },
        });
        setNewPassword("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error.", {
        style: {
          border: "none",
          color: "red",
        },
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    const initSupabaseSession = async () => {
      const access_token = localStorage.getItem("twiq_access_token");
      const refresh_token = localStorage.getItem("twiq_refresh_token");

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          toast.error("Authentication expired. Please log in again.", {
            description: error.message,
            style: {
              border: "none",
              color: "red",
            },
          });
        }
      } else {
        toast.error("No session token found.", {
          style: {
            border: "none",
            color: "red",
          },
        });
      }
    };

    initSupabaseSession();
  }, []);

  const handleDeleteAccount = () => {
    openDialog()
  };


  return (
    <div className="page_content">
      <div className="pageTop">
        {(showToggleChat) && (
          <>
            <div onClick={toggleSidebar} className="pageTop_iconWrapper">
              <PanelRightOpen className="pageIcon" size="22px" />
            </div>
            <NewChatBtn alt />
          </>
        )}
        <PlatformTop />
      </div>
      <TwiqBg />
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
                  <div className="flex items-center gap-4">
                    <Image
                      src={
                        previewUrl ||
                        user?.avatar_url ||
                        "https://api.dicebear.com/7.x/identicon/svg?seed=mufutau"
                      }
                      width={64}
                      height={64}
                      alt="user avatar"
                      className="rounded-full border object-cover w-16 h-16"
                    />
                    <div className="flex flex-col">
                      <input
                        type="file"
                        accept="image/*"
                        id="profile-pic-upload"
                        className="hidden"
                        onChange={handleProfilePicChange}
                      />
                      <Label
                        htmlFor="profile-pic-upload"
                        className="cursor-pointer text-sm font-medium text-blue-600 hover:underline"
                      >
                        Change Picture
                      </Label>

                      {previewUrl && (
                        <Button
                          className="mt-2 w-fit px-3 py-1 text-sm font-medium"
                          onClick={handleSaveProfilePic}
                        >
                          {loading ? (
                            <CircularProgress color="black" size="14px" />
                          ) : (
                            <p>Save Profile Picture</p>
                          )}
                        </Button>
                      )}
                    </div>
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
                <div className="space-y-1 w-full">
                  <Label className="text-black" htmlFor="new-password">New Password</Label>
                  <div className="relative mt-2 inputOverBox w-full">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="settingProfileInput password rounded-lg py-5 pr-4 pl-4 text-lg"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Lock
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 transform lockIcon"
                    />
                  </div>
                  <Button
                    className="mt-2 w-fit px-4 py-2 text-sm font-medium"
                    disabled={passwordLoading || !newPassword}
                    onClick={handlePasswordUpdate}
                  >
                    {passwordLoading ? (
                      <CircularProgress color="inherit" size="16px" />
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
                <div className="space-y-1 mt-6 dangerZone">
                  <Label className="text-red-600 text-sm font-medium">Danger Zone</Label>
                  <p className="text-sm text-gray-500">
                    Deleting your account is permanent and cannot be undone.
                  </p>
                  <Button
                    // variant="destructive"
                    className="mt-2 w-fit px-4 py-2 text-sm font-medium bg-red-300 hover:bg-red-500 cursor-pointer transition-all duration-300"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>

            </Card>
          </TabsContent>
          <SubscriptionTab user={user} openSubDialog={openSubDialog} />
        </Tabs>
      </div>
      <SubscriptionDialog />
      <DeleteAccountDialog />
    </div>
  )
}


export default Settings;