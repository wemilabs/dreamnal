/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}",
];
export const presets = [require("nativewind/preset")];
export const theme = {
  extend: {
    colors: {
      app_theme: "#faf5ff",
    },
  },
};
export const plugins = [];
