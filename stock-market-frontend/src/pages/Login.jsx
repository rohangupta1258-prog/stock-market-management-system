import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { TrendingUp, Eye, EyeOff, LogIn } from 'lucide-react'

export default function Login() {
  const [form, setForm]       = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data, res.data.token)
      toast.success(`Welcome back, ${res.data.username}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)' }}>

      {/* Background blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-primary mb-4">
            <TrendingUp size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">StockMarket</h1>
          <p className="text-gray-400 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
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
                placeholder="Enter your username"
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
                  placeholder="Enter your password"
                  required
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
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 p-3 rounded-xl border text-center"
               style={{ background: 'rgba(59,130,246,0.08)',
                        borderColor: 'rgba(59,130,246,0.2)' }}>
            <p className="text-xs text-blue-400">
              Demo: <strong>demo_user</strong> / <strong>password123</strong>
            </p>
          </div>

          {/* Register link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}