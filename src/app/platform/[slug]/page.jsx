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
  const { user } = useAuthStore();
  const router = useRouter();
    const { openSubDialog } = useSusbcriptionDialogStore();

  useEffect(() => {
    if (!user?.email_confirmed) {
      setIsEmailConfirmed(false)
    } else if (!user?.is_active) {
      openSubDialog();
      const signString = generateSignString(user?.organization_name);
      router.push(`/platform/${signString}/settings`);
    } else {
      setIsEmailConfirmed(true)
    }
  }, [user]);

  return isEmailConfirmed ? <DashboardPageContent /> : <VerifyEmail />;
};

export default Dashboard;
