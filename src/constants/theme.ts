export const COLORS = {
  background: {
    primary: '#05010B',      // Deep Royal Purple
    secondary: '#0F031E',    // Dark Purple
    surface: '#1B0633',      // Elevated Purple Surface
    glass: 'rgba(27, 6, 51, 0.65)'
  },
  accent: {
    goldRoyal: '#FFD700',    // Royal Gold
    goldLight: '#FFF8DC',    // Light Gold
    goldMid: '#FFE169',      // Mid Gold
    goldDark: '#D4AF37',     // Dark Gold
    goldBronze: '#996515'    // Metallic Bronze
  },
  text: {
    primary: '#FFFFFF',      // White
    secondary: '#FFF8DC',    // Light Gold
    muted: 'rgba(255, 248, 220, 0.7)'
  },
  glow: {
    goldSoft: 'rgba(255, 215, 0, 0.25)',
    goldIntense: 'rgba(255, 215, 0, 0.6)'
  }
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    heading: "'Cinzel', 'Cormorant Garamond', Georgia, serif",
    subheading: "'Cormorant Garamond', Georgia, serif",
    body: "'Inter', 'Manrope', system-ui, sans-serif"
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem'     // 48px
  }
} as const;

export const SHADOWS = {
  glass: '0 25px 60px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 248, 220, 0.35)',
  goldGlow: '0 0 30px rgba(255, 215, 0, 0.25)',
  goldGlowLg: '0 0 60px rgba(255, 215, 0, 0.5)'
} as const;

// Animation Structural Constants (Prepared for future phases)
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.2,
    cinematic: 2.8
  },
  easing: {
    cinematic: [0.16, 1, 0.3, 1],
    smooth: [0.4, 0, 0.2, 1]
  }
} as const;
