"use client";

import { AppSidebar } from "@/components/appSideBar";
import "./dashboard.css";
import DashboardPageContent from "@/components/dashboardComponent/dashboardPageContent";
import { useSideBar } from "@/store/sidebarStore";
import { SidebarProvider } from "@/components/ui/sidebar";

const Dashboard = () => {
  const {isSidebarOpen, setIsSidebarOpen} = useSideBar(); 

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <div className="dashboard_wrapper">
        <AppSidebar />
        <DashboardPageContent />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
