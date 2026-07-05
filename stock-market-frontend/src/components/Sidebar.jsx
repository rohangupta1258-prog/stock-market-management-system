import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, ShoppingCart,
  Briefcase, History, BarChart2, X
} from 'lucide-react'

const navItems = [
  { path: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { path: '/stocks',       label: 'Stocks',       icon: TrendingUp      },
  { path: '/trade',        label: 'Trade',        icon: ShoppingCart    },
  { path: '/portfolio',    label: 'Portfolio',    icon: Briefcase       },
  { path: '/transactions', label: 'Transactions', icon: History         },
  { path: '/market',       label: 'Market',       icon: BarChart2       },
]

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden"
             onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar panel */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        flex flex-col w-64 border-r transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}
      `} style={{ background: '#0d1017', borderColor: 'rgba(255,255,255,0.08)' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b"
             style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Navigation</p>
          </div>
          <button onClick={() => setIsOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200
                ${isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: market status */}
        <div className="p-4 m-4 rounded-xl glass">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-green-400 font-medium">Market Open</span>
          </div>
          <p className="text-xs text-gray-500">Prices update every 30s</p>
        </div>
      </aside>
    </>
  )
}