// Trackly type ramp — Outfit for titles/numerics, Public Sans for body/UI text

export const fonts = {
  outfitRegular: 'Outfit_400Regular',
  outfitMedium: 'Outfit_500Medium',
  outfitSemiBold: 'Outfit_600SemiBold',
  outfitBold: 'Outfit_700Bold',
  publicSansRegular: 'PublicSans_400Regular',
  publicSansMedium: 'PublicSans_500Medium',
  publicSansSemiBold: 'PublicSans_600SemiBold',
  publicSansBold: 'PublicSans_700Bold',
};

export const type = {
  display: { fontFamily: fonts.outfitBold, fontSize: 32, lineHeight: 38 },
  title: { fontFamily: fonts.outfitBold, fontSize: 24, lineHeight: 30 },
  heading: { fontFamily: fonts.outfitSemiBold, fontSize: 20, lineHeight: 26 },
  subheading: { fontFamily: fonts.outfitSemiBold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fonts.publicSansRegular, fontSize: 15, lineHeight: 21 },
  bodyMedium: { fontFamily: fonts.publicSansMedium, fontSize: 15, lineHeight: 21 },
  bodySmall: { fontFamily: fonts.publicSansRegular, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.publicSansMedium, fontSize: 12, lineHeight: 16 },
  label: { fontFamily: fonts.publicSansSemiBold, fontSize: 11, lineHeight: 14, letterSpacing: 0.6 },
  button: { fontFamily: fonts.publicSansSemiBold, fontSize: 16, lineHeight: 20 },
  numericLarge: { fontFamily: fonts.outfitBold, fontSize: 24, lineHeight: 28 },
};
