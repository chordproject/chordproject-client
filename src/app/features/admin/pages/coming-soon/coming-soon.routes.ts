import { Routes } from '@angular/router';
import { ComingSoonClassicComponent } from './classic/coming-soon.component';
import { ComingSoonFullscreenReversedComponent } from './fullscreen-reversed/coming-soon.component';
import { ComingSoonFullscreenComponent } from './fullscreen/coming-soon.component';
import { ComingSoonModernReversedComponent } from './modern-reversed/coming-soon.component';
import { ComingSoonModernComponent } from './modern/coming-soon.component';
import { ComingSoonSplitScreenReversedComponent } from './split-screen-reversed/coming-soon.component';
import { ComingSoonSplitScreenComponent } from './split-screen/coming-soon.component';

export default [
  {
    path: 'classic',
    component: ComingSoonClassicComponent,
  },
  {
    path: 'modern',
    component: ComingSoonModernComponent,
  },
  {
    path: 'modern-reversed',
    component: ComingSoonModernReversedComponent,
  },
  {
    path: 'split-screen',
    component: ComingSoonSplitScreenComponent,
  },
  {
    path: 'split-screen-reversed',
    component: ComingSoonSplitScreenReversedComponent,
  },
  {
    path: 'fullscreen',
    component: ComingSoonFullscreenComponent,
  },
  {
    path: 'fullscreen-reversed',
    component: ComingSoonFullscreenReversedComponent,
  },
] as Routes;
