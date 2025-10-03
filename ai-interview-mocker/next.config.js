
/** @type {import('next').NextConfig} */
const nextConfig = {
// Force all routes to compile on server start
experimental: {
// Ensure routes are compiled before serving
optimizePackageImports: ['@clerk/nextjs'],
},
// Increase page buffer to keep routes in memory
onDemandEntries: {
// Period (in ms) where the server will keep pages in the buffer
maxInactiveAge: 60 * 60 * 1000, // 1 hour
// Number of pages that should be kept simultaneously without being disposed
pagesBufferLength: 10,
},
};

export default nextConfig;