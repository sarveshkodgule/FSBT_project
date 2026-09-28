// Experiment 3: Connecting to MongoDB - Seed Data
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Game = require('../models/Game');
const User = require('../models/User');

// Stable image URLs sourced from picsum.photos (Lorem Picsum) — deterministic
// seeds ensure the same image is always returned for the same game.
// Format: https://picsum.photos/seed/<keyword>/800/450
const games = [
  // ── ACTION ──────────────────────────────────────────────────────────────
  {
    title: 'Shadow Strike: Origins',
    description:
      'An explosive third-person action game where you play as a rogue agent uncovering a global conspiracy. Fight through 20 missions with a mix of stealth, gunplay, and hand-to-hand combat.',
    price: 2499,
    discountPrice: 1999,
    genre: 'Action',
    platform: ['PC', 'PlayStation', 'Xbox'],
    developer: 'Ironclad Studios',
    publisher: 'Apex Interactive',
    releaseDate: new Date('2024-03-15'),
    image: 'https://picsum.photos/seed/shadowstrike/800/450',
    rating: 4.5,
    numReviews: 128,
    stock: 200,
    tags: ['stealth', 'action', 'conspiracy', 'shooter'],
    featured: true,
  },
  {
    title: 'Neon Blade',
    description:
      'A cyberpunk hack-and-slash set in a dystopian megacity. Wield energy blades and cyber-abilities to fight through corrupt corporations and street gangs in a neon-drenched open world.',
    price: 1999,
    discountPrice: 0,
    genre: 'Action',
    platform: ['PC', 'PlayStation'],
    developer: 'CyberForge',
    publisher: 'CyberForge',
    releaseDate: new Date('2024-07-20'),
    image: 'https://picsum.photos/seed/neonblade/800/450',
    rating: 4.2,
    numReviews: 95,
    stock: 150,
    tags: ['cyberpunk', 'hack-and-slash', 'open world'],
    featured: true,
  },

  // ── ADVENTURE ───────────────────────────────────────────────────────────
  {
    title: 'Lost Horizon',
    description:
      'Embark on an epic journey across ancient ruins, dense jungles, and treacherous mountain passes. Solve environmental puzzles and unravel a mystery that spans thousands of years.',
    price: 2199,
    discountPrice: 1499,
    genre: 'Adventure',
    platform: ['PC', 'PlayStation', 'Nintendo Switch'],
    developer: 'Wanderer Games',
    publisher: 'Odyssey Publishing',
    releaseDate: new Date('2023-11-10'),
    image: 'https://picsum.photos/seed/losthorizon/800/450',
    rating: 4.7,
    numReviews: 210,
    stock: 180,
    tags: ['exploration', 'puzzles', 'mystery', 'ancient ruins'],
    featured: true,
  },
  {
    title: "Captain Finn's Treasure",
    description:
      'A swashbuckling pirate adventure across a vast archipelago. Command your ship, recruit a crew, discover hidden islands, and outsmart rival pirates in a golden age of seafaring.',
    price: 1799,
    discountPrice: 0,
    genre: 'Adventure',
    platform: ['PC', 'Xbox', 'Nintendo Switch'],
    developer: 'High Seas Dev',
    publisher: 'Sea Voyage Interactive',
    releaseDate: new Date('2024-01-22'),
    image: 'https://picsum.photos/seed/captainfinn/800/450',
    rating: 4.3,
    numReviews: 87,
    stock: 120,
    tags: ['pirate', 'naval', 'open world', 'exploration'],
    featured: false,
  },

  // ── RPG ─────────────────────────────────────────────────────────────────
  {
    title: 'Elden Realm: Forsaken Age',
    description:
      'A massive open-world RPG with a deep lore and brutal combat. Choose from 8 character classes, build your skills, forge alliances, and face god-like bosses to claim the shattered throne.',
    price: 3499,
    discountPrice: 2799,
    genre: 'RPG',
    platform: ['PC', 'PlayStation', 'Xbox'],
    developer: 'FromSoft Inspired',
    publisher: 'Epic Tales',
    releaseDate: new Date('2024-02-25'),
    image: 'https://picsum.photos/seed/eldenrealm/800/450',
    rating: 4.9,
    numReviews: 512,
    stock: 300,
    tags: ['open world', 'soulslike', 'fantasy', 'boss fights'],
    featured: true,
  },
  {
    title: 'Chronicles of Aethoria',
    description:
      'A classic turn-based RPG with a rich story spanning 80+ hours. Build your party of six heroes, master elemental magic, and restore balance to a world torn apart by ancient gods.',
    price: 2799,
    discountPrice: 0,
    genre: 'RPG',
    platform: ['PC', 'Nintendo Switch'],
    developer: 'Pixel Legends',
    publisher: 'Nostalgic Games Co.',
    releaseDate: new Date('2023-09-05'),
    image: 'https://picsum.photos/seed/aethoria/800/450',
    rating: 4.6,
    numReviews: 340,
    stock: 220,
    tags: ['turn-based', 'fantasy', 'party', 'story-rich'],
    featured: false,
  },

  // ── STRATEGY ─────────────────────────────────────────────────────────────
  {
    title: 'Empire Forge',
    description:
      'A grand strategy game where you build a civilization from a small settlement to a global empire. Manage resources, diplomacy, military, and technology across centuries of history.',
    price: 2299,
    discountPrice: 1799,
    genre: 'Strategy',
    platform: ['PC'],
    developer: 'Grand Minds Studio',
    publisher: 'Tactics Publishing',
    releaseDate: new Date('2023-06-14'),
    image: 'https://picsum.photos/seed/empireforge/800/450',
    rating: 4.4,
    numReviews: 178,
    stock: 250,
    tags: ['grand strategy', 'civilization', 'diplomacy', 'historical'],
    featured: false,
  },
  {
    title: 'Starfront Command',
    description:
      'Real-time strategy in the depths of space. Command fleets, colonize planets, research technologies, and crush rival factions in a galaxy-spanning war for dominance.',
    price: 1999,
    discountPrice: 1499,
    genre: 'Strategy',
    platform: ['PC'],
    developer: 'Orbital RTS',
    publisher: 'Orbital RTS',
    releaseDate: new Date('2024-04-10'),
    image: 'https://picsum.photos/seed/starfront/800/450',
    rating: 4.1,
    numReviews: 134,
    stock: 200,
    tags: ['RTS', 'sci-fi', 'space', 'fleet battles'],
    featured: false,
  },

  // ── SPORTS ───────────────────────────────────────────────────────────────
  {
    title: 'Premier Kick 2025',
    description:
      'The most realistic football simulation with 50+ leagues, 1000+ real teams, and a completely revamped dribbling and passing system. Career mode, Ultimate Team, and online multiplayer included.',
    price: 3999,
    discountPrice: 3499,
    genre: 'Sports',
    platform: ['PC', 'PlayStation', 'Xbox'],
    developer: 'SportSim Studios',
    publisher: 'Global Sports Interactive',
    releaseDate: new Date('2024-09-27'),
    image: 'https://picsum.photos/seed/premierkick/800/450',
    rating: 4.0,
    numReviews: 623,
    stock: 500,
    tags: ['football', 'soccer', 'multiplayer', 'career mode'],
    featured: true,
  },
  {
    title: 'Slam Dunk Arena',
    description:
      'An arcade basketball game with exaggerated physics, legendary street courts, and over-the-top dunks. Play solo tournaments or challenge friends in 2v2 and 3v3 online matches.',
    price: 1499,
    discountPrice: 999,
    genre: 'Sports',
    platform: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    developer: 'Hardwood Games',
    publisher: 'Sportcore Publishing',
    releaseDate: new Date('2024-06-01'),
    image: 'https://picsum.photos/seed/slamdunk/800/450',
    rating: 3.9,
    numReviews: 89,
    stock: 300,
    tags: ['basketball', 'arcade', 'multiplayer', 'street sports'],
    featured: false,
  },

  // ── RACING ───────────────────────────────────────────────────────────────
  {
    title: 'Velocity Rush: Neon Circuit',
    description:
      'High-octane futuristic racing on anti-gravity tracks suspended above mega-cities. Unlock 60+ ships, customize them fully, and compete in the intergalactic championship.',
    price: 1799,
    discountPrice: 1299,
    genre: 'Racing',
    platform: ['PC', 'PlayStation', 'Xbox'],
    developer: 'TurboLab',
    publisher: 'Speed Demon Games',
    releaseDate: new Date('2024-05-18'),
    image: 'https://picsum.photos/seed/velocityrush/800/450',
    rating: 4.3,
    numReviews: 156,
    stock: 200,
    tags: ['futuristic', 'anti-gravity', 'racing', 'multiplayer'],
    featured: false,
  },
  {
    title: 'Dirt Rally Masters',
    description:
      'The most authentic off-road racing experience. Drive 80+ iconic rally cars across mud, snow, gravel, and tarmac stages worldwide. Career mode, time trials, and online championships.',
    price: 2999,
    discountPrice: 0,
    genre: 'Racing',
    platform: ['PC', 'PlayStation', 'Xbox'],
    developer: 'Gravel Track Games',
    publisher: 'Motorsport Interactive',
    releaseDate: new Date('2023-12-01'),
    image: 'https://picsum.photos/seed/dirtrally/800/450',
    rating: 4.6,
    numReviews: 202,
    stock: 180,
    tags: ['rally', 'realistic', 'off-road', 'simulation'],
    featured: false,
  },

  // ── SIMULATION ────────────────────────────────────────────────────────────
  {
    title: 'City Architect Pro',
    description:
      'Build and manage a living, breathing metropolis from a small town to a thriving megacity. Balance economy, traffic, pollution, and citizen happiness across hundreds of hours of gameplay.',
    price: 2499,
    discountPrice: 1999,
    genre: 'Simulation',
    platform: ['PC'],
    developer: 'Urban Planner Games',
    publisher: 'Blueprint Studios',
    releaseDate: new Date('2023-08-20'),
    image: 'https://picsum.photos/seed/cityarchitect/800/450',
    rating: 4.5,
    numReviews: 289,
    stock: 350,
    tags: ['city builder', 'management', 'urban', 'sandbox'],
    featured: false,
  },
  {
    title: 'Space Station Tycoon',
    description:
      'Design and operate your own space station orbiting distant planets. Manage crews, research modules, supply chains, and tourists while surviving cosmic disasters and resource shortages.',
    price: 1999,
    discountPrice: 0,
    genre: 'Simulation',
    platform: ['PC'],
    developer: 'Orbit Builders',
    publisher: 'Cosmos Interactive',
    releaseDate: new Date('2024-03-30'),
    image: 'https://picsum.photos/seed/spacestation/800/450',
    rating: 4.2,
    numReviews: 112,
    stock: 200,
    tags: ['space', 'tycoon', 'management', 'sci-fi'],
    featured: false,
  },

  // ── HORROR ───────────────────────────────────────────────────────────────
  {
    title: 'Darkwood Manor',
    description:
      'A psychological survival horror set in a crumbling Victorian mansion. Navigate pitch-black corridors, solve dark rituals, and survive the night against terrifying supernatural entities.',
    price: 1499,
    discountPrice: 999,
    genre: 'Horror',
    platform: ['PC', 'PlayStation'],
    developer: 'Nightmare Craft',
    publisher: 'Scare Factor Studios',
    releaseDate: new Date('2023-10-31'),
    image: 'https://picsum.photos/seed/darkwood/800/450',
    rating: 4.4,
    numReviews: 198,
    stock: 150,
    tags: ['survival horror', 'psychological', 'atmospheric', 'Victorian'],
    featured: false,
  },
  {
    title: 'Dead Signal',
    description:
      'Co-op survival horror for up to 4 players. Investigate an abandoned research facility overrun by mutated experiments. Communication is key — or your team dies.',
    price: 1799,
    discountPrice: 1499,
    genre: 'Horror',
    platform: ['PC', 'PlayStation', 'Xbox'],
    developer: 'Signal Lost Games',
    publisher: 'Scream Team Publishing',
    releaseDate: new Date('2024-08-14'),
    image: 'https://picsum.photos/seed/deadsignal/800/450',
    rating: 4.1,
    numReviews: 143,
    stock: 200,
    tags: ['co-op', 'survival horror', 'multiplayer', 'monsters'],
    featured: false,
  },

  // ── PUZZLE ───────────────────────────────────────────────────────────────
  {
    title: 'Mind Fracture',
    description:
      'A mind-bending puzzle game that manipulates gravity, time, and perception. 200 hand-crafted levels that will challenge your logic and spatial reasoning in increasingly devious ways.',
    price: 999,
    discountPrice: 699,
    genre: 'Puzzle',
    platform: ['PC', 'Nintendo Switch', 'Mobile'],
    developer: 'Logic Lens',
    publisher: 'Indie Spark',
    releaseDate: new Date('2023-07-10'),
    image: 'https://picsum.photos/seed/mindfracture/800/450',
    rating: 4.8,
    numReviews: 321,
    stock: 1000,
    tags: ['puzzle', 'mind-bending', 'logic', 'indie'],
    featured: false,
  },

  // ── FIGHTING ─────────────────────────────────────────────────────────────
  {
    title: 'Iron Fist Championship',
    description:
      'A tournament fighting game featuring 50 unique fighters from across the world. Master complex combo systems, special moves, and counter-attacks to rise through the global rankings.',
    price: 2299,
    discountPrice: 1799,
    genre: 'Fighting',
    platform: ['PC', 'PlayStation', 'Xbox'],
    developer: 'Kombat Factory',
    publisher: 'Fist & Fury Interactive',
    releaseDate: new Date('2024-01-15'),
    image: 'https://picsum.photos/seed/ironfist/800/450',
    rating: 4.3,
    numReviews: 267,
    stock: 250,
    tags: ['fighting', 'tournament', 'combos', 'multiplayer'],
    featured: false,
  },

  // ── SHOOTER ──────────────────────────────────────────────────────────────
  {
    title: 'Warzone: Black Ops',
    description:
      'A tactical first-person shooter with a gripping single-player campaign and deep multiplayer modes. Features destructible environments, realistic ballistics, and a 100-player battle royale mode.',
    price: 3499,
    discountPrice: 2999,
    genre: 'Shooter',
    platform: ['PC', 'PlayStation', 'Xbox'],
    developer: 'Frontline Dev',
    publisher: 'Combat Zone Games',
    releaseDate: new Date('2024-11-01'),
    image: 'https://picsum.photos/seed/warzone/800/450',
    rating: 4.5,
    numReviews: 892,
    stock: 500,
    tags: ['FPS', 'tactical', 'battle royale', 'multiplayer'],
    featured: true,
  },
  {
    title: 'Galactic Defender',
    description:
      'A third-person sci-fi shooter with jetpack mechanics and zero-gravity combat. Battle alien hordes across 12 planets in solo or 4-player online co-op.',
    price: 1999,
    discountPrice: 1499,
    genre: 'Shooter',
    platform: ['PC', 'PlayStation', 'Xbox'],
    developer: 'Orbit Studios',
    publisher: 'Nova Games',
    releaseDate: new Date('2024-06-20'),
    image: 'https://picsum.photos/seed/galacticdefender/800/450',
    rating: 4.0,
    numReviews: 175,
    stock: 300,
    tags: ['sci-fi', 'co-op', 'jetpack', 'aliens'],
    featured: false,
  },

  // ── PLATFORMER ───────────────────────────────────────────────────────────
  {
    title: 'Pixel Run: Chaos Edition',
    description:
      'A chaotic 2D platformer with procedurally generated levels, 10 playable characters, and local/online multiplayer for up to 4 players. Race, battle, and sabotage your friends.',
    price: 999,
    discountPrice: 699,
    genre: 'Platformer',
    platform: ['PC', 'Nintendo Switch', 'PlayStation'],
    developer: 'Jump Factory',
    publisher: 'Retro Wave Games',
    releaseDate: new Date('2024-02-14'),
    image: 'https://picsum.photos/seed/pixelrun/800/450',
    rating: 4.2,
    numReviews: 154,
    stock: 400,
    tags: ['platformer', 'multiplayer', 'indie', 'procedural'],
    featured: false,
  },

  // ── SANDBOX ──────────────────────────────────────────────────────────────
  {
    title: 'Worlds Unlimited',
    description:
      'An infinite sandbox universe where you can build anything, explore procedurally generated planets, mine resources, and create machines. Supports 100-player multiplayer servers.',
    price: 1499,
    discountPrice: 0,
    genre: 'Sandbox',
    platform: ['PC', 'Xbox', 'Nintendo Switch'],
    developer: 'Block World Studios',
    publisher: 'Infinite Play',
    releaseDate: new Date('2023-05-01'),
    image: 'https://picsum.photos/seed/worldsunlimited/800/450',
    rating: 4.6,
    numReviews: 478,
    stock: 999,
    tags: ['sandbox', 'survival', 'building', 'multiplayer'],
    featured: true,
  },

  // ── MMO ──────────────────────────────────────────────────────────────────
  {
    title: 'Chronicles Online: Eternity',
    description:
      'A massively multiplayer online RPG with a living world that evolves without players. Join guilds, siege castles, trade in player-run economies, and participate in server-wide events.',
    price: 999,
    discountPrice: 0,
    genre: 'MMO',
    platform: ['PC'],
    developer: 'Massively Studios',
    publisher: 'Online Worlds Inc.',
    releaseDate: new Date('2022-12-01'),
    image: 'https://picsum.photos/seed/chroniclesonline/800/450',
    rating: 4.1,
    numReviews: 654,
    stock: 9999,
    tags: ['MMO', 'online', 'guilds', 'PvP', 'fantasy'],
    featured: false,
  },

  // ── BATTLE ROYALE ─────────────────────────────────────────────────────────
  {
    title: 'Last Zone Standing',
    description:
      'A fast-paced battle royale for 150 players on a dynamic map with shifting terrain. Unique abilities, vehicles, and a crafting system keep every match fresh.',
    price: 0,
    discountPrice: 0,
    genre: 'Battle Royale',
    platform: ['PC', 'PlayStation', 'Xbox'],
    developer: 'Drop Zone Games',
    publisher: 'Drop Zone Games',
    releaseDate: new Date('2024-07-04'),
    image: 'https://picsum.photos/seed/lastzonestanding/800/450',
    rating: 4.0,
    numReviews: 1102,
    stock: 9999,
    tags: ['battle royale', 'free-to-play', 'multiplayer', 'crafting'],
    featured: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing games
    await Game.deleteMany({});
    console.log('Existing games cleared');

    // Insert all games
    await Game.insertMany(games);
    console.log(`${games.length} games seeded successfully!`);

    // Create default admin if not exists
    const adminExists = await User.findOne({ email: 'admin@gamestore.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@gamestore.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Default admin created: admin@gamestore.com / admin123');
    }

    mongoose.connection.close();
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
