import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../context/userContext'
import '../styles/Login.css'



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
    

      // Save auth token
      localStorage.setItem('token', data.token)
      // Only save user object for customer logins (don't overwrite when admin logs in)
      if (data.user && Object.keys(data.user).length > 0) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }
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
          <h1 className="role-title">Welcome to Mondo Grill</h1>
          <p className="role-subtitle">Select your login type</p>

          <div className="role-options">
            <button onClick={() => setUserRole('customer')} className={`role-btn customer-role`}>
              <div className="role-name">Customer</div>
              <div className="role-desc">Order delicious seafood</div>
            </button>
            <button onClick={() => setUserRole('admin')} className={`role-btn admin-role`}>
              <div className="role-name">Admin</div>
              <div className="role-desc">Manage orders & users</div>
            </button>
          </div>

          <button onClick={() => navigate('/')} className="go-back-btn">← Back to Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="mb-4" style={{ paddingLeft: '18px' }}>
          <button onClick={() => { setUserRole(null); setEmail(''); setPassword(''); setError('') }} className="back-to-role-btn">← Change Role</button>
        </div>

        <h1 className="login-title">{userRole === 'customer' ? `${login === 'signup' ? 'Customer Sign Up' : 'Customer Sign In'}` : 'Admin Login'}</h1>
        <p className="login-subtitle">{userRole === 'customer' ? 'Sign in to order your favorite dishes' : 'Sign in to manage your restaurant'}</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={onSubmit} className="login-form">
          {login === 'signup' && userRole === 'customer' && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="form-input" />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" className="form-input" />
          </div>

          <div className="form-group password-wrapper">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="form-input" />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="show-password-btn">{showPassword ? 'Hide' : 'Show'}</button>
          </div>

          <div className="form-options">
            <label className="remember-me"><input type="checkbox" /> Remember me</label>
            <button type="button" onClick={() => alert('Reset password flow')} className="forgot-btn">Forgot?</button>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">{loading ? (login === 'signup' ? 'Signing up...' : 'Signing in...') : (login === 'signup' ? 'Sign Up' : 'Sign In')}</button>
        </form>

        {userRole === 'customer' && (
          login === 'signup' ? (
            <p className="test-note">Already have an account? <button onClick={() => setLogin('login')} className="forgot-btn"> Sign In</button></p>
          ) : (
            <p className="test-note">Don't have an account? <button onClick={() => setLogin('signup')} className="forgot-btn"> Sign Up</button></p>
          )
        )}
      </div>
    </div>
  )
}

export default Login