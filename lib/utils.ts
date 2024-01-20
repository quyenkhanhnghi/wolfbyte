import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { checkUserAPILimit, increaseAPILimit } from "./api-limit";
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

// Function to validate the freeTrialAPI and the User Subscription
export async function validateUserAccess() {
  try {
    const [freeTrial, isUserPremium] = await Promise.all([
      checkUserAPILimit(),
      checkSubscription(),
    ]);

    // Increase API limit if user is in a free trial and not a premium user
    if (freeTrial && !isUserPremium) {
      await increaseAPILimit();
      return true;
    }

    return isUserPremium;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
