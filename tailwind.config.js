/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}",
];
export const presets = [require("nativewind/preset")];
export const theme = {
  extend: {
    colors: {
      primary: "#fff",
      secondary: {
        DEFAULT: "#8b5cf6",
        100: "#e9d5ff",
        200: "#9333ea",
      },

      accent: "#f3f4f6",
      dark: "#1F2937",
      black: {
        DEFAULT: "#000000",
        100: "#8C8E98",
        200: "#666876",
        300: "#191D31",
      },
      danger: "#f75555",
    },
  },
};
export const plugins = [];
