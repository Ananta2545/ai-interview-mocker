import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/(.*)',
  '/',
])

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  
  console.log('🔍 Middleware checking:', pathname);

  // If it's a public route, allow it without auth
  if (isPublicRoute(req)) {
    console.log('✅ Public route allowed');
    return;
  }

  // For all protected routes (including API routes), protect them
  console.log('🔒 Protecting route');
  await auth.protect();
  console.log('✅ User authenticated for:', pathname);
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}