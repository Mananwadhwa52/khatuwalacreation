function PolicyLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen mandala-bg page-enter">
      <div className="bg-cream-dark border-b border-gold/20 py-14 text-center">
        <span className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-gold block mb-3">Legal</span>
        <h1 className="font-display text-4xl font-bold text-primary">{title}</h1>
        <p className="font-body text-sm text-muted mt-2">Last updated: {lastUpdated}</p>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-14 prose-styles">
        <div className="bg-cream rounded-2xl border border-gold/20 shadow-sm p-8 md:p-12 font-body text-sm text-muted leading-relaxed space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}
function H2({ children }) { return <h2 className="font-display text-xl font-bold text-primary mt-8 mb-3">{children}</h2> }
function P({ children }) { return <p className="mb-3 leading-relaxed">{children}</p> }
function UL({ children }) { return <ul className="list-disc pl-5 space-y-1">{children}</ul> }

// ── Shipping Policy ──
export function ShippingPolicy() {
  return (
    <PolicyLayout title="Shipping Policy" lastUpdated="January 1, 2025">
      <P>At Khatu Walas Creation, we ensure your divine products reach you safely and on time.</P>
      <H2>Processing Time</H2>
      <P>Orders are processed within 1-2 business days after payment confirmation. Custom orders may require 3-5 additional business days.</P>
      <H2>Delivery Timelines</H2>
      <UL>
        <li><strong>Standard Shipping:</strong> 5-7 business days across India</li>
        <li><strong>Express Shipping:</strong> 2-3 business days (select cities)</li>
        <li><strong>Metro cities</strong> (Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata): 3-4 days standard</li>
        <li><strong>Tier-2 and Tier-3 cities:</strong> 6-8 business days</li>
      </UL>
      <H2>Shipping Charges</H2>
      <UL>
        <li><strong>Free shipping</strong> on orders above ₹999</li>
        <li><strong>₹99</strong> flat rate for orders below ₹999</li>
        <li>Express shipping surcharges apply separately</li>
      </UL>
      <H2>Tracking Your Order</H2>
      <P>Once shipped, you will receive a tracking number via email and SMS. You can also track your order in the "My Orders" section of your account.</P>
      <H2>Delays & Force Majeure</H2>
      <P>Delivery timelines are estimates. We are not responsible for delays caused by courier partners, natural disasters, government restrictions, or public holidays. We will keep you informed of any significant delays.</P>
      <H2>Packaging</H2>
      <P>All items are carefully packaged with protective materials to ensure safe delivery. Festival and special occasion orders include gift wrapping upon request (charges may apply).</P>
      <H2>Contact</H2>
      <P>For shipping queries, WhatsApp us at +91 98765 43210 or email hello@khatuwalascreation.com</P>
    </PolicyLayout>
  )
}

// ── Refund Policy ──
export function RefundPolicy() {
  return (
    <PolicyLayout title="Refund & Return Policy" lastUpdated="January 1, 2025">
      <P>We want you to be completely satisfied with your divine purchase. If you are not happy, we are here to help.</P>
      <H2>Return Eligibility</H2>
      <UL>
        <li>Returns accepted within <strong>7 days</strong> of delivery</li>
        <li>Item must be <strong>unused, unwashed</strong> and in original condition with tags attached</li>
        <li>Item must be in original packaging</li>
        <li>Proof of purchase (order ID) required</li>
      </UL>
      <H2>Non-Returnable Items</H2>
      <UL>
        <li>Custom / personalized orders</li>
        <li>Items purchased during clearance sales</li>
        <li>Perishable items (flowers, prasad, etc.)</li>
        <li>Items that have been used or damaged after delivery</li>
      </UL>
      <H2>Refund Process</H2>
      <P>Once your return is received and inspected, we will send you a notification. Approved refunds are processed within <strong>5-7 business days</strong> to your original payment method:</P>
      <UL>
        <li><strong>Online payments (Razorpay):</strong> Refunded to original payment source</li>
        <li><strong>Cash on Delivery:</strong> Refunded via bank transfer (provide account details)</li>
      </UL>
      <H2>How to Initiate a Return</H2>
      <P>1. Log in to your account and go to "My Orders"</P>
      <P>2. Select the order and click "Request Refund"</P>
      <P>3. Provide the reason for return</P>
      <P>4. We will arrange a reverse pickup within 2-3 business days</P>
      <H2>Damaged or Wrong Items</H2>
      <P>If you received a damaged, defective, or incorrect item, contact us within 48 hours of delivery with photographs. We will arrange an immediate replacement or full refund at no cost to you.</P>
      <H2>Cancellations</H2>
      <P>Orders can be cancelled before they are shipped. Once shipped, cancellation is not possible — please wait for delivery and then initiate a return. To cancel, go to "My Orders" and click "Cancel Order".</P>
      <H2>Contact</H2>
      <P>Refund queries: WhatsApp +91 98765 43210 | Email: hello@khatuwalascreation.com</P>
    </PolicyLayout>
  )
}

