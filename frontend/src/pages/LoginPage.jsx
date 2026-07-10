// LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}! 🙏`)
      const redirect = sp.get('redirect') || (user.role === 'admin' ? '/admin' : '/')
      navigate(redirect)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail.trim()) return toast.error('Please enter your email')
    setForgotLoading(true)
    try {
      const { data } = await api.post('/auth/forgot-password', { email: forgotEmail })
      toast.success(data.message || 'Reset link sent to your email!')
      setForgotMode(false)
      setForgotEmail('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link')
    } finally { setForgotLoading(false) }
  }

  return (
    <div className="min-h-screen mandala-bg flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-md bg-cream rounded-2xl border border-gold/20 shadow-xl p-8 page-enter">
        <div className="text-center mb-8">
          <div className="font-display text-[10px] tracking-[0.2em] uppercase text-primary mb-1">Khatu Walas</div>
          <div className="font-display text-2xl font-bold" style={{ background:'linear-gradient(135deg,#D4AF37,#B8860B)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Creation</div>
          <h1 className="font-display text-2xl font-bold text-primary mt-4 mb-1">{forgotMode ? 'Reset Password' : 'Welcome Back'}</h1>
          <p className="font-body text-sm text-muted">{forgotMode ? 'Enter your email to receive a reset link' : 'Sign in to your account'}</p>
        </div>

        {forgotMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Email</label>
              <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="input-field" placeholder="your@email.com" required/>
            </div>
            <button type="submit" disabled={forgotLoading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
              {forgotLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending...</> : 'Send Reset Link'}
            </button>
            <button type="button" onClick={() => setForgotMode(false)} className="w-full text-center font-body text-sm text-muted hover:text-primary transition">
              ← Back to Login
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} className="input-field" placeholder="your@email.com" required/>
              </div>
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Password</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} className="input-field pr-10" placeholder="Your password" required/>
                  <button type="button" onClick={() => setShow(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                    {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Signing in...</> : 'Sign In'}
              </button>
            </form>
            <div className="text-center mt-4">
              <button onClick={() => setForgotMode(true)} className="font-body text-sm text-gold hover:text-primary transition font-semibold">Forgot Password?</button>
            </div>
          </>
        )}
        <p className="font-body text-sm text-center text-muted mt-6">Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register</Link></p>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.phone)
      toast.success('Account created! Welcome 🙏')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen mandala-bg flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-md bg-cream rounded-2xl border border-gold/20 shadow-xl p-8 page-enter">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-primary mb-1">Create Account</h1>
          <p className="font-body text-sm text-muted">Join our community of devotees</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['name','Full Name','Your full name','text'],['email','Email','your@email.com','email'],['phone','Phone','10-digit mobile (optional)','tel']].map(([k,l,p,t])=>(
            <div key={k}>
              <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">{l}</label>
              <input type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} className="input-field" placeholder={p} required={k!=='phone'}/>
            </div>
          ))}
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Password</label>
            <div className="relative">
              <input type={show?'text':'password'} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} className="input-field pr-10" placeholder="Min 6 characters" required/>
              <button type="button" onClick={()=>setShow(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary">{show?<EyeOff size={16}/>:<Eye size={16}/>}</button>
            </div>
          </div>
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Confirm Password</label>
            <input type="password" value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))} className="input-field" placeholder="Repeat password" required/>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Creating...</> : 'Create Account'}
          </button>
        </form>
        <p className="font-body text-sm text-center text-muted mt-6">Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link></p>
      </div>
    </div>
  )
}

export default LoginPage
