import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Truck, RefreshCw, Package } from 'lucide-react'
import api from '../utils/api'
import ProductCard from '../components/product/ProductCard'

const defaultCategories = [
  { title: 'Radha Krishna', value: 'radha-krishna', desc: 'Poshaks, Shringar & Jewellery Sets', color: 'from-rose-100 to-pink-50', accent: '#570000' , imageurl: 'https://i.ibb.co/DPkgMHZx/file-000000007f847208ada30b449c72a0f1.png' },
  { title: 'Laddu Gopal',   value: 'laddu-gopal',   desc: 'Size 0 to 10 — All Seasons',      color: 'from-amber-100 to-yellow-50', accent: '#8d4f11' , imageurl: 'https://i.ibb.co/gMngmcBQ/file-00000000b024720896937019d17cf461.png' },
  { title: 'Accessories',   value: 'accessories',   desc: 'Crowns, Flutes, Swings & More',   color: 'from-teal-100 to-cyan-50',  accent: '#002c2c', imageurl: 'https://i.ibb.co/VYt3fFJs/file-000000008cc872089a2fb7a7fbbdf1a7.png' },
  { title: 'Puja Items',    value: 'puja-items',    desc: 'Diyas, Incense & Ritual Items',   color: 'from-purple-100 to-violet-50', accent: '#3b0764', imageurl: 'https://i.ibb.co/81gsr1M/file-0000000068ac72089454ff1afa2e4d4f.png' },
  { title: 'Khatu Shyam Baba', value: 'khatu-shyam-baba', desc: 'Idols, Poshaks & Devotional Items', color: 'from-orange-100 to-amber-50', accent: '#9a3412', imageurl: 'https://i.ibb.co/C3D1ykBd/IMG-20260709-223701-png.png' },
]

const testimonials = [
  { name: 'Priya M., Delhi',   text: 'The quality of the Poshak is absolutely divine. My Laddu Gopal looks like royalty from Vrindavan!', rating: 5 },
  { name: 'Ramesh T., Jaipur', text: 'Ordered a custom Radha Krishna set for our temple. The zari embroidery exceeded all expectations!',   rating: 5 },
  { name: 'Anjali K., Mumbai', text: 'Fast delivery, beautiful packaging, pure devotion in every piece. Will order again and again.',         rating: 5 },
]

