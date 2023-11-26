import { getUserAPIUsage } from "@/lib/api-limit";
import { UserButton } from "@clerk/nextjs";
import SidebarMobile from "./Sidebar-mobile";
import { checkSubscription } from "@/lib/subscription";

async function Navbar() {
  const userAPIUsage = await getUserAPIUsage();
  const isUserPremium = await checkSubscription();
  return (
    <div className="flex items-center p-4">
      <SidebarMobile
        userAPIUsage={userAPIUsage}
        isUserPremium={isUserPremium}
      />
      <div className="flex justify-end w-full">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}

export default Navbar;
