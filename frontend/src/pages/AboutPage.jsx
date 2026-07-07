// AboutPage.jsx
import { Link } from 'react-router-dom'
export function AboutPage() {
  return (
    <div className="min-h-screen mandala-bg page-enter">
      <div className="bg-cream-dark border-b border-gold/20 py-20 text-center">
        <span className="section-label">Our Devotional Journey</span>
        <h1 className="font-display text-5xl font-bold text-primary">About Us</h1>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-primary mb-4">From @khatuwalascreation to Your Altar</h2>
            <p className="font-body text-sm text-muted leading-relaxed mb-4">Khatu Walas Creation was born from a simple, heartfelt desire — to dress our deities in the finest silks and most intricate embroideries. Our journey started on Instagram, where we shared our first handmade Poshaks for Laddu Gopal.</p>
            <p className="font-body text-sm text-muted leading-relaxed mb-6">The overwhelming love from the community of devotees inspired us to expand, creating this dedicated home for divine creations. Every stitch is an offering. Every bead is a prayer.</p>
            <a href="https://instagram.com/khatuwalascreation" target="_blank" rel="noreferrer" className="btn-primary">Follow on Instagram</a>
          </div>
          <div className="bg-gradient-to-br from-amber-100 to-rose-50 rounded-2xl p-8 h-64 flex items-center justify-center border border-gold/20">
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-gold mb-2">150k+</div>
              <div className="font-body text-sm text-muted">Devotees & Counting</div>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[['150k+','Devotees Reached'],['5000+','Handcrafted Designs'],['100%','Artisan Made']].map(([n,l])=>(
            <div key={l} className="bg-cream rounded-xl border border-gold/20 p-6 text-center shadow-sm">
              <div className="font-display text-4xl font-bold text-gold mb-2">{n}</div>
              <div className="font-body text-xs font-semibold uppercase tracking-widest text-muted">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ContactPage.jsx
import { useState } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin, Instagram } from 'lucide-react'
export function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [loading, setLoading] = useState(false)
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      toast.success('Message sent! We will reply within 24 hours 🙏')
      setForm({ name:'', email:'', phone:'', subject:'', message:'' })
    } catch { toast.error('Failed to send message') } finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen mandala-bg page-enter">
      <div className="bg-cream-dark border-b border-gold/20 py-16 text-center">
        <span className="section-label">We'd Love to Hear From You</span>
        <h1 className="font-display text-4xl font-bold text-primary">Contact Us</h1>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary mb-6">Get in Touch</h2>
          <div className="space-y-5 mb-8">
            {[
              { icon:<Phone size={18}/>, label:'WhatsApp', val:'+91 98765 43210', href:'https://wa.me/919876543210' },
              { icon:<Instagram size={18}/>, label:'Instagram', val:'@khatuwalascreation', href:'https://instagram.com/khatuwalascreation' },
              { icon:<Mail size={18}/>, label:'Email', val:'hello@khatuwalascreation.com', href:'mailto:hello@khatuwalascreation.com' },
              { icon:<MapPin size={18}/>, label:'Location', val:'Punjab, India', href:null },
            ].map(({ icon, label, val, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center text-gold flex-shrink-0">{icon}</div>
                <div>
                  <div className="font-body text-xs font-bold uppercase tracking-widest text-muted">{label}</div>
                  {href ? <a href={href} target="_blank" rel="noreferrer" className="font-body text-sm text-primary hover:text-gold transition">{val}</a> : <div className="font-body text-sm text-primary">{val}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-cream border border-gold/20 rounded-xl p-5">
            <h4 className="font-body text-xs font-bold uppercase tracking-widest text-muted mb-3">Business Hours</h4>
            <div className="space-y-1 font-body text-sm text-muted">
              <div className="flex justify-between"><span>Mon – Sat</span><span className="font-semibold text-primary">9:00 AM – 8:00 PM</span></div>
              <div className="flex justify-between"><span>Sunday</span><span className="font-semibold text-primary">10:00 AM – 5:00 PM</span></div>
              <p className="text-xs text-gold mt-2">✦ WhatsApp responses within 2 hours</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-cream rounded-2xl border border-gold/20 shadow-md p-8 space-y-4">
          <h3 className="font-display text-xl font-bold text-primary mb-2">Send a Message</h3>
          {[['name','Full Name','Your name'],['email','Email','your@email.com'],['phone','Phone (optional)','Mobile number'],['subject','Subject','What is this about?']].map(([k,l,p])=>(
            <div key={k}>
              <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">{l}</label>
              <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} className="input-field" placeholder={p} required={k!=='phone'}/>
            </div>
          ))}
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Message</label>
            <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} rows={4} className="input-field resize-none" placeholder="How can we help?" required/>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">{loading?'Sending...':'Send Message 🙏'}</button>
        </form>
      </div>
    </div>
  )
}

// FAQPage.jsx
const faqs = [
  { q:'How do I place an order?', a:'Browse our collections, add items to your cart, select size if applicable, and proceed to checkout. We accept Razorpay (UPI, cards, net banking) and Cash on Delivery.' },
  { q:'What sizes do Laddu Gopal outfits come in?', a:'We offer outfits in sizes 0 through 10 (No. 0 is the smallest, No. 10 is larger). Please check the size guide or message us on WhatsApp for help choosing the right size for your idol.' },
  { q:'How long does delivery take?', a:'Standard delivery: 5-7 business days. Express: 2-3 business days (available in select cities). We ship pan India.' },
  { q:'Do you offer free shipping?', a:'Yes! Orders above ₹999 get free shipping. Orders below ₹999 have a flat shipping fee of ₹99.' },
  { q:'What is your return/refund policy?', a:'We accept returns within 7 days of delivery for items that are unused and in original condition. Custom orders are non-returnable. Refunds are processed within 5-7 business days.' },
  { q:'Can I place a custom/bulk order?', a:'Absolutely! We specialize in custom orders for temples, events, and weddings. Contact us via WhatsApp or the contact form with your requirements and we will provide a quote.' },
  { q:'Are your products really handmade?', a:'Yes, 100%. Every Poshak, Shringar set and accessory is handcrafted by skilled artisans. We never compromise on quality or devotion.' },
  { q:'How do I track my order?', a:'Once your order is shipped, you will receive a tracking number via email. You can also track your orders in the "My Orders" section after logging in.' },
  { q:'Do you ship internationally?', a:'Currently we ship within India only. We are working on international shipping — follow us on Instagram @khatuwalascreation for updates.' },
  { q:'What payment methods do you accept?', a:'We accept all major UPI apps (GPay, PhonePe, Paytm), credit/debit cards, net banking via Razorpay, and Cash on Delivery.' },
]
export function FAQPage() {
  const [open, setOpen] = useState(null)
  return (
    <div className="min-h-screen mandala-bg page-enter">
      <div className="bg-cream-dark border-b border-gold/20 py-16 text-center">
        <span className="section-label">Got Questions?</span>
        <h1 className="font-display text-4xl font-bold text-primary">Frequently Asked Questions</h1>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-cream rounded-xl border border-gold/20 overflow-hidden shadow-sm">
            <button onClick={() => setOpen(open===i?null:i)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gold/5 transition">
              <span className="font-body text-sm font-semibold text-primary pr-4">{f.q}</span>
              <span className="text-gold font-bold text-lg flex-shrink-0">{open===i?'−':'+'}</span>
            </button>
            {open===i && <div className="px-6 pb-5 font-body text-sm text-muted leading-relaxed border-t border-gold/10 pt-3">{f.a}</div>}
          </div>
        ))}
        <div className="text-center pt-8">
          <p className="font-body text-sm text-muted mb-4">Still have questions? We're here to help!</p>
          <a href="/contact" className="btn-primary">Contact Us</a>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
