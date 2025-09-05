const { themeConfig } = require('./src/config/theme.ts');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: themeConfig.colors.primary,
        gray: themeConfig.colors.gray,
        accent: themeConfig.colors.primary[500], // Main accent color
      },
      spacing: themeConfig.spacing,
      borderRadius: themeConfig.borderRadius,
      boxShadow: themeConfig.shadows,
      screens: themeConfig.breakpoints,
    },
  },
  plugins: [],
};
