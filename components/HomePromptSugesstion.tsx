"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useUIContext } from "@/context/UIContext";

interface HomePromptSugesstionProps {}

const prompts = [
  {
    title: "Meow-sic",
    description: "Music that is soothing for cats?",
    href: "/music",
  },
  {
    title: "Purr-ogrammings",
    description: "Interactive games specifically for cats?",
    href: "/code",
  },
  {
    title: "Cat-ch Me If You Can",
    description: "Generate cat video is baking",
    href: "/video",
  },
  {
    title: "Paws and Pixel",
    description: "Create Cat Breed Gallery",
    href: "image",
  },
  {
    title: "Tail Talk",
    description: "Studying wild cat populations",
    href: "conversation",
  },
  {
    title: "Eco-Paws",
    description: "Purr-fessor in spotting wild cats for science?",
    href: "conversation",
  },
];

export function HomePromptSugesstion() {
  const { setPromptSuggestion } = useUIContext();

  return (
    <div className="px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prompts.map((prompt) => (
          <Link
            key={prompt.title}
            href={prompt.href}
            onClick={() => setPromptSuggestion(prompt.description)}
          >
            <Card className="bg-transparent text-white">
              <CardHeader>
                <CardTitle>{prompt.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-400">
                {prompt.description}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
