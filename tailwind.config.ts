import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'sans-serif'],
      },
      colors: {
        background: '#000000',
        foreground: '#B7AB98',
        accent: '#EB5939',
        muted: '#404040',
        hairline: '#1A1A1A',
        surface: {
          DEFAULT: '#131313',
          dim: '#131313',
          bright: '#3a3939',
          container: '#201f1f',
          variant: '#353534',
        }
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        'section-gap': '160px',
        'element-gap': '24px',
        'gutter': '32px',
      },
    },
  },
  plugins: [],
};

export default config;
