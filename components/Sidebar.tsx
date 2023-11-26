"use client";
import { cn } from "@/lib/utils";
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  VideoIcon,
} from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserAPILimit } from "./UserAPILimit";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    href: "/image",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-700",
    href: "/video",
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    href: "/music",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    href: "/code",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

interface SidebarProps {
  userAPIUsage: number;
  isUserPremium: boolean;
}

function Sidebar({ userAPIUsage, isUserPremium }: SidebarProps) {
  const pathname = usePathname();
  return (
    <div className="space-y-4 flex flex-col h-full bg-black text-white">
      <div className="px-3 py-3 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <Image alt="logo" src="/logo.png" width={500} height={500} />
          </div>
          <h1 className={cn("text-2xl font-bold", montserrat.className)}>
            WolfByte
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm flex p-2 justify-start font-medium hover:text-white hover:bg-white/50 rounded-md transition",
                pathname === route.href ? "bg-white/50 " : "text-zinc-400"
              )}
            >
              <div className="flex items-center">
                <route.icon className={cn("h-4 w-5", route.color)} />
                <h1 className="pl-5">{route.label}</h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {!isUserPremium && <UserAPILimit userAPIUsage={userAPIUsage} />}
    </div>
  );
}

export default Sidebar;
