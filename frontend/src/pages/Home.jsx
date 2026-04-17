import React from 'react'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  const navigate = useNavigate()
  return (
    <div>
      <section className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat" 
         style={{
           backgroundImage: 'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&h=900&fit=crop")'
         }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex items-center justify-center h-screen text-center px-4 py-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Mondo Grill & Seafood</h1>
            <p className="text-lg md:text-2xl text-gray-100 mb-6">Experience the finest seafood and grilled specialties.</p>
            <div className="flex justify-center">
              <button onClick={() =>navigate('/menu') } className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition duration-300">Explore Menu</button>
            </div>
          </div>
        </div>
      </section>

      {/* About & Contact combined section (side-by-side on wide screens) */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="w-full md:w-1/2 md:pr-6 text-left">
            <h2 className="text-2xl font-semibold mb-4">About Mondo Grill</h2>
            <p className="text-gray-700 leading-relaxed">Mondo Grill is a neighbourhood restaurant known for fresh, sustainably sourced seafood and flame-grilled dishes. We focus on quality ingredients, friendly service, and a relaxed atmosphere for families and friends.</p>
          </div>

          <div className="w-full md:w-1/2 md:pl-6 text-left md:text-right">
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="text-gray-700">Address: Nairobi, Kenya</p>
            <p className="text-gray-700">Phone: +254 700 000 000</p>
            <p className="text-gray-700">Email: hello@mondogrill.co.ke</p>
            <p className="text-gray-700 mt-3">Hours: Daily 11:00 — 22:00</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home