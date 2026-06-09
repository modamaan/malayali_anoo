import type { Video, Event, Sponsor, TrustStat, MerchItem } from "./types";


export const MOCK_MERCH = [
  {
    id: "m1",
    name: "Classic Logo T-Shirt",
    price: 499,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    description: "Premium cotton t-shirt with the classic Malayali Aano logo.",
  },
  {
    id: "m2",
    name: "Red Edition Hoodie",
    price: 1299,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    description: "Stay warm in style with our signature red hoodie.",
  },
  {
    id: "m3",
    name: "Signature Cap",
    price: 299,
    currency: "INR",
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
    description: "High-quality snapback cap.",
  },
];


export const TRUST_STATS: TrustStat[] = [
  { value: "50+", label: "Strategic Partnerships" },
  { value: "100K+", label: "Community Members" },
  { value: "10M+", label: "Monthly Reach" },
];
