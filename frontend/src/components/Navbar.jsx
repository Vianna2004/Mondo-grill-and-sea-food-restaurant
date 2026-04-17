import React from 'react'
import logo from '../assets/mondo-logo.png'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

        // keep navbar visible on home; special case for login page handled below

        // on login page show only logout button (no logo/links)
        if (location.pathname === '/login') {
            return (
                <div className='flex justify-end p-4'>
                    {localStorage.getItem('token') ? (
                        <button onClick={() => {
                                localStorage.removeItem('token');
                                navigate('/login');
                        }} className='text-white px-4 py-2 rounded bg-red-600 font-semibold'>Logout</button>
                    ) : null}
                </div>
            )
        }

  return (
    <div>
        <div className='flex justify-between items-center mx-4 p-4 shadow-2xl'>
            <div>
                <img className='w-16' src={logo} alt="" srcset="" />
            </div>
             <div>
                <ul className='flex gap-6 text-lg'>
                    <Link className='p-2 bg-gray-200 cursor-pointer rounded ' to='/'>Home</Link>
                </ul>
             </div>
                 {localStorage.getItem('token') ? (
                     <button onClick={() => {
                          localStorage.removeItem('token');
                          navigate('/login');
                     }} className='border-0 text-white px-5 py-2 rounded bg-red-700 font-semibold cursor-pointer transition-all duration-500 hover:scale-105 text-lg'>Logout</button>
                 ) : (
                     <button onClick={() => navigate('/login')} className='border-0 text-white px-5 py-2 rounded bg-indigo-700 font-semibold cursor-pointer transition-all duration-500 hover:scale-105 text-lg'>Login</button>
                 )}
        </div>
    </div>
    
  )
}

export default Navbar