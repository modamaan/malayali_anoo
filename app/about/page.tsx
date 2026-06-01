import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pt-12 pb-24">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
          <span className="text-white">ABOUT </span>
          <span className="text-primary-500">US</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
          We are <span className="text-white font-bold">Malayali AAANOO</span>. Bringing the essence of Kerala to the UK 🇬🇧 through engaging podcasts, talk shows, and community events.
        </p>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop" 
              alt="Our Team"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-widest text-primary-500 uppercase mb-4">Our Story</h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Born from a passion for authentic storytelling</h3>
            <div className="space-y-6 text-gray-300 text-lg">
              <p>
                What started as a shared passion for authentic storytelling has evolved into the UK's premier Malayalam media platform. We believe in connecting the diaspora through conversations that matter, gameshows that entertain, and events that unite us.
              </p>
              <p>
                Our mission is simple: to keep the essence of Kerala alive across borders. From thought-provoking podcasts and interviews to massive community gatherings, we create content that feels like home.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-4xl font-black text-primary-500 font-heading mb-2">50+</h4>
                <p className="text-gray-400">Projects Completed</p>
              </div>
              <div>
                <h4 className="text-4xl font-black text-primary-500 font-heading mb-2">1M+</h4>
                <p className="text-gray-400">Online Reach</p>
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
