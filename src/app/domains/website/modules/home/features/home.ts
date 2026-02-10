import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'website-home',
  imports: [RouterLink, MatButton],
  template: `
    <div
      class="flex h-full w-full flex-auto flex-col items-center justify-center"
    >
      <div class="">Website home</div>
      <a
        matButton="filled"
        class="mt-4"
        routerLink="/admin"
      >
        Go to app
      </a>
    </div>
  `,
})
export default class WebsiteHome {}
