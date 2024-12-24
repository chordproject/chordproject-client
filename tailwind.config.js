const path = require('path');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const generatePalette = require(
  path.resolve(__dirname, 'src/@fuse/tailwind/utils/generate-palette')
);

/**
 * Custom palettes
 *
 * Uses the generatePalette helper method to generate
 * Tailwind-like color palettes automatically
 */
const customPalettes = {
  brand: generatePalette('#2196F3'),
};

/**
 * Themes
 */
const themes = {
  // Default theme is required for theming system to work correctly!
  // default: {
  //     primary: {
  //         ...colors.indigo,
  //         DEFAULT: colors.indigo[600],
  //     },
  //     accent: {
  //         ...colors.slate,
  //         DEFAULT: colors.slate[800],
  //     },
  //     warn: {
  //         ...colors.red,
  //         DEFAULT: colors.red[600],
  //     },
  //     'on-warn': {
  //         500: colors.red['50'],
  //     },
  // },
  // Rest of the themes will use the 'default' as the base
  // theme and will extend it with their given configuration.
  brand: {
    primary: customPalettes.brand,
  },
  teal: {
    primary: {
      ...colors.teal,
      DEFAULT: colors.teal[600],
    },
  },
  rose: {
    primary: colors.rose,
  },
  purple: {
    primary: {
      ...colors.purple,
      DEFAULT: colors.purple[600],
    },
  },
  amber: {
    primary: colors.amber,
  },
};

/**
 * Tailwind configuration
 */
