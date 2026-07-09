import { useState, useEffect, useRef } from 'react'
import { Plus, Edit2, Trash2, X, Upload, Star } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const CATS = ['radha-krishna','laddu-gopal','accessories','puja-items','khatu-shyam-baba']
const EMPTY = { name:'', description:'', price:'', mrp:'', category:'radha-krishna', subcategory:'', badges:'', sizes:'', inStock:true, featured:false, stockCount:'' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const fileRef = useRef()

  const fetchProducts = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: 10 })
    if (catFilter) params.set('category', catFilter)
    if (search) params.set('search', search)
    const { data } = await api.get(`/products?${params}`)
    setProducts(data.products)
    setTotal(data.total)
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [page, catFilter])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setFiles([]); setPreviews([]); setModal(true) }
  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name, description: p.description, price: p.price, mrp: p.mrp||'',
      category: p.category, subcategory: p.subcategory||'',
      badges: p.badges?.join(', ')||'', sizes: p.sizes?.join(', ')||'',
      inStock: p.inStock, featured: p.featured, stockCount: p.stockCount||''
    })
    setFiles([]); setPreviews([])
    setModal(true)
  }

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files)
    setFiles(selected)
    setPreviews(selected.map(f => URL.createObjectURL(f)))
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.description) return toast.error('Name, price and description required')
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => {
        if (k === 'badges') fd.append(k, JSON.stringify(v.split(',').map(s=>s.trim()).filter(Boolean)))
        else if (k === 'sizes') fd.append(k, JSON.stringify(v.split(',').map(s=>s.trim()).filter(Boolean)))
        else fd.append(k, v)
      })
      files.forEach(f => fd.append('images', f))

      if (editing) {
        await api.put(`/products/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Product updated!')
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Product created!')
      }
      setModal(false)
      fetchProducts()
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch { toast.error('Failed to delete') }
  }

  const toggleFeatured = async (p) => {
    await api.put(`/products/${p._id}`, new URLSearchParams({ featured: !p.featured }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    fetchProducts()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Products</h1>
          <p className="font-body text-sm text-gray-400">{total} total products</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><Plus size={15}/>Add Product</button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchProducts()} placeholder="Search products..." className="input-field max-w-xs text-sm"/>
        <select value={catFilter} onChange={e=>{ setCatFilter(e.target.value); setPage(1) }} className="input-field max-w-[200px] text-sm">
          <option value="">All Categories</option>
          {CATS.map(c=><option key={c} value={c}>{c.replace('-',' ')}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{['Product','Category','Price','Stock','Featured','Actions'].map(h=><th key={h} className="px-4 py-3 text-left font-body text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_,i)=>(
                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-8 animate-shimmer rounded"/></td></tr>
              )) : products.map(p=>(
                <tr key={p._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url||'/placeholder.jpg'} alt={p.name} className="w-10 h-10 object-cover rounded border border-gray-100"/>
                      <div>
                        <p className="font-body text-xs font-semibold text-gray-800 max-w-[200px] truncate">{p.name}</p>
                        <p className="font-body text-[10px] text-gray-400">#{p._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-gray-600 capitalize">{p.category?.replace('-',' ')}</td>
                  <td className="px-4 py-3">
                    <div className="font-body text-xs font-bold text-gray-800">₹{p.price.toLocaleString()}</div>
                    {p.mrp && <div className="font-body text-[10px] text-gray-400 line-through">₹{p.mrp}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.inStock ? 'In Stock' : 'Out'}</span>
                    <div className="font-body text-[10px] text-gray-400 mt-0.5">{p.stockCount} units</div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={()=>toggleFeatured(p)} className={`w-8 h-8 rounded-full flex items-center justify-center transition ${p.featured?'bg-gold text-primary':'bg-gray-100 text-gray-300 hover:bg-gold/20'}`}>
                      <Star size={14} fill={p.featured?'currentColor':'none'}/>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(p)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition"><Edit2 size={13}/></button>
                      <button onClick={()=>handleDelete(p._id)} className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 transition"><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && products.length === 0 && <div className="text-center py-12 font-body text-sm text-gray-400">No products found</div>}
        </div>
        {/* Pagination */}
        {total > 10 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="font-body text-xs text-gray-400">Showing {(page-1)*10+1}–{Math.min(page*10, total)} of {total}</span>
            <div className="flex gap-2">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-outline text-xs px-3 py-1.5 disabled:opacity-40">Prev</button>
              <button onClick={()=>setPage(p=>p+1)} disabled={page*10>=total} className="btn-outline text-xs px-3 py-1.5 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-xl font-bold text-primary">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={()=>setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Product Name *</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="input-field" placeholder="e.g. Radha Poshak – Maroon Silk"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} className="input-field" placeholder="1299"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">MRP / Compare Price</label>
                  <input type="number" value={form.mrp} onChange={e=>setForm(f=>({...f,mrp:e.target.value}))} className="input-field" placeholder="1599"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Category *</label>
                  <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="input-field">
                    {CATS.map(c=><option key={c} value={c}>{c.replace('-',' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Subcategory</label>
                  <input value={form.subcategory} onChange={e=>setForm(f=>({...f,subcategory:e.target.value}))} className="input-field" placeholder="e.g. Poshak, Shringar"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Stock Count</label>
                  <input type="number" value={form.stockCount} onChange={e=>setForm(f=>({...f,stockCount:e.target.value}))} className="input-field" placeholder="50"/>
                </div>
                <div>
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Sizes (comma separated)</label>
                  <input value={form.sizes} onChange={e=>setForm(f=>({...f,sizes:e.target.value}))} className="input-field" placeholder="0, 1, 2, 3, 4, 5"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Badges (comma separated)</label>
                  <input value={form.badges} onChange={e=>setForm(f=>({...f,badges:e.target.value}))} className="input-field" placeholder="Pure Silk, Bestseller, Handmade"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Description *</label>
                  <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={4} className="input-field resize-none" placeholder="Detailed product description..."/>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.inStock} onChange={e=>setForm(f=>({...f,inStock:e.target.checked}))} className="accent-primary w-4 h-4"/>
                    <span className="font-body text-sm font-semibold text-gray-700">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))} className="accent-primary w-4 h-4"/>
                    <span className="font-body text-sm font-semibold text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Images (up to 6)</label>
                <div onClick={()=>fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gold/50 transition">
                  <Upload size={24} className="text-gray-300 mx-auto mb-2"/>
                  <p className="font-body text-sm text-gray-400">Click to upload images</p>
                  <p className="font-body text-xs text-gray-300">JPG, PNG, WebP – Max 8MB each</p>
                  <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles}/>
                </div>
                {/* Existing images */}
                {editing && editing.images?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {editing.images.map((img,i) => (
                      <div key={i} className="relative w-16 h-16">
                        <img src={img.url} alt="" className="w-full h-full object-cover rounded border border-gray-200"/>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center"><X size={8} className="text-white"/></div>
                      </div>
                    ))}
                  </div>
                )}
                {/* New previews */}
                {previews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {previews.map((p,i) => <img key={i} src={p} alt="" className="w-16 h-16 object-cover rounded border-2 border-gold/40"/>)}
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={()=>setModal(false)} className="btn-outline text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                {saving ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</> : (editing ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
