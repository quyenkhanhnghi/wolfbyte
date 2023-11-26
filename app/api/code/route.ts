import { checkUserAPILimit, increaseAPILimit } from "@/lib/api-limit";
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

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("Missing OpenApiai key", { status: 500 });
    }
    if (!messages) {
      return new NextResponse("Message are required", { status: 400 });
    }
    console.log(messages);

    const freeTrial = checkUserAPILimit();
    if (!freeTrial) {
      return new NextResponse("Your free trial has expried", { status: 403 });
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
    // const chatCompletion: OpenAI.Chat.ChatCompletion =
    //   await openai.chat.completions.create(params);
    const response: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(params);

    await increaseAPILimit();
    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
