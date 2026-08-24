import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  host: {
    // Ensure root component fills the entire viewport
    class: 'flex min-h-full w-full flex-auto flex-col',
    '[style.--brand-logo-light]': 'brandLogoLight',
    '[style.--brand-logo-dark]': 'brandLogoDark',
  },
  template: `<router-outlet />`,
})
export class App {
  protected readonly brandLogoLight = `url('/${environment.brand}/logo/logo-text-light.svg')`;
  protected readonly brandLogoDark = `url('/${environment.brand}/logo/logo-text-dark.svg')`;

  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    const brandName = environment.brand === 'hj' ? 'HomenaJesus' : 'ChordProject';
    this.title.setTitle(brandName);
    this.meta.updateTag({
      name: 'description',
      content:
        environment.brand === 'hj'
          ? 'Cancionero digital para ministerios de música de la Iglesia.'
          : 'Tu cancionero digital para escribir, organizar y tocar canciones con acordes.',
    });
    const favicon = this.document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) {
      favicon.href = `/${environment.brand}/logo/logo.ico`;
    }
  }
}
