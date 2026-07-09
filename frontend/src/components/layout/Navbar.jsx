import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Heart, User, Menu, X, Search, Instagram, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const categories = [
  { label: 'Radha Krishna', value: 'radha-krishna' },
  { label: 'Laddu Gopal',   value: 'laddu-gopal' },
  { label: 'Accessories',   value: 'accessories' },
  { label: 'Puja Items',    value: 'puja-items' },
  { label: 'Khatu Shyam Baba', value: 'khatu-shyam-baba' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count, setIsOpen } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [search, setSearch] = useState('')
  const [shopOpen, setShopOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const handleSearch = e => {
    e.preventDefault()
    if (search.trim()) { navigate(`/products?search=${encodeURIComponent(search)}`); setSearch('') }
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`} style={{ background: '#FAF6F0', borderBottom: '1px solid rgba(212,175,55,0.3)' }}>
      {/* Top bar */}
      <div className="bg-primary text-cream text-center py-2 px-4 text-[11px] font-body tracking-widest uppercase">
        ✦ Free shipping above ₹999 &nbsp;|&nbsp; Cash on Delivery available &nbsp;|&nbsp; 100% Handmade ✦
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div className="font-display leading-tight">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Khatu Walas</div>
            <div className="text-lg font-bold" style={{ background: 'linear-gradient(135deg,#D4AF37,#B8860B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Creation</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className="font-body text-xs font-semibold tracking-widest uppercase text-muted hover:text-primary transition">Home</Link>

          {/* Shop dropdown */}
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <button className="flex items-center gap-1 font-body text-xs font-semibold tracking-widest uppercase text-muted hover:text-primary transition">
              Shop <ChevronDown size={12}/>
            </button>
            {shopOpen && (
              <div className="absolute top-full left-0 w-48 bg-cream border border-gold/30 rounded shadow-xl py-2 z-50">
                <Link to="/products" className="block px-4 py-2 text-xs font-body font-semibold tracking-widest uppercase text-muted hover:text-primary hover:bg-gold/10 transition">All Products</Link>
                {categories.map(c => (
                  <Link key={c.value} to={`/products?category=${c.value}`} className="block px-4 py-2 text-xs font-body font-semibold tracking-widest uppercase text-muted hover:text-primary hover:bg-gold/10 transition">{c.label}</Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className="font-body text-xs font-semibold tracking-widest uppercase text-muted hover:text-primary transition">About</Link>
          <Link to="/contact" className="font-body text-xs font-semibold tracking-widest uppercase text-muted hover:text-primary transition">Contact</Link>
        </nav>

        {/* Search + icons */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center border border-gold/40 rounded px-3 py-1.5 bg-white/60 gap-2">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-transparent outline-none font-body text-xs text-gray-700 placeholder-muted/50 w-32"/>
            <button type="submit"><Search size={14} className="text-muted"/></button>
          </form>

          <a href="https://instagram.com/khatuwalascreation" target="_blank" rel="noreferrer" className="text-muted hover:text-primary transition hidden sm:block">
            <Instagram size={18}/>
          </a>

          {/* Wishlist */}
          {user && <Link to="/wishlist" className="text-muted hover:text-primary transition"><Heart size={18}/></Link>}

          {/* Cart */}
          <button onClick={() => setIsOpen(true)} className="relative text-muted hover:text-primary transition">
            <ShoppingBag size={20}/>
            {count > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">{count}</span>}
          </button>

          {/* User */}
          {user ? (
            <div className="relative hidden lg:block" onMouseEnter={() => setUserOpen(true)} onMouseLeave={() => setUserOpen(false)}>
              <button className="flex items-center gap-1 text-muted hover:text-primary transition">
                <User size={18}/> <ChevronDown size={12}/>
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full w-48 bg-cream border border-gold/30 rounded shadow-xl py-2 z-50">
                  <div className="px-4 py-2 text-[11px] text-muted border-b border-gold/20 mb-1 truncate">{user.name}</div>
                  <Link to="/profile" className="block px-4 py-2 text-xs font-body font-semibold uppercase tracking-wider text-muted hover:text-primary hover:bg-gold/10 transition">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-xs font-body font-semibold uppercase tracking-wider text-muted hover:text-primary hover:bg-gold/10 transition">My Orders</Link>
                  {user.role === 'admin' && <Link to="/admin" className="block px-4 py-2 text-xs font-body font-semibold uppercase tracking-wider text-gold hover:bg-gold/10 transition">Admin Panel</Link>}
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-xs font-body font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 transition flex items-center gap-2"><LogOut size={12}/> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden lg:block font-body text-xs font-semibold tracking-widest uppercase text-muted hover:text-primary transition">Login</Link>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-muted hover:text-primary transition">
            {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-cream border-t border-gold/20 py-4 px-6 flex flex-col gap-3">
          <form onSubmit={handleSearch} className="flex items-center border border-gold/40 rounded px-3 py-2 gap-2 bg-white/60">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="bg-transparent outline-none font-body text-sm flex-1 text-gray-700"/>
            <button type="submit"><Search size={14} className="text-muted"/></button>
          </form>
          <Link to="/" className="font-body text-xs font-semibold tracking-widest uppercase text-muted">Home</Link>
          <Link to="/products" className="font-body text-xs font-semibold tracking-widest uppercase text-muted">All Products</Link>
          {categories.map(c => (
            <Link key={c.value} to={`/products?category=${c.value}`} className="font-body text-xs font-semibold tracking-widest uppercase text-muted pl-3">– {c.label}</Link>
          ))}
          <Link to="/about" className="font-body text-xs font-semibold tracking-widest uppercase text-muted">About</Link>
          <Link to="/contact" className="font-body text-xs font-semibold tracking-widest uppercase text-muted">Contact</Link>
          {user ? <>
            <Link to="/profile" className="font-body text-xs font-semibold tracking-widest uppercase text-muted">Profile</Link>
            <Link to="/orders" className="font-body text-xs font-semibold tracking-widest uppercase text-muted">My Orders</Link>
            {user.role === 'admin' && <Link to="/admin" className="font-body text-xs font-semibold tracking-widest uppercase text-gold">Admin Panel</Link>}
            <button onClick={logout} className="text-left font-body text-xs font-semibold tracking-widest uppercase text-red-600">Logout</button>
          </> : <>
            <Link to="/login" className="font-body text-xs font-semibold tracking-widest uppercase text-muted">Login</Link>
            <Link to="/register" className="font-body text-xs font-semibold tracking-widest uppercase text-muted">Register</Link>
          </>}
        </div>
      )}
    </header>
  )
}
