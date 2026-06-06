import type { Video, Event, Sponsor, TrustStat, MerchItem } from "./types";

export const MOCK_BANNERS = [
  {
    id: "b1",
    title: "Gameshows & Community Events",
    subtitle: "Connecting the Malayali diaspora",
    imageUrl: "", // Images removed as per user request
    link: "https://youtu.be/-k1rcCfsrfs?si=6-CkwCX_HWhhPocD",
    youtubeId: "-k1rcCfsrfs",
  },
  {
    id: "b2",
    title: "Latest UK Updates",
    subtitle: "Essential news and drops you can't miss",
    imageUrl: "",
    link: "https://youtu.be/T8Uac9vIAxU?si=DfOkPdA7-ClsDynD",
    youtubeId: "T8Uac9vIAxU",
  },
  {
    id: "b3",
    title: "Exclusive Interviews",
    subtitle: "Get up close and personal with the stars",
    imageUrl: "",
    link: "https://youtu.be/1Q-jyu3aaJc?si=4es4ijAPY-r-fjeP",
    youtubeId: "1Q-jyu3aaJc",
  }
];

export const MOCK_SADANAM_KAYYILUNDO = [
  {
    id: "sk1",
    title: "Sadanam Kayyilundo?? | London East Ham",
    description: "Public Interaction in London East Ham",
    youtubeId: "z8uQfvCNXS8",
    thumbnailUrl: "https://img.youtube.com/vi/z8uQfvCNXS8/hqdefault.jpg",
    link: "https://youtu.be/z8uQfvCNXS8?si=o9AIS8-utW7IBB5D",
    date: "2024-05-10",
  },
  {
    id: "sk2",
    title: "Saadhanam Kayyil undo | @ Leicester",
    description: "Malayali Aaanoo public interaction at Leicester.",
    youtubeId: "fOpq5bq00KM",
    thumbnailUrl: "https://img.youtube.com/vi/fOpq5bq00KM/hqdefault.jpg",
    link: "https://youtu.be/fOpq5bq00KM?si=XWJmiVk8Z98EtcNn",
    date: "2024-04-22",
  }
];

export const MOCK_GAMESHOWS = [
  {
    id: "gs1",
    title: "MALAYALI AAANOO GAME SHOW | S1E1",
    description: "The premiere episode of our thrilling new game show!",
    youtubeId: "DOl0Fg9owDs",
    thumbnailUrl: "https://img.youtube.com/vi/DOl0Fg9owDs/hqdefault.jpg",
    link: "https://youtu.be/DOl0Fg9owDs?si=9r7d31Fg_1PsOiA8",
    date: "2024-02-05",
  },
  {
    id: "gs2",
    title: "MALAYALI AAANOO GAME SHOW | S1E2",
    description: "Game Show Season 1 Episode 2 — the fun continues!",
    youtubeId: "-k1rcCfsrfs",
    thumbnailUrl: "https://img.youtube.com/vi/-k1rcCfsrfs/hqdefault.jpg",
    link: "https://youtu.be/-k1rcCfsrfs?si=Uo-AT1bA9y2LzKW_",
    date: "2024-03-01",
  }
];

