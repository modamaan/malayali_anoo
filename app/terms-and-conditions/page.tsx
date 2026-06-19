import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 pt-32 min-h-screen">
      <h1 className="text-4xl font-heading font-black mb-8 text-white">Terms & Conditions</h1>
      <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
          <p>
            Welcome to Malayali Aaanoo. These Terms & Conditions govern your use of our website and services.
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use
            Malayali Aaanoo if you do not agree to take all of the terms and conditions stated on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. E-commerce and Payments</h2>
          <p>
            If you wish to purchase any product or service made available through the Service ("Purchase"), 
            you may be asked to supply certain information relevant to your Purchase including, without limitation, 
            your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
            All payments are securely processed via Stripe.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us.
          </p>
        </section>
      </div>
    </div>
  );
}
