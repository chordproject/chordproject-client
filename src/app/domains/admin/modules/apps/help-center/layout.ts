import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'help-center-layout',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export default class HelpCenterLayout {}
