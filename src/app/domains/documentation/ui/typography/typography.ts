import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FuseHighlightComponent } from '@fuse/components/highlight';

@Component({
  selector: 'typography',
  templateUrl: './typography.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [FuseHighlightComponent, RouterLink],
})
export default class Typography {}
