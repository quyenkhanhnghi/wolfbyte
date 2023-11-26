import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { checkUserAPILimit, increaseAPILimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { handleErrorResponse, validateUserAccess } from "@/lib/utils";

const openai = new OpenAI({
  organization: "org-MZzlW8W1nD0dBOLetqJvQTkY",
  apiKey: process.env.OPENAI_KEY,
});

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    handleErrorResponse("Method not allowed", 405);
  }

  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    // validate input parameters, user access and API key
    if (!userId) {
      handleErrorResponse("Unauthorized", 401);
    }

    if (!openai.apiKey) {
      handleErrorResponse("Missing OpenApiai key", 500);
    }
    if (!prompt) {
      handleErrorResponse("Input text is required", 400);
    }
    if (!amount) {
      handleErrorResponse("Amount is required", 400);
    }
    if (!resolution) {
      handleErrorResponse("Resolution is required", 400);
    }

    if (!(await validateUserAccess())) {
      handleErrorResponse("Your free trial has expried", 403);
    }

    // API from OpenAI
    const response = await openai.images.generate({
      prompt: prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    console.log(response);

    // If user is not a premium user then increase the API limit
    if (!validateUserAccess) {
      await increaseAPILimit();
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    handleErrorResponse("Internal Server Error", 500);
  }
}
