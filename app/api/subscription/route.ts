import { NextResponse } from "next/server";
import { logApiRequest, logger } from "@/lib/logger";

export async function GET(request: Request) {
    try {
    logApiRequest(request, "api:subscription");
        return NextResponse.json({ error: "Not implemented" }, { status: 501 });
        logger.info("api:subscription", "GET executed successfully");
    } catch (error) {
        logger.error("api:subscription", "Error in GET", { error });
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
