import Link from "next/link";
import Image from "next/image";
import { MOCK_VIDEOS, MOCK_EVENTS, MOCK_SPONSORS } from "@/lib/data";
import HeroBanner from "@/components/HeroBanner";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      <HeroBanner />

      {/* Featured Videos Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-2 uppercase tracking-tight">Latest Podcasts & Talk Shows</h2>
            <p className="text-gray-400">Podcasts • Interviews • Gameshows</p>
          </div>
          <Link href="/portfolio" className="hidden md:flex items-center text-primary-500 font-bold hover:text-white transition-colors uppercase tracking-widest text-sm">
            View All 
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {MOCK_VIDEOS.map((video) => (
            <Link href={video.link} target="_blank" rel="noopener noreferrer" key={video.id} className="group cursor-pointer relative overflow-hidden rounded-xl bg-card border border-white/5 hover:border-primary-500/50 transition-colors flex flex-col">
              <div className="aspect-video relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-300"></div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(210,27,46,0.6)] scale-90 group-hover:scale-100 transition-transform">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-xs text-primary-500 mb-2 font-mono">{video.date}</p>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">{video.title}</h4>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mt-2">{video.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events Section (Ticker Style) */}
      <section className="py-24 bg-primary-600 relative overflow-hidden">
        {/* Angled background effect */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-zinc-900 -skew-y-2 origin-top-left z-10 -mt-8"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-900 skew-y-2 origin-bottom-left z-10 -mb-8"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tight">Community Events</h2>
          </div>

          <div className="space-y-6">
            {MOCK_EVENTS.map((event) => (
              <div key={event.id} className="glass p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-6 md:w-1/3">
                  <div className="text-center bg-black/50 p-4 rounded-xl min-w-[100px]">
                    <p className="text-primary-500 font-bold text-xl uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
                    <p className="text-white font-black text-3xl">{new Date(event.date).getDate()}</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                    <p className="text-gray-300 flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="md:w-1/3 text-center md:text-left text-gray-200">
                  <p>{event.description}</p>
                  {/* @ts-ignore */}
                  {event.price && <p className="text-primary-500 font-bold mt-2">{event.price}</p>}
                </div>

                <div className="md:w-1/4 flex justify-end w-full">
                  <Link 
                    /* @ts-ignore */
                    href={event.ticketLink || `/events/${event.id}`} 
                    /* @ts-ignore */
                    target={event.ticketLink ? "_blank" : "_self"}
                    /* @ts-ignore */
                    rel={event.ticketLink ? "noopener noreferrer" : ""}
                    className="px-6 py-3 w-full text-center bg-zinc-950 hover:bg-white hover:text-black text-white font-bold rounded-full transition-colors"
                  >
                    {/* @ts-ignore */}
                    {event.ticketLink ? "Register Now" : "Details"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Carousel */}
      <section className="py-24 bg-zinc-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 uppercase tracking-widest text-sm font-bold mb-10">Trusted By Our Partners</p>

          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60">
            {MOCK_SPONSORS.map((sponsor) => (
              <div key={sponsor.id} className="grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sponsor.logoUrl} alt={sponsor.name} className="h-12 md:h-16 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
