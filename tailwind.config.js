/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#F7F3EE',
        surface: '#FFFFFF',
        'surface-2': '#F2EDE6',
        border: '#C8BAA8',
        wine: '#7A1515',
        'wine-hover': '#991B1B',
        gold: '#A87C2A',
        'gold-light': '#C9A84C',
        text: '#1C1410',
        subtext: '#7A6E65',
        'subtext-light': '#9E9189',
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'System'],
        'sans-medium': ['Inter_500Medium', 'System'],
        'sans-semibold': ['Inter_600SemiBold', 'System'],
        display: ['CormorantGaramond_600SemiBold', 'serif'],
        'display-italic': ['CormorantGaramond_600SemiBold_Italic', 'serif'],
        'display-bold': ['CormorantGaramond_700Bold', 'serif'],
      },
    },
  },
  plugins: [],
};
