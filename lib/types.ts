// ─── Video ───────────────────────────────────────────────────────────────────
export interface Video {
  id: string;
  title: string;
  description?: string;
  youtubeId: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  link: string;
  date: string;
  category?: string;
}

// ─── Event ───────────────────────────────────────────────────────────────────
export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl?: string;
  images?: string[];
  ticketLink?: string;
  price?: string;
  time?: string;
}

// ─── Sponsor ─────────────────────────────────────────────────────────────────
export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
}

// ─── Trust stat ───────────────────────────────────────────────────────────────
export interface TrustStat {
  value: string;
  label: string;
}

// ─── Merch ───────────────────────────────────────────────────────────────────
export interface MerchItem {
  id: string;
  name: string;
  price: number;
  currency?: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  sort_order?: number;
}
