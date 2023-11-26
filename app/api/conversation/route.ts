import { increaseAPILimit } from "@/lib/api-limit";
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

    // validate input parameters, user access and API key
    if (!userId) {
      handleErrorResponse("Unauthorized", 401);
      // return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      handleErrorResponse("Missing OpenApiai key", 500);
      // return new NextResponse("Missing OpenApiai key", { status: 500 });
    }
    if (!messages) {
      handleErrorResponse("Message are required", 400);
      // return new NextResponse("Message are required", { status: 400 });
    }

    if (!(await validateUserAccess())) {
      handleErrorResponse("Your free trial has expried", 403);
      // return new NextResponse("Your free trial has expried", { status: 403 });
    }

    console.log(messages);

    // API from OpenAI
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: messages,
      model: "gpt-3.5-turbo",
    };
    // const chatCompletion: OpenAI.Chat.ChatCompletion =
    //   await openai.chat.completions.create(params);
    const response: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(params);

    // If user is not a premium user then increase the API limit
    if (!validateUserAccess) {
      await increaseAPILimit();
    }

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    handleErrorResponse("Internal Server Error", 500);
  }
}
