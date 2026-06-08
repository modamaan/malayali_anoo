'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`;
    window.location.href = `mailto:malayaliaaanoo@gmail.com?subject=${encodeURIComponent(subject || 'New Contact Form Submission')}&body=${encodeURIComponent(body)}`;
  };
  return (
    <div className="flex flex-col min-h-screen pt-12 pb-24">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
          <span className="text-white">GET IN </span>
          <span className="text-primary-500">TOUCH</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
          Have a project in mind, want to book us for an event, or just want to say hi? Drop us a line.
        </p>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-6">Contact Information</h2>
              <p className="text-gray-400 mb-8">
                We're always open to discussing new projects, creative ideas or opportunities to be part of your visions.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-primary-500 mr-4 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Email Us</h4>
                    <p className="text-gray-400">malayaliaaanoo@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-primary-500 mr-4 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Call Us</h4>
                    <p className="text-gray-400">+44 7344 909757</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-primary-500 mr-4 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Location</h4>
                    <p className="text-gray-400">London, United Kingdom</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-heading font-black text-xl md:text-1xl uppercase tracking-wider mb-6">FOLLOW US</h3>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/malayaliaaanoo" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-14 h-14 rounded-full bg-white/5 hover:bg-primary-600 flex items-center justify-center text-white hover:scale-110 transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
                <a href="https://www.youtube.com/@MalayaliAAANOO" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-14 h-14 rounded-full bg-white/5 hover:bg-primary-600 flex items-center justify-center text-white hover:scale-110 transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12L10 15V9l5.194 3z" clipRule="evenodd" /></svg>
                </a>
                <a href="https://www.tiktok.com/@malayaliaaanoo" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-14 h-14 rounded-full bg-white/5 hover:bg-primary-600 flex items-center justify-center text-white hover:scale-110 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-.9 4.45-2.43 5.92-1.53 1.47-3.77 2.23-5.91 1.95-2.14-.28-4.04-1.43-5.2-3.13-1.16-1.7-1.57-3.92-1.04-5.93.53-2.01 1.95-3.66 3.75-4.52 1.8-.86 3.95-.91 5.79-.13v4.11c-1.3-.29-2.73-.08-3.83.65-1.1.73-1.75 2.01-1.66 3.32.09 1.31.9 2.5 2.1 3.09 1.2.59 2.68.52 3.82-.18 1.14-.7 1.88-2.01 1.86-3.34-.01-5.18-.01-10.36-.01-15.54z"/></svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="glass p-8 md:p-10 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-8">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="How can we help?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea 
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  placeholder="Tell us about your project..."
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(210,27,46,0.4)]"
              >
                Send Message
              </button>
            </form>
          </div>
          
        </div>
      </section>
    </div>
  );
}
