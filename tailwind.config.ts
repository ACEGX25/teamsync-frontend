import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-brand)",
        "primary-deep": "var(--color-brand-deep)",
        "primary-light": "var(--color-brand-light)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
      },
      fontFamily: {
        display: "var(--font-display)",
        base: "var(--font-base)",
      },
      borderRadius: {
        page: "var(--radius-page)",
        input: "var(--radius-input)",
        btn: "var(--radius-btn)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        btn: "var(--shadow-btn)",
        "btn-hover": "var(--shadow-btn-hover)",
      },
      backgroundColor: {
        primary: "var(--color-brand)",
      },
    },
  },
  plugins: [],
};

export default config;
