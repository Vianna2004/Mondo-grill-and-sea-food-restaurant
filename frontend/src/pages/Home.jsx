import React from 'react'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="relative w-full h-screen bg-cover bg-center bg-no-repeat" 
         style={{
           backgroundImage: 'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&h=900&fit=crop")'
         }}>
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Mondo Grill & Seafood
        </h1>
        <p className="text-xl md:text-2xl text-gray-100 mb-8">
          Experience the finest seafood restaurant in Kenya
        </p>
        <button onClick={() =>navigate('/menu') } className="bg-red-600 hover:bg-red-700 text-white font-bold p=4 px-8 rounded-lg transition duration-300">
          Explore Menu
        </button>
      </div>
    </div>
  )
}

export default Home