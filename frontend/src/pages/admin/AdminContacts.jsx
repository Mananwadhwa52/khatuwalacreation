// AdminContacts.jsx
import { useState, useEffect } from 'react'
import { Mail, Check } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/contact').then(r => setContacts(r.data.contacts)).finally(() => setLoading(false))
  }, [])

  const markRead = async (id) => {
    await api.put(`/contact/${id}/read`)
    setContacts(prev => prev.map(c => c._id === id ? { ...c, read: true } : c))
    toast.success('Marked as read')
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Contact Messages</h1>
        <p className="font-body text-sm text-gray-400">{contacts.length} total messages</p>
      </div>
      <div className="space-y-3">
        {loading ? [...Array(5)].map((_,i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5"><div className="h-12 animate-shimmer rounded"/></div>
        )) : contacts.map(c => (
          <div key={c._id} className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${!c.read ? 'border-l-4 border-l-gold' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-gold"/>
                </div>
                <div>
                  <p className="font-body text-sm font-bold text-gray-800">{c.name}</p>
                  <p className="font-body text-xs text-gray-400">{c.email} · {c.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
                {!c.read && (
                  <button onClick={() => markRead(c._id)} className="w-7 h-7 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-100 transition">
                    <Check size={13}/>
                  </button>
                )}
              </div>
            </div>
            {c.subject && <p className="font-body text-sm font-semibold text-gray-700 mb-1">{c.subject}</p>}
            <p className="font-body text-sm text-gray-600 leading-relaxed">{c.message}</p>
          </div>
        ))}
        {!loading && contacts.length === 0 && (
          <div className="text-center py-16 font-body text-sm text-gray-400">No messages yet</div>
        )}
      </div>
    </div>
  )
}

// AdminCoupons.jsx
import { Plus, X, Edit2, Trash2 } from 'lucide-react'
export function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ code:'', type:'percent', value:'', minOrder:'', maxDiscount:'', usageLimit:'', active:true, expiresAt:'' })
  const [saving, setSaving] = useState(false)

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/coupons')
      setCoupons(data.coupons || [])
    } catch { toast.error('Failed to load coupons') }
    setLoading(false)
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleSave = async () => {
    if (!form.code || !form.value) return toast.error('Code and value are required')
    setSaving(true)
    try {
      if (editingId) {
        await api.put(`/coupons/${editingId}`, form)
        toast.success('Coupon updated!')
      } else {
        await api.post('/coupons', form)
        toast.success('Coupon created!')
      }
      setModal(false)
      fetchCoupons()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return
    try {
      await api.delete(`/coupons/${id}`)
      toast.success('Coupon deleted')
      fetchCoupons()
    } catch { toast.error('Failed to delete') }
  }

  const openModal = (c = null) => {
    if (c) {
      setEditingId(c._id)
      setForm({ code: c.code, type: c.type, value: c.value, minOrder: c.minOrder || '', maxDiscount: c.maxDiscount || '', usageLimit: c.usageLimit || '', active: c.active, expiresAt: c.expiresAt ? c.expiresAt.split('T')[0] : '' })
    } else {
      setEditingId(null)
      setForm({ code:'', type:'percent', value:'', minOrder:'', maxDiscount:'', usageLimit:'', active:true, expiresAt:'' })
    }
    setModal(true)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Coupons</h1>
          <p className="font-body text-sm text-gray-400">Manage discount codes</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 text-sm"><Plus size={15}/>Add Coupon</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>{['Code','Discount','Min Order','Usage Limit','Status','Actions'].map(h => <th key={h} className="px-4 py-3 text-left font-body text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? [...Array(3)].map((_,i) => (
              <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-8 animate-shimmer rounded"/></td></tr>
            )) : coupons.map(c => (
              <tr key={c._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-body text-sm font-bold text-gray-800">{c.code}</td>
                <td className="px-4 py-3 font-body text-sm font-semibold text-green-600">
                  {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                  {c.maxDiscount ? <div className="text-[10px] text-gray-400 font-normal">Max ₹{c.maxDiscount}</div> : ''}
                </td>
                <td className="px-4 py-3 font-body text-xs text-gray-600">{c.minOrder ? `₹${c.minOrder}` : 'None'}</td>
                <td className="px-4 py-3 font-body text-xs text-gray-600">{c.usageLimit || 'Unlimited'}</td>
                <td className="px-4 py-3">
                  <span className={`badge text-[10px] ${c.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.active ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openModal(c)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition"><Edit2 size={13}/></button>
                    <button onClick={() => handleDelete(c._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition"><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && coupons.length === 0 && <div className="text-center py-16 font-body text-sm text-gray-400">No coupons found</div>}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-primary">{editingId ? 'Edit Coupon' : 'Add Coupon'}</h2>
              <button onClick={() => setModal(false)}><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Coupon Code *</label>
                <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="input-field" placeholder="e.g. WELCOME10" required/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Type *</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field">
                    <option value="percent">Percent Off</option>
                    <option value="flat">Flat Discount</option>
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">{form.type === 'percent' ? 'Percentage *' : 'Amount (₹) *'}</label>
                  <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} className="input-field" placeholder={form.type === 'percent' ? '10' : '100'} required/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Min Order (₹)</label>
                  <input type="number" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} className="input-field" placeholder="0"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Max Discount (₹)</label>
                  <input type="number" value={form.maxDiscount} onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value }))} className="input-field" placeholder="No limit" disabled={form.type === 'flat'}/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} className="input-field" placeholder="1"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Expires At</label>
                  <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="input-field"/>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="accent-primary"/>
                <span className="font-body text-sm font-bold text-gray-700">Coupon Active</span>
              </label>
              <button onClick={handleSave} disabled={saving} className="btn-primary w-full mt-4 py-3">{saving ? 'Saving...' : editingId ? 'Update Coupon' : 'Create Coupon'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// AdminUsers.jsx
import { Users as UsersIcon } from 'lucide-react'
export function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/auth/users').then(r => setUsers(r.data.users)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Users</h1>
        <p className="font-body text-sm text-gray-400">{users.length} registered users</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>{['Name','Email','Phone','Role','Joined'].map(h => <th key={h} className="px-4 py-3 text-left font-body text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? [...Array(10)].map((_,i) => (
              <tr key={i}><td colSpan={5} className="px-4 py-4"><div className="h-8 animate-shimmer rounded"/></td></tr>
            )) : users.map(u => (
              <tr key={u._id} className="border-t border-gray-50">
                <td className="px-4 py-3 font-body text-sm font-semibold text-gray-800">{u.name}</td>
                <td className="px-4 py-3 font-body text-xs text-gray-600">{u.email}</td>
                <td className="px-4 py-3 font-body text-xs text-gray-600">{u.phone || 'N/A'}</td>
                <td className="px-4 py-3"><span className={`badge text-[10px] ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                <td className="px-4 py-3 font-body text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && users.length === 0 && <div className="text-center py-16 font-body text-sm text-gray-400">No users yet</div>}
      </div>
    </div>
  )
}

export default AdminContacts