// ── Privacy Policy ──
export function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="January 1, 2025">
      <P>Khatu Walas Creation ("we", "us", "our") is committed to protecting your personal information and your right to privacy.</P>
      <H2>Information We Collect</H2>
      <UL>
        <li><strong>Personal info:</strong> Name, email, phone, shipping address when you register or place an order</li>
        <li><strong>Payment info:</strong> Processed securely via Razorpay — we never store card details</li>
        <li><strong>Usage data:</strong> Pages visited, products viewed, browser type (for improving our service)</li>
        <li><strong>Communications:</strong> Messages you send via contact form or WhatsApp</li>
      </UL>
      <H2>How We Use Your Information</H2>
      <UL>
        <li>Process and fulfill your orders</li>
        <li>Send order confirmations and shipping updates</li>
        <li>Respond to customer service requests</li>
        <li>Send promotional emails (you can unsubscribe at any time)</li>
        <li>Improve our website and services</li>
        <li>Comply with legal obligations</li>
      </UL>
      <H2>Information Sharing</H2>
      <P>We do not sell, trade, or rent your personal information to third parties. We share data only with:</P>
      <UL>
        <li>Shipping partners (name, address, phone for delivery)</li>
        <li>Razorpay (payment processing)</li>
        <li>Email service providers (for transactional emails)</li>
      </UL>
      <H2>Data Security</H2>
      <P>We implement SSL encryption, secure database practices, and limited access controls to protect your data. However, no method of transmission over the internet is 100% secure.</P>
      <H2>Cookies</H2>
      <P>We use cookies to maintain your login session and remember your cart. You can disable cookies in your browser settings, but some features may not work properly.</P>
      <H2>Your Rights</H2>
      <UL>
        <li>Access and update your personal information via your account settings</li>
        <li>Request deletion of your account and data</li>
        <li>Unsubscribe from marketing emails at any time</li>
      </UL>
      <H2>Contact</H2>
      <P>Privacy concerns: hello@khatuwalascreation.com</P>
    </PolicyLayout>
  )
}

// ── Terms of Service ──
export function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service" lastUpdated="January 1, 2025">
      <P>By accessing and using the Khatu Walas Creation website, you agree to be bound by these Terms of Service.</P>
      <H2>Use of Website</H2>
      <P>You may use this website for lawful purposes only. You must not misuse our website by introducing viruses or other malicious material, or attempt unauthorized access to any part of our system.</P>
      <H2>Account Registration</H2>
      <UL>
        <li>You must provide accurate and complete information when creating an account</li>
        <li>You are responsible for maintaining the confidentiality of your password</li>
        <li>You must notify us immediately of any unauthorized use of your account</li>
        <li>One account per person — multiple accounts may be suspended</li>
      </UL>
      <H2>Products & Pricing</H2>
      <UL>
        <li>All prices are in Indian Rupees (₹) and inclusive of applicable taxes</li>
        <li>Prices are subject to change without notice</li>
        <li>We reserve the right to cancel orders due to pricing errors or stock unavailability</li>
        <li>Product images are for illustration — slight color variations may occur</li>
      </UL>
      <H2>Intellectual Property</H2>
      <P>All content on this website — including images, text, logos, and product designs — is the intellectual property of Khatu Walas Creation. Reproduction or use without written permission is prohibited.</P>
      <H2>Limitation of Liability</H2>
      <P>Khatu Walas Creation shall not be liable for any indirect, incidental, or consequential damages arising from use of our products or website. Our maximum liability is limited to the amount paid for the specific product.</P>
      <H2>Governing Law</H2>
      <P>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Punjab, India.</P>
      <H2>Changes to Terms</H2>
      <P>We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.</P>
      <H2>Contact</H2>
      <P>Questions about our terms: hello@khatuwalascreation.com</P>
    </PolicyLayout>
  )
}

export default ShippingPolicy
