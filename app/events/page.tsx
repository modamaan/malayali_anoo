"use client";

import { useState } from "react";
import { MOCK_EVENTS } from "@/lib/data";
import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("Upcoming");
  const filters = ["Upcoming", "Past"];

  const now = new Date();
  
  const filteredEvents = MOCK_EVENTS.filter(event => {
    // Set time to 00:00:00 to only compare dates
    const eventDate = new Date(event.date);
    eventDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (activeFilter === "Upcoming") {
      return eventDate >= today;
    } else {
      return eventDate < today;
    }
  });

  return (
    <div className="flex flex-col min-h-screen pt-4 pb-24">
      <section className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-4">
          <span className="text-white uppercase">{activeFilter} </span>
          <span className="text-primary-500">EVENTS</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light mb-8">
          {activeFilter === "Upcoming" 
            ? "Experience the energy live. Join us at our next big event."
            : "Take a look back at our memorable past events."}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {filters.map((filter) => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                activeFilter === filter ? "bg-primary-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-[400px]">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:gap-10">
            {filteredEvents.map((event) => (
            <div key={event.id} className="glass rounded-xl md:rounded-2xl overflow-hidden group hover:border-primary-500/50 transition-colors flex flex-col h-full">
              <div className="h-32 md:h-64 relative overflow-hidden">
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
                <div className="absolute top-2 left-2 md:top-4 md:left-4 z-30 bg-primary-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-md md:rounded-lg font-bold shadow-lg backdrop-blur-sm text-center">
                  <div className="text-[10px] md:text-xs uppercase tracking-wider">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                  <div className="text-base md:text-2xl leading-none">{new Date(event.date).getDate()}</div>
                </div>
              </div>

              <div className="p-3 md:p-8 flex flex-col flex-grow">
                <div className="flex flex-col gap-1 md:gap-2 mb-2 md:mb-4 text-[10px] md:text-sm text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="truncate">
                      {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {/* @ts-ignore */}
                {event.price && (
                  <p className="text-primary-500 font-bold text-xs md:text-base mb-2 md:mb-4">{/* @ts-ignore */}{event.price}</p>
                )}
                <h3 className="text-sm md:text-3xl font-bold text-white mb-2 md:mb-4 leading-tight line-clamp-2">{event.title}</h3>
                <p className="text-[10px] md:text-base text-gray-300 mb-4 md:mb-8 flex-grow line-clamp-3">{event.description}</p>

                <Link
                  /* @ts-ignore */
                  href={event.ticketLink || `/events/${event.id}`}
                  /* @ts-ignore */
                  target={event.ticketLink ? "_blank" : "_self"}
                  /* @ts-ignore */
                  rel={event.ticketLink ? "noopener noreferrer" : ""}
                  className="block w-full py-2 md:py-4 text-center bg-white/10 hover:bg-primary-600 text-white font-bold rounded-md md:rounded-xl transition-colors text-[10px] md:text-base"
                >
                  {/* @ts-ignore */}
                  {event.ticketLink ? "Tickets" : "Details"}
                </Link>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg md:text-xl">No {activeFilter.toLowerCase()} events found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
