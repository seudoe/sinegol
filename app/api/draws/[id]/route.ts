import { NextResponse } from "next/server";
import { logApiRequest, logger } from "@/lib/logger";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
    logApiRequest(request, "api:draws:id", { id });
        return NextResponse.json({ error: "Not implemented" }, { status: 501 });
        logger.info("api:draws:id", "GET executed successfully");
    } catch (error) {
        logger.error("api:draws:id", "Error in GET", { error });
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
    logApiRequest(request, "api:draws:id", { id });
        return NextResponse.json({ error: "Not implemented" }, { status: 501 });
        logger.info("api:draws:id", "PATCH executed successfully");
    } catch (error) {
        logger.error("api:draws:id", "Error in PATCH", { error });
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
