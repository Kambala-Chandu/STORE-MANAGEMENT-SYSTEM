/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens -> CSS variables (see src/index.css)
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        elevated: "rgb(var(--color-elevated) / <alpha-value>)",
        sidebar: "rgb(var(--color-sidebar) / <alpha-value>)",
        navbar: "rgb(var(--color-navbar) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)",
        hover: "rgb(var(--color-hover) / <alpha-value>)",
        "table-header": "rgb(var(--color-table-header) / <alpha-value>)",
        "table-row": "rgb(var(--color-table-row) / <alpha-value>)",
        "input-bg": "rgb(var(--color-input-bg) / <alpha-value>)",
        "modal-bg": "rgb(var(--color-modal-bg) / <alpha-value>)", 
        overlay: "rgb(var(--color-overlay) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        "border-strong": "rgb(var(--color-border-strong) / <alpha-value>)",
        content: {
          DEFAULT: "rgb(var(--color-content) / <alpha-value>)",
          muted: "rgb(var(--color-content-muted) / <alpha-value>)",
          subtle: "rgb(var(--color-content-subtle) / <alpha-value>)",
          inverse: "rgb(var(--color-content-inverse) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          hover: "rgb(var(--color-primary-hover) / <alpha-value>)",
          soft: "rgb(var(--color-primary-soft) / <alpha-value>)",
          fg: "rgb(var(--color-primary-fg) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          hover: "rgb(var(--color-secondary-hover) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          soft: "rgb(var(--color-success-soft) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
          soft: "rgb(var(--color-warning-soft) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--color-danger) / <alpha-value>)",
          soft: "rgb(var(--color-danger-soft) / <alpha-value>)",
        },
        info: {
          DEFAULT: "rgb(var(--color-info) / <alpha-value>)",
          soft: "rgb(var(--color-info-soft) / <alpha-value>)",
        },
        muted: "rgb(var(--color-muted) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Text", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        // Enterprise type scale — nothing below 12px
        caption: ["0.75rem", { lineHeight: "1.125rem", letterSpacing: "0.01em" }],
        body: ["0.875rem", { lineHeight: "1.375rem" }],
        "body-lg": ["1rem", { lineHeight: "1.5rem" }],
        title: ["1.125rem", { lineHeight: "1.625rem", letterSpacing: "-0.01em" }],
        "title-lg": ["1.375rem", { lineHeight: "1.875rem", letterSpacing: "-0.015em" }],
        display: ["1.75rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }],
        "display-lg": ["2.25rem", { lineHeight: "2.75rem", letterSpacing: "-0.025em" }],
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        glow: "var(--shadow-glow)",
      },
      spacing: {
        gutter: "var(--space-gutter)",
        section: "var(--space-section)",
        sidebar: "16rem",
        "sidebar-collapsed": "4.5rem",
        navbar: "3.5rem",
      },
      transitionTimingFunction: {
        enterprise: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "180ms",
        slow: "280ms",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "float-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in-up": "fade-in-up 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        "scale-in": "scale-in 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in-left": "slide-in-left 260ms cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in-right": "slide-in-right 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        shimmer: "shimmer 1.6s infinite",
        "float-subtle": "float-subtle 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