const config = {
  darkMode: 'class',
  content: ['./src/**/*.{html,scss,ts}'],
  theme: {
    fontSize: {
      xs: '0.625rem',
      sm: '0.75rem',
      base: '0.8125rem',
      lg: '0.875rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '2rem',
      '5xl': '2.25rem',
      '6xl': '2.5rem',
      '7xl': '3rem',
      '8xl': '4rem',
      '9xl': '6rem',
      '10xl': '8rem',
    },
    screens: {
      sm: '600px',
      md: '960px',
      lg: '1280px',
      xl: '1440px',
    },
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      borderColor: {
        DEFAULT: 'color-mix()',
      },
      colors: {
        neutral: colors.slate,

        primary: {
          ...colors.indigo,
          DEFAULT: colors.indigo[600],
        },
        // accent: {
        //     ...colors.slate,
        //     DEFAULT: colors.slate[800],
        // },
        error: {
          ...colors.red,
          DEFAULT: colors.red[600],
        },
        'on-primary': {
          DEFAULT: colors.white,
        },
        'on-error': {
          DEFAULT: colors.white,
        },

        // Fuse colors
        'fuse-primary': {
          0: 'rgb(var(--fuse-color-primary-0-rgb))',
          10: 'rgb(var(--fuse-color-primary-10-rgb))',
          20: 'rgb(var(--fuse-color-primary-20-rgb))',
          25: 'rgb(var(--fuse-color-primary-25-rgb))',
          30: 'rgb(var(--fuse-color-primary-30-rgb))',
          35: 'rgb(var(--fuse-color-primary-35-rgb))',
          40: 'rgb(var(--fuse-color-primary-40-rgb))',
          50: 'rgb(var(--fuse-color-primary-50-rgb))',
          60: 'rgb(var(--fuse-color-primary-60-rgb))',
          70: 'rgb(var(--fuse-color-primary-70-rgb))',
          80: 'rgb(var(--fuse-color-primary-80-rgb))',
          90: 'rgb(var(--fuse-color-primary-90-rgb))',
          95: 'rgb(var(--fuse-color-primary-95-rgb))',
          98: 'rgb(var(--fuse-color-primary-98-rgb))',
          99: 'rgb(var(--fuse-color-primary-99-rgb))',
          100: 'rgb(var(--fuse-color-primary-100-rgb))',
        },

        'fuse-secondary': {
          0: 'rgb(var(--fuse-color-secondary-0-rgb))',
          10: 'rgb(var(--fuse-color-secondary-10-rgb))',
          20: 'rgb(var(--fuse-color-secondary-20-rgb))',
          25: 'rgb(var(--fuse-color-secondary-25-rgb))',
          30: 'rgb(var(--fuse-color-secondary-30-rgb))',
          35: 'rgb(var(--fuse-color-secondary-35-rgb))',
          40: 'rgb(var(--fuse-color-secondary-40-rgb))',
          50: 'rgb(var(--fuse-color-secondary-50-rgb))',
          60: 'rgb(var(--fuse-color-secondary-60-rgb))',
          70: 'rgb(var(--fuse-color-secondary-70-rgb))',
          80: 'rgb(var(--fuse-color-secondary-80-rgb))',
          90: 'rgb(var(--fuse-color-secondary-90-rgb))',
          95: 'rgb(var(--fuse-color-secondary-95-rgb))',
          98: 'rgb(var(--fuse-color-secondary-98-rgb))',
          99: 'rgb(var(--fuse-color-secondary-99-rgb))',
          100: 'rgb(var(--fuse-color-secondary-100-rgb))',
        },

        'fuse-error': {
          0: 'rgb(var(--fuse-color-error-0-rgb))',
          10: 'rgb(var(--fuse-color-error-10-rgb))',
          20: 'rgb(var(--fuse-color-error-20-rgb))',
          25: 'rgb(var(--fuse-color-error-25-rgb))',
          30: 'rgb(var(--fuse-color-error-30-rgb))',
          35: 'rgb(var(--fuse-color-error-35-rgb))',
          40: 'rgb(var(--fuse-color-error-40-rgb))',
          50: 'rgb(var(--fuse-color-error-50-rgb))',
          60: 'rgb(var(--fuse-color-error-60-rgb))',
          70: 'rgb(var(--fuse-color-error-70-rgb))',
          80: 'rgb(var(--fuse-color-error-80-rgb))',
          90: 'rgb(var(--fuse-color-error-90-rgb))',
          95: 'rgb(var(--fuse-color-error-95-rgb))',
          98: 'rgb(var(--fuse-color-error-98-rgb))',
          99: 'rgb(var(--fuse-color-error-99-rgb))',
          100: 'rgb(var(--fuse-color-error-100-rgb))',
        },

        'fuse-neutral': {
          0: 'rgb(var(--fuse-color-neutral-0-rgb))',
          4: 'rgb(var(--fuse-color-neutral-4-rgb))',
          6: 'rgb(var(--fuse-color-neutral-6-rgb))',
          10: 'rgb(var(--fuse-color-neutral-10-rgb))',
          12: 'rgb(var(--fuse-color-neutral-12-rgb))',
          17: 'rgb(var(--fuse-color-neutral-17-rgb))',
          20: 'rgb(var(--fuse-color-neutral-20-rgb))',
          22: 'rgb(var(--fuse-color-neutral-22-rgb))',
          24: 'rgb(var(--fuse-color-neutral-24-rgb))',
          25: 'rgb(var(--fuse-color-neutral-25-rgb))',
          30: 'rgb(var(--fuse-color-neutral-30-rgb))',
          35: 'rgb(var(--fuse-color-neutral-35-rgb))',
          40: 'rgb(var(--fuse-color-neutral-40-rgb))',
          50: 'rgb(var(--fuse-color-neutral-50-rgb))',
          60: 'rgb(var(--fuse-color-neutral-60-rgb))',
          70: 'rgb(var(--fuse-color-neutral-70-rgb))',
          80: 'rgb(var(--fuse-color-neutral-80-rgb))',
          87: 'rgb(var(--fuse-color-neutral-87-rgb))',
          90: 'rgb(var(--fuse-color-neutral-90-rgb))',
          92: 'rgb(var(--fuse-color-neutral-92-rgb))',
          94: 'rgb(var(--fuse-color-neutral-94-rgb))',
          96: 'rgb(var(--fuse-color-neutral-96-rgb))',
          95: 'rgb(var(--fuse-color-neutral-95-rgb))',
          98: 'rgb(var(--fuse-color-neutral-98-rgb))',
          99: 'rgb(var(--fuse-color-neutral-99-rgb))',
          100: 'rgb(var(--fuse-color-neutral-100-rgb))',
        },

        'fuse-neutral-variant': {
          0: 'rgb(var(--fuse-color-neutral-variant-0-rgb))',
          10: 'rgb(var(--fuse-color-neutral-variant-10-rgb))',
          20: 'rgb(var(--fuse-color-neutral-variant-20-rgb))',
          25: 'rgb(var(--fuse-color-neutral-variant-25-rgb))',
          30: 'rgb(var(--fuse-color-neutral-variant-30-rgb))',
          35: 'rgb(var(--fuse-color-neutral-variant-35-rgb))',
          40: 'rgb(var(--fuse-color-neutral-variant-40-rgb))',
          50: 'rgb(var(--fuse-color-neutral-variant-50-rgb))',
          60: 'rgb(var(--fuse-color-neutral-variant-60-rgb))',
          70: 'rgb(var(--fuse-color-neutral-variant-70-rgb))',
          80: 'rgb(var(--fuse-color-neutral-variant-80-rgb))',
          90: 'rgb(var(--fuse-color-neutral-variant-90-rgb))',
          95: 'rgb(var(--fuse-color-neutral-variant-95-rgb))',
          98: 'rgb(var(--fuse-color-neutral-variant-98-rgb))',
          99: 'rgb(var(--fuse-color-neutral-variant-99-rgb))',
          100: 'rgb(var(--fuse-color-neutral-variant-100-rgb))',
        },

        // Angular Material system colors
        'mat-background': 'var(--mat-sys-background)',
        'mat-error': 'var(--mat-sys-error)',
        'mat-error-container': 'var(--mat-sys-error-container)',
        'mat-inverse-on-surface': 'var(--mat-sys-inverse-on-surface)',
        'mat-inverse-primary': 'var(--mat-sys-inverse-primary)',
        'mat-inverse-surface': 'var(--mat-sys-inverse-surface)',
        'mat-on-background': 'var(--mat-sys-on-background)',
        'mat-on-error': 'var(--mat-sys-on-error)',
        'mat-on-error-container': 'var(--mat-sys-on-error-container)',
        'mat-on-primary': 'var(--mat-sys-on-primary)',
        'mat-on-primary-container': 'var(--mat-sys-on-primary-container)',
        'mat-on-primary-fixed': 'var(--mat-sys-on-primary-fixed)',
        'mat-on-primary-fixed-variant':
          'var(--mat-sys-on-primary-fixed-variant)',
        'mat-on-secondary': 'var(--mat-sys-on-secondary)',
        'mat-on-secondary-container': 'var(--mat-sys-on-secondary-container)',
        'mat-on-secondary-fixed': 'var(--mat-sys-on-secondary-fixed)',
        'mat-on-secondary-fixed-variant':
          'var(--mat-sys-on-secondary-fixed-variant)',
        'mat-on-surface': 'var(--mat-sys-on-surface)',
        'mat-on-surface-variant': 'var(--mat-sys-on-surface-variant)',
        'mat-on-tertiary': 'var(--mat-sys-on-tertiary)',
        'mat-on-tertiary-container': 'var(--mat-sys-on-tertiary-container)',
        'mat-on-tertiary-fixed': 'var(--mat-sys-on-tertiary-fixed)',
        'mat-on-tertiary-fixed-variant':
          'var(--mat-sys-on-tertiary-fixed-variant)',
        'mat-outline': 'var(--mat-sys-outline)',
        'mat-outline-variant': 'var(--mat-sys-outline-variant)',
        'mat-primary': 'var(--mat-sys-primary)',
        'mat-primary-container': 'var(--mat-sys-primary-container)',
        'mat-primary-fixed': 'var(--mat-sys-primary-fixed)',
        'mat-primary-fixed-dim': 'var(--mat-sys-primary-fixed-dim)',
        'mat-scrim': 'var(--mat-sys-scrim)',
        'mat-secondary': 'var(--mat-sys-secondary)',
        'mat-secondary-container': 'var(--mat-sys-secondary-container)',
        'mat-secondary-fixed': 'var(--mat-sys-secondary-fixed)',
        'mat-secondary-fixed-dim': 'var(--mat-sys-secondary-fixed-dim)',
        'mat-shadow': 'var(--mat-sys-shadow)',
        'mat-surface': 'var(--mat-sys-surface)',
        'mat-surface-bright': 'var(--mat-sys-surface-bright)',
        'mat-surface-container': 'var(--mat-sys-surface-container)',
        'mat-surface-container-high': 'var(--mat-sys-surface-container-high)',
        'mat-surface-container-highest':
          'var(--mat-sys-surface-container-highest)',
        'mat-surface-container-low': 'var(--mat-sys-surface-container-low)',
        'mat-surface-container-lowest':
          'var(--mat-sys-surface-container-lowest)',
        'mat-surface-dim': 'var(--mat-sys-surface-dim)',
        'mat-surface-tint': 'var(--mat-sys-surface-tint)',
        'mat-surface-variant': 'var(--mat-sys-surface-variant)',
        'mat-tertiary': 'var(--mat-sys-tertiary)',
        'mat-tertiary-container': 'var(--mat-sys-tertiary-container)',
        'mat-tertiary-fixed': 'var(--mat-sys-tertiary-fixed)',
        'mat-tertiary-fixed-dim': 'var(--mat-sys-tertiary-fixed-dim)',
      },
      flex: {
        0: '0 0 auto',
      },
      fontFamily: {
        sans: `"InterVariable", ${defaultTheme.fontFamily.sans.join(',')}`,
        mono: `"IBM Plex Mono", ${defaultTheme.fontFamily.mono.join(',')}`,
      },
      opacity: {
        12: '0.12',
        38: '0.38',
        87: '0.87',
      },
      rotate: {
        '-270': '270deg',
        15: '15deg',
        30: '30deg',
        60: '60deg',
        270: '270deg',
      },
      scale: {
        '-1': '-1',
      },
      zIndex: {
        '-1': -1,
        49: 49,
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        99: 99,
        999: 999,
        9999: 9999,
        99999: 99999,
      },
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        50: '12.5rem',
        90: '22.5rem',

        // Bigger values
        100: '25rem',
        120: '30rem',
        128: '32rem',
        140: '35rem',
        160: '40rem',
        180: '45rem',
        192: '48rem',
        200: '50rem',
        240: '60rem',
        256: '64rem',
        280: '70rem',
        320: '80rem',
        360: '90rem',
        400: '100rem',
        480: '120rem',

        // Fractional values
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
      },
      minHeight: ({ theme }) => ({
        ...theme('spacing'),
      }),
      maxHeight: {
        none: 'none',
      },
      minWidth: ({ theme }) => ({
        ...theme('spacing'),
        screen: '100vw',
      }),
      maxWidth: ({ theme }) => ({
        ...theme('spacing'),
        screen: '100vw',
      }),
      transitionDuration: {
        400: '400ms',
      },
      transitionTimingFunction: {
        drawer: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      },

      // @tailwindcss/typography
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: 'var(--fuse-text-default)',
            '[class~="lead"]': {
              color: 'var(--fuse-text-secondary)',
            },
            a: {
              color: 'var(--fuse-primary-500)',
            },
            strong: {
              color: 'var(--fuse-text-default)',
            },
            'ol > li::before': {
              color: 'var(--fuse-text-secondary)',
            },
            'ul > li::before': {
              backgroundColor: 'var(--fuse-text-hint)',
            },
            hr: {
              borderColor: 'var(--fuse-border)',
            },
            blockquote: {
              color: 'var(--fuse-text-default)',
              borderLeftColor: 'var(--fuse-border)',
            },
            h1: {
              color: 'var(--fuse-text-default)',
            },
            h2: {
              color: 'var(--fuse-text-default)',
            },
            h3: {
              color: 'var(--fuse-text-default)',
            },
            h4: {
              color: 'var(--fuse-text-default)',
            },
            'figure figcaption': {
              color: 'var(--fuse-text-secondary)',
            },
            code: {
              color: 'var(--fuse-text-default)',
              fontWeight: '500',
            },
            'a code': {
              color: 'var(--fuse-primary)',
            },
            pre: {
              color: theme('colors.white'),
              backgroundColor: theme('colors.gray.800'),
            },
            thead: {
              color: 'var(--fuse-text-default)',
              borderBottomColor: 'var(--fuse-border)',
            },
            'tbody tr': {
              borderBottomColor: 'var(--fuse-border)',
            },
            'ol[type="A" s]': false,
            'ol[type="a" s]': false,
            'ol[type="I" s]': false,
            'ol[type="i" s]': false,
          },
        },
        sm: {
          css: {
            code: {
              fontSize: '1em',
            },
            pre: {
              fontSize: '1em',
            },
            table: {
              fontSize: '1em',
            },
          },
        },
      }),
    },
  },
  corePlugins: {
    appearance: false,
    container: false,
    float: false,
    clear: false,
    placeholderColor: false,
    placeholderOpacity: false,
    verticalAlign: false,
  },
  plugins: [
    // Fuse - Tailwind plugins
    require(path.resolve(__dirname, 'src/@fuse/tailwind/plugins/utilities')),
    require(path.resolve(__dirname, 'src/@fuse/tailwind/plugins/icon-size')),
    require(path.resolve(__dirname, 'src/@fuse/tailwind/plugins/theming'))({
      themes,
    }),

    // Other third party and/or custom plugins
    require('@tailwindcss/typography')({ modifiers: ['sm', 'lg'] }),
  ],
};

module.exports = config;
