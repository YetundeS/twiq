"use client";

import { AppSidebar } from "@/components/appSideBar";
import "./dashboard.css";
import { PanelRightOpen } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ModelOverview from "@/components/modelOverview";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { generateSignString } from "@/lib/utils";
import { fetchUser } from "@/apiCalls/authAPI";
import Image from "next/image";
import { Search, BookOpen, FileText, FileCode, Mic } from "lucide-react";

const modelsOverview = [
  {
    title: "Legal Assistant",
    description: "Find relevant case laws in minutes instead of hours.",
    Icon: Search,
    link: "legal-assistant",
  },
  {
    title: "E-Discovery",
    description: "AI assistant that helps you go through files in seconds.",
    Icon: BookOpen,
    link: "e-discovery",
  },
  {
    title: "Document Automation",
    description:
      "Automated document generation based on McGrath Kane templates.",
    Icon: FileText,
    link: "document-automation",
  },
  {
    title: "Contract Review",
    description: "Eliminate mistakes and flag risks in contracts.",
    Icon: FileCode,
    link: "contract-review",
  },
  {
    title: "Transcription",
    description: "AI-powered transcription and deposition summary.",
    Icon: Mic,
    link: "transcription",
  },
];

const Dashboard = () => {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [organization, setOrganization] = useState("");

  const { user, updateUser } = useAuthStore();

  const isHydrated = useHydrationZustand(useAuthStore);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/");
    }
  }, [user, isHydrated]);

  useEffect(() => {
    if (!user) return;
    const signString = generateSignString(user?.organization_name);
    setOrganization(signString);
  }, [user]);

  useEffect(() => {
    fetchUser(updateUser);
  }, []); // Runs only on mount (hard reload)

  return (
      <div className="dashboard_wrapper">
        <AppSidebar />
        <div className="page_content">
          <div className="pageTop">
            <div onClick={toggleSidebar} className="sideBar_trigger">
              <PanelRightOpen className="panelBtn" />
            </div>
          </div>
          <div className="pageBody">
            <div className="aboveTheFold">
              <h2 className="dashboardTitle">Welcome, {user?.user_name}</h2>
              {user?.logo_url && (
                <Image
                  src={user?.logo_url}
                  width={700}
                  height={400}
                  alt="logo"
                  className="userLogo"
                />
              )}
            </div>
            <Separator className="seperatorCss" />
            <div className="modelsOverview">
              {modelsOverview?.map((model, i) => (
                <ModelOverview
                  model={model}
                  key={i}
                  organizationName={organization}
                />
              ))}
            </div>
          </div>
        </div>
        </div>
  );
};

export default Dashboard;
