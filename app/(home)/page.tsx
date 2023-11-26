import React from "react";
import HomeNavbar from "@/components/HomeNavbar";
import { HomeContent } from "@/components/HomeContent";
import { HomePromptSugesstion } from "@/components/HomePromptSugesstion";

export default function HomePage() {
  return (
    <>
      <div>
        <HomeNavbar />
        <HomeContent />
        <HomePromptSugesstion />
      </div>
    </>
  );
}
