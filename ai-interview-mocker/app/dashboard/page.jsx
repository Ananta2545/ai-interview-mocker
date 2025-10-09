import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

const Dashboard = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Page Title */}
      <div className="space-y-2 text-center md:text-left">
        <h2 className="font-bold text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent transition-colors duration-300">
          Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors duration-300">
          Create and start your AI-powered mock interviews
        </p>
      </div>

      {/* Add New Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl hover:scale-[1.01]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 flex items-center justify-center shadow-lg transition-all duration-300">
            <span className="text-white font-bold text-lg">+</span>
          </div>
          <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-200 transition-colors duration-300">
            Add New Interview
          </h3>
        </div>
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

