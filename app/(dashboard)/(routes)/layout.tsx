import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getUserAPIUsage } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import React from "react";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const userAPIUsage = await getUserAPIUsage();
  const isUserPremium = await checkSubscription();

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:flex-col md:fixed md:w-72 md:inset-y-0 bg-gray-900">
        <Sidebar userAPIUsage={userAPIUsage} isUserPremium={isUserPremium} />
      </div>
      <main className="md:pl-72">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
