"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUIContext } from "@/context/UIContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  Code,
  ImageIcon,
  MessageSquare,
  Music,
  VideoIcon,
  Zap,
} from "lucide-react";
import axios from "axios";
import { useState } from "react";

const cards = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/conversation",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: "/image",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    href: "/video",
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/music",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: "/code",
  },
];

export function Modal() {
  const modal = useUIContext();
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      console.log(error, "[STRIPE_CLIENT_ERROR]");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={modal.isModalOpen} onOpenChange={modal.setModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center flex-col pb-2 gap-y-4">
              <div className="flex items-center gap-x-2 font-bold text-xl">
                Upgrade to WolfByte
                <Badge variant="premium" className="uppercase py-1 pl-3">
                  Premium
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription>
              {cards.map((card) => (
                <Card
                  key={card.label}
                  className="flex items-center justify-between p-2"
                >
                  <div className="flex items-center p-2">
                    <div className={cn("rounded-md p-2", card.bgColor)}>
                      <card.icon className={cn("w-8 h-8", card.color)} />
                    </div>
                    <div className="pl-4 font-semibold">{card.label}</div>
                  </div>
                  <Check className="pr-2 font-bold h-8 w-8" />
                </Card>
              ))}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={loading}
              onClick={onSubscribe}
              variant="premium"
              size="lg"
            >
              Upgrade
              <Zap className="h-4 w-4 fill-white ml-1" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
