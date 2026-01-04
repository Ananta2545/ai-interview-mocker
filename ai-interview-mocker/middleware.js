import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionId } = await auth();
  const pathname = req.nextUrl.pathname;

  console.log("🔍 Checking:", pathname, " | userId:", userId);

  // ✅ 1. If user is logged in and tries to visit sign-in or sign-up → redirect to dashboard
  if (userId && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
    console.log("➡️ Already signed in → redirecting to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ✅ 2. Allow public routes without auth
  if (isPublicRoute(req)) {
    console.log("✅ Public route allowed");
    return NextResponse.next();
  }

  // ✅ 3. Allow API routes (auth handled inside them)
  if (isApiRoute(req)) {
    console.log("🔓 API route - skipping middleware auth");
    return NextResponse.next();
  }

  // ✅ 4. For protected routes (dashboard etc.)
  if (!userId || !sessionId) {
    // Only redirect if not already on sign-in or sign-up
    if (!pathname.startsWith("/sign-in") && !pathname.startsWith("/sign-up")) {
      console.log("🚫 Not authenticated → redirecting to /sign-in");
      const redirectUrl = new URL("/sign-in", req.url);
      redirectUrl.searchParams.set("redirect_url", req.url); // preserve target
      return NextResponse.redirect(redirectUrl);
    }
  }


  console.log("✅ Authenticated access to:", pathname);
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|webp|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
