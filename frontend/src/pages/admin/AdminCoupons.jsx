import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(null)

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons')
      setCoupons(data.coupons)
    } catch (err) {
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCoupons() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (form._id) {
        await api.put(`/coupons/${form._id}`, form)
        toast.success('Coupon updated')
      } else {
        await api.post('/coupons', form)
        toast.success('Coupon created')
      }
      setModal(false)
      fetchCoupons()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving coupon')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return
    try {
      await api.delete(`/coupons/${id}`)
      toast.success('Coupon deleted')
      fetchCoupons()
    } catch (err) {
      toast.error('Error deleting coupon')
    }
  }

  const openModal = (coupon = null) => {
    if (coupon) {
      setForm({ ...coupon, expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '' })
    } else {
      setForm({ code: '', type: 'percent', value: 0, minOrder: 0, maxDiscount: 0, usageLimit: 1, active: true, expiresAt: '' })
    }
    setModal(true)
  }

  if (loading) return <div className="p-8 text-center text-muted">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Coupons</h1>
          <p className="font-body text-sm text-muted">Manage discount codes</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus size={16}/> New Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left font-body text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-muted">Code</th>
              <th className="p-4 font-semibold text-muted">Discount</th>
              <th className="p-4 font-semibold text-muted">Limits</th>
              <th className="p-4 font-semibold text-muted">Usage</th>
              <th className="p-4 font-semibold text-muted">Status</th>
              <th className="p-4 font-semibold text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map(c => (
              <tr key={c._id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-primary flex items-center gap-2"><Tag size={14} className="text-gold"/>{c.code}</td>
                <td className="p-4">{c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="p-4 text-xs text-muted">
                  Min: ₹{c.minOrder} <br/>
                  Max Disc: {c.maxDiscount ? `₹${c.maxDiscount}` : 'None'}
                </td>
                <td className="p-4 text-xs">{c.usedCount} / {c.usageLimit || '∞'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${c.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openModal(c)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(c._id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-muted">No coupons found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-cream rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gold/20 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-xl font-bold text-primary mb-6">{form._id ? 'Edit Coupon' : 'New Coupon'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Code</label>
                <input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="input-field uppercase" required/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input-field">
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Value</label>
                  <input type="number" value={form.value} onChange={e => setForm({...form, value: Number(e.target.value)})} className="input-field" required/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Min Order (₹)</label>
                  <input type="number" value={form.minOrder} onChange={e => setForm({...form, minOrder: Number(e.target.value)})} className="input-field" required/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Max Disc (₹)</label>
                  <input type="number" value={form.maxDiscount || ''} onChange={e => setForm({...form, maxDiscount: Number(e.target.value)})} className="input-field" placeholder="No limit"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: Number(e.target.value)})} className="input-field" required/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Expires At</label>
                  <input type="date" value={form.expiresAt || ''} onChange={e => setForm({...form, expiresAt: e.target.value})} className="input-field"/>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="accent-primary"/>
                <span className="font-body text-sm text-muted">Is Active</span>
              </label>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setModal(false)} className="flex-1 btn-outline">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
