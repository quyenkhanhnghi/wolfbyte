import prismadb from "@/lib/prismadb";
import { handleErrorResponse } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = auth();
  const user = await currentUser();

  try {
    if (!userId) {
      return handleErrorResponse("Unauthorized", 401);
    }
    const content = await prismadb.generatedContent.findMany({
      where: { userId: userId },
    });

    if (!content || content.length === 0) {
      return new NextResponse(null, {
        status: 404,
        statusText: "No content found",
      });
    }

    return new NextResponse(JSON.stringify(content), { status: 200 });
  } catch (error) {
    console.log("[ERROR_FETCHING_CONTENT]", error);
    handleErrorResponse("Internal Server Error", 500);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { contentType, content } = body;
  const { userId } = auth();

  try {
    if (!userId) {
      return handleErrorResponse("Unauthorized", 401);
    }

    await prismadb.generatedContent.create({
      data: {
        userId: userId,
        content: content,
        contentType: contentType,
      },
    });
    return new NextResponse("Save content successfully", { status: 200 });
  } catch (error) {
    console.log("[ERROR_SAVING_CONTENT]", error);
    handleErrorResponse("Internal Server Error", 500);
  }
}
