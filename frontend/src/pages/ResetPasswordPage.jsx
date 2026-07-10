import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters')
    setLoading(true)
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password: form.password })
      toast.success(data.message || 'Password reset successful!')
      setSuccess(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen mandala-bg flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-md bg-cream rounded-2xl border border-gold/20 shadow-xl p-8 page-enter">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-primary"/>
          </div>
          <h1 className="font-display text-2xl font-bold text-primary mb-1">
            {success ? 'Password Reset!' : 'Set New Password'}
          </h1>
          <p className="font-body text-sm text-muted">
            {success ? 'You can now login with your new password' : 'Enter your new password below'}
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <Link to="/login" className="btn-primary inline-block px-8 py-3">Go to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">New Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} className="input-field pr-10" placeholder="Min 8 characters" required/>
                <button type="button" onClick={() => setShow(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                  {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={e => setForm(f=>({...f,confirm:e.target.value}))} className="input-field" placeholder="Repeat password" required/>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Resetting...</> : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
