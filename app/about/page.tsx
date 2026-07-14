import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
          <span className="text-white">ABOUT </span>
          <span className="text-primary-500">US</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
          We are <span className="text-white font-bold relative inline-block">
            Malayali AAANOO
            <span className="absolute -bottom-1.5 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full opacity-80"></span>
          </span>. Bringing the essence of Kerala to the UK 🇬🇧 through engaging podcasts, talk shows, and community events.
        </p>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center lg:items-start">
          <div className="relative lg:sticky lg:top-32">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 md:border-4 border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-gray-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/group_photo.png"
                alt="Our Team"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl -z-10"></div>
          </div>
          
          <div className="flex flex-col justify-center pb-12">
            <h2 className="text-sm font-bold tracking-widest text-primary-500 uppercase mb-4">Our Story</h2>
            <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
              <p className="text-2xl md:text-3xl font-heading text-white font-black leading-tight">
                Born from a passion for authentic storytelling, what began as a shared vision has evolved into the UK’s premier media platform for our community.
              </p>
              <p className="text-gray-400">
                We are your definitive digital hub—curating the essential news, cultural insights, and community updates that matter to you here in the UK. Think of us as your go-to guide, bringing you closer to home, no matter where you are in the country.
              </p>

              <div className="pl-6 border-l-4 border-primary-500/50 bg-primary-500/5 rounded-r-lg p-6">
                <h3 className="text-xl font-black font-heading text-white mb-2">Our Vision: Bridging the Distance</h3>
                <p className="text-gray-300">
                  We are crafting a future where everyone feels connected, empowered, and truly at home. We aren’t just building a network; we are building a space that honors our heritage while remaining sharp, modern, and forward-thinking. We are here to ensure that no matter how far we are from our roots, we never lose the spark that makes us who we are.
                </p>
              </div>

              <div className="pl-6 border-l-4 border-red-500/50 bg-red-500/5 rounded-r-lg p-6">
                <h3 className="text-xl font-black font-heading text-white mb-2">Our Mission: Bringing the Best to You</h3>
                <p className="text-gray-300">
                  We keep the essence of the homeland alive by curating content that feels like a conversation among friends. Whether it’s through thought-provoking podcasts or our signature gameshows—where we trade formal scripts for genuine laughter and high energy—our mission is simple: to deliver the information you need and the entertainment that inspires.
                </p>
              </div>

              <div className="inline-block mt-8">
                <p className="font-bold text-white text-xl">
                  We’re here to make sure that{" "}
                  <span className="relative inline-block text-primary-500 mx-1">
                    "home"
                    {/* Hand-drawn arrow SVG pointing to 'home' */}
                    <svg 
                      width="45" 
                      height="45" 
                      viewBox="0 0 100 100" 
                      className="absolute -top-10 -right-8 text-gray-400 rotate-[15deg] opacity-70 pointer-events-none hidden md:block"
                    >
                      <path d="M 85 15 Q 60 30 20 85" fill="transparent" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                      <path d="M 20 85 L 25 65 M 20 85 L 42 80" fill="transparent" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  is always just a click away. Let’s make something great together.
                </p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
              <div>
                <h4 className="text-5xl font-black text-primary-500 font-heading mb-2">50+</h4>
                <p className="text-gray-400 font-medium">Projects Completed</p>
              </div>
              <div>
                <h4 className="text-5xl font-black text-primary-500 font-heading mb-2">1M+</h4>
                <p className="text-gray-400 font-medium">Online Reach</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 py-24 bg-primary-600 text-center px-4">
        <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-8">Ready to create something amazing?</h2>
        <Link href="/contact" className="inline-block px-10 py-4 bg-black text-white font-bold rounded-full hover:bg-white hover:text-black transition-colors text-lg">
          Let's Talk
        </Link>
      </section>
    </div>
  );
}