export const MOCK_UK_UPDATES = [
  {
    id: "uk1",
    title: "Latest UK updates | malayaliaaanoo",
    description: "Stay informed with the latest updates from the UK.",
    youtubeId: "4i7u9FHkjhU",
    thumbnailUrl: "https://img.youtube.com/vi/4i7u9FHkjhU/hqdefault.jpg",
    link: "https://youtu.be/4i7u9FHkjhU?si=1iljb1q-k5g1sg3V",
    date: "2024-05-15",
  },
  {
    id: "uk2",
    title: "Top Updates In UK | malayaliaaanoo",
    description: "Top news and updates you need to know.",
    youtubeId: "V6uQyLKCUEY",
    thumbnailUrl: "https://img.youtube.com/vi/V6uQyLKCUEY/hqdefault.jpg",
    link: "https://youtu.be/V6uQyLKCUEY?si=7c3vI0dB4mksbQ4-",
    date: "2024-04-20",
  },
  {
    id: "uk3",
    title: "UK Updates: Everything you need to know 🇬🇧 | malayaliaaanoo",
    description: "Comprehensive coverage of UK updates.",
    youtubeId: "T8Uac9vIAxU",
    thumbnailUrl: "https://img.youtube.com/vi/T8Uac9vIAxU/hqdefault.jpg",
    link: "https://youtu.be/T8Uac9vIAxU?si=8V4A6QglCSGgVP0g",
    date: "2024-03-10",
  },
  {
    id: "uk4",
    title: "UK Updates: Everything you need to know 🇬🇧 | malayaliaaanoo",
    description: "More essential UK updates and news.",
    youtubeId: "stOPgpVm8Uo",
    thumbnailUrl: "https://img.youtube.com/vi/stOPgpVm8Uo/hqdefault.jpg",
    link: "https://youtu.be/stOPgpVm8Uo?si=KJB7ODNPATHlVliF",
    date: "2024-02-25",
  },
  {
    id: "uk5",
    title: "Major Shifts for UK Renters 🏠 & Local News Roundup",
    description: "Important changes for renters and local news.",
    youtubeId: "8WG2V5S7JvM",
    thumbnailUrl: "https://img.youtube.com/vi/8WG2V5S7JvM/hqdefault.jpg",
    link: "https://youtu.be/8WG2V5S7JvM?si=0brTtRgZ-S0GNlWx",
    date: "2024-01-20",
  },
  {
    id: "uk6",
    title: "Recent Top Updates in UK",
    description: "The most recent top updates happening in the UK.",
    youtubeId: "CwKVPQfxICM",
    thumbnailUrl: "https://img.youtube.com/vi/CwKVPQfxICM/hqdefault.jpg",
    link: "https://youtu.be/CwKVPQfxICM?si=2xWCbUYgX0YuV5Ys",
    date: "2023-12-15",
  }
];

export const MOCK_PODCASTS = [
  {
    id: "pc1",
    title: "Exclusive interview with Subash Manuel",
    description: "Exclusive interview with Subash Manuel, Patriot Movie Co-Producer.",
    youtubeId: "1Q-jyu3aaJc",
    thumbnailUrl: "https://img.youtube.com/vi/1Q-jyu3aaJc/hqdefault.jpg",
    link: "https://youtu.be/1Q-jyu3aaJc?si=g_zm8F4rEzI6is1b",
    date: "2024-03-10",
  }
];

