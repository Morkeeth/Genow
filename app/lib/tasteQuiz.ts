import type { TasteProfile } from './types'

export interface TasteQuestion {
  id: string
  prompt: string
  optionA: {
    imageUrl: string
    label: string
    vibe: string
  }
  optionB: {
    imageUrl: string
    label: string
    vibe: string
  }
  // What each choice adds to the profile
  weights: {
    a: { classic: number; subtle: number; minimal: number }
    b: { classic: number; subtle: number; minimal: number }
  }
}

export const tasteQuestions: TasteQuestion[] = [
  {
    id: 'tq-1',
    prompt: 'Which painting would you hang in your home?',
    optionA: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg',
      label: 'Monet — Water Lilies',
      vibe: 'Soft light, nature, contemplation',
    },
    optionB: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Matisse-The-Red-Studio.jpg',
      label: 'Matisse — The Red Studio',
      vibe: 'Bold color, flat space, radical',
    },
    weights: {
      a: { classic: 0.3, subtle: 0.4, minimal: 0 },
      b: { classic: -0.3, subtle: -0.4, minimal: 0.2 },
    },
  },
  {
    id: 'tq-2',
    prompt: 'Friday evening. You\'re pouring a glass.',
    optionA: {
      imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
      label: 'Light Burgundy',
      vibe: 'Delicate, earthy, old-world',
    },
    optionB: {
      imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
      label: 'Bold Napa Cabernet',
      vibe: 'Rich, powerful, new-world',
    },
    weights: {
      a: { classic: 0.4, subtle: 0.4, minimal: 0.1 },
      b: { classic: -0.3, subtle: -0.5, minimal: -0.1 },
    },
  },
  {
    id: 'tq-3',
    prompt: 'Which room feels more like you?',
    optionA: {
      imageUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80',
      label: 'Minimal & clean',
      vibe: 'Dieter Rams, white space, clarity',
    },
    optionB: {
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      label: 'Warm & layered',
      vibe: 'Candlelight, texture, patina',
    },
    weights: {
      a: { classic: -0.1, subtle: 0.2, minimal: 0.5 },
      b: { classic: 0.3, subtle: -0.1, minimal: -0.5 },
    },
  },
  {
    id: 'tq-4',
    prompt: 'Which says more to you?',
    optionA: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg',
      label: 'Vermeer — Girl with a Pearl Earring',
      vibe: 'Quiet mastery, intimacy, timeless',
    },
    optionB: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/7/74/Guernica.jpg',
      label: 'Picasso — Guernica',
      vibe: 'Raw power, disruption, statement',
    },
    weights: {
      a: { classic: 0.5, subtle: 0.3, minimal: 0.1 },
      b: { classic: -0.4, subtle: -0.5, minimal: -0.2 },
    },
  },
  {
    id: 'tq-5',
    prompt: 'The craft you respect most?',
    optionA: {
      imageUrl: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800&q=80',
      label: 'Hand-thrown ceramics',
      vibe: 'Imperfect, wabi-sabi, one of a kind',
    },
    optionB: {
      imageUrl: 'https://images.unsplash.com/photo-1545060894-7843d1d0ae0e?w=800&q=80',
      label: 'Precision engineering',
      vibe: 'Exact, engineered, Swiss-watch perfection',
    },
    weights: {
      a: { classic: 0.2, subtle: 0.1, minimal: -0.3 },
      b: { classic: -0.1, subtle: -0.1, minimal: 0.4 },
    },
  },
  {
    id: 'tq-6',
    prompt: 'Which weekend sounds better?',
    optionA: {
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
      label: 'Long lunch with old friends',
      vibe: 'Conversation, wine, no rush',
    },
    optionB: {
      imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a32ede2e3?w=800&q=80',
      label: 'Solo museum morning',
      vibe: 'Quiet, contemplative, discovering',
    },
    weights: {
      a: { classic: 0.1, subtle: -0.1, minimal: -0.2 },
      b: { classic: 0.1, subtle: 0.3, minimal: 0.3 },
    },
  },
  {
    id: 'tq-7',
    prompt: 'Which captures beauty?',
    optionA: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/800px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg',
      label: 'Klimt — The Kiss',
      vibe: 'Gold, ornament, lush, romantic',
    },
    optionB: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/1280px-Nighthawks_by_Edward_Hopper_1942.jpg',
      label: 'Hopper — Nighthawks',
      vibe: 'Solitude, urban, cool, cinematic',
    },
    weights: {
      a: { classic: 0.2, subtle: -0.3, minimal: -0.4 },
      b: { classic: -0.1, subtle: 0.2, minimal: 0.3 },
    },
  },
]

