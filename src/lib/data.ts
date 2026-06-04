export const CHANNEL = {
  name: "Car Torque SA",
  handle: "@CarTorqueSA",
  url: "https://www.youtube.com/@CarTorqueSA",
  tagline: "Honest South African car reviews — real drives, real roads, real verdicts.",
  about:
    "Car Torque SA delivers honest, in-depth reviews of the cars actually on sale in South Africa. From budget hatches and family people-movers to hot hatches and performance icons — we drive them, we live with them, and we tell you what's worth your money.",
};

export type Video = { id: string; title: string; category: string; description: string };

// Pulled from the @CarTorqueSA YouTube RSS feed (channel UC5MCOg3Oy3rkeq5Iiekmayw).
// Update by replacing entries below as new uploads land.
export const VIDEOS: Video[] = [
  {
    id: "IMUAMdA0PC8",
    title: "Renault Kwid: A Hit or Miss in the World of Compact Cars?",
    category: "Reviews",
    description: "Is South Africa's cheapest new car a bargain or a compromise? Full review.",
  },
  {
    id: "asbq1tab8Ak",
    title: "Renault Clio V Review: Stylish, Practical & Packed with Features",
    category: "Reviews",
    description: "The new Clio takes on a crowded segment. Here's where it wins — and where it slips.",
  },
  {
    id: "rr7ef1k5G-w",
    title: "Best Budget Car: Kia Picanto — Should You Buy?",
    category: "Reviews",
    description: "Price, in-depth review and test drive of SA's most popular budget hatch.",
  },
  {
    id: "ar3c0JuzExo",
    title: "Renault Triber: The Ultimate Family Car Review",
    category: "Reviews",
    description: "Seven seats, sub-R250k. Is the Triber really the family car bargain of the decade?",
  },
  {
    id: "IFkvWYvKIpQ",
    title: "Launch Control: Renault Megane 4 RS 280",
    category: "Performance",
    description: "The Megane RS 280 launches hard. We put launch control to the test.",
  },
  {
    id: "k6-krzw6rtc",
    title: "Best Fuel Consumption in Its Class",
    category: "Quick Takes",
    description: "Real-world economy numbers from our long-term test.",
  },
  {
    id: "Q-tUJKf6THI",
    title: "Renault Triber Keyless Entry — Walkaround",
    category: "Quick Takes",
    description: "A quick look at the Triber's keyless entry feature.",
  },
];

// First three are featured on the home page.
export const FEATURED_VIDEOS: Video[] = VIDEOS.slice(0, 3);

export const CATEGORIES = [
  { slug: "reviews", title: "Reviews", blurb: "Honest, in-depth takes on the cars you're actually considering." },
  { slug: "performance", title: "Performance", blurb: "Hot hatches, sports cars and the occasional launch-control session." },
  { slug: "quick-takes", title: "Quick Takes", blurb: "Walkarounds, features and short-form clips from the channel." },
];

export type Post = { slug: string; title: string; excerpt: string; date: string; body: string };

export const POSTS: Post[] = [
  {
    slug: "best-budget-cars-sa-2026",
    title: "Best Budget Cars in SA Right Now",
    excerpt: "Kia Picanto, Renault Kwid, Suzuki S-Presso — which sub-R250k hatch is actually worth your money?",
    date: "2026-05-22",
    body:
      "We've driven all three of South Africa's best-selling budget hatches back to back. The Picanto wins on perceived quality, the Kwid on outright price, and the S-Presso lands somewhere in between. Here's the breakdown.",
  },
  {
    slug: "renault-triber-family-car",
    title: "Renault Triber: SA's Best Family Car Under R250k?",
    excerpt: "Seven seats, sliding rear bench and a price tag that undercuts almost everything else. The catch?",
    date: "2026-05-10",
    body:
      "The Triber is genuinely surprising. The third row is properly usable for kids, fuel economy is respectable, and resale is holding up. We unpack the trade-offs you should know before signing.",
  },
  {
    slug: "megane-rs-280-on-sa-roads",
    title: "Megane RS 280: Hot Hatch Hero on SA Roads",
    excerpt: "Launch control, a chassis that loves South African back roads, and a soundtrack that delivers.",
    date: "2026-04-28",
    body:
      "We took the Megane RS 280 from Joburg through to the Magaliesberg passes. The Cup chassis is firm but never crashy, and launch control hooks up surprisingly well on warm tar.",
  },
];

export const MERCH = [
  { name: "Car Torque SA Tee", price: "R 349", tag: "Coming Soon" },
  { name: "Workshop Cap", price: "R 249", tag: "Coming Soon" },
  { name: "Track Day Hoodie", price: "R 699", tag: "Coming Soon" },
  { name: "Decal Pack", price: "R 99", tag: "Coming Soon" },
];
