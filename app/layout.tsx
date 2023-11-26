import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/context/ModalProvider";
import { ToasterProvider } from "@/context/ToasterProvider";
import { ChatboxProvider } from "@/context/ChatboxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WoftByte",
  description: "AI Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ChatboxProvider />
          <ModalProvider />
          <ToasterProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
