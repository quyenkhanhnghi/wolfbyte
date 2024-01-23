import { checkUserAPILimit, increaseAPILimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { handleErrorResponse, validateUserAccess } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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
    const { messages } = body;
    const isFreeTrial = await checkUserAPILimit();
    const isPremium = await checkSubscription();

    // validate input parameters, user access and API key
    if (!userId) {
      return handleErrorResponse("Unauthorized", 401);
    }

    if (!openai.apiKey) {
      return handleErrorResponse("Missing OpenApiai key", 500);
    }
    if (!messages) {
      return handleErrorResponse("Message are required", 400);
    }

    if (!isFreeTrial && !isPremium) {
      return handleErrorResponse("Your free trial has expried", 403);
    }

    // API from OpenAI
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: messages,
      model: "gpt-3.5-turbo",
    };

    // const response: OpenAI.Chat.ChatCompletion =
    //   await openai.chat.completions.create(params);

    // Example response from OpenAI
    const response = {
      role: "assistant",
      content:
        "The radius of the Sun is approximately 696,340 kilometers (432,450 miles).",
    };

    // Increase API limit if user is in a free trial and not a premium user
    if (!isPremium) {
      await increaseAPILimit();
    }

    return NextResponse.json(response);
    // return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    handleErrorResponse("Internal Server Error", 500);
  }
}
