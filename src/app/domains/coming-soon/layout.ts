import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'coming-soon-layout',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export default class ComingSoonLayout {}
