import { mockInterview } from '../../../utils/schema.js';
import { db } from '../../../utils/db.js';
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { desc, eq } from 'drizzle-orm';

// Force dynamic rendering and prevent caching
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req){
    try{
        console.log("Interview API Route Hit");
        
        // Try to get userId from auth first, fallback to header
        let userId = null;
        try {
            const authResult = await auth();
            userId = authResult?.userId;
        } catch (e) {
            console.log("Auth not available, checking header");
        }
        
        // Fallback: Get userId from request header
        if (!userId) {
            userId = req.headers.get('x-user-id');
        }
        
        console.log("Auth userId: ", userId)
        
        if(!userId){
            return NextResponse.json({error: "Unauthorized - No user found"}, {status: 401});
        }

        const interviews = await db.select({
            id: mockInterview.id,
            mockId: mockInterview.mockId,
            jobPosition: mockInterview.jobPosition,
            jobDesc: mockInterview.jobDesc,
            jobExperience: mockInterview.jobExperience,
            createdAt: mockInterview.createdAt,
            jsonMockResp: mockInterview.jsonMockResp,
            userId: mockInterview.userId
        })
        .from(mockInterview)
        .where(eq(mockInterview.userId, userId))
        .orderBy(desc(mockInterview.createdAt));

         const formattedInterviews = interviews.map(interview => ({
            id: interview.id,
            mockId: interview.mockId,
            jobPosition: interview.jobPosition,
            jobDesc: interview.jobDesc,
            jobExperience: interview.jobExperience,
            createdAt: interview.createdAt,
            userId: interview.userId,
            totalQuestions: Array.isArray(interview.jsonMockResp) 
                ? interview.jsonMockResp.length 
                : JSON.parse(interview.jsonMockResp || '[]').length
        }));

        return NextResponse.json({
            success: true,
            interviews: formattedInterviews
        });
    }catch(error){
        console.error("Error fetching interviews: ", error);
        return NextResponse.json({
            error: error.message || "Failed to fetch interview details"
        }, {status: 500});
    }
}

