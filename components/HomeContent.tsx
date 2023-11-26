"use client";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import TypewriterComponent from "typewriter-effect";
import { Button } from "./ui/button";

const tools = [
  "ChatBot",
  "Code Generation",
  "Photo Generation",
  "Music Generation",
  "Video Generation",
];

export function HomeContent() {
  const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold text-center py-16 space-y-5">
      <div className="text-4xl sm:text-6xl mg:text-7xl lg:text-8xl font-extrabold">
        <h1>The AI Platform for</h1>
      </div>
      <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 text-xl sm:text-4xl mg:text-5xl lg:text-7xl font-extrabold pt-2">
        <TypewriterComponent
          options={{ strings: tools, autoStart: true, loop: true }}
        />
      </div>
      <div className="text-muted-foreground text-lg font-light italic">
        Create content using OPEN AI and REPLICATE AI
      </div>
      <div>
        <Link
          href={isSignedIn ? "/dashboard" : "/sign-in"}
          className="bg-gradient-primary"
        >
          <Button variant="welcome">GET START WITH FREE TRIAL</Button>
        </Link>
      </div>
    </div>
  );
}
