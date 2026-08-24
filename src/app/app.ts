import { Component } from '@angular/core';
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
}
