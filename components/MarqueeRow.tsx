import type { Sponsor } from "@/lib/types";

// Logo image — brand colors always visible, scale + glow on hover
function LogoItem({ sponsor, rowKey }: { sponsor: Sponsor; rowKey: string }) {
  return (
    <a
      key={rowKey}
      href={sponsor.website || undefined}
      target={sponsor.website ? "_blank" : undefined}
      rel={sponsor.website ? "noopener noreferrer" : undefined}
      className="trust-logo-item shrink-0 group/logo relative flex items-center justify-center px-3"
    >
      {/* Red radial glow on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-lg opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 blur-xl"
        style={{
          background: "radial-gradient(circle, rgba(229,57,53,0.25) 0%, transparent 70%)",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        /* @ts-ignore */
        src={sponsor.logo_url || sponsor.logoUrl}
        alt={sponsor.name}
        className="h-6 md:h-7 w-auto object-contain select-none pointer-events-none opacity-75 group-hover/logo:opacity-100 group-hover/logo:scale-110 transition-all duration-300"
      />
    </a>
  );
}

interface MarqueeRowProps {
  sponsors: Sponsor[];
  /** Direction the row scrolls. Defaults to "left". */
  direction?: "left" | "right";
  /** Extra Tailwind classes applied to the outer wrapper div */
  className?: string;
}

/**
 * A single infinite-scrolling marquee row.
 * Duplication factor = 4 to ensure seamless looping on wide viewports.
 */
export default function MarqueeRow({
  sponsors,
  direction = "left",
  className = "",
}: MarqueeRowProps) {
  const animClass =
    direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  // 4× duplication for seamless loop (translateX –50% = back to start)
  const items = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Left edge fade */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-56 bg-gradient-to-r from-[#111113] to-transparent z-10 pointer-events-none" />
      {/* Right edge fade */}
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-56 bg-gradient-to-l from-[#111113] to-transparent z-10 pointer-events-none" />

      <div className={`flex w-max items-center gap-20 md:gap-28 py-6 ${animClass}`}>
        {items.map((sponsor, idx) => (
          <LogoItem
            key={`${direction}-${sponsor.id}-${idx}`}
            rowKey={`${direction}-${sponsor.id}-${idx}`}
            sponsor={sponsor}
          />
        ))}
      </div>
    </div>
  );
}
