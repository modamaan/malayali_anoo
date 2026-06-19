import React from 'react';

export default function PrivacyNotice() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 pt-32 min-h-screen">
      <h1 className="text-4xl font-heading font-black mb-8 text-white">Privacy Notice</h1>
      <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you create an account, make a purchase, 
            sign up for a newsletter, or communicate with us. This may include your name, email address, payment 
            information (processed securely by Stripe), and shipping address.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to process your transactions,
            and to communicate with you. We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
          <p>
            We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized 
            access, disclosure, alteration, and destruction. Payment processing is handled by compliant third-party payment 
            processors (Stripe).
          </p>
        </section>
      </div>
    </div>
  );
}
