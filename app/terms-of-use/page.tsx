import React from 'react';

export default function TermsOfUse() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 pt-32 min-h-screen">
      <h1 className="text-4xl font-heading font-black mb-8 text-white">Terms of Use</h1>
      <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
          <p>
            By viewing or using this website, you agree to these Terms of Use. If you disagree with any part
            of the terms, then you may not access the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding Content provided by users), features and functionality
            are and will remain the exclusive property of Malayali Aaanoo and its licensors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Acceptable Use</h2>
          <p>
            You agree not to use the website in any way that causes, or may cause, damage to the website or 
            impairment of the availability or accessibility of the website.
          </p>
        </section>
      </div>
    </div>
  );
}
