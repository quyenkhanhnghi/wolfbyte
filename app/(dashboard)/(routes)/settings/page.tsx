import { Heading } from "@/components/Heading";
import { SubscriptionButton } from "@/components/SubscriptionButton";
import { checkSubscription } from "@/lib/subscription";
import { Settings } from "lucide-react";
import Image from "next/image";

export default async function SettingsPage() {
  const isUserPremium = await checkSubscription();

  return (
    <div>
      <Heading
        title="Settings"
        description="Manage Account Settings"
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground test-lg italic">
          {isUserPremium ? (
            <>
              <p className="pb-2">YOU are currently on a Premium account</p>
              <Image alt="Wolf" src="/wolf.JPEG" width={500} height={500} />
            </>
          ) : (
            "You are currently on a FreeTrial account"
          )}
        </div>
        <SubscriptionButton isUserPremium={isUserPremium} />
      </div>
    </div>
  );
}
