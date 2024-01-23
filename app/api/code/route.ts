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

    if (!isFreeTrial && !isPremium) {
      return handleErrorResponse("Your free trial has expried", 403);
    }

    // API from OpenAI
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

    // const response: OpenAI.Chat.ChatCompletion =
    //   await openai.chat.completions.create(params);

    // console.log(response.choices[0].message);

    // Example response from OpenAI
    const response = {
      role: "assistant",
      content:
        "Sure! Here's an example of how to implement a binary search algorithm in Python:\n" +
        "\n" +
        "```python\n" +
        "def binary_search(arr, target):\n" +
        "    # Initialize the starting and ending indices\n" +
        "    start = 0\n" +
        "    end = len(arr) - 1\n" +
        "\n" +
        "    while start <= end:\n" +
        "        # Calculate the mid index\n" +
        "        mid = (start + end) // 2\n" +
        "\n" +
        "        # If target is found, return the index\n" +
        "        if arr[mid] == target:\n" +
        "            return mid\n" +
        "        # If target is greater, ignore the left half\n" +
        "        elif arr[mid] < target:\n" +
        "            start = mid + 1\n" +
        "        # If target is smaller, ignore the right half\n" +
        "        else:\n" +
        "            end = mid - 1\n" +
        "\n" +
        "    # If target is not found, return -1\n" +
        "    return -1\n" +
        "\n" +
        "# Example usage\n" +
        "numbers = [2, 4, 6, 8, 10]\n" +
        "target = 8\n" +
        "\n" +
        "result = binary_search(numbers, target)\n" +
        "if result != -1:\n" +
        '    print(f"Target found at index: {result}")\n' +
        "else:\n" +
        '    print("Target not found")\n' +
        "```\n" +
        "\n" +
        "In this implementation, the binary_search function takes in an array (arr) and a target value as parameters. It starts with two indices, `start` and `end`, which define the range in which the target value is searched. \n" +
        "\n" +
        "Inside the while loop, the algorithm calculates the middle index (`mid`) of the current range. It then compares the value at the middle index with the target value to determine whether to adjust the range to the left or right. \n" +
        "\n" +
        "If the target value is found, the function returns the index at which it is found. If the target is not found, the function returns -1.\n" +
        "\n" +
        "You can use the `binary_search` function to search for a target value in a sorted list or array. In the example usage, the function is called with a `numbers` list and a `target` value of 8. The result is then printed to the console.",
    };

    // Increase API limit if user is in a free trial and not a premium user
    if (!isPremium) {
      await increaseAPILimit();
    }

    // return NextResponse.json(response.choices[0].message);
    return NextResponse.json(response);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
