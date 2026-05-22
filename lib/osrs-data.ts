// All OSRS skills in hiscores order
export const SKILLS = [
  { name: "Overall",      icon: "⚔",  max: 2277, color: "var(--skill-overall)" },
  { name: "Attack",       icon: "⚔",  max: 99,   color: "var(--skill-attack)" },
  { name: "Defence",      icon: "🛡",  max: 99,   color: "var(--skill-defence)" },
  { name: "Strength",     icon: "💪",  max: 99,   color: "var(--skill-strength)" },
  { name: "Hitpoints",    icon: "❤",  max: 99,   color: "var(--skill-hitpoints)" },
  { name: "Ranged",       icon: "🏹",  max: 99,   color: "var(--skill-ranged)" },
  { name: "Prayer",       icon: "🙏",  max: 99,   color: "var(--skill-prayer)" },
  { name: "Magic",        icon: "🔮",  max: 99,   color: "var(--skill-magic)" },
  { name: "Cooking",      icon: "🍳",  max: 99,   color: "var(--skill-cooking)" },
  { name: "Woodcutting",  icon: "🪓",  max: 99,   color: "var(--skill-woodcutting)" },
  { name: "Fletching",    icon: "🏹",  max: 99,   color: "var(--skill-fletching)" },
  { name: "Fishing",      icon: "🎣",  max: 99,   color: "var(--skill-fishing)" },
  { name: "Firemaking",   icon: "🔥",  max: 99,   color: "var(--skill-firemaking)" },
  { name: "Crafting",     icon: "🧶",  max: 99,   color: "var(--skill-crafting)" },
  { name: "Smithing",     icon: "🔨",  max: 99,   color: "var(--skill-smithing)" },
  { name: "Mining",       icon: "⛏",  max: 99,   color: "var(--skill-mining)" },
  { name: "Herblore",     icon: "🌿",  max: 99,   color: "var(--skill-herblore)" },
  { name: "Agility",      icon: "🏃",  max: 99,   color: "var(--skill-agility)" },
  { name: "Thieving",     icon: "🗝",  max: 99,   color: "var(--skill-thieving)" },
  { name: "Slayer",       icon: "💀",  max: 99,   color: "var(--skill-slayer)" },
  { name: "Farming",      icon: "🌾",  max: 99,   color: "var(--skill-farming)" },
  { name: "Runecraft",    icon: "🔵",  max: 99,   color: "var(--skill-runecraft)" },
  { name: "Hunter",       icon: "🦌",  max: 99,   color: "var(--skill-hunter)" },
  { name: "Construction", icon: "🏗",  max: 99,   color: "var(--skill-construction)" },
];

export type SkillData = {
  rank: number;
  level: number;
  xp: number;
};

export type HiscoresData = {
  username: string;
  skills: Record<string, SkillData>;
};

// ── HERB PATCHES ──
export const HERB_PATCHES = [
  "Falador",
  "Catherby",
  "Ardougne",
  "Canifis",
  "Farming Guild",
  "Harmony Island",
  "Hosidius",
  "Weiss",
];

// ── HERBS ──
export const HERBS = [
  "Guam", "Marrentill", "Tarromin", "Harralander",
  "Ranarr", "Toadflax", "Irit", "Avantoe",
  "Kwuarm", "Snapdragon", "Cadantine", "Lantadyme",
  "Dwarf Weed", "Torstol",
];

// ── FLOWERS (flower patch crops in OSRS) ──
export const FLOWERS = [
  "Marigold", "Rosemary", "Nasturtium",
  "Woad", "Limpwurt", "White lily",
  "Orchid", "Sunflower",
];

// ── COMPOST TYPES ──
export const COMPOST_TYPES = ["None", "Compost", "Supercompost", "Ultracompost"];

// ── BIRD HOUSE LOCATIONS ──
export const BH_LOCATIONS = [
  "Verdant Valley",
  "Solitary Pine",
  "Lands End",
  "Mushroom Meadow",
];

// ── BIRD HOUSE TIERS ──
export const BH_TIERS = [
  "Regular", "Oak", "Willow", "Teak",
  "Maple", "Mahogany", "Yew", "Magic", "Redwood",
];

// ── SLAYER MASTERS ──
export const SLAYER_MASTERS = [
  "Turael", "Mazchna", "Vannaka", "Chaeldar",
  "Konar", "Nieve", "Duradel", "Spria",
];

// Format GP numbers
export function formatGp(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toString();
}

// Format XP numbers
export function formatXp(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}
