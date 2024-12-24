import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  argbFromHex,
  DislikeAnalyzer,
  DynamicScheme,
  Hct,
  hexFromArgb,
  rgbaFromArgb,
  TemperatureCache,
  TonalPalette,
} from '@material/material-color-utilities';
import { FUSE_THEME_CONFIG, ThemeConfig } from './theme.provider';

interface ColorPalettes {
  primary: TonalPalette;
  secondary: TonalPalette;
  tertiary: TonalPalette;
  neutral: TonalPalette;
  neutralVariant: TonalPalette;
  error: TonalPalette;
}

interface ThemeWithPalettes extends ThemeConfig {
  palettes: Record<string, string>;
}

export type Scheme = 'dark' | 'light' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Injections
  private document = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private themeConfig = inject(FUSE_THEME_CONFIG);

  // Fields
  scheme = signal<Scheme>(
    this.isBrowser
      ? ((localStorage.getItem('scheme') as Scheme) ?? 'light')
      : 'light'
  );
  theme = signal<string>(
    this.isBrowser
      ? ((localStorage.getItem('theme') as string) ?? 'default')
      : 'default'
  );

  private injectableStyles: Record<string, HTMLStyleElement> = {};
  private hueTones = [
    0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100,
  ];
  private neutralHueTones = [
    ...this.hueTones,
    ...[4, 6, 12, 17, 22, 24, 87, 92, 94, 96],
  ];

  private afterRenderRef = afterNextRender(() => {
    // Generate palettes and inject them to the DOM
    this.injectPalettesToDOM(this.generatePalettes());
  });

  private schemeChangeEffect = effect(() => {
    const scheme = this.scheme();
    const htmlEl = this.document.documentElement;

    // Sync the scheme with the local storage
    localStorage.setItem('scheme', this.scheme());

    // Set the color scheme to the html element
    htmlEl.style['colorScheme'] = scheme === 'system' ? 'light dark' : scheme;
  });

  private themeChangeEffect = effect(() => {
    const theme = this.theme();
    const htmlEl = this.document.documentElement;

    // Sync the theme with the local storage
    localStorage.setItem('theme', this.theme());

    // Set the theme to the html element
    htmlEl.classList.forEach((className) => {
      if (className.startsWith('theme-')) {
        htmlEl.classList.remove(className);
      }
    });
    htmlEl.classList.add(`theme-${theme}`);
  });

  /**
   * Generates palettes using the provided theme configuration
   */
  generatePalettes(): ThemeWithPalettes[] {
    return this.themeConfig.map((config) => {
      // Generate M3 color palettes and remove the tertiary from the result
      const { tertiary, ...m3Palettes } = this.generateM3ColorPalettes(
        config.primaryColor,
        config.secondaryColor ?? null,
        config.neutralColor ?? null
      );

      // Generate palettes
      const palettes = {};
      for (const [variant, palette] of Object.entries(m3Palettes)) {
        const paletteKey = variant
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();
        const tones =
          paletteKey === 'neutral' ? this.neutralHueTones : this.hueTones;

        for (const tone of tones) {
          // Hex
          palettes['--fuse-color-' + paletteKey + '-' + tone] = hexFromArgb(
            palette.tone(tone)
          );

          // RGB
          const rgba = rgbaFromArgb(palette.tone(tone));
          palettes['--fuse-color-' + paletteKey + '-' + tone + '-rgb'] =
            `${rgba.r} ${rgba.g} ${rgba.b}`;
        }
      }

      return {
        ...config,
        palettes,
      };
    });
  }

  /**
   * Generates Material 3 color palettes based on the provided primary,
   * secondary, tertiary, and neutral colors. If any color is omitted, a default
   * palette is created based on the primary color hue and chroma adjustments.
   */
  private generateM3ColorPalettes(
    primaryColor: string,
    secondaryColor?: string,
    tertiaryColor?: string,
    neutralColor?: string
  ): ColorPalettes {
    /**
     * Gets Hct representation of Hex color
     */
    const getHctFromHex = (color: string): Hct => {
      try {
        return Hct.fromInt(argbFromHex(color));
      } catch (error) {
        throw new Error(
          'Cannot parse the specified color ' +
            color +
            '. Please verify it is a hex color (ex. #ffffff or ffffff).',
          { cause: error }
        );
      }
    };

    const primaryColorHct = getHctFromHex(primaryColor);
    const primaryPalette = TonalPalette.fromHct(primaryColorHct);

    let secondaryPalette: TonalPalette;
    if (secondaryColor) {
      secondaryPalette = TonalPalette.fromHct(getHctFromHex(secondaryColor));
    } else {
      secondaryPalette = TonalPalette.fromHueAndChroma(
        primaryColorHct.hue,
        Math.max(primaryColorHct.chroma - 32.0, primaryColorHct.chroma * 0.5)
      );
    }

    let tertiaryPalette: TonalPalette;
    if (tertiaryColor) {
      tertiaryPalette = TonalPalette.fromHct(getHctFromHex(tertiaryColor));
    } else {
      tertiaryPalette = TonalPalette.fromInt(
        DislikeAnalyzer.fixIfDisliked(
          new TemperatureCache(primaryColorHct).analogous(3, 6)[2]
        ).toInt()
      );
    }

    let neutralPalette: TonalPalette;
    if (neutralColor) {
      neutralPalette = TonalPalette.fromHct(getHctFromHex(neutralColor));
    } else {
      neutralPalette = TonalPalette.fromHueAndChroma(
        primaryColorHct.hue,
        primaryColorHct.chroma / 8.0
      );
    }

    const neutralVariantPalette = TonalPalette.fromHueAndChroma(
      primaryColorHct.hue,
      primaryColorHct.chroma / 8.0 + 4.0
    );

    // Generate error palette
    const { errorPalette } = new DynamicScheme({
      sourceColorArgb: primaryPalette.keyColor.toInt(),
      variant: 6,
      contrastLevel: 0,
      isDark: false,
      primaryPalette: primaryPalette,
      secondaryPalette: secondaryPalette,
      tertiaryPalette: tertiaryPalette,
      neutralPalette: neutralPalette,
      neutralVariantPalette: neutralVariantPalette,
    });

    return {
      primary: primaryPalette,
      secondary: secondaryPalette,
      tertiary: tertiaryPalette,
      neutral: neutralPalette,
      neutralVariant: neutralVariantPalette,
      error: errorPalette,
    };
  }

  /**
   * Inject palettes to DOM as CSS variables. The name of the theme is used
   * to encapsulate the variables like "html.theme-{THEME_NAME}". The default
   * theme palettes are written directly to the "html".
   */
  private injectPalettesToDOM(themeWithPalettes: ThemeWithPalettes[]) {
    const styleClassName = 'fuse-theme-variables';

    // Create a style element for each theme and store it inside the
    // injectableStyles overriding previous ones each time
    for (const theme of themeWithPalettes) {
      const style = document.createElement('style');
      style.id = theme.name;
      style.classList.add(styleClassName);

      style.textContent +=
        theme.name === 'default' ? `html {` : `html.theme-${theme.name} {`;
      for (const [name, value] of Object.entries(theme.palettes)) {
        style.textContent += `${name}: ${value};`;
      }
      style.textContent += `}`;

      this.injectableStyles[theme.name] = style;
    }

    // Get all injected styles from the head
    const styleElements: Record<string, HTMLStyleElement> = Array.from(
      this.document.querySelectorAll(`.${styleClassName}`)
    ).reduce((acc, el) => {
      acc[el.id] = el;
      return acc;
    }, {});

    // Remove the style from the head if it doesn't exist anymore
    for (const [id, styleElement] of Object.entries(styleElements)) {
      if (!this.injectableStyles[id]) {
        this.document.head.removeChild(styleElement);
      }
    }

    // Add or update the rest
    for (const [themeName, style] of Object.entries(this.injectableStyles)) {
      if (styleElements[themeName]) {
        styleElements[themeName].textContent = style.textContent;
      } else {
        this.document.head.appendChild(style);
      }
    }
  }
}