function Skeleton() {
  return <div className="animate-shimmer rounded-lg aspect-[3/4]"/>
}

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(defaultCategories)

  useEffect(() => {
    api.get('/products?featured=true&limit=8')
      .then(r => setFeatured(r.data.products))
      .catch(() => {})

    api.get('/settings')
      .then(r => {
        if (r.data?.collections?.length > 0) {
          setCategories(r.data.collections)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section className="mandala-bg min-h-[88vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-label">✦ Handcrafted with Devotion ✦</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary leading-[1.1] mb-6">
              Divine Attire<br/>for Your<br/><em className="italic text-gold">Sacred Idols</em>
            </h1>
            <div className="gold-divider max-w-xs mb-6"><span className="text-gold text-base">🪷</span></div>
            <p className="font-body text-base text-muted leading-relaxed mb-8 max-w-md">
              Every stitch is an offering. Every bead is a prayer. Discover exquisitely handcrafted Poshaks, Shringar sets and accessories for Radha Krishna and Laddu Gopal.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/products?category=radha-krishna" className="btn-primary py-4 px-8 text-sm">Shop Radha Krishna</Link>
              <Link to="/products?category=laddu-gopal" className="btn-outline py-4 px-8 text-sm">Shop Laddu Gopal</Link>
            </div>
            {/* Stats */}
            <div className="flex gap-10 mt-12 pt-8 border-t border-gold/20">
              {[['150k+','Devotees'],['5000+','Designs'],['100%','Handmade']].map(([n,l]) => (
                <div key={l}>
                  <div className="font-display text-2xl font-bold text-gold">{n}</div>
                  <div className="font-body text-[11px] tracking-widest uppercase text-muted">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden md:block">
            <div className="absolute inset-[-16px] border border-gold/25 rounded-2xl pointer-events-none"/>
            <div className="bg-gradient-to-br from-amber-100 to-rose-50 rounded-2xl p-8 flex items-center justify-center h-[560px] relative overflow-hidden">
              <img src="https://i.ibb.co/Vpm1HCBW/IMG-20260709-222502-png.png" className="object-fill w-full rounded-2xl h-full"  alt="IMG-20260709-222502-png" border="0" /> 
              <div className="absolute bottom-6 text-center w-full">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary/50">✦ Radha Krishna Poshak ✦</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-primary py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...Array(3)].map((_, i) => (
            <span key={i} className="font-body text-[11px] font-semibold tracking-[0.2em] uppercase text-gold inline-block">
              ✦ Handcrafted Poshaks &nbsp;&nbsp;✦ Pure Silk Shringar &nbsp;&nbsp;✦ Laddu Gopal Outfits &nbsp;&nbsp;✦ Radha Krishna Sets &nbsp;&nbsp;✦ Custom Orders Welcome &nbsp;&nbsp;✦ Free Shipping Above ₹999 &nbsp;&nbsp;✦ Wholesale Available &nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Trust signals */}
      <section className="bg-cream-dark border-y border-gold/20 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Truck size={22}/>, title: 'Free Shipping', desc: 'On orders above ₹999' },
            { icon: <RefreshCw size={22}/>, title: 'Easy Returns', desc: '7-day return window' },
            { icon: <Shield size={22}/>, title: 'Secure Payments', desc: 'Razorpay & COD' },
            { icon: <Package size={22}/>, title: 'Handmade Quality', desc: '100% artisan crafted' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="text-gold flex-shrink-0">{icon}</div>
              <div>
                <div className="font-body text-xs font-bold text-primary">{title}</div>
                <div className="font-body text-xs text-muted">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="section-label">Our Collections</span>
          <h2 className="section-title">Shop by Devotion</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map(cat => (
            <Link key={cat.value} to={`/products?category=${cat.value}`}
              className={`group relative h-80 bg-gradient-to-br ${cat.color || 'from-gray-100 to-gray-50'} rounded-xl overflow-hidden border border-gold/15 card-hover flex flex-col p-6`}>
              <div className="flex-1 w-full relative mb-4 flex items-center justify-center min-h-[140px]">
                <img src={`${cat.imageurl}`} className="absolute inset-0 w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500" alt={cat.title} /> 
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" style={{ background: cat.accent || '#D4AF37' }}/>
              <div className="relative z-10 mt-auto">
                <h3 className="font-display text-xl font-bold mb-1" style={{ color: cat.accent || '#D4AF37' }}>{cat.title}</h3>
                <p className="font-body text-xs text-muted mb-3 line-clamp-2">{cat.desc}</p>
                <span className="font-body text-[11px] font-bold tracking-widest uppercase flex items-center gap-1" style={{ color: '#D4AF37' }}>
                  Explore <ArrowRight size={12}/>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-label">Curated for You</span>
            <h2 className="section-title">Featured Offerings</h2>
          </div>
          <Link to="/products?featured=true" className="font-body text-xs font-bold tracking-widest uppercase text-muted hover:text-primary transition border-b border-gold pb-0.5 hidden sm:block">View All →</Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? [...Array(8)].map((_,i) => <Skeleton key={i}/>) : featured.map(p => <ProductCard key={p._id} product={p}/>)}
        </div>
        <div className="text-center mt-10">
          <Link to="/products" className="btn-outline py-3 px-10">Browse All Products</Link>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="bg-primary py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle,#D4AF37 1px,transparent 0)', backgroundSize: '28px 28px' }}/>
        <div className="relative z-10 max-w-lg mx-auto px-6">
          <span className="font-body text-[11px] tracking-[0.25em] uppercase text-gold block mb-4">Follow the Journey</span>
          <h2 className="font-display text-4xl font-bold text-cream mb-4">@khatuwalascreation</h2>
          <p className="font-body text-sm text-cream/70 mb-8 leading-relaxed">Join 150,000+ devotees. See new arrivals, festival specials and behind-the-scenes from our artisans.</p>
          <a href="https://instagram.com/khatuwalascreation" target="_blank" rel="noreferrer" className="btn-gold inline-flex items-center gap-2 py-4 px-8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            Follow on Instagram
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="section-label">Devotee Stories</span>
          <h2 className="section-title">What Our Community Says</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-cream border-l-4 border-gold p-6 rounded-lg shadow-sm">
              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-gold text-gold"/>)}
              </div>
              <p className="font-body text-sm text-muted leading-relaxed italic mb-4">"{t.text}"</p>
              <div className="font-body text-xs font-bold text-primary">— {t.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