interface Archetype {
  name: string
  description: string
  yourTaste: string
}

export function computeProfile(answers: Record<string, 'a' | 'b'>): TasteProfile {
  let classic = 0, subtle = 0, minimal = 0
  let count = 0

  for (const q of tasteQuestions) {
    const choice = answers[q.id]
    if (!choice) continue
    const w = q.weights[choice]
    classic += w.classic
    subtle += w.subtle
    minimal += w.minimal
    count++
  }

  // Normalize to -1..1
  const norm = (v: number) => Math.max(-1, Math.min(1, count > 0 ? v / (count * 0.5) : 0))
  const c = norm(classic)
  const s = norm(subtle)
  const m = norm(minimal)

  const archetype = getArchetype(c, s, m)

  return {
    classic_vs_modern: c,
    subtle_vs_bold: s,
    minimalist_vs_expressive: m,
    archetype: archetype.name,
    completedAt: new Date().toISOString(),
  }
}

export function getArchetype(classic: number, subtle: number, minimal: number): Archetype {
  // Determine dominant traits
  if (classic > 0.2 && subtle > 0.2) {
    return {
      name: 'The Connoisseur',
      description: 'You\'re drawn to quiet mastery — the things that get better the longer you look. Old-world wine, Dutch masters, hand-crafted details.',
      yourTaste: 'Light Burgundy, Vermeer, linen, aged wood, a well-set table.',
    }
  }
  if (classic > 0.2 && subtle <= 0.2) {
    return {
      name: 'The Romantic',
      description: 'You love the grand gesture — gold leaf, full-bodied wines, rooms with history. Beauty should be felt, not analyzed.',
      yourTaste: 'Klimt, Champagne, velvet, candlelight, impasto brushstrokes.',
    }
  }
  if (classic <= -0.2 && minimal > 0.2) {
    return {
      name: 'The Modernist',
      description: 'Less, but better. You see beauty in restraint, in the space between things. Dieter Rams is your spirit animal.',
      yourTaste: 'Matisse, natural wine, Bauhaus, concrete, single-origin everything.',
    }
  }
  if (classic <= -0.2 && minimal <= -0.2) {
    return {
      name: 'The Radical',
      description: 'You want art that makes a statement. You\'d rather be provoked than soothed. Rules are there to be understood — then broken.',
      yourTaste: 'Picasso, bold Syrah, brutalism, raw edges, the unexpected.',
    }
  }
  if (subtle > 0.3) {
    return {
      name: 'The Observer',
      description: 'You notice what others miss — the light in a Vermeer, the mineral note in a Chablis. For you, beauty is in the details.',
      yourTaste: 'Monet, Pinot Noir, Japanese ceramics, morning light, silence.',
    }
  }
  if (minimal > 0.3) {
    return {
      name: 'The Essentialist',
      description: 'You strip away everything unnecessary until only the essential remains. Your spaces are curated, your taste is sharp.',
      yourTaste: 'Hopper, dry Riesling, Scandinavian design, wabi-sabi, precision.',
    }
  }
  // Default: The Explorer
  return {
    name: 'The Explorer',
    description: 'You don\'t have a type — you have curiosity. Old and new, subtle and bold, classic and radical. You follow what resonates.',
    yourTaste: 'A bit of everything — and that\'s the point.',
  }
}

export function getArchetypeForProfile(profile: TasteProfile): Archetype {
  return getArchetype(profile.classic_vs_modern, profile.subtle_vs_bold, profile.minimalist_vs_expressive)
}
