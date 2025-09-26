import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
])

const isApiRoute = createRouteMatcher([
  // '/app/(.*)',
  '/api/(.*)'
])

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

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

  if(isProtectedRoute(req)){
    console.log("HELOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    await auth.protect();
    return;
  }
  
  if (!isPublicRoute(req) && !isApiRoute(req)) {
    const { userId } = await auth();
    console.log('User ID:', userId);
    console.log('User authenticated:', !!userId);

    console.log("MIDDLE WARE USER ID : ", userId);
    
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
  matcher: ["/((?!_next|.*\\..*).*)"],
}