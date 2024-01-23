/** @format */

import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { handleErrorResponse } from "@/lib/utils";
import { checkUserAPILimit, increaseAPILimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

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
    const isFreeTrial = await checkUserAPILimit();
    const isPremium = await checkSubscription();

    // validate input parameters, user access and API key
    if (!userId) {
      return handleErrorResponse("Unauthorized", 401);
    }

    if (!openai.apiKey) {
      return handleErrorResponse("Missing OpenApiai key", 500);
    }
    if (!prompt) {
      return handleErrorResponse("Input text is required", 400);
    }
    if (!amount) {
      return handleErrorResponse("Amount is required", 400);
    }
    if (!resolution) {
      return handleErrorResponse("Resolution is required", 400);
    }

    if (!isFreeTrial && !isPremium) {
      return handleErrorResponse("Your free trial has expried", 403);
    }

    // API from OpenAI
    // const response = await openai.images.generate({
    //   prompt: prompt,
    //   n: parseInt(amount, 10),
    //   size: resolution,
    // });

    // console.log(response);

    // Example response from OpenAI
    const response = {
      created: 1705762541,
      data: [
        {
          url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-MZzlW8W1nD0dBOLetqJvQTkY/user-29UBHWFhm4bDvhBQH7aCXQ3u/img-ICi2Tt4doz6EBHQ8z91C9Chn.png?st=2024-01-20T13%3A55%3A41Z&se=2024-01-20T15%3A55%3A41Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-19T19%3A36%3A25Z&ske=2024-01-20T19%3A36%3A25Z&sks=b&skv=2021-08-06&sig=0FN6XWj684sJf/Ep4rzi1qHCLCsA8XOahNcyoBnzYMA%3D",
        },
        {
          url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-MZzlW8W1nD0dBOLetqJvQTkY/user-29UBHWFhm4bDvhBQH7aCXQ3u/img-IGzddFADGBkxX4hnLv5kWzLv.png?st=2024-01-20T13%3A55%3A41Z&se=2024-01-20T15%3A55%3A41Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-19T19%3A36%3A25Z&ske=2024-01-20T19%3A36%3A25Z&sks=b&skv=2021-08-06&sig=qv48Dsq9hhjIHHu6Zt9WU%2BBS/MAKMxxMoJ2LDPGAwy8%3D",
        },
        {
          url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-MZzlW8W1nD0dBOLetqJvQTkY/user-29UBHWFhm4bDvhBQH7aCXQ3u/img-FAaRUhgkuBfrom36chUDWyQR.png?st=2024-01-20T13%3A55%3A41Z&se=2024-01-20T15%3A55%3A41Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-19T19%3A36%3A25Z&ske=2024-01-20T19%3A36%3A25Z&sks=b&skv=2021-08-06&sig=s0uvHwm6t7bO4smyvjVJzZAfSjWpoisYNHeubXbCMQ0%3D",
        },
      ],
    };

    // Increase API limit if user is in a free trial and not a premium user
    if (!isPremium) {
      await increaseAPILimit();
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    handleErrorResponse("Internal Server Error", 500);
  }
}
