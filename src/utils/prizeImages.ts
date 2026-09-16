/**
 * AKM LUCKY DRAW — Centralized Prize Image Mapping & Resolvers
 * 
 * Provides deterministic, stable mapping between physical prizes and their
 * corresponding product images in /public/prizes/
 */

export interface PrizeImageDefinition {
  slug: string;
  title: string;
  baseFileName: string;
  primaryPath: string;
  iconType: 'watch' | 'headphones' | 'wallet' | 'spray' | 'belt' | 'chocolate' | 'teddy' | 'gift';
  accentColor: string;
}

/**
 * Master mapping for the 10 real physical campaign prizes:
 * 1. Ladies Analog Watch -> ladies-analog-watch
 * 2. Gents Analog Watch  -> gents-analog-watch
 * 3. AirPods             -> airpods
 * 4. Neckband            -> neckband
 * 5. Men's Wallet        -> mens-wallet
 * 6. Ladies Wallet       -> ladies-wallet
 * 7. Perfume             -> perfume
 * 8. Belt                -> belt
 * 9. Chocolate           -> chocolate
 * 10. Teddy              -> teddy
 */
export const PRIZE_IMAGE_DEFINITIONS: Record<string, PrizeImageDefinition> = {
  'ladies-analog-watch': {
    slug: 'ladies-analog-watch',
    title: 'Ladies Analog Watch',
    baseFileName: 'ladies-analog-watch',
    primaryPath: '/prizes/ladies-analog-watch.png',
    iconType: 'watch',
    accentColor: '#D4AF37'
  },
  'gents-analog-watch': {
    slug: 'gents-analog-watch',
    title: 'Gents Analog Watch',
    baseFileName: 'gents-analog-watch',
    primaryPath: '/prizes/gents-analog-watch.png',
    iconType: 'watch',
    accentColor: '#D4AF37'
  },
  'airpods': {
    slug: 'airpods',
    title: 'AirPods',
    baseFileName: 'airpods',
    primaryPath: '/prizes/airpods.png',
    iconType: 'headphones',
    accentColor: '#38BDF8'
  },
  'neckband': {
    slug: 'neckband',
    title: 'Neckband',
    baseFileName: 'neckband',
    primaryPath: '/prizes/neckband.png',
    iconType: 'headphones',
    accentColor: '#818CF8'
  },
  'mens-wallet': {
    slug: 'mens-wallet',
    title: "Men's Wallet",
    baseFileName: 'mens-wallet',
    primaryPath: '/prizes/mens-wallet.png',
    iconType: 'wallet',
    accentColor: '#D4AF37'
  },
  'ladies-wallet': {
    slug: 'ladies-wallet',
    title: 'Ladies Wallet',
    baseFileName: 'ladies-wallet',
    primaryPath: '/prizes/ladies-wallet.png',
    iconType: 'wallet',
    accentColor: '#FB7185'
  },
  'perfume': {
    slug: 'perfume',
    title: 'Perfume',
    baseFileName: 'perfume',
    primaryPath: '/prizes/perfume.png',
    iconType: 'spray',
    accentColor: '#34D399'
  },
  'belt': {
    slug: 'belt',
    title: 'Belt',
    baseFileName: 'belt',
    primaryPath: '/prizes/belt.png',
    iconType: 'belt',
    accentColor: '#F59E0B'
  },
  'chocolate': {
    slug: 'chocolate',
    title: 'Chocolate',
    baseFileName: 'chocolate',
    primaryPath: '/prizes/chocolate.png',
    iconType: 'chocolate',
    accentColor: '#A855F7'
  },
  'teddy': {
    slug: 'teddy',
    title: 'Teddy',
    baseFileName: 'teddy',
    primaryPath: '/prizes/teddy.png',
    iconType: 'teddy',
    accentColor: '#F43F5E'
  }
};

/**
 * Normalizes text to match against prize slugs
 */
