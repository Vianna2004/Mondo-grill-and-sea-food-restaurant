import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import axios from 'axios'
import { useContext } from 'react'
import { UserContext } from '../context/userContext'



const Login = () => {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState(false)

  const { backendUrl, token, setToken } = useContext(UserContext);

  const validate = () => {
    if (!email) return 'Email is required.'
    // simple email check
    const re = /\S+@\S+\.\S+/
    if (!re.test(email)) return 'Enter a valid email address.'
    if (!password) return 'Password is required.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    return ''
  }

  
  //   e.preventDefault()
  //   const v = validate()
  //   if (v) {
  //     setError(v)
  //     return
  //   }
  //   if (!userRole) {
  //     setError('Please select a login role (Customer or Admin)')
  //     return
  //   }
  //   setError('')
  //   setLoading(true)
  //   // Simulate login request - allow any valid format for testing
  //

  const onSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    if (!userRole) {
      setError('Please select a login role (Customer or Admin)')
      return
    }
    setError('')
    setLoading(true)

    try {
      //const baseUrl = backendUrl || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const response = await axios.post(backendUrl + '/api/user/login', { email, password })

      const data = response.data

      if (response.status !== 200) {
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }

      // Save user info to localStorage
      localStorage.setItem('token', data.token)
     // localStorage.setItem('userRole', userRole)

      // Navigate based on role
      if (userRole === 'customer') {
        navigate('/menu')
      } else if (userRole === 'admin') {
        //localStorage.setItem('adminLoggedIn', 'true')
        navigate('/admin-dashboard')
      }
      setLoading(false)
    } catch (error) {
      console.error('Login error:', error)
      setError(error.response?.data?.message || 'An error occurred during login. Please try again.')
      setLoading(false)
    }
  }
  

  if (!userRole) {
    return (
      <div className="login-role-container">
        <div className="role-selection-card">
          <h1 className="role-title">👋 Welcome to Mondo Grill</h1>
          <p className="role-subtitle">Select your login type</p>
          
          <div className="role-options">
            <button
              className="role-btn customer-role"
              onClick={() => setUserRole('customer')}
            >
              <div className="role-icon">🍽️</div>
              <div className="role-name">Customer</div>
              <div className="role-desc">Order delicious seafood</div>
            </button>
            
            <button
              className="role-btn admin-role"
              onClick={() => setUserRole('admin')}
            >
              <div className="role-icon">👨‍💼</div>
              <div className="role-name">Admin</div>
              <div className="role-desc">Manage orders & users</div>
            </button>
          </div>
          
          <button
            className="go-back-btn"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <button
          className="back-to-role-btn"
          onClick={() => {
            setUserRole(null)
            setEmail('')
            setPassword('')
            setError('')
          }}
        >
          ← Change Role
        </button>

        <h1 className="login-title">
          {userRole === 'customer' ? '🍽️ Customer Login' : '👨‍💼 Admin Login'}
        </h1>
        <p className="login-subtitle">
          {userRole === 'customer' ? 'Sign in to order your favorite dishes' : 'Sign in to manage your restaurant'}
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="show-password-btn"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => alert('Reset password flow')}
              className="forgot-btn"
            >
              Forgot?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* <p className="test-note">
          💡 For testing: Use any email (e.g., test@test.com) and password (min 6 characters)
        </p> */}
      </div>
    </div>
  )
}

export default Login