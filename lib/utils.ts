import { type ClassValue, clsx } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { checkUserAPILimit } from "./api-limit";
import { checkSubscription } from "./subscription";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pathURL(path: string) {
  return `${process.env.NEXT_PUBLIC_URL}${path}`;
}

export function handleErrorResponse(message: string, statusCode: number) {
  return new NextResponse(message, { status: statusCode });
}

export async function validateUserAccess() {
  const freeTrial = await checkUserAPILimit();
  const isUserPremium = await checkSubscription();
  return freeTrial || isUserPremium;
}
