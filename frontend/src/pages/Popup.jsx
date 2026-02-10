import React from 'react'
import { useNavigate } from 'react-router-dom'

const Popup = () => {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => navigate(-1)} />
      <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold mb-4">Login Popup</h2>
        <p className="mb-6">This is a popup page. Put your login form here.</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Placeholder: perform login then close popup
              navigate(-1)
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Popup
