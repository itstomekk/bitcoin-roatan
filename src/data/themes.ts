// Centralized theme colors - change here to update everywhere
export const themeColors = {
  why: {
    name: 'teal',
    main: '172 58% 39%',      // teal-ocean
    light: '172 45% 55%',     // teal-light
    bgTint: '172 45% 95%',    // very light teal
  },
  use: {
    name: 'yellow',
    main: '43 89% 63%',       // sun-yellow
    light: '43 85% 70%',      // sun-yellow-light
    bgTint: '43 89% 95%',     // very light yellow
  },
  whatsup: {
    name: 'navy',
    main: '213 55% 23%',      // deep-navy
    light: '213 45% 35%',     // navy-light
    bgTint: '213 55% 95%',    // very light navy
  },
} as const;

export type ThemeKey = keyof typeof themeColors;
