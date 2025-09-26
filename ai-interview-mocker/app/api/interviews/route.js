import { mockInterview } from '../../../utils/schema.js';
import { db } from '../../../utils/db.js';
import {auth, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from 'drizzle-orm';

export async function GET(req){
    try{

        console.log("🚀 API Route Hit");
        console.log("REQUEST IS ==============: ", req.authorization)
        const {userId} = getAuth(req);
        const authData = getAuth(req);

        console.log("AUTH DATA IS ", authData)
        if(!userId){
            return NextResponse.json({error: "unauthorized"}, {status: 404});
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
        .orderBy(mockInterview.createdAt);

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