import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl.clone();

  const isDevelopment = process.env.NODE_ENV === "development";
  const isStaticFileRequest = url.pathname.includes(".");
  const host = req.headers.get("host");

  const normalizedHost = new URL(process.env.NORMALIZED_URL);
  const isCorrectScheme = url.protocol === normalizedHost.protocol;
  const isCorrectHostname = host === normalizedHost.host;
  const isCorrectHost = isCorrectScheme && isCorrectHostname;

  if (!isStaticFileRequest && !isDevelopment && !isCorrectHost) {
    url.protocol = normalizedHost.protocol;
    url.host = normalizedHost.host;
    url.port = normalizedHost.port;
    return NextResponse.redirect(url);
  }

  if (isStaticFileRequest) {
    console.log(`Not redirecting because is static file: ${url.pathname}`);
    return;
  }

  if (isDevelopment) {
    console.log(`Not redirecting because NODE_ENV === ${process.env.NODE_ENV}`);
    return;
  }

  if (isCorrectHostname) {
    console.log(
      `Not redirecting because hostname is already "${url.hostname}"`
    );
    return;
  }
}
