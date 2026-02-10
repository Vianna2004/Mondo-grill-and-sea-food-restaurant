import React from 'react'
import Navbar from './components/Navbar'
import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Menu from './pages/Menu'
import Cart from './pages/cart'
import Payment from './pages/Payment'
import Myorder from './pages/Myorder'
import Admindashboard from './pages/Admindashboard'
import Popup from './pages/Popup'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/my-order' element={<Myorder />} />
        <Route path='/admin-dashboard' element={<Admindashboard />} />
        {/* <Route path='/login-popup' element={<Popup />} /> */}
      </Routes>
    </div>
  )
}

export default App