import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/'
])

const isApiRoute = createRouteMatcher([
  // '/app/(.*)',
  '/api/(.*)'
])

// export default clerkMiddleware(async (auth, req) => {
  
//   if (!isPublicRoute(req) && !isApiRoute(req)) {
//     await auth.protect()
//   }
// })

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('Path:', pathname);
  console.log('Is Public Route:', isPublicRoute(req));
  console.log('Is API Route:', isApiRoute(req));
  
  if (!isPublicRoute(req) && !isApiRoute(req)) {
    const { userId } = await auth();
    console.log('User ID:', userId);
    console.log('User authenticated:', !!userId);
    
    if (!userId) {
      console.log('❌ No user - redirecting to sign-in');
      await auth.protect();
    } else {
      console.log('✅ User authenticated - allowing access');
    }
  } else {
    console.log('ℹ️ Public/API route - skipping auth');
  }
  console.log('========================');
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}