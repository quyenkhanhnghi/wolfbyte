import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { checkUserAPILimit, increaseAPILimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { handleErrorResponse } from "@/lib/utils";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function validateUserAccess() {
  const freeTrial = await checkUserAPILimit();
  const isUserPremium = await checkSubscription();
  return freeTrial || isUserPremium;
}

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    handleErrorResponse("Method not allowed", 405);
  }

  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    // validate input parameters, user access and API key
    if (!userId) {
      handleErrorResponse("Unauthorized", 401);
    }
    if (!prompt) {
      handleErrorResponse("Input music is required", 400);
    }

    if (!(await validateUserAccess())) {
      handleErrorResponse("Your free trial has expried", 403);
    }

    // API from OpenAI
    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        },
      }
    );

    // If user is not a premium user then increase the API limit
    if (!validateUserAccess) {
      await increaseAPILimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    handleErrorResponse("Internal Server Error", 500);
  }
}
