import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'auth-layout',
  imports : [RouterOutlet],
  template: `<router-outlet/>`
})
export default class AuthLayout {}
