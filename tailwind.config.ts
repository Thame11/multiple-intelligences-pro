import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["Tajawal", "Cairo", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#14231f",
        brand: {
          50: "#effaf4",
          100: "#d8f3e4",
          500: "#2f8f5b",
          600: "#237247",
          700: "#1d5b3b",
          900: "#153b2a"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(20,35,31,0.09)",
      }
    },
  },
  plugins: [],
};
export default config;
