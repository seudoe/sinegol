import { NextResponse } from "next/server";
import { logApiRequest, logger } from "@/lib/logger";

export async function POST(request: Request) {
    try {
    logApiRequest(request, "api:stripe:webhook");
        return NextResponse.json({ error: "Not implemented" }, { status: 501 });
        logger.info("api:stripe:webhook", "POST executed successfully");
    } catch (error) {
        logger.error("api:stripe:webhook", "Error in POST", { error });
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
