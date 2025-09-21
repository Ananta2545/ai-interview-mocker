"use client";
import { Button } from '../../../../components/ui/button.jsx';
import { WebcamIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam';

const Interview = ({params}) => {
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    // console.log(params);
    // useEffect(()=>{
    //     params.then(result => {
    //         console.log(result.interviewId);
    //     }).catch(err => console.error(err))
    // }, [])

    useEffect(()=>{
        const fetchInterview = async ()=>{
            try{
                const resolvedParams = await params;
                const mockId = resolvedParams.interviewId;
                const res = await fetch(`/api/interview/${mockId}`);
                const data = await res.json();

                if(data.success){
                    console.log(data.interview[0].jobPosition);
                    setInterview(data.interview[0]);
                }else{
                    setError(data.error || "Interview not found");
                }
            }catch(error){
                setError(error.message);
            }finally{
                setLoading(false);
            }
        }
        fetchInterview();
    }, [params])

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;
    return(
        <div className='my-10 flex justify-center flex-col items-center'>
            <h2 className='font-bold text-2xl'>Let's get started</h2>
            <div>
                {
                    webCamEnabled ? <Webcam mirrored onUserMedia={()=>setWebCamEnabled(true)} onUserMediaError={()=>setWebCamEnabled(false)} style={{height: 300, width: 300}}/> : <><WebcamIcon className='h-72 w-full my-7 p-20 rounded-lg bg-secondary'/>
                    <Button onClick={()=>setWebCamEnabled(true)} className={`bg-blue-500 cursor-pointer hover:bg-blue-800`}>Enable Web Cam and Microphone</Button>
                    </>
                }
            </div>

            <div className='flex flex-col my-5'>
                <h2 className='text-lg'><strong>Job Role/Job Position: </strong>{interview?.jobPosition}</h2>
                <h2 className='text-lg'><strong>Job Description/Tech Stack: </strong>{interview?.jobDesc}</h2>
                <h2 className='text-lg'><strong>Years of Experience: </strong>{interview?.jobExperience}</h2>
            </div>
        </div>
    )

};

export default Interview