/** @format */

import { checkUserAPILimit, increaseAPILimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { handleErrorResponse, validateUserAccess } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  organization: "org-MZzlW8W1nD0dBOLetqJvQTkY",
  apiKey: process.env.OPENAI_KEY,
});

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return;
  }

  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;
    const isFreeTrial = await checkUserAPILimit();
    const isPremium = await checkSubscription();

    if (!userId) {
      return handleErrorResponse("Unauthorized", 401);
    }

    if (!openai.apiKey) {
      return handleErrorResponse("Missing OpenApiai key", 500);
    }

    if (!messages) {
      return handleErrorResponse("Message are required", 400);
    }

    console.log(messages);

    if (!isFreeTrial) {
      return handleErrorResponse("Your free trial has expried", 403);
    }

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [
        ...messages,
        {
          role: "system",
          content:
            "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
        },
      ],
      model: "gpt-3.5-turbo",
    };

    const response: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(params);

    console.log(response);

    // Increase API limit if user is in a free trial and not a premium user
    if (!isPremium) {
      await increaseAPILimit();
    }

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
