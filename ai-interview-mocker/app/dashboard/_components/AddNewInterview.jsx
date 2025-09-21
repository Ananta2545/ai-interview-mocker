"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperiance, setJobExperiance] = useState();
  const [loading, setLoading] = useState(false);

  const router = useRouter();


  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try{
        const res = await fetch("/api/gemini", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({jobPosition, jobDesc, jobExperiance}),
        })

        if(!res.ok){
            const errorData = await res.json();
            console.error("Backend error:", errorData.error);
            return;
        }
        

        const data = await res.json();
        // console.log("Saved interview in DB:", data.savedInterview);
        setOpenDialog(false);
        setLoading(false);
        router.push('/dashboard/interview'+ data.savedInterview[0]?.mockId)
    }catch(error){
        console.log("Error: ", error);
    }
  }

  return (
    <div>
      {/* Card that opens the dialog */}
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 duration-300 cursor-pointer hover:shadow-md"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      {/* Dialog starts here */}
      <Dialog open={openDialog}>
        <DialogContent className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl w-full max-w-2xl animate-fade-in scale-in duration-500">
            <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-purple-700 mb-4 text-center sm:text-left">
                Tell us more about your job interviewing
            </DialogTitle>

            <form onSubmit={onSubmit}>

            
                <div className="text-gray-700 space-y-6">
                    {/* Job details section */}
                    <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Add details about your job position/role, Job description, and years of experience
                    </h2>

                    <div className="flex flex-col gap-4 mt-4">
                        {/* Job Role / Position */}
                        <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">
                            Job Role / Job Position
                        </label>
                        <Input
                            placeholder="Ex. Full Stack Developer"
                            required
                            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                            onChange={(event)=>setJobPosition(event.target.value)}
                        />
                        </div>

                        {/* You can add more fields like Job Description or Experience here */}
                        <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">
                            Job Description(in short)
                        </label>
                        <Textarea
                            required
                            placeholder="Ex. React, Node.js, MongoDB, etc."
                            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                            onChange={(event)=>setJobDesc(event.target.value)}
                        />
                        </div>

                        <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">
                            Years of Experience
                        </label>
                        <Input
                            required
                            placeholder="Ex. 2 Years"
                            type="number"
                            max={100}
                            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                            onChange={(event)=>setJobExperiance(event.target.value)}
                        />
                        </div>
                    </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-gray-700 hover:text-white hover:bg-gray-500 transition-colors duration-300 cursor-pointer"
                        onClick={() => setOpenDialog(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 cursor-pointer">
                        {loading? 
                        <>
                        <LoaderCircle className="animate-spin"/>Generating from AI
                        </>:'Start Interview'
                        }
                    </Button>
                    </div>
                </div>
            </form>
            </DialogHeader>
        </DialogContent>
        </Dialog>

    </div>
  );
};

export default AddNewInterview;
