import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl.clone();

  console.log(JSON.stringify(url, null, 2));

  const isDevelopment = process.env.NODE_ENV === "development";
  const isStaticFileRequest = url.pathname.includes(".");
  const host = req.headers.get("host");

  const normalizedHost = new URL(process.env.NORMALIZED_URL);
  console.log(JSON.stringify(normalizedHost, null, 2));

  const isCorrectScheme = url.protocol === normalizedHost.protocol;
  const isCorrectHostname = host === normalizedHost.host;
  const isCorrectHost = isCorrectScheme && isCorrectHostname;

  if (isStaticFileRequest) {
    console.log(`Not redirecting because is static file: ${url.pathname}`);
    return;
  }

  if (isDevelopment) {
    console.log(`Not redirecting because NODE_ENV === ${process.env.NODE_ENV}`);
    return;
  }

  if (isCorrectHost) {
    console.log(`Not redirecting because host is already "${url.origin}"`);
    return;
  }

  url.port = normalizedHost.port;
  url.protocol = normalizedHost.protocol;
  url.host = normalizedHost.host;

  console.log(JSON.stringify(url, null, 2));

  return NextResponse.redirect(url);
}
