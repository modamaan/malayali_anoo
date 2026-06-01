import { MOCK_VIDEOS } from "@/lib/data";

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen pt-12 pb-24">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
          <span className="text-white">OUR </span>
          <span className="text-primary-500">WORK</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
          Explore our latest cinematic productions, web series, and commercial projects.
        </p>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Filters (Mock UI) */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {["All", "Web Series", "Commercials", "Events", "Music Videos"].map((filter, i) => (
            <button 
              key={filter} 
              className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                i === 0 ? "bg-primary-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* We duplicate mock videos to fill out the grid nicely for demo purposes */}
          {[...MOCK_VIDEOS, ...MOCK_VIDEOS].map((video, index) => (
            <div key={`${video.id}-${index}`} className="group cursor-pointer relative overflow-hidden rounded-xl bg-card border border-card-border hover:border-primary-500/50 transition-colors">
              <div className="aspect-video relative overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transform group-hover:scale-105 transition-all duration-700"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                  <div className="w-16 h-16 bg-primary-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(210,27,46,0.5)]">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold text-white group-hover:text-primary-500 transition-colors pr-4">{video.title}</h4>
                  <span className="text-xs text-gray-500 font-mono whitespace-nowrap">{video.date}</span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
