import MarqueeRow from "./MarqueeRow";
import { TRUST_STATS } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

/**
 * Premium trust / partners section.
 * Data is driven entirely by TRUST_STATS in lib/data.ts and dynamically fetched sponsors from the database.
 */
export default async function TrustSection() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .order("created_at", { ascending: true });

  const sponsorList = sponsors || [];

  // Offset row-2 so logos don't mirror row-1 perfectly
  const row2Sponsors = [
    ...sponsorList.slice(2),
    ...sponsorList.slice(0, 2),
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-[#111113]">
      {/* ── Ambient radial glow ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(229,57,53,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Animated noise texture ── */}
      <div aria-hidden="true" className="noise-overlay" />

      {/* ── Top hairline ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ───── Heading ───── */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center mb-16">
        <p className="text-[10px] md:text-[15px] font-bold uppercase tracking-[0.35em] text-white mb-4">
          Trusted By Our Partners
        </p>

        {/* Animated accent line */}
        <div className="flex justify-center mb-6">
          <span className="block h-px w-10 bg-gradient-to-r from-transparent via-primary-500 to-transparent accent-line-animated" />
        </div>

        <p className="text-white/60 text-sm md:text-base font-light tracking-wide leading-relaxed">
          Collaborating with leading brands and organizations worldwide.
        </p>
      </div>

      {/* ───── Stats row ───── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 mb-14">
        <div className="flex items-center justify-center divide-x divide-white/[0.08]">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="flex-1 text-center px-6 py-3">
              <p className="text-white text-xl md:text-2xl font-bold tracking-tight font-heading">
                {stat.value}
              </p>
              <p className="text-white/50 text-[10px] md:text-xs uppercase tracking-widest mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ───── Marquee block ───── */}
      <div className="pause-marquee relative z-10 flex flex-col">
        {/* Border top */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* Glassmorphism sheen */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.015) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.015) 100%)",
          }}
        />

        {/* Row 1 — left (all screens) */}
        <MarqueeRow
          sponsors={sponsorList}
          direction="left"
          className="border-b border-white/[0.05]"
        />

        {/* Row 2 — right (tablet/desktop only) */}
        <MarqueeRow
          sponsors={row2Sponsors}
          direction="right"
          className="hidden md:block"
        />

        {/* Border bottom */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </div>

      {/* ── Bottom hairline ── */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
