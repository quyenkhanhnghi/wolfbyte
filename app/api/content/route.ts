import prismadb from "@/lib/prismadb";
import { handleErrorResponse } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = auth();

  try {
    if (!userId) {
      return handleErrorResponse("Unauthorized", 401);
    }

    console.log(userId);
    const content = await prismadb.generatedContent.findMany({
      where: { userId: userId },
    });

    if (!content || content.length === 0) {
      return NextResponse.json(null, {
        status: 404,
        statusText: "No content found",
      });
    }

    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.log("[ERROR_FETCHING_CONTENT]", error);
    return handleErrorResponse("Internal Server Error", 500);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { contentType, content, isUserGenerated } = body;
  const { userId } = auth();

  try {
    if (!userId) {
      return handleErrorResponse("Unauthorized", 401);
    }
    await prismadb.generatedContent.create({
      data: {
        userId: userId,
        contentType: contentType,
        isUserGenerated: isUserGenerated,
        content: content,
      },
    });
    return NextResponse.json("Save content successfully", { status: 200 });
  } catch (error) {
    console.log("[ERROR_SAVING_CONTENT]", error);
    return handleErrorResponse("Internal Server Error", 500);
  }
}
