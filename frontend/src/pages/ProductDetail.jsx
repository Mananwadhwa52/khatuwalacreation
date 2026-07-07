import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, Shield, Truck, RefreshCw, Share2 } from 'lucide-react'
import api from '../utils/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import ProductCard from '../components/product/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('')
  const [tab, setTab] = useState('description')
  const [review, setReview] = useState({ rating: 5, title: '', comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/reviews/product/${id}`)
    ]).then(([pr, rr]) => {
      setProduct(pr.data.product)
      setReviews(rr.data.reviews)
      api.get(`/products?category=${pr.data.product.category}&limit=4`).then(r =>
        setRelated(r.data.products.filter(p => p._id !== id).slice(0,4)))
    }).finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !size) return toast.error('Please select a size')
    addToCart(product, qty, size)
    toast.success('Added to cart 🛍️')
  }

  const submitReview = async () => {
    if (!user) return toast.error('Please login to review')
    if (!review.comment) return toast.error('Please write a comment')
    setSubmitting(true)
    try {
      const { data } = await api.post('/reviews', { productId: id, ...review })
      setReviews(prev => [data.review, ...prev])
      setReview({ rating: 5, title: '', comment: '' })
      toast.success('Review submitted!')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit review')
    } finally { setSubmitting(false) }
  }

  if (loading) return (
    <div className="min-h-screen mandala-bg flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold border-t-primary rounded-full animate-spin"/>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><h2 className="font-display text-2xl text-primary mb-4">Product not found</h2><Link to="/products" className="btn-outline">Browse Products</Link></div>
    </div>
  )

  const discount = product.mrp && product.mrp > product.price ? Math.round((product.mrp - product.price) / product.mrp * 100) : null

  return (
    <div className="min-h-screen mandala-bg page-enter">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 font-body text-xs text-muted">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-primary transition capitalize">{product.category?.replace('-',' ')}</Link>
          <span>/</span>
          <span className="text-primary truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-cream-dark rounded-xl overflow-hidden mb-3 border border-gold/15">
              <img src={product.images?.[imgIdx]?.url || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover"/>
              {product.images?.length > 1 && <>
                <button onClick={() => setImgIdx(i => (i - 1 + product.images.length) % product.images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition"><ChevronLeft size={16}/></button>
                <button onClick={() => setImgIdx(i => (i + 1) % product.images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition"><ChevronRight size={16}/></button>
              </>}
              {discount && <div className="absolute top-3 left-3 badge bg-primary text-white">-{discount}%</div>}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition ${imgIdx === i ? 'border-gold' : 'border-transparent'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="font-body text-[11px] tracking-widest uppercase text-muted/60 mb-2 capitalize">{product.category?.replace('-',' ')}</p>
            <h1 className="font-display text-3xl font-bold text-primary mb-3">{product.name}</h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= Math.round(product.ratings) ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200'}/>)}
                </div>
                <span className="font-body text-sm text-muted">{product.ratings} ({product.numReviews} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
              {product.mrp && product.mrp > product.price && <>
                <span className="font-body text-lg text-muted line-through">₹{product.mrp.toLocaleString()}</span>
                <span className="badge bg-green-100 text-green-700">{discount}% OFF</span>
              </>}
            </div>

            {/* Badges */}
            {product.badges?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {product.badges.map(b => <span key={b} className="badge bg-primary/10 text-primary">{b}</span>)}
              </div>
            )}

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-5">
                <label className="font-body text-xs font-bold tracking-widest uppercase text-primary block mb-2">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSize(s)} className={`w-12 h-10 rounded border font-body text-sm font-semibold transition ${size === s ? 'bg-primary text-white border-primary' : 'border-gold/40 text-muted hover:border-primary hover:text-primary'}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="mb-6">
              <label className="font-body text-xs font-bold tracking-widest uppercase text-primary block mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 border border-gold/40 rounded flex items-center justify-center hover:bg-gold/10 transition font-bold text-lg">−</button>
                <span className="font-body font-bold text-lg w-8 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 border border-gold/40 rounded flex items-center justify-center hover:bg-gold/10 transition font-bold text-lg">+</button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={!product.inStock} className="flex-1 btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingBag size={16}/> {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="w-12 h-14 border border-gold/40 rounded flex items-center justify-center text-muted hover:text-primary hover:border-primary transition">
                <Heart size={18}/>
              </button>
            </div>

            {/* Trust */}
            <div className="border border-gold/20 rounded-lg p-4 bg-cream-dark">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: <Truck size={16}/>, text: 'Free shipping ₹999+' },
                  { icon: <RefreshCw size={16}/>, text: '7-day returns' },
                  { icon: <Shield size={16}/>, text: 'Secure checkout' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1">
                    <div className="text-gold">{icon}</div>
                    <span className="font-body text-[10px] text-muted">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-b border-gold/20">
          <div className="flex gap-8">
            {['description','reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`font-body text-xs font-bold tracking-widest uppercase pb-3 border-b-2 transition capitalize ${tab === t ? 'border-gold text-primary' : 'border-transparent text-muted hover:text-primary'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {tab === 'description' ? (
            <div className="max-w-3xl font-body text-sm text-muted leading-relaxed whitespace-pre-line">{product.description}</div>
          ) : (
            <div className="max-w-3xl">
              {/* Review form */}
              {user && (
                <div className="bg-cream border border-gold/20 rounded-lg p-6 mb-8">
                  <h3 className="font-display text-lg font-bold text-primary mb-4">Write a Review</h3>
                  <div className="mb-3">
                    <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setReview(r => ({ ...r, rating: s }))}>
                          <Star size={22} className={s <= review.rating ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <input value={review.title} onChange={e => setReview(r => ({ ...r, title: e.target.value }))} placeholder="Review title (optional)" className="input-field mb-3"/>
                  <textarea value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} rows={4} placeholder="Share your experience..." className="input-field mb-4 resize-none"/>
                  <button onClick={submitReview} disabled={submitting} className="btn-primary">{submitting ? 'Submitting...' : 'Submit Review'}</button>
                </div>
              )}
              {reviews.length === 0 ? (
                <p className="font-body text-muted">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map(r => (
                    <div key={r._id} className="border-b border-gold/10 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= r.rating ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200'}/>)}</div>
                        <span className="font-body text-xs font-bold text-primary">{r.name}</span>
                        <span className="font-body text-xs text-muted">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      {r.title && <p className="font-body text-sm font-semibold text-primary mb-1">{r.title}</p>}
                      <p className="font-body text-sm text-muted">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="section-title mb-8">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p._id} product={p}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
