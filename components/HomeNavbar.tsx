"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { ArrowUpRight } from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

export default function HomeNavbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative mr-2">
          <Image src="/logo.png" width={50} height={50} alt="Logo" />
        </div>
        <h1
          className={cn("text-white text-2xl font-bold", montserrat.className)}
        >
          WolfByte
        </h1>
      </Link>
      <div className="flex items-center ml-1 gap-x-2">
        <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
          <Button variant="outline">
            LOGIN
            <ArrowUpRight className="h-4 w-4 fill-white ml-1" />
          </Button>
        </Link>
        <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
          <Button variant="premium">
            TRY WOLFBYTE
            <ArrowUpRight className="h-4 w-4 fill-white ml-1" />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
