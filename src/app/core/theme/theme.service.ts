import { MediaMatcher } from '@angular/cdk/layout';
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
  TemperatureCache,
  TonalPalette,
} from '@material/material-color-utilities';
import { FUSE_THEME_CONFIG, ThemeConfig } from './theme.provider';

type DynamicSchemes = {
  light: DynamicScheme;
  dark: DynamicScheme;
};

type Theme = {
  sysVariables: Record<string, string>;
} & ThemeConfig;

export type Scheme = 'dark' | 'light' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Injections
  private document = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private mediaMatcher = inject(MediaMatcher);
  private themeConfig = inject(FUSE_THEME_CONFIG);

  // Fields
  private prefersDarkMode = signal<boolean>(
    this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)').matches
  );
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
    // Generate themes using the provided theme configuration
    const themes = this.generateThemes(this.themeConfig);

    // Inject the themes to the DOM
    this.injectThemesToDOM(themes);

    // Add a media watcher for dark mode
    this.mediaMatcher
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        this.prefersDarkMode.set(e.matches);
      });
  });

  private schemeChangeEffect = effect(() => {
    if (!this.isBrowser) {
      return;
    }

    const scheme = this.scheme();
    const prefersDarkMode = this.prefersDarkMode();
    const htmlEl = this.document.documentElement;

    // Sync the scheme with the local storage
    localStorage.setItem('scheme', this.scheme());

    // Figure out if the scheme is 'dark'
    const isDark =
      scheme === 'dark' || (scheme === 'system' && prefersDarkMode);
    htmlEl.classList.toggle('dark', isDark);
    htmlEl.classList.toggle('light', !isDark);
  });

  private themeChangeEffect = effect(() => {
    if (!this.isBrowser) {
      return;
    }

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
   * Generates themes using the provided theme configuration
   */
  private generateThemes(themes: ThemeConfig[]): Theme[] {
    return themes.map((theme) => {
      // Generate M3 dynamic schemes
      const dynamicSchemes = this.generateDynamicSchemes(
        theme.primary,
        theme.secondary ?? null,
        theme.tertiary ?? null,
        theme.neutral ?? null
      );

      // Generate system variables
      const sysVariables = {
        // Background
        // '--mat-sys-background': `light-dark(${hexFromArgb(dynamicSchemes.light.background)}, ${hexFromArgb(dynamicSchemes.dark.background)})`,
        // '--mat-sys-on-background': `light-dark(${hexFromArgb(dynamicSchemes.light.onBackground)}, ${hexFromArgb(dynamicSchemes.dark.onBackground)})`,
        // Surface
        // '--mat-sys-surface': `light-dark(${hexFromArgb(dynamicSchemes.light.surface)}, ${hexFromArgb(dynamicSchemes.dark.surface)})`,
        // '--mat-sys-surface-dim': `light-dark(${hexFromArgb(dynamicSchemes.light.surfaceDim)}, ${hexFromArgb(dynamicSchemes.dark.surfaceDim)})`,
        // '--mat-sys-surface-bright': `light-dark(${hexFromArgb(dynamicSchemes.light.surfaceBright)}, ${hexFromArgb(dynamicSchemes.dark.surfaceBright)})`,
        // '--mat-sys-surface-tint': `light-dark(${hexFromArgb(dynamicSchemes.light.surfaceTint)}, ${hexFromArgb(dynamicSchemes.dark.surfaceTint)})`,
        // '--mat-sys-surface-variant': `light-dark(${hexFromArgb(dynamicSchemes.light.surfaceVariant)}, ${hexFromArgb(dynamicSchemes.dark.surfaceVariant)})`,
        // '--mat-sys-surface-container-lowest': `light-dark(${hexFromArgb(dynamicSchemes.light.surfaceContainerLowest)}, ${hexFromArgb(dynamicSchemes.dark.surfaceContainerLowest)})`,
        // '--mat-sys-surface-container-low': `light-dark(${hexFromArgb(dynamicSchemes.light.surfaceContainerLow)}, ${hexFromArgb(dynamicSchemes.dark.surfaceContainerLow)})`,
        // '--mat-sys-surface-container': `light-dark(${hexFromArgb(dynamicSchemes.light.surfaceContainer)}, ${hexFromArgb(dynamicSchemes.dark.surfaceContainer)})`,
        // '--mat-sys-surface-container-high': `light-dark(${hexFromArgb(dynamicSchemes.light.surfaceContainerHigh)}, ${hexFromArgb(dynamicSchemes.dark.surfaceContainerHigh)})`,
        // '--mat-sys-surface-container-highest': `light-dark(${hexFromArgb(dynamicSchemes.light.surfaceContainerHighest)}, ${hexFromArgb(dynamicSchemes.dark.surfaceContainerHighest)})`,
        // '--mat-sys-on-surface': `light-dark(${hexFromArgb(dynamicSchemes.light.onSurface)}, ${hexFromArgb(dynamicSchemes.dark.onSurface)})`,
        // '--mat-sys-on-surface-variant': `light-dark(${hexFromArgb(dynamicSchemes.light.onSurfaceVariant)}, ${hexFromArgb(dynamicSchemes.dark.onSurfaceVariant)})`,
        // Primary
        // '--mat-sys-primary': `light-dark(${hexFromArgb(dynamicSchemes.light.primary)}, ${hexFromArgb(dynamicSchemes.dark.primary)})`,
        // '--mat-sys-primary-container': `light-dark(${hexFromArgb(dynamicSchemes.light.primaryContainer)}, ${hexFromArgb(dynamicSchemes.dark.primaryContainer)})`,
        // '--mat-sys-primary-fixed': `light-dark(${hexFromArgb(dynamicSchemes.light.primaryFixed)}, ${hexFromArgb(dynamicSchemes.dark.primaryFixed)})`,
        // '--mat-sys-primary-fixed-dim': `light-dark(${hexFromArgb(dynamicSchemes.light.primaryFixedDim)}, ${hexFromArgb(dynamicSchemes.dark.primaryFixedDim)})`,
        // '--mat-sys-on-primary': `light-dark(${hexFromArgb(dynamicSchemes.light.onPrimary)}, ${hexFromArgb(dynamicSchemes.dark.onPrimary)})`,
        // '--mat-sys-on-primary-container': `light-dark(${hexFromArgb(dynamicSchemes.light.onPrimaryContainer)}, ${hexFromArgb(dynamicSchemes.dark.onPrimaryContainer)})`,
        // '--mat-sys-on-primary-fixed': `light-dark(${hexFromArgb(dynamicSchemes.light.onPrimaryFixed)}, ${hexFromArgb(dynamicSchemes.dark.onPrimaryFixed)})`,
        // '--mat-sys-on-primary-fixed-variant': `light-dark(${hexFromArgb(dynamicSchemes.light.onPrimaryFixedVariant)}, ${hexFromArgb(dynamicSchemes.dark.onPrimaryFixedVariant)})`,
        // Secondary
        // '--mat-sys-secondary': `light-dark(${hexFromArgb(dynamicSchemes.light.secondary)}, ${hexFromArgb(dynamicSchemes.dark.secondary)})`,
        // '--mat-sys-secondary-container': `light-dark(${hexFromArgb(dynamicSchemes.light.secondaryContainer)}, ${hexFromArgb(dynamicSchemes.dark.secondaryContainer)})`,
        // '--mat-sys-secondary-fixed': `light-dark(${hexFromArgb(dynamicSchemes.light.secondaryFixed)}, ${hexFromArgb(dynamicSchemes.dark.secondaryFixed)})`,
        // '--mat-sys-secondary-fixed-dim': `light-dark(${hexFromArgb(dynamicSchemes.light.secondaryFixedDim)}, ${hexFromArgb(dynamicSchemes.dark.secondaryFixedDim)})`,
        // '--mat-sys-on-secondary': `light-dark(${hexFromArgb(dynamicSchemes.light.onSecondary)}, ${hexFromArgb(dynamicSchemes.dark.onSecondary)})`,
        // '--mat-sys-on-secondary-container': `light-dark(${hexFromArgb(dynamicSchemes.light.onSecondaryContainer)}, ${hexFromArgb(dynamicSchemes.dark.onSecondaryContainer)})`,
        // '--mat-sys-on-secondary-fixed': `light-dark(${hexFromArgb(dynamicSchemes.light.onSecondaryFixed)}, ${hexFromArgb(dynamicSchemes.dark.onSecondaryFixed)})`,
        // '--mat-sys-on-secondary-fixed-variant': `light-dark(${hexFromArgb(dynamicSchemes.light.onSecondaryFixedVariant)}, ${hexFromArgb(dynamicSchemes.dark.onSecondaryFixedVariant)})`,
        // Tertiary
        // '--mat-sys-tertiary': `light-dark(${hexFromArgb(dynamicSchemes.light.tertiary)}, ${hexFromArgb(dynamicSchemes.dark.tertiary)})`,
        // '--mat-sys-tertiary-container': `light-dark(${hexFromArgb(dynamicSchemes.light.tertiaryContainer)}, ${hexFromArgb(dynamicSchemes.dark.tertiaryContainer)})`,
        // '--mat-sys-tertiary-fixed': `light-dark(${hexFromArgb(dynamicSchemes.light.tertiaryFixed)}, ${hexFromArgb(dynamicSchemes.dark.tertiaryFixed)})`,
        // '--mat-sys-tertiary-fixed-dim': `light-dark(${hexFromArgb(dynamicSchemes.light.tertiaryFixedDim)}, ${hexFromArgb(dynamicSchemes.dark.tertiaryFixedDim)})`,
        // '--mat-sys-on-tertiary': `light-dark(${hexFromArgb(dynamicSchemes.light.onTertiary)}, ${hexFromArgb(dynamicSchemes.dark.onTertiary)})`,
        // '--mat-sys-on-tertiary-container': `light-dark(${hexFromArgb(dynamicSchemes.light.onTertiaryContainer)}, ${hexFromArgb(dynamicSchemes.dark.onTertiaryContainer)})`,
        // '--mat-sys-on-tertiary-fixed': `light-dark(${hexFromArgb(dynamicSchemes.light.onTertiaryFixed)}, ${hexFromArgb(dynamicSchemes.dark.onTertiaryFixed)})`,
        // '--mat-sys-on-tertiary-fixed-variant': `light-dark(${hexFromArgb(dynamicSchemes.light.onTertiaryFixedVariant)}, ${hexFromArgb(dynamicSchemes.dark.onTertiaryFixedVariant)})`,
        // Error
        // '--mat-sys-error': `light-dark(${hexFromArgb(dynamicSchemes.light.error)}, ${hexFromArgb(dynamicSchemes.dark.error)})`,
        // '--mat-sys-error-container': `light-dark(${hexFromArgb(dynamicSchemes.light.errorContainer)}, ${hexFromArgb(dynamicSchemes.dark.errorContainer)})`,
        // '--mat-sys-on-error': `light-dark(${hexFromArgb(dynamicSchemes.light.onError)}, ${hexFromArgb(dynamicSchemes.dark.onError)})`,
        // '--mat-sys-on-error-container': `light-dark(${hexFromArgb(dynamicSchemes.light.onErrorContainer)}, ${hexFromArgb(dynamicSchemes.dark.onErrorContainer)})`,
        // Others
        // '--mat-sys-outline': `light-dark(${hexFromArgb(dynamicSchemes.light.outline)}, ${hexFromArgb(dynamicSchemes.dark.outline)})`,
        // '--mat-sys-outline-variant': `light-dark(${hexFromArgb(dynamicSchemes.light.outlineVariant)}, ${hexFromArgb(dynamicSchemes.dark.outlineVariant)})`,
        // '--mat-sys-scrim': `light-dark(${hexFromArgb(dynamicSchemes.light.scrim)}, ${hexFromArgb(dynamicSchemes.dark.scrim)})`,
        // '--mat-sys-shadow': `light-dark(${hexFromArgb(dynamicSchemes.light.shadow)}, ${hexFromArgb(dynamicSchemes.dark.shadow)})`,
        // Inverse
        // '--mat-sys-inverse-primary': `light-dark(${hexFromArgb(dynamicSchemes.light.inversePrimary)}, ${hexFromArgb(dynamicSchemes.dark.inversePrimary)})`,
        // '--mat-sys-inverse-surface': `light-dark(${hexFromArgb(dynamicSchemes.light.inverseSurface)}, ${hexFromArgb(dynamicSchemes.dark.inverseSurface)})`,
        // '--mat-sys-inverse-on-surface': `light-dark(${hexFromArgb(dynamicSchemes.light.inverseOnSurface)}, ${hexFromArgb(dynamicSchemes.dark.inverseOnSurface)})`,
        // Angular Material fixed color extensions
        // '--mat-sys-neutral-variant20': `${hexFromArgb(dynamicSchemes.light.neutralVariantPalette.tone(20))}`,
        // '--mat-sys-neutral10': `${hexFromArgb(dynamicSchemes.light.neutralPalette.tone(10))}`,
        // Angular Material shadow extensions
        // '--mat-sys-level0': `0px 0px 0px 0px var(--mat-sys-shadow),0px 0px 0px 0px var(--mat-sys-shadow),0px 0px 0px 0px var(--mat-sys-shadow)`,
        // '--mat-sys-level1': `0px 2px 1px -1px var(--mat-sys-shadow),0px 1px 1px 0px var(--mat-sys-shadow),0px 1px 3px 0px var(--mat-sys-shadow)`,
        // '--mat-sys-level2': `0px 3px 3px -2px var(--mat-sys-shadow),0px 3px 4px 0px var(--mat-sys-shadow),0px 1px 8px 0px var(--mat-sys-shadow)`,
        // '--mat-sys-level3': `0px 3px 5px -1px var(--mat-sys-shadow),0px 6px 10px 0px var(--mat-sys-shadow),0px 1px 18px 0px var(--mat-sys-shadow)`,
        // '--mat-sys-level4': `0px 5px 5px -3px var(--mat-sys-shadow),0px 8px 10px 1px var(--mat-sys-shadow),0px 3px 14px 2px var(--mat-sys-shadow)`,
        // '--mat-sys-level5': `0px 7px 8px -4px var(--mat-sys-shadow),0px 12px 17px 2px var(--mat-sys-shadow),0px 5px 22px 4px var(--mat-sys-shadow)`,
      };

      return {
        ...theme,
        sysVariables,
      };
    });
  }

  /**
   * Generates Material 3 dynamic schemes based on the provided primary,
   * secondary, tertiary, and neutral colors. If any color is omitted, a default
   * palette is created based on the primary color hue and chroma adjustments.
   */
  private generateDynamicSchemes(
    primaryColor: string,
    secondaryColor?: string,
    tertiaryColor?: string,
    neutralColor?: string
  ): DynamicSchemes {
    // Gets Hct representation of a Hex color
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

    // Primary
    const primaryColorHct = getHctFromHex(primaryColor);
    const primaryPalette = TonalPalette.fromHct(primaryColorHct);

    // Secondary
    let secondaryPalette: TonalPalette;
    if (secondaryColor) {
      secondaryPalette = TonalPalette.fromHct(getHctFromHex(secondaryColor));
    } else {
      secondaryPalette = TonalPalette.fromHueAndChroma(
        primaryColorHct.hue,
        // Math.max(primaryColorHct.chroma - 32.0, primaryColorHct.chroma * 0.5)
        0.0
      );
    }

    // Tertiary
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

    // Neutral
    let neutralPalette: TonalPalette;
    if (neutralColor) {
      neutralPalette = TonalPalette.fromHct(getHctFromHex(neutralColor));
    } else {
      neutralPalette = TonalPalette.fromHueAndChroma(
        primaryColorHct.hue,
        // primaryColorHct.chroma / 8.0
        0.0
      );
    }

    // Neutral variant
    const neutralVariantPalette = TonalPalette.fromHueAndChroma(
      primaryColorHct.hue,
      primaryColorHct.chroma / 8.0 + 4.0
    );

    // Prepare the dynamic scheme configuration
    const dynamicSchemeConfiguration = {
      sourceColorArgb: primaryPalette.keyColor.toInt(),
      primaryPalette: primaryPalette,
      secondaryPalette: secondaryPalette,
      tertiaryPalette: tertiaryPalette,
      neutralPalette: neutralPalette,
      neutralVariantPalette: neutralVariantPalette,
      variant: 6,
      contrastLevel: 0,
    };

    // Create and return dynamic schemes
    return {
      light: new DynamicScheme({
        ...dynamicSchemeConfiguration,
        isDark: false,
      }),
      dark: new DynamicScheme({ ...dynamicSchemeConfiguration, isDark: true }),
    };
  }

  /**
   * Inject themes to DOM as CSS variables. The name of the theme is used
   * to encapsulate them like ".theme-{THEME_NAME}". The default
   * theme palettes are written directly to the ":root".
   */
  private injectThemesToDOM(themes: Theme[]) {
    const styleClassName = 'fuse-theme-variables';

    // Create a style element for each theme and store it inside the
    // injectableStyles overriding previous ones each time
    for (const theme of themes) {
      const style = document.createElement('style');
      style.id = theme.name;
      style.classList.add(styleClassName);

      style.textContent +=
        theme.name === 'default' ? `:root {` : `.theme-${theme.name} {`;
      for (const [name, value] of Object.entries(theme.sysVariables)) {
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
