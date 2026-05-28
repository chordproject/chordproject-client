import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'maintenance-layout',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export default class MaintenanceLayout {}
