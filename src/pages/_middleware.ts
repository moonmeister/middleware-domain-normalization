import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const normalizedHostname = "domain-normalization.headlesswp.xyz";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl.clone();

  const isDevelopment = process.env.NODE_ENV === "development";
  const isStaticFileRequest = url.pathname.includes(".");
  const isCorrectHostname = url.hostname === normalizedHostname;

  if (!isStaticFileRequest && !isDevelopment && !isCorrectHostname) {
    url.hostname = normalizedHostname;
    console.log(`Redirecting from ${req.nextUrl.host} to ${url.hostname}`);
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
