export const tags: Tag[] = [
  { name: "All", value: "all" },
  { name: "Lucid", value: "lucid" },
  { name: "Prophetic", value: "prophetic" },
  { name: "Premonitory", value: "premonitory" },
  { name: "Nightmare", value: "nightmare" },
  { name: "Fantastic", value: "fantastic" },
  { name: "Recurrent", value: "recurrent" },
  { name: "Daydream", value: "daydream" },
  { name: "Dystopian", value: "dystopian" },
  { name: "False Awakening", value: "false-awakening" },
  { name: "Healing", value: "healing" },
  { name: "Epic", value: "epic" },
  { name: "Signal", value: "signal" },
  { name: "Mutual", value: "mutual" },
  { name: "Progressive", value: "progressive" },
  { name: "Past Life", value: "past-life" },
  { name: "Tragic", value: "tragic" },
  { name: "Dramatic", value: "dramatic" },
  { name: "Night Terrors", value: "night-terrors" },
  { name: "I don't really know", value: "other" },
];

export const categories: Category[] = [
  {
    name: "Lucid",
    description:
      "These are dreams where you become aware that you're dreaming and can sometimes control the dream's outcome.",
    image: "https://images.unsplash.com/photo-1536514072410-5019a3c69182?w=500&q=80"
  },
  {
    name: "Nightmare",
    description:
      "These are distressing dreams that can cause feelings of fear, anxiety, or sadness.",
    image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=500&q=80"
  },
  {
    name: "Prophetic",
    description: "Dreams that seem to predict future events or provide insight into what's to come.",
    image: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=500&q=80"
  },
  {
    name: "Premonitory",
    description: "Dreams that give warnings or feelings about future events.",
    image: "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?w=500&q=80"
  },
  {
    name: "Fantastic",
    description: "Extraordinary dreams filled with magical elements and impossible scenarios.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80"
  },
  {
    name: "Recurrent",
    description: "Dreams that repeat themselves either exactly or with slight variations.",
    image: "https://images.unsplash.com/photo-1493612216891-65cbf3b5c420?w=500&q=80"
  },
  {
    name: "Daydream",
    description: "Conscious dreams that occur while awake, often involving fantasies or aspirations.",
    image: "https://images.unsplash.com/photo-1497561813398-8fcc7a37b567?w=500&q=80"
  },
  {
    name: "Dystopian",
    description: "Dreams set in dark, oppressive, or post-apocalyptic scenarios.",
    image: "https://images.unsplash.com/photo-1542435503-956c469947f6?w=500&q=80"
  },
  {
    name: "False Awakening",
    description: "Dreams where you believe you've woken up, only to realize you're still dreaming.",
    image: "https://images.unsplash.com/photo-1455642305367-68834a9d4147?w=500&q=80"
  },
  {
    name: "Healing",
    description: "Dreams that provide emotional or psychological healing and comfort.",
    image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=500&q=80"
  },
  {
    name: "Epic",
    description: "Grand, adventurous dreams with heroic elements and sweeping narratives.",
    image: "https://images.unsplash.com/photo-1443926818681-717d074a57af?w=500&q=80"
  },
  {
    name: "Signal",
    description: "Dreams that appear to communicate important messages from the subconscious.",
    image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=500&q=80"
  },
  {
    name: "Mutual",
    description: "Shared dreams experienced by multiple people simultaneously.",
    image: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=500&q=80"
  },
  {
    name: "Progressive",
    description: "Dreams that evolve and build upon previous dreams in a series.",
    image: "https://images.unsplash.com/photo-1454817481404-7e84c1b73b4a?w=500&q=80"
  },
  {
    name: "Past Life",
    description: "Dreams that seem to recall memories or experiences from previous lives.",
    image: "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?w=500&q=80"
  },
  {
    name: "Tragic",
    description: "Dreams involving loss, grief, or profound emotional experiences.",
    image: "https://images.unsplash.com/photo-1476370648495-3533f64427a2?w=500&q=80"
  },
  {
    name: "Dramatic",
    description: "Intense dreams filled with emotional or theatrical elements.",
    image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500&q=80"
  },
  {
    name: "Night Terrors",
    description: "Extremely frightening dreams that cause intense fear and panic.",
    image: "https://images.unsplash.com/photo-1555094840-4c41b8e2d545?w=500&q=80"
  }
];

export const dummyDreams = [
  {
    id: "1",
    title: "Flying Over Crystal Cities",
    content: "I found myself soaring over a magnificent city made entirely of crystal. The sunlight refracted through the buildings, creating rainbow patterns everywhere. I could feel the wind beneath my wings, though I wasn't sure if I actually had wings.",
    tags: ["lucid", "fantastic", "epic"],
    date: "2025-01-24T10:30:00Z"
  },
  {
    id: "2",
    title: "The Ancient Library",
    content: "Wandering through an endless library with books that wrote themselves. Each tome contained memories of past lives, and as I touched them, I could experience fragments of those memories.",
    tags: ["past-life", "prophetic"],
    date: "2025-01-23T22:15:00Z"
  },
  {
    id: "3",
    title: "Ocean of Stars",
    content: "Swimming in an ocean where the water was made of liquid starlight. Each movement created ripples of constellations, and I could hear the music of the cosmos.",
    tags: ["fantastic", "epic", "healing"],
    date: "2025-01-23T03:45:00Z"
  },
  {
    id: "4",
    title: "Time Loop Mystery",
    content: "Caught in a repeating moment where I kept discovering new details about a mysterious event. Each loop revealed another layer of a complex puzzle I needed to solve.",
    tags: ["recurrent", "signal"],
    date: "2025-01-22T15:20:00Z"
  },
  {
    id: "5",
    title: "The Living Forest",
    content: "Walking through a forest where the trees were conscious beings. They shared their ancient wisdom through a network of glowing roots, revealing secrets about the nature of reality.",
    tags: ["healing", "mutual", "fantastic"],
    date: "2025-01-21T19:10:00Z"
  }
];
