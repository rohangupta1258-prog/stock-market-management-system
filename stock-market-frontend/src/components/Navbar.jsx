import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Menu, Bell, LogOut, User, TrendingUp, ChevronDown
} from 'lucide-react'

export default function Navbar({ onMenuClick }) {
  const { user, logout, refreshBalance } = useAuth()
  const navigate                         = useNavigate()
  const [dropdownOpen, setDropdownOpen]  = useState(false)

  useEffect(() => {
    refreshBalance()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b"
         style={{ background: '#0f1117', borderColor: 'rgba(255,255,255,0.08)' }}>

      {/* Left: hamburger + brand */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick}
                className="text-gray-400 hover:text-white transition-colors">
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">StockMarket</span>
        </div>
      </div>

      {/* Right: balance + notifications + user */}
      <div className="flex items-center gap-4">

        {/* Balance pill */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full glass">
          <span className="text-gray-400 text-sm">Balance</span>
          <span className="text-green-400 font-bold text-sm">
            ${Number(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Notification bell */}
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/10 transition-all">
            <div className="w-7 h-7 rounded-full btn-primary flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-200">
              {user?.username}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl glass border py-1 z-50"
                 style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="px-4 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400
                           hover:bg-red-500/10 transition-colors">
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}