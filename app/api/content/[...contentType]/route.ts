import prismadb from "@/lib/prismadb";
import { handleErrorResponse } from "@/lib/utils";
import { contentType } from "@/type";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { contentType: any } }
) {
  const { userId } = auth();
  const routeContentType = params.contentType;

  try {
    if (!userId) {
      return handleErrorResponse("Unauthorized", 401);
    }

    const validContentType = contentType[routeContentType];

    const content = await prismadb.generatedContent.findMany({
      where: {
        userId: userId,
        contentType: validContentType as unknown as undefined,
      },
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
