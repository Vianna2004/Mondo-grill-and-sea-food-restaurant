import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import axios from 'axios'
import { useContext } from 'react'
import { UserContext } from '../context/userContext'



const Login = () => {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState('signup')

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

      if (login === 'signup' && userRole === 'customer') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (data?.token) {
          setToken(data.token)
          alert('Signup successful! Please log in now.')
          setLogin('login')
        } else {
          setError(data.message || 'Signup failed')
        }
        setLoading(false)
        return
      }

      // Use different endpoint based on role
      const endpoint = userRole === 'admin' ? '/api/user/admin-login' : '/api/user/login'
      const response = await axios.post(backendUrl + endpoint, { email, password })

      const data = response.data

      if (response.status !== 200) {
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }
    

      // Save user info to localStorage and update context
      localStorage.setItem('token', data.token)
      setToken && setToken(data.token)
     // localStorage.setItem('userRole', userRole)

      // Navigate based on role and token payload
      if (userRole === 'customer') {
        navigate('/menu')
      } else if (userRole === 'admin') {
        // Check token payload for admin role
        try {
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          if (payload.role === 'admin') {
            navigate('/admin-dashboard')
          } else {
            setError('You are not authorized as admin.');
          }
        } catch (e) {
          setError('Invalid admin token.');
        }
      }
      // update context token for other parts of the app
      setToken && setToken(data.token)
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
          {userRole === 'customer' ? `🍽️ Customer ${login === 'signup' ? 'Sign Up' : 'Sign In'}` : '🧑‍💼Admin Login'}
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

         {login === 'signup' && userRole === 'customer' && <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="name"
            />
          </div>}

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

          {login === 'signup' && userRole === 'customer' ? (
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          )}
        </form>

        {/* <p className="test-note">
          💡 For testing: Use any email (e.g., test@test.com) and password (min 6 characters)
        </p> */}

        {userRole === 'customer' && (
          login === 'signup' ? (
            <p className="toggle-login">
              Already have an account?{' '}
              <button
                className="toggle-login-btn"
                onClick={() => setLogin('login')}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="toggle-login">
              Don't have an account?{' '}
              <button
                className="toggle-login-btn"
                onClick={() => setLogin('signup')}
              >
                Sign Up
              </button>
            </p>
          )
        )}
      </div>
    </div>
  )
}

export default Login