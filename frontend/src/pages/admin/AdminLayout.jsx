import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, MessageSquare, Tag, Users, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin',           label: 'Dashboard', icon: <LayoutDashboard size={17}/>, end: true },
  { to: '/admin/products',  label: 'Products',  icon: <Package size={17}/> },
  { to: '/admin/orders',    label: 'Orders',    icon: <ShoppingBag size={17}/> },
  { to: '/admin/contacts',  label: 'Messages',  icon: <MessageSquare size={17}/> },
  { to: '/admin/coupons',   label: 'Coupons',   icon: <Tag size={17}/> },
  { to: '/admin/users',     label: 'Users',     icon: <Users size={17}/> },
  { to: '/admin/settings',  label: 'Settings',  icon: <LayoutDashboard size={17}/> },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-primary text-cream" style={{ minHeight: '100vh' }}>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="font-display text-[10px] tracking-[0.2em] uppercase opacity-60 mb-0.5">Khatu Walas</div>
        <div className="font-display text-lg font-bold text-gold">Admin Panel</div>
        <div className="font-body text-xs opacity-50 mt-1">{user?.email}</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-body text-xs font-semibold uppercase tracking-widest transition ${isActive ? 'bg-gold text-primary' : 'text-cream/70 hover:bg-white/10 hover:text-cream'}`}>
            {icon}{label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-xs font-semibold uppercase tracking-widest text-cream/60 hover:bg-red-500/20 hover:text-cream transition">
          <LogOut size={17}/> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-56 flex-shrink-0 shadow-xl">
        <Sidebar/>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}/>
          <div className="fixed left-0 top-0 h-full w-56 z-50 md:hidden shadow-2xl">
            <Sidebar/>
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-primary transition"><Menu size={22}/></button>
          <div className="font-display text-lg font-bold text-primary hidden md:block">Dashboard</div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-body text-xs font-bold text-primary">{user?.name}</div>
              <div className="font-body text-[10px] text-muted">Administrator</div>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
