import React from 'react'
import logo from '../assets/mondo-logo.png'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
     
    const navigate = useNavigate();

  return (
    <div>
        <div className='flex justify-between items-center mx-4 p-4 shadow-2xl'>
            <div>
                <img className='w-16' src={logo} alt="" srcset="" />
            </div>
             <div>
                <ul className='flex gap-6 text-lg'>
                    <Link className='p-2 bg-gray-200 cursor-pointer rounded ' to='/'>Home</Link>
                    <Link className='p-2 bg-gray-200 cursor-pointer rounded ' to='/about'>About</Link>
                    <Link className='p-2 bg-gray-200 cursor-pointer rounded ' to='/contact'>Contact</Link>
                </ul>
             </div>
             {localStorage.getItem('token') ? (
                <button onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                }} className=' border-0 text-white p-5 rounded bg-red-700 font-semibold cursor-pointer transition-all duration-500 hover:scale-105'>Logout</button>
             ) : (
                <button onClick={() => navigate('/login')} className=' border-0 text-white p-5 rounded bg-indigo-700 font-semibold cursor-pointer transition-all duration-500 hover:scale-105'>Login</button>
             )}
        </div>
    </div>
    
  )
}

export default Navbar