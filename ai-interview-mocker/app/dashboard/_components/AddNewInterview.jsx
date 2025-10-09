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
import toast from "react-hot-toast";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperiance, setJobExperiance] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();


  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try{
        console.log("🚀 Submitting interview request...");
        
        const res = await fetch("/api/gemini", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({jobPosition, jobDesc, jobExperiance}),
        })

        const data = await res.json();
        
        if(!res.ok){
            console.error("❌ Backend error:", data);
            
            // Display user-friendly error message
            const errorMsg = data.userMessage || data.error || "Failed to generate interview questions";
            setError(errorMsg);
            
            // Show toast notification with appropriate icon
            if (data.errorType === "MODEL_OVERLOADED") {
              toast.error(errorMsg, {
                duration: 6000,
                icon: '🤖',
              });
            } else if (data.errorType === "RATE_LIMIT") {
              toast.error(errorMsg, {
                duration: 5000,
                icon: '⏳',
              });
            } else if (data.errorType === "NETWORK_ERROR") {
              toast.error(errorMsg, {
                duration: 5000,
                icon: '🌐',
              });
            } else if (data.errorType === "TIMEOUT_ERROR") {
              toast.error(errorMsg, {
                duration: 5000,
                icon: '⏱️',
              });
            } else {
              toast.error(errorMsg, {
                duration: 5000,
              });
            }
            
            setLoading(false);
            return;
        }
        
        console.log("✅ Interview created successfully:", data.savedInterview[0]?.mockId);

        // Success!
        toast.success("Interview questions generated successfully! 🎉", {
          duration: 3000,
        });
        
        setOpenDialog(false);
        setLoading(false);
        setError(null);
        
        // Navigate to interview page
        router.push('/dashboard/interview/'+ data.savedInterview[0]?.mockId)
        
    }catch(error){
        console.error("❌ Unexpected error:", error);
        const errorMsg = "Network error. Please check your connection and try again.";
        setError(errorMsg);
        toast.error(errorMsg, {
          duration: 5000,
          icon: '🌐',
        });
        setLoading(false);
    }
  }

  return (
    <div>
      {/* Card that opens the dialog */}
      <div
        className="p-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:scale-105 duration-300 cursor-pointer hover:shadow-lg dark:hover:shadow-2xl transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center text-gray-800 dark:text-gray-200 font-medium transition-colors duration-300">+ Add New</h2>
      </div>

      {/* Dialog starts here */}
      <Dialog open={openDialog}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl p-8 sm:p-10 shadow-2xl dark:shadow-2xl dark:border dark:border-gray-700 w-full max-w-2xl animate-fade-in scale-in duration-500 transition-colors">
            <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 mb-4 text-center sm:text-left transition-colors duration-300">
                Tell us more about your job interviewing
            </DialogTitle>

            <form onSubmit={onSubmit}>

            {/* Error message display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-300">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">❌</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1 transition-colors duration-300">Error</p>
                    <p className="text-sm text-red-700 dark:text-red-400 transition-colors duration-300">{error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            
                <div className="text-gray-700 dark:text-gray-300 space-y-6 transition-colors duration-300">
                    {/* Job details section */}
                    <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        Add details about your job position/role, Job description, and years of experience
                    </h2>

                    <div className="flex flex-col gap-4 mt-4">
                        {/* Job Role / Position */}
                        <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            Job Role / Job Position
                        </label>
                        <Input
                            placeholder="Ex. Full Stack Developer"
                            required
                            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all duration-300"
                            onChange={(event)=>setJobPosition(event.target.value)}
                        />
                        </div>

                        {/* You can add more fields like Job Description or Experience here */}
                        <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            Job Description(in short)
                        </label>
                        <Textarea
                            required
                            placeholder="Ex. React, Node.js, MongoDB, etc."
                            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all duration-300"
                            onChange={(event)=>setJobDesc(event.target.value)}
                        />
                        </div>

                        <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            Years of Experience
                        </label>
                        <Input
                            required
                            placeholder="Ex. 2 Years"
                            type="number"
                            max={100}
                            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all duration-300"
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
                        className="text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gray-500 dark:hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
                        onClick={() => setOpenDialog(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white transition-all duration-300 cursor-pointer">
                        {loading? 
                        <>
                        <LoaderCircle className="animate-spin mr-2"/>
                        <span>Generating from AI...</span>
                        </>
                        :'Start Interview'
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
