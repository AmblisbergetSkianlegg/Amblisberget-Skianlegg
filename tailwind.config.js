/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
          90: 'var(--color-primary-90)',
          50: 'var(--color-primary-50)',
          30: 'var(--color-primary-30)',
          10: 'var(--color-primary-10)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          90: 'var(--color-secondary-90)',
          50: 'var(--color-secondary-50)',
          30: 'var(--color-secondary-30)',
          10: 'var(--color-secondary-10)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
          90: 'var(--color-accent-90)',
          50: 'var(--color-accent-50)',
          30: 'var(--color-accent-30)',
          10: 'var(--color-accent-10)',
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
          disabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',
          inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',
        },
        bg: {
          base: 'rgb(var(--color-bg-base) / <alpha-value>)',
          elevated: 'rgb(var(--color-bg-elevated) / <alpha-value>)',
          sunken: 'rgb(var(--color-bg-sunken) / <alpha-value>)',
        },
        border: {
          light: 'rgb(var(--color-border-light) / <alpha-value>)',
          medium: 'rgb(var(--color-border-medium) / <alpha-value>)',
          heavy: 'rgb(var(--color-border-heavy) / <alpha-value>)',
        },
      },
      spacing: {
        'header': 'var(--spacing-header)',
        'header-tablet': 'var(--spacing-header-tablet)',
        'header-mobile': 'var(--spacing-header-mobile)',
        'statusBar': 'var(--spacing-statusBar)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
      },
      fontFamily: {
        'sans': ['var(--font-family-primary)'],
      },
      fontSize: {
        'xxs': 'var(--font-size-xxs)',
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'base': 'var(--font-size-base)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
      },
      lineHeight: {
        'tight': 'var(--line-height-tight)',
        'normal': 'var(--line-height-normal)',
        'relaxed': 'var(--line-height-relaxed)',
      },
      transitionDuration: {
        'normal': 'var(--transition-duration-normal)',
        'fast': 'var(--transition-duration-fast)',
      },
      transitionTimingFunction: {
        'DEFAULT': 'var(--transition-timing-function)',
      },
    },
  },
  plugins: [],
}
