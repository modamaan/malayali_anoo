import { MOCK_EVENTS } from "@/lib/data";
import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen pt-12 pb-24">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
          <span className="text-white">UPCOMING </span>
          <span className="text-primary-500">EVENTS</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
          Experience the energy live. Join us at our next big event.
        </p>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {MOCK_EVENTS.map((event) => (
            <div key={event.id} className="glass rounded-2xl overflow-hidden group hover:border-primary-500/50 transition-colors flex flex-col h-full">
              <div className="h-64 relative overflow-hidden">
                {/* @ts-ignore */}
                {event.images && event.images.length > 0 ? (
                  /* @ts-ignore */
                  <ImageCarousel images={event.images} alt={event.title} />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-contain bg-black transform group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute top-4 left-4 z-30 bg-primary-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg backdrop-blur-sm text-center">
                  <div className="text-xs uppercase tracking-wider">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                  <div className="text-2xl leading-none">{new Date(event.date).getDate()}</div>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex flex-col gap-2 mb-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                    {/* @ts-ignore */}
                    {event.time && ` • ${event.time}`}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {event.location}
                  </div>
                </div>

                {/* @ts-ignore */}
                {event.price && (
                  <p className="text-primary-500 font-bold mb-4">{/* @ts-ignore */}{event.price}</p>
                )}
                <h3 className="text-3xl font-bold text-white mb-4">{event.title}</h3>
                <p className="text-gray-300 mb-8 flex-grow">{event.description}</p>

                <Link
                  /* @ts-ignore */
                  href={event.ticketLink || `/events/${event.id}`}
                  /* @ts-ignore */
                  target={event.ticketLink ? "_blank" : "_self"}
                  /* @ts-ignore */
                  rel={event.ticketLink ? "noopener noreferrer" : ""}
                  className="block w-full py-4 text-center bg-white/10 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors"
                >
                  {/* @ts-ignore */}
                  {event.ticketLink ? "Get Tickets / Register" : "Details"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
