import { eq } from 'drizzle-orm';
import {db} from '../../../../utils/db.js'
import { mockInterview } from '../../../../utils/schema.js'
import { NextResponse } from 'next/server'

export async function GET(req, context){
    try{
        // Await params before accessing properties (Next.js 15 requirement)
        const params = await context.params;
        const {mockId} = params;

        const interview = await db.select().from(mockInterview).where(eq(mockInterview.mockId, mockId));
        if(!interview){
            return NextResponse.json({error: "Interview not found"}, {status: 404});
        }

        return NextResponse.json({success: true, interview})
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}