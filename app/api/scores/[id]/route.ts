import { NextResponse } from "next/server";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
