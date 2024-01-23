import prismadb from "@/lib/prismadb";
import { handleErrorResponse } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { contentType: undefined } }
) {
  const { userId } = auth();
  const contentType = params.contentType;

  try {
    if (!userId) {
      return handleErrorResponse("Unauthorized", 401);
    }

    console.log(userId);
    const content = await prismadb.generatedContent.findMany({
      where: { userId: userId, contentType: contentType },
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
