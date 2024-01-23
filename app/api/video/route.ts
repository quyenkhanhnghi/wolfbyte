import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { checkUserAPILimit, increaseAPILimit } from "@/lib/api-limit";
import { handleErrorResponse } from "@/lib/utils";
import { checkSubscription } from "@/lib/subscription";

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
    const isFreeTrial = await checkUserAPILimit();
    const isPremium = await checkSubscription();

    // validate input parameters, user access and API key
    if (!userId) {
      handleErrorResponse("Unauthorized", 401);
    }
    if (!prompt) {
      handleErrorResponse("Input video prompt is required", 400);
    }
    console.log(prompt);

    if (!isFreeTrial && !isPremium) {
      return handleErrorResponse("Your free trial has expried", 403);
    }

    // API from ReplicateAI
    // const response = await replicate.run(
    //   "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
    //   {
    //     input: {
    //       prompt: prompt,
    //     },
    //   }
    // );

    // Example response from OpenAI
    const response = [
      "https://replicate.delivery/pbxt/YSpyBHviTwJZI1h28DcsoNOPKnC3SfImGj9nf8fPX3jfJs5IB/output-0.mp4",
    ];
    console.log(response);

    // Increase API limit if user is in a free trial and not a premium user
    if (!isPremium) {
      await increaseAPILimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    handleErrorResponse("Internal Server Error", 500);
  }
}
