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
  const [form, setForm] = useState({ code:'', type:'percent', value:'', minOrder:'', maxDiscount:'', usageLimit:'', active:true, expiresAt:'' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Mock data since we haven't built coupon routes yet
    setLoading(false)
  }, [])

  const handleSave = async () => {
    // TODO: implement coupon create/update API
    toast.success('Coupon saved!')
    setModal(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Coupons</h1>
          <p className="font-body text-sm text-gray-400">Manage discount codes</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={15}/>Add Coupon</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
        <p className="font-body text-sm text-gray-400">Coupon management coming soon...</p>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-primary">Add Coupon</h2>
              <button onClick={() => setModal(false)}><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Coupon Code</label>
                <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="input-field" placeholder="e.g. WELCOME10"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field">
                    <option value="percent">Percent Off</option>
                    <option value="flat">Flat Discount</option>
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">{form.type === 'percent' ? 'Percentage' : 'Amount (₹)'}</label>
                  <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} className="input-field" placeholder={form.type === 'percent' ? '10' : '100'}/>
                </div>
              </div>
              <button onClick={handleSave} disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Create Coupon'}</button>
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
