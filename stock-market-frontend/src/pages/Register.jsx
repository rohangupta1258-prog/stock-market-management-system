import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { TrendingUp, Eye, EyeOff, UserPlus } from 'lucide-react'

export default function Register() {
  const [form, setForm]         = useState({ username: '', email: '', password: '' })
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate                = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      toast.success('Account created! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)' }}>

      {/* Background blobs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-primary mb-4">
            <TrendingUp size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">StockMarket</h1>
          <p className="text-gray-400 mt-1">Create your account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">

          {/* Starting balance badge */}
          <div className="mb-6 p-3 rounded-xl border text-center"
               style={{ background: 'rgba(16,185,129,0.08)',
                        borderColor: 'rgba(16,185,129,0.2)' }}>
            <p className="text-xs text-green-400">
              🎉 Start with <strong>$10,000</strong> virtual balance
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Choose a username"
                required
                minLength={3}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500
                           border outline-none transition-all
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ background: 'rgba(255,255,255,0.05)',
                         borderColor: 'rgba(255,255,255,0.1)' }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500
                           border outline-none transition-all
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ background: 'rgba(255,255,255,0.05)',
                         borderColor: 'rgba(255,255,255,0.1)' }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500
                             border outline-none transition-all pr-12
                             focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ background: 'rgba(255,255,255,0.05)',
                           borderColor: 'rgba(255,255,255,0.1)' }}
                />
                <button type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                                   hover:text-white transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white btn-primary
                         flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white
                                rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}