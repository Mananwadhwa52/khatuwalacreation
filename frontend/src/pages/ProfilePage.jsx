import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { User, Package, Heart, MapPin, Lock, Plus, Edit2, Trash2, Star } from 'lucide-react'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh']

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState({ name: '', phone: '' })
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [addrModal, setAddrModal] = useState(false)
  const [editingAddr, setEditingAddr] = useState(null)
  const [addrForm, setAddrForm] = useState({ fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false })
  const [addrLoading, setAddrLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' })
      setAddresses(user.addresses || [])
    }
  }, [user])

  const updateProfile = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/auth/profile', form)
      await refreshUser()
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update') } finally { setLoading(false) }
  }

  const updatePassword = async e => {
    e.preventDefault()
    if (pwForm.password !== pwForm.confirm) return toast.error('Passwords do not match')
    if (pwForm.password.length < 8) return toast.error('Password must be at least 8 characters')
    setLoading(true)
    try {
      await api.put('/auth/profile', { password: pwForm.password })
      setPwForm({ password: '', confirm: '' })
      toast.success('Password updated!')
    } catch { toast.error('Failed') } finally { setLoading(false) }
  }

  const openAddrModal = (addr = null) => {
    if (addr) {
      setEditingAddr(addr._id)
      setAddrForm({ fullName: addr.fullName || '', phone: addr.phone || '', line1: addr.line1 || '', line2: addr.line2 || '', city: addr.city || '', state: addr.state || '', pincode: addr.pincode || '', isDefault: addr.isDefault || false })
    } else {
      setEditingAddr(null)
      setAddrForm({ fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false })
    }
    setAddrModal(true)
  }

  const saveAddress = async (e) => {
    e.preventDefault()
    if (!addrForm.fullName || !addrForm.phone || !addrForm.line1 || !addrForm.city || !addrForm.state || !addrForm.pincode) {
      return toast.error('Please fill all required fields')
    }
    setAddrLoading(true)
    try {
      let res
      if (editingAddr) {
        res = await api.put(`/auth/address/${editingAddr}`, addrForm)
      } else {
        res = await api.post('/auth/address', addrForm)
      }
      setAddresses(res.data.addresses)
      await refreshUser()
      setAddrModal(false)
      toast.success(editingAddr ? 'Address updated!' : 'Address added!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address')
    } finally { setAddrLoading(false) }
  }

  const deleteAddress = async (id) => {
    if (!confirm('Delete this address?')) return
    try {
      const { data } = await api.delete(`/auth/address/${id}`)
      setAddresses(data.addresses)
      await refreshUser()
      toast.success('Address deleted')
    } catch { toast.error('Failed to delete') }
  }

  const setDefault = async (id) => {
    try {
      const { data } = await api.put(`/auth/address/${id}/default`)
      setAddresses(data.addresses)
      await refreshUser()
      toast.success('Default address updated')
    } catch { toast.error('Failed to update') }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={15}/> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={15}/> },
    { id: 'security', label: 'Security', icon: <Lock size={15}/> },
  ]

  return (
    <div className="min-h-screen mandala-bg page-enter py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-3xl font-bold text-primary mb-8">My Account</h1>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <Package size={18}/>, label: 'My Orders', to: '/orders' },
            { icon: <Heart size={18}/>, label: 'Wishlist', to: '/wishlist' },
            { icon: <MapPin size={18}/>, label: 'Addresses', to: '#', onClick: () => setTab('addresses') },
            { icon: <Lock size={18}/>, label: 'Security', to: '#', onClick: () => setTab('security') },
          ].map(({ icon, label, to, onClick }) => (
            onClick ? (
              <button key={label} onClick={onClick} className="bg-cream border border-gold/20 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-gold/50 hover:shadow-md transition">
                <div className="text-gold">{icon}</div>
                <span className="font-body text-xs font-semibold text-muted">{label}</span>
              </button>
            ) : (
              <Link key={label} to={to} className="bg-cream border border-gold/20 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-gold/50 hover:shadow-md transition">
                <div className="text-gold">{icon}</div>
                <span className="font-body text-xs font-semibold text-muted">{label}</span>
              </Link>
            )
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-cream rounded-2xl border border-gold/20 shadow-sm overflow-hidden">
          <div className="flex border-b border-gold/20">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-body text-xs font-bold uppercase tracking-widest transition ${tab === t.id ? 'border-b-2 border-gold text-primary' : 'text-muted hover:text-primary'}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
          <div className="p-6">
            {tab === 'profile' && (
              <form onSubmit={updateProfile} className="space-y-4 max-w-sm">
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Full Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Email</label>
                  <input value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="10-digit phone"/>
                </div>
                <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
              </form>
            )}

            {tab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="font-body text-sm text-muted">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
                  <button onClick={() => openAddrModal()} className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2">
                    <Plus size={14}/>Add Address
                  </button>
                </div>
                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin size={40} className="text-gold/30 mx-auto mb-3"/>
                    <p className="font-body text-sm text-muted mb-4">No saved addresses yet</p>
                    <button onClick={() => openAddrModal()} className="btn-outline text-xs">Add Your First Address</button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {addresses.map(addr => (
                      <div key={addr._id} className={`bg-white rounded-xl border p-4 transition ${addr.isDefault ? 'border-gold shadow-sm' : 'border-gray-200'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-body text-sm font-bold text-primary">{addr.fullName}</span>
                              {addr.isDefault && <span className="badge bg-gold/10 text-gold text-[9px] flex items-center gap-1"><Star size={8}/>Default</span>}
                            </div>
                            <p className="font-body text-xs text-muted">{addr.phone}</p>
                            <p className="font-body text-xs text-muted mt-1">{addr.line1}{addr.line2 ? ', ' + addr.line2 : ''}, {addr.city}, {addr.state} – {addr.pincode}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            {!addr.isDefault && <button onClick={() => setDefault(addr._id)} className="w-7 h-7 bg-gold/10 text-gold rounded-lg flex items-center justify-center hover:bg-gold/20 transition" title="Set as default"><Star size={12}/></button>}
                            <button onClick={() => openAddrModal(addr)} className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition"><Edit2 size={12}/></button>
                            <button onClick={() => deleteAddress(addr._id)} className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition"><Trash2 size={12}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'security' && (
              <form onSubmit={updatePassword} className="space-y-4 max-w-sm">
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">New Password</label>
                  <input type="password" value={pwForm.password} onChange={e => setPwForm(f => ({ ...f, password: e.target.value }))} className="input-field" placeholder="Min 8 characters"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Confirm Password</label>
                  <input type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} className="input-field"/>
                </div>
                <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Updating...' : 'Update Password'}</button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {addrModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-cream rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gold/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-primary">{editingAddr ? 'Edit Address' : 'Add Address'}</h2>
              <button onClick={() => setAddrModal(false)} className="text-muted hover:text-primary">✕</button>
            </div>
            <form onSubmit={saveAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Full Name *</label>
                  <input value={addrForm.fullName} onChange={e => setAddrForm(f => ({ ...f, fullName: e.target.value }))} className="input-field" required/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Phone *</label>
                  <input value={addrForm.phone} onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))} className="input-field" maxLength={10} required/>
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Address Line 1 *</label>
                <input value={addrForm.line1} onChange={e => setAddrForm(f => ({ ...f, line1: e.target.value }))} className="input-field" required/>
              </div>
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Address Line 2</label>
                <input value={addrForm.line2} onChange={e => setAddrForm(f => ({ ...f, line2: e.target.value }))} className="input-field"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">City *</label>
                  <input value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} className="input-field" required/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Pincode *</label>
                  <input value={addrForm.pincode} onChange={e => setAddrForm(f => ({ ...f, pincode: e.target.value }))} className="input-field" maxLength={6} required/>
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">State *</label>
                <select value={addrForm.state} onChange={e => setAddrForm(f => ({ ...f, state: e.target.value }))} className="input-field" required>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))} className="accent-primary"/>
                <span className="font-body text-sm text-muted">Set as default address</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setAddrModal(false)} className="flex-1 btn-outline">Cancel</button>
                <button type="submit" disabled={addrLoading} className="flex-1 btn-primary">{addrLoading ? 'Saving...' : editingAddr ? 'Update' : 'Add Address'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
