import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { increaseAPILimit } from "@/lib/api-limit";
import { handleErrorResponse, validateUserAccess } from "@/lib/utils";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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
      handleErrorResponse("Input video prompt is required", 400);
    }
    console.log(prompt);

    if (!(await validateUserAccess())) {
      handleErrorResponse("Your free trial has expried", 403);
    }

    // API from ReplicateAI
    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt: prompt,
        },
      }
    );
    console.log(response);

    // If user is not a premium user then increase the API limit
    if (!validateUserAccess) {
      await increaseAPILimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    handleErrorResponse("Internal Server Error", 500);
  }
}
