import { MOCK_SPONSORS } from "@/lib/data";
import Link from "next/link";

export default function SponsorsPage() {
  return (
    <div className="flex flex-col min-h-screen pt-12 pb-24">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
          <span className="text-white">OUR </span>
          <span className="text-primary-500">SPONSORS</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
          We are proud to be partnered with these incredible brands that help us bring the essence of Kerala to the UK.
        </p>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center">
          {MOCK_SPONSORS.map((sponsor) => (
            <a 
              key={sponsor.id} 
              href={sponsor.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group glass p-8 rounded-2xl flex items-center justify-center w-full aspect-[4/3] hover:bg-white/5 hover:border-primary-500/30 transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={sponsor.logoUrl} 
                alt={sponsor.name} 
                className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100 group-hover:scale-110"
              />
            </a>
          ))}
        </div>
      </section>
      
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center mt-12">
        <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-6">Become a Partner</h2>
        <p className="text-gray-400 mb-10 text-lg">
          Join us in our mission to connect the diaspora through premium entertainment, podcasts, and community events.
        </p>
        <Link href="/contact" className="inline-block px-10 py-4 bg-zinc-950 border border-white/5 text-white font-bold rounded-full hover:bg-white hover:text-black hover:border-white transition-colors text-lg shadow-xl">
          Get In Touch
        </Link>
      </section>
    </div>
  );
}