export const MOCK_OTHERS = [
  {
    id: "ot1",
    title: "60000 Rupees Winner from Wayanad",
    description: "Meet the lucky winner from Wayanad who took home 60,000 Rupees!",
    youtubeId: "VSD-2yT_4Hk",
    thumbnailUrl: "https://img.youtube.com/vi/VSD-2yT_4Hk/hqdefault.jpg",
    link: "https://youtu.be/VSD-2yT_4Hk?si=8WEv1_NulcNnjH8i",
    date: "2024-06-01",
  },
  {
    id: "ot2",
    title: "£500 Logo Winner Reveal | malayaliaaanoo",
    description: "The grand reveal of our £500 logo competition winner.",
    youtubeId: "kYuHT4eY_9g",
    thumbnailUrl: "https://img.youtube.com/vi/kYuHT4eY_9g/hqdefault.jpg",
    link: "https://youtu.be/kYuHT4eY_9g?si=0zQi7r1YGkmbl1vn",
    date: "2024-05-20",
  },
  {
    id: "ot3",
    title: "Winning Logo",
    description: "A closer look at the winning logo design.",
    youtubeId: "VkDbftRDYzQ",
    thumbnailUrl: "https://img.youtube.com/vi/VkDbftRDYzQ/hqdefault.jpg",
    link: "https://youtu.be/VkDbftRDYzQ?si=S6PF1yXquJhCMTW9",
    date: "2024-05-21",
  },
  {
    id: "ot4",
    title: "Give Away 500£ (60000Rs)",
    description: "Huge giveaway announcement! £500 up for grabs.",
    youtubeId: "uXDV04j0p9c",
    thumbnailUrl: "https://img.youtube.com/vi/uXDV04j0p9c/hqdefault.jpg",
    link: "https://youtu.be/uXDV04j0p9c?si=PlLIrekjAtlH0mDr",
    date: "2024-04-15",
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: "e1",
    title: "Biriyani Challenge",
    date: "2026-06-20",
    location: "Northampton",
    description: "Join our ultimate Biriyani Challenge! Register now to participate in this culinary showdown.",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1600&auto=format&fit=crop",
    images: [
      "/biriyani_challenge/biriyani_1.jpg",
      "/biriyani_challenge/biriyani_2.jpg",
      "/biriyani_challenge/biriyani_3.jpg",
      "/biriyani_challenge/biriyani_4.jpg",
      "/biriyani_challenge/biriyani_5.jpg",
      "/biriyani_challenge/biriyani_6.jpg",
    ],
    ticketLink: "https://docs.google.com/forms/d/e/1FAIpQLSdNP1_6kgjIp0dHeT38zza6eS5qVO9aHk7uBcmKUqVUklAAbw/viewform",
    price: "Free Registration",
  },
  {
    id: "e2",
    title: "Malayaliaaanoo x Naattil Evidaa",
    date: "2026-07-17",
    time: "Fri 4:00pm - Sun 9:00am",
    location: "YHA National Forest, Moira",
    description: "Our massive collaboration event. Join us for an unforgettable weekend getaway.",
    imageUrl: "/naatil_evidaa.jpg",
    ticketLink: "https://www.fatsoma.com/e/cbhuilmx/naattil-evidaa?utm_source=ig&utm_medium=social&utm_content=link_in_bio",
    price: "£160 + fees",
  },
];

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

export const MOCK_SPONSORS = [
  {
    id: "s1",
    name: "Amazon",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    website: "https://amazon.com",
  },
  {
    id: "s2",
    name: "Nvidia",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
    website: "https://nvidia.com",
  },
  {
    id: "s3",
    name: "Ford",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Ford_Motor_Company_Logo.svg",
    website: "https://ford.com",
  },
  {
    id: "s4",
    name: "Coinbase",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/15/Coinbase_nav_logo.svg",
    website: "https://coinbase.com",
  },
  {
    id: "s5",
    name: "Google",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    website: "https://google.com",
  },
  {
    id: "s6",
    name: "Shopify",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
    website: "https://shopify.com",
  },
];

export const TRUST_STATS: TrustStat[] = [
  { value: "50+", label: "Strategic Partnerships" },
  { value: "100K+", label: "Community Members" },
  { value: "10M+", label: "Monthly Reach" },
];

