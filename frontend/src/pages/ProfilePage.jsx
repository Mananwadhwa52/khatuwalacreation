// ProfilePage.jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { User, Package, Heart, MapPin, Lock } from 'lucide-react'

export function ProfilePage() {
  const { user, setUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState({ name: user?.name||'', phone: user?.phone||'' })
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const updateProfile = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/auth/profile', form)
      setUser(u => ({ ...u, ...form }))
      localStorage.setItem('kw_user', JSON.stringify({ ...user, ...form }))
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update') } finally { setLoading(false) }
  }

  const updatePassword = async e => {
    e.preventDefault()
    if (pwForm.password !== pwForm.confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await api.put('/auth/profile', { password: pwForm.password })
      setPwForm({ password:'', confirm:'' })
      toast.success('Password updated!')
    } catch { toast.error('Failed') } finally { setLoading(false) }
  }

  const tabs = [
    { id:'profile', label:'Profile', icon:<User size={15}/> },
    { id:'security', label:'Security', icon:<Lock size={15}/> },
  ]

  return (
    <div className="min-h-screen mandala-bg page-enter py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-3xl font-bold text-primary mb-8">My Account</h1>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon:<Package size={18}/>, label:'My Orders', to:'/orders' },
            { icon:<Heart size={18}/>, label:'Wishlist', to:'/wishlist' },
            { icon:<MapPin size={18}/>, label:'Addresses', to:'/profile' },
            { icon:<Lock size={18}/>, label:'Security', to:'/profile' },
          ].map(({ icon, label, to }) => (
            <Link key={label} to={to} className="bg-cream border border-gold/20 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-gold/50 hover:shadow-md transition">
              <div className="text-gold">{icon}</div>
              <span className="font-body text-xs font-semibold text-muted">{label}</span>
            </Link>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-cream rounded-2xl border border-gold/20 shadow-sm overflow-hidden">
          <div className="flex border-b border-gold/20">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-body text-xs font-bold uppercase tracking-widest transition ${tab===t.id ? 'border-b-2 border-gold text-primary' : 'text-muted hover:text-primary'}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
          <div className="p-6">
            {tab==='profile' && (
              <form onSubmit={updateProfile} className="space-y-4 max-w-sm">
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Full Name</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="input-field"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Email</label>
                  <input value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} className="input-field" placeholder="10-digit phone"/>
                </div>
                <button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save Changes'}</button>
              </form>
            )}
            {tab==='security' && (
              <form onSubmit={updatePassword} className="space-y-4 max-w-sm">
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">New Password</label>
                  <input type="password" value={pwForm.password} onChange={e=>setPwForm(f=>({...f,password:e.target.value}))} className="input-field" placeholder="Min 6 characters"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Confirm Password</label>
                  <input type="password" value={pwForm.confirm} onChange={e=>setPwForm(f=>({...f,confirm:e.target.value}))} className="input-field"/>
                </div>
                <button type="submit" disabled={loading} className="btn-primary">{loading?'Updating...':'Update Password'}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
