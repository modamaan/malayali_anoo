import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function SponsorsPage() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .order("created_at", { ascending: true });
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

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {(sponsors || []).map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.website || undefined}
              target={sponsor.website ? "_blank" : undefined}
              rel={sponsor.website ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-center w-full aspect-[2/1] bg-[#1a1a1d] border border-white/10 rounded-2xl hover:border-primary-500/50 hover:bg-white/5 transition-all duration-300 p-8 hover:shadow-[0_8px_30px_rgba(210,27,46,0.1)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sponsor.logo_url}
                alt={sponsor.name}
                className="max-w-[140px] md:max-w-[180px] max-h-[80px] object-contain transition-all duration-300 group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center mt-12">
        <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-6">For Business Inquiries & Collabs</h2>
        <p className="text-gray-400 mb-10 text-lg">
          Interested in working together? Reach out to us for sponsorships, brand partnerships, and exciting collaborations.
        </p>
        <Link href="/contact" className="inline-block px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors text-lg">
          Get In Touch
        </Link>
      </section>
    </div>
  );
}
