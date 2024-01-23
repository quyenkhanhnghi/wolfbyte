"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { set } from "zod";

interface SubscriptionButtonProps {
  isUserPremium: boolean;
}

export function SubscriptionButton({ isUserPremium }: SubscriptionButtonProps) {
  const [loading, setIsLoading] = useState(false);

  const handleButtonClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      console.log("[BILLNG ERROR]}", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={loading}
      variant="premium"
      onClick={handleButtonClick}
      className="text-lg"
    >
      {isUserPremium ? "Manage Subscription" : "Upgrade"}
      {!isUserPremium && <Zap className="w-4 h-4 fill-white ml-2" />}
      {isUserPremium && <Sparkles className="w-4 h-4 fill-white ml-2" />}
    </Button>
  );
}
