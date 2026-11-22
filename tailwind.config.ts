import type { Config } from "tailwindcss";

// Aliases for design-system/mandiri-edc-monitoring/tokens.json. Keep hex values in sync.
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F4F6F9",
        glass: "rgba(255, 255, 255, 0.92)",
        subtle: "#F8FAFC",
        hover: "#F1F5F9",
        control: "#E2E8F0",
        ink: {
          DEFAULT: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
        },
        cobalt: "#2563EB",
        sky: "#38BDF8",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        panel: "16px",
        card: "12px",
        control: "10px",
      },
    },
  },
  plugins: [],
} satisfies Config;