function normalizeIdentifier(str: string): string {
  return str
    .toLowerCase()
    .replace(/^prize[-_]/, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Resolves canonical prize slug from any prize reference (id, title, name, or slug)
 */
export function getPrizeSlug(prize?: { id?: string; title?: string; name?: string; slug?: string } | string | null): string | null {
  if (!prize) return null;

  if (typeof prize === 'string') {
    const norm = normalizeIdentifier(prize);
    if (PRIZE_IMAGE_DEFINITIONS[norm]) return norm;
    return matchFuzzySlug(norm);
  }

  // 1. Direct slug property
  if (prize.slug) {
    const norm = normalizeIdentifier(prize.slug);
    if (PRIZE_IMAGE_DEFINITIONS[norm]) return norm;
  }

  // 2. Prize ID matching (e.g. 'prize-airpods' -> 'airpods')
  if (prize.id) {
    const normId = normalizeIdentifier(prize.id);
    if (PRIZE_IMAGE_DEFINITIONS[normId]) return normId;
    const match = matchFuzzySlug(normId);
    if (match) return match;
  }

  // 3. Name or Title matching (e.g. "AirPods" -> 'airpods')
  const label = prize.title || prize.name;
  if (label) {
    const normLabel = normalizeIdentifier(label);
    if (PRIZE_IMAGE_DEFINITIONS[normLabel]) return normLabel;
    const match = matchFuzzySlug(normLabel);
    if (match) return match;
  }

  return null;
}

/**
 * Fuzzy matching helper to handle slight naming variations
 */
function matchFuzzySlug(norm: string): string | null {
  if (norm.includes('ladies') && norm.includes('watch')) return 'ladies-analog-watch';
  if (norm.includes('gent') && norm.includes('watch')) return 'gents-analog-watch';
  if (norm.includes('airpod')) return 'airpods';
  if (norm.includes('neckband')) return 'neckband';
  if (norm.includes('men') && norm.includes('wallet')) return 'mens-wallet';
  if (norm.includes('lad') && norm.includes('wallet')) return 'ladies-wallet';
  if (norm.includes('perfume') || norm.includes('fragrance')) return 'perfume';
  if (norm.includes('belt')) return 'belt';
  if (norm.includes('chocolate')) return 'chocolate';
  if (norm.includes('teddy')) return 'teddy';
  return null;
}

/**
 * Returns prioritized array of image candidate URLs for a given prize.
 * The UI attempts them in order, ensuring PNGs uploaded/dropped by the user take priority,
 * followed by WebP, JPG, and local SVG, before falling back to placeholder.
 */
export function getPrizeImageCandidates(
  prize?: { id?: string; title?: string; name?: string; image?: string | null; imageUrl?: string | null } | null
): string[] {
  const candidates: string[] = [];

  // Priority: Custom uploaded photo (Firebase Storage URL or Data URL)
  const customUrl = prize?.imageUrl || prize?.image;
  if (customUrl && typeof customUrl === 'string' && customUrl.trim()) {
    const cleanUrl = customUrl.trim();
    if (cleanUrl !== '/akm-logo.png' && !cleanUrl.endsWith('/akm-logo.png')) {
      candidates.push(cleanUrl);
    }
  }

  return candidates;
}

/**
 * Returns primary image URL for a prize, or empty string if not uploaded yet.
 */
export function getPrizeImageUrl(
  prize?: { id?: string; title?: string; name?: string; image?: string | null; imageUrl?: string | null } | null
): string {
  const candidates = getPrizeImageCandidates(prize);
  return candidates.length > 0 ? candidates[0] : '';
}

/**
 * Retrieves the full metadata definition for a prize
 */
export function getPrizeDefinition(
  prize?: { id?: string; title?: string; name?: string } | string | null
): PrizeImageDefinition | null {
  const slug = getPrizeSlug(prize);
  if (slug && PRIZE_IMAGE_DEFINITIONS[slug]) {
    return PRIZE_IMAGE_DEFINITIONS[slug];
  }
  return null;
}
