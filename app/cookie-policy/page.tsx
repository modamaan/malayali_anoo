import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 pt-32 min-h-screen">
      <h1 className="text-4xl font-heading font-black mb-8 text-white">Cookie Policy</h1>
      <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies</h2>
          <p>
            Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored 
            in your web browser and allows the Service or a third-party to recognize you and make your next visit easier 
            and the Service more useful to you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
          <p>
            When you use and access the Service, we may place a number of cookies files in your web browser.
            We use cookies for the following purposes: to enable certain functions of the Service (like shopping cart persistence), 
            to provide analytics, and to store your preferences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Third-party Cookies</h2>
          <p>
            In addition to our own cookies, we may also use various third-parties cookies (like Stripe for payments and security) 
            to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.
          </p>
        </section>
      </div>
    </div>
  );
}
