export const THEME = {
  colors: {
    // Deep Dark Theme Backgrounds
    background: '#0B0D12',
    backgroundSecondary: '#11141C',
    surface: '#161A24',
    surfaceElevated: '#1D2230',
    surfaceHighlight: '#252C3D',

    // User-created custom workout plan subtle background difference
    surfaceCustom: '#1E2536',
    surfaceCustomElevated: '#252F44',
    borderCustom: '#2E3B54',

    // Primary Brand Red
    primary: '#E5173F',
    primaryDark: '#B80E30',
    primaryMuted: 'rgba(229, 23, 63, 0.16)',
    primaryGlow: 'rgba(229, 23, 63, 0.32)',

    // Secondary & Accent Spectrum (Yellow, Green, Blue, Orange)
    yellow: '#FFCC00',
    yellowMuted: 'rgba(255, 204, 0, 0.16)',
    green: '#00A859',
    greenMuted: 'rgba(0, 168, 89, 0.16)',
    blue: '#0070F3',
    blueMuted: 'rgba(0, 112, 243, 0.16)',
    streak: '#FF6B00',
    streakMuted: 'rgba(255, 107, 0, 0.16)',
    purple: '#9B51E0',
    purpleMuted: 'rgba(155, 81, 224, 0.16)',
    cyan: '#00C2CB',
    cyanMuted: 'rgba(0, 194, 203, 0.16)',
    red: '#E5173F',
    redMuted: 'rgba(229, 23, 63, 0.16)',

    // Texts
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#FFFFFF',

    // Borders & Lines
    border: '#23293A',
    borderSubtle: '#181E2B',
    borderActive: '#E5173F',
  },
  typography: {
    titleLarge: {
      fontSize: 26,
      fontWeight: '800' as const,
      letterSpacing: -0.5,
    },
    titleMedium: {
      fontSize: 20,
      fontWeight: '700' as const,
      letterSpacing: -0.3,
    },
    titleSmall: {
      fontSize: 16,
      fontWeight: '700' as const,
    },
    body: {
      fontSize: 14,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 12,
      fontWeight: '500' as const,
    },
    badge: {
      fontSize: 11,
      fontWeight: '700' as const,
      letterSpacing: 0.5,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 22,
    full: 9999,
  },
};
