"use client";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

interface SidebarProps {
  userAPIUsage: number;
  isUserPremium: boolean;
}

function SidebarMobile({ userAPIUsage, isUserPremium }: SidebarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }
  return (
    <div className="flex items-center p-4">
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar userAPIUsage={userAPIUsage} isUserPremium={isUserPremium} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default SidebarMobile;
