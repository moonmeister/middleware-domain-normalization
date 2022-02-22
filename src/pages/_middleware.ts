import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (!process.env.NORMALIZED_URL) {
    console.error(
      "You must provide a NORMALIZED_URL environment variable for the domain normalization middleware to work correctly"
    );
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  const normalizedHost = new URL(process.env.NORMALIZED_URL);
  const host = req.headers.get("host");

  const isDevelopment = process.env.NODE_ENV === "development";
  const isCorrectHostname = host.split(":")[0] === normalizedHost.hostname;

  if (!isDevelopment && !isCorrectHostname) {
    url.protocol = normalizedHost.protocol;
    url.host = normalizedHost.host;
    url.port = normalizedHost.port;
    return NextResponse.redirect(url);
  }
}
