import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import api from '../utils/api'
import ProductCard from '../components/product/ProductCard'

const CATEGORIES = [
  { label: 'All Products',   value: '' },
  { label: 'Radha Krishna',  value: 'radha-krishna' },
  { label: 'Laddu Gopal',   value: 'laddu-gopal' },
  { label: 'Accessories',   value: 'accessories' },
  { label: 'Puja Items',    value: 'puja-items' },
]
const SORTS = [
  { label: 'Newest First',    value: 'newest' },
  { label: 'Price: Low–High', value: 'priceAsc' },
  { label: 'Price: High–Low', value: 'priceDesc' },
  { label: 'Most Popular',    value: 'popular' },
]

export default function ProductsPage() {
  const [sp, setSp] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = sp.get('category') || ''
  const search   = sp.get('search')   || ''
  const sort     = sp.get('sort')     || 'newest'
  const page     = Number(sp.get('page') || 1)

  const setParam = (key, val) => {
    const n = new URLSearchParams(sp)
    if (val) n.set(key, val); else n.delete(key)
    n.delete('page')
    setSp(n)
  }

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ sort, page, limit: 12 })
    if (category) params.set('category', category)
    if (search)   params.set('search', search)
    api.get(`/products?${params}`)
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages) })
      .finally(() => setLoading(false))
  }, [category, search, sort, page])

  return (
    <div className="min-h-screen mandala-bg page-enter">
      {/* Header */}
      <div className="bg-cream-dark border-b border-gold/20 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="section-label">{search ? `Search: "${search}"` : 'Our Collections'}</span>
          <h1 className="section-title">{CATEGORIES.find(c => c.value === category)?.label || 'All Products'}</h1>
          {total > 0 && <p className="font-body text-sm text-muted mt-1">{total} products found</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters bar */}
        <div className="flex items-center gap-4 flex-wrap mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c.value}
                onClick={() => setParam('category', c.value)}
                className={`font-body text-[11px] font-semibold tracking-widest uppercase px-4 py-2 rounded border transition ${category === c.value ? 'bg-primary text-white border-primary' : 'bg-white text-muted border-gold/30 hover:border-primary hover:text-primary'}`}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="ml-auto relative">
            <select value={sort} onChange={e => setParam('sort', e.target.value)}
              className="font-body text-xs font-semibold tracking-widest uppercase border border-gold/30 rounded px-3 py-2 bg-white text-muted focus:outline-none focus:border-gold appearance-none pr-7 cursor-pointer">
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"/>
          </div>
        </div>

        {/* Active filters */}
        {(category || search) && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="font-body text-xs text-muted">Filters:</span>
            {category && <button onClick={() => setParam('category','')} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full hover:bg-primary/20 transition">{category} <X size={10}/></button>}
            {search && <button onClick={() => { const n = new URLSearchParams(sp); n.delete('search'); setSp(n) }} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full hover:bg-primary/20 transition">"{search}" <X size={10}/></button>}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_,i) => <div key={i} className="animate-shimmer rounded-lg aspect-[3/4]"/>)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🙏</div>
            <h3 className="font-display text-2xl text-primary mb-2">No products found</h3>
            <p className="font-body text-muted mb-6">Try a different category or search term</p>
            <button onClick={() => setSp(new URLSearchParams())} className="btn-outline">Clear Filters</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p._id} product={p}/>)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {[...Array(pages)].map((_,i) => (
              <button key={i}
                onClick={() => { const n = new URLSearchParams(sp); n.set('page', i+1); setSp(n); window.scrollTo(0,0) }}
                className={`w-9 h-9 rounded border font-body text-sm font-semibold transition ${page === i+1 ? 'bg-primary text-white border-primary' : 'border-gold/30 text-muted hover:border-primary hover:text-primary'}`}>
                {i+1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
