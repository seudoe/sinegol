import { NextResponse } from "next/server";
import { logApiRequest, logger } from "@/lib/logger";

export async function GET(request: Request) {
    try {
    logApiRequest(request, "api:charities");
        return NextResponse.json({ error: "Not implemented" }, { status: 501 });
        logger.info("api:charities", "GET executed successfully");
    } catch (error) {
        logger.error("api:charities", "Error in GET", { error });
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function POST(request: Request) {
    try {
    logApiRequest(request, "api:charities");
        return NextResponse.json({ error: "Not implemented" }, { status: 501 });
        logger.info("api:charities", "POST executed successfully");
    } catch (error) {
        logger.error("api:charities", "Error in POST", { error });
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
