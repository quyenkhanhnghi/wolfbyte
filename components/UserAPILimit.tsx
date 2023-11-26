import { useEffect, useState } from "react";
import { MAX_FREE_API } from "@/constant";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useUIContext } from "@/context/UIContext";
import { Zap } from "lucide-react";

interface UserAPILimitProps {
  userAPIUsage: number;
}

export function UserAPILimit({ userAPIUsage }: UserAPILimitProps) {
  const modal = useUIContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), [isMounted]);

  if (!isMounted) {
    return null;
  }
  return (
    <div className="px-3">
      <Card className="bg-white/30 border-0">
        <CardContent className="py-4">
          <div className="text-center text-sm text-white space-y-2">
            <p className="mb-4">
              {userAPIUsage} / {MAX_FREE_API} Free AI Usage
            </p>
            <Progress
              className="h-3"
              value={(userAPIUsage / MAX_FREE_API) * 100}
            />
          </div>
          <Button
            onClick={modal.setModalOpen}
            className="mt-4 w-full"
            variant="premium"
          >
            Upgrade to Premium
            <Zap className="h-4 w-4 fill-white ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
