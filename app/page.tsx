import HeroBanner from "@/components/HeroBanner";
import IntroSplashScreen from "@/components/IntroSplashScreen";
import VideoRow from "@/components/VideoRow";
import TrustSection from "@/components/TrustSection";
import Link from "next/link";
import {
  MOCK_GAMESHOWS,
  MOCK_SADANAM_KAYYILUNDO,
  MOCK_UK_UPDATES,
  MOCK_PODCASTS,
  MOCK_OTHERS,
  MOCK_EVENTS,
} from "@/lib/data";

// Video rows config — add/remove/reorder here without touching JSX
const VIDEO_ROWS = [
  { title: "Gameshows", subtitle: "Watch our thrilling competition series", videos: MOCK_GAMESHOWS, linkHref: "/portfolio" },
  { title: "Sadanam Kayyilundo??", subtitle: "Hilarious public interactions", videos: MOCK_SADANAM_KAYYILUNDO, linkHref: "/portfolio" },
  { title: "Latest UK Updates", subtitle: "Essential news and updates you can't miss", videos: MOCK_UK_UPDATES, linkHref: "/portfolio" },
  { title: "Podcasts & Interviews", subtitle: "Deep conversations with fascinating people", videos: MOCK_PODCASTS, linkHref: "/portfolio" },
  { title: "Others", subtitle: "More exciting content and giveaways", videos: MOCK_OTHERS, linkHref: "/portfolio" },
] as const;

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <IntroSplashScreen />
      <HeroBanner />

      {/* ── Video content rows ── */}
      <div className="py-12">
        {VIDEO_ROWS.map((row) => (
          <VideoRow key={row.title} {...row} />
        ))}
      </div>

      {/* ── Community Events ── */}
      <section className="py-24 bg-primary-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-16 bg-background -skew-y-2 origin-top-left z-10 -mt-8" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background skew-y-2 origin-bottom-left z-10 -mb-8" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tight">
              Community Events
            </h2>
          </div>

          <div className="space-y-6">
            {MOCK_EVENTS.map((event) => (
              <div
                key={event.id}
                className="glass p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/10 transition-colors"
              >
                {/* Date badge + title */}
                <div className="flex items-center gap-6 md:w-1/3">
                  <div className="text-center bg-black/50 p-4 rounded-xl min-w-[100px]">
                    <p className="text-primary-500 font-bold text-xl uppercase">
                      {new Date(event.date).toLocaleString("default", { month: "short" })}
                    </p>
                    <p className="text-white font-black text-3xl">
                      {new Date(event.date).getDate()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                    <p className="text-gray-300 flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="md:w-1/3 text-center md:text-left text-gray-200">
                  <p>{event.description}</p>
                  {event.price && (
                    <p className="text-primary-500 font-bold mt-2">{event.price}</p>
                  )}
                </div>

                {/* CTA */}
                <div className="md:w-1/4 flex justify-end w-full">
                  <Link
                    href={event.ticketLink ?? `/events/${event.id}`}
                    target={event.ticketLink ? "_blank" : "_self"}
                    rel={event.ticketLink ? "noopener noreferrer" : ""}
                    className="px-6 py-3 w-full text-center bg-zinc-950 hover:bg-white hover:text-black text-white font-bold rounded-full transition-colors"
                  >
                    {event.ticketLink ? "Register Now" : "Details"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust / Partners ── */}
      <TrustSection />
    </div>
  );
}
