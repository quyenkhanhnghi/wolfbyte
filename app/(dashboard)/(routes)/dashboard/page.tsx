import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Code,
  ImageIcon,
  MessageSquare,
  Music,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // const router = useRouter();
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
  return (
    <div className="space-y-4">
      <h1 className="text-2xl md:text-4xl font-bold text-center">Woftbyte</h1>
      <p className="text-muted-foreground font-light text-sm md:text-md text-center">
        Welcome to Woftbyte – Your Gateway to Smarter Solutions
      </p>
      <div className="px-4 md:px-20 space-y-4">
        {cards.map((card) => (
          <div
            key={card.href}
            className="border-black/10 w-full justify-between items-center rounded-md hover:shadow-md hover:bg-white/50 transition cursor-pointer h-30"
          >
            <Link href={card.href}>
              <Card
                key={card.href}
                // className="border-black/10 flex items-center justify-between hover:bg-white/50 rounded-md hover:shadow-md cursor-pointer transition p-3"
              >
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center p-2">
                    <div className={cn("rounded-md p-2", card.bgColor)}>
                      <card.icon className={cn("w-8 h-8", card.color)} />
                    </div>
                    <div className="pl-4 font-semibold">{card.label}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 r-0" />
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
