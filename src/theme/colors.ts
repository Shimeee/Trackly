// Trackly color tokens — mirrors the Figma "Color" variable collection (Light/Dark modes)

export const lightColors = {
  bgCanvas: '#FFFFFF',
  bgSurface: '#FFFFFF',
  bgSurfaceSecondary: '#F8FAFC',
  textPrimary: '#0F1729',
  textSecondary: '#47546A',
  textTertiary: '#64748B',
  textOnAccent: '#FFFFFF',
  borderDefault: '#E4E8F0',
  borderSubtle: '#EDF0F5',
  accentPrimary: '#4338CA',
  accentSubtleBg: '#EEF1FF',
  statusSuccess: '#158040',
  statusSuccessBg: '#F0FDF4',
  statusWarning: '#B4530A',
  statusWarningBg: '#FFFAEB',
  statusError: '#B91C1C',
  statusErrorBg: '#FEF2F2',
};

export const darkColors = {
  bgCanvas: '#0B0F19',
  bgSurface: '#1E293B',
  bgSurfaceSecondary: '#141B2C',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textOnAccent: '#FFFFFF',
  borderDefault: 'rgba(255,255,255,0.08)',
  borderSubtle: 'rgba(255,255,255,0.06)',
  accentPrimary: '#7C87FA',
  accentSubtleBg: 'rgba(67,56,202,0.28)',
  statusSuccess: '#59D180',
  statusSuccessBg: 'rgba(21,128,64,0.18)',
  statusWarning: '#E29B4D',
  statusWarningBg: 'rgba(180,83,10,0.18)',
  statusError: '#EC6666',
  statusErrorBg: 'rgba(185,28,28,0.18)',
};

export type ColorTokens = typeof lightColors;

// Category brand colors (fixed, same in both themes)
export const categoryColors = {
  entertainment: '#8B3DFF',
  softwareProductivity: '#1DB855',
  mobileInternet: '#EA8317',
  healthFitness: '#DC3D3D',
  other: '#64748B',
};

export const statusBadgeColors = {
  active: { light: '#158040', dark: '#59D180' },
  trial: { light: '#4338CA', dark: '#7C87FA' },
  paused: { light: '#B4530A', dark: '#E29B4D' },
  cancelled: { light: '#64748B', dark: '#94A3B8' },
};
