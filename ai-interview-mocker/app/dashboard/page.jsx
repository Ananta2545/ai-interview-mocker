import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

const Dashboard = () => {
  return (
    <div className="p-8 space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="font-bold text-3xl text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">
          Create and start your AI-powered mock interviews
        </p>
      </div>

      {/* Add New Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-lg text-gray-800 mb-4">+ Add New Interview</h3>
        <AddNewInterview />
      </div>

      {/* Interview List Section */}
      <div>
        <InterviewList />
      </div>
    </div>
  )
}

export default Dashboard
