// dashboard/[slug]/page.jsx
"use client";

import { useEffect, useState } from "react";

import DashboardPageContent from "@/components/dashboardComponent/dashboardPageContent";
import VerifyEmail from "@/components/dashboardComponent/dashboardPageContent/verifyEmail";
import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import useSusbcriptionDialogStore from "@/store/useSusbcriptionDialogStore";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();
  const { openSubDialog } = useSusbcriptionDialogStore();

  useEffect(() => {
    if (!user) return;

    if (!user.email_confirmed) {
      setIsEmailConfirmed(false);
    } else if (!user.is_active && !hasNavigated) {
      setHasNavigated(true);
      openSubDialog();
      const signString = generateSignString(user.organization_name);
      if (signString) {
        router.push(`/platform/${signString}/settings`);
      }
    } else if (user.is_active) {
      setIsEmailConfirmed(true);
    }
  }, [user?.email_confirmed, user?.is_active, user?.organization_name, hasNavigated, openSubDialog, router]);

  return isEmailConfirmed ? <DashboardPageContent /> : <VerifyEmail />;
};

export default Dashboard;