export const MOCK_YOUTUBE_VIDEOS = [
  {
    id: "yt1",
    title: "Sadanam Kayyilundo?? | London East Ham",
    thumbnailUrl: "https://img.youtube.com/vi/z8uQfvCNXS8/hqdefault.jpg",
    link: "https://youtu.be/z8uQfvCNXS8?si=o9AIS8-utW7IBB5D",
    date: "2024-05-10",
    trending: true,
  },
  {
    id: "yt2",
    title: "Saadhanam Kayyil undo | @ Leicester",
    thumbnailUrl: "https://img.youtube.com/vi/fOpq5bq00KM/hqdefault.jpg",
    link: "https://youtu.be/fOpq5bq00KM?si=XWJmiVk8Z98EtcNn",
    date: "2024-04-22"
  },
  {
    id: "yt3",
    title: "When Sunil OG meets Malayali Aaanoo!",
    thumbnailUrl: "https://img.youtube.com/vi/VdojyLT-xZs/hqdefault.jpg",
    link: "https://youtube.com/shorts/VdojyLT-xZs?si=k2SWohV4d1Dks0ej",
    date: "2024-03-15",
    trending: true,
  },
  {
    id: "yt4",
    title: "MALAYALI AAANOO GAME SHOW | S1E1",
    thumbnailUrl: "https://img.youtube.com/vi/DOl0Fg9owDs/hqdefault.jpg",
    link: "https://youtu.be/DOl0Fg9owDs?si=9r7d31Fg_1PsOiA8",
    date: "2024-02-05"
  },
  {
    id: "yt5",
    title: "Major Shifts for UK Renters 🏠 & Local News",
    thumbnailUrl: "https://img.youtube.com/vi/8WG2V5S7JvM/hqdefault.jpg",
    link: "https://youtu.be/8WG2V5S7JvM?si=vyAmBF2dZY-2f33r",
    date: "2024-01-20"
  },
  {
    id: "yt6",
    title: "UK Event Updates | malayaliaaanoo",
    thumbnailUrl: "https://img.youtube.com/vi/TfWueK4HHA8/hqdefault.jpg",
    link: "https://youtube.com/shorts/TfWueK4HHA8?si=YyawpFxyTkwt08RR",
    date: "2024-06-03",
    trending: true,
  },
  {
    id: "yt7",
    title: "Malayali Aaanoo Gameshow | Episode 2 | highlights",
    thumbnailUrl: "https://img.youtube.com/vi/k8a_lJ6Th-I/hqdefault.jpg",
    link: "https://youtube.com/shorts/k8a_lJ6Th-I?si=wX-LE0RBtlZ-jnCm",
    date: "2024-06-02",
  },
  {
    id: "yt8",
    title: "What are they scanning at ?",
    thumbnailUrl: "https://img.youtube.com/vi/p-QltcMxnsA/hqdefault.jpg",
    link: "https://youtube.com/shorts/p-QltcMxnsA?si=yROlbmS4ufMI4kiL",
    date: "2024-06-01",
  },
  {
    id: "yt9",
    title: "Comment the answer | malayaliaaanoo | East Ham",
    thumbnailUrl: "https://img.youtube.com/vi/mcREsf-oZWw/hqdefault.jpg",
    link: "https://youtube.com/shorts/mcREsf-oZWw?si=nOQ5QDdimy3JcPkp",
    date: "2024-05-28",
    trending: true,
  },
  {
    id: "yt10",
    title: "Sadhanam kayyil undo | Malayali aaanoo | East Ham Episode",
    thumbnailUrl: "https://img.youtube.com/vi/2jZX5S1Vr5k/hqdefault.jpg",
    link: "https://youtube.com/shorts/2jZX5S1Vr5k?si=MApFf5xtw7OxUGka",
    date: "2024-05-25",
  },
  {
    id: "yt11",
    title: "Parking Fine increasing to £160 |malayaliaaanoo",
    thumbnailUrl: "https://img.youtube.com/vi/FVBOEiAtryI/hqdefault.jpg",
    link: "https://youtube.com/shorts/FVBOEiAtryI?si=67d9AuQO06XuZQMG",
    date: "2024-05-20",
  }
];

export const MOCK_INSTAGRAM_POSTS = [
  {
    id: "ig1",
    title: "The ultimate Malayali Entertainment Show in the UK",
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
    link: "https://www.instagram.com/reel/DYmKotyou2_/"
  },
  {
    id: "ig2",
    title: "We are OFFICIALLY mobile! 📢🔥",
    thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop",
    link: "https://www.instagram.com/reel/DYu6ISdOKPl/"
  },
  {
    id: "ig3",
    title: "Are you ready for the ultimate feast?",
    thumbnailUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop",
    link: "https://www.instagram.com/p/DZCK-YpiOxj/"
  },
  {
    id: "ig4",
    title: "0 Minutes. One Giant Biriyani. Unlimited Glory. 🏆",
    thumbnailUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=600&auto=format&fit=crop",
    link: "https://www.instagram.com/reel/DYpyToGOxrP/"
  },
  {
    id: "ig5",
    title: "Why was 6 afraid of 7? 😱",
    thumbnailUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600&auto=format&fit=crop",
    link: "https://www.instagram.com/reel/DYk24ECOA9X/"
  }
];
