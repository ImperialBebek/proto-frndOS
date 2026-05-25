import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        grey: {
          50: "var(--grey-50)",
          100: "var(--grey-100)",
          200: "var(--grey-200)",
        },
        primary: {
          50: "var(--primary-50)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          950: "var(--primary-950)",
        },
        text: {
          default: "var(--text-default)",
          subtle: "var(--text-subtle)",
          subtlest: "var(--text-subtlest)",
          inverse: "var(--text-inverse)",
        },
        positive: {
          50: "var(--positive-50)",
          600: "var(--positive-600)",
        },
        negative: {
          50: "var(--negative-50)",
          500: "var(--negative-500)",
        },
        warning: {
          50: "var(--warning-50)",
          500: "var(--warning-500)",
          600: "var(--warning-600)",
        },
        emerald: {
          100: "var(--emerald-100)",
          800: "var(--emerald-800)",
        },
        yellow: {
          100: "var(--yellow-100)",
          900: "var(--yellow-900)",
        },
        red: {
          50: "var(--red-50)",
          800: "var(--red-800)",
        },
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "24px",
        rounded: "var(--radius-rounded)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0px 0px 2px var(--grey-100)",
        command: "0px 0px 4px 0px var(--grey-100)",
      },
      backdropBlur: {
        shallow: "16px",
        container: "32px",
      },
    },
  },
  plugins: [],
};

export default config;
