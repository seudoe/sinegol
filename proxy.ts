import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { logger } from "@/lib/logger";

export async function proxy(request: NextRequest) {
  const start = Date.now();
  const response = await updateSession(request);

  logger.info("proxy", `${request.method} ${request.nextUrl.pathname}`, {
    status: response.status,
    ms: Date.now() - start,
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
