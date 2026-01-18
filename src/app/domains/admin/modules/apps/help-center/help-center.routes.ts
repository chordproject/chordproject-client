import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { HelpCenterFaqsComponent } from './faqs/faqs.component';
import { HelpCenterGuidesCategoryComponent } from './guides/category/category.component';
import { HelpCenterGuidesGuideComponent } from './guides/guide/guide.component';
import { HelpCenterGuidesComponent } from './guides/guides.component';
import { HelpCenterComponent } from './help-center.component';
import { HelpCenterService } from './help-center.service';
import { HelpCenterSupportComponent } from './support/support.component';

export default [
  {
    path: '',
    component: HelpCenterComponent,
    resolve: {
      faqs: () => inject(HelpCenterService).getFaqsByCategory('most-asked'),
    },
  },
  {
    path: 'faqs',
    component: HelpCenterFaqsComponent,
    resolve: {
      faqs: () => inject(HelpCenterService).getAllFaqs(),
    },
  },
  {
    path: 'guides',
    children: [
      {
        path: '',
        component: HelpCenterGuidesComponent,
        resolve: {
          guides: () => inject(HelpCenterService).getAllGuides(),
        },
      },
      {
        path: ':categorySlug',
        children: [
          {
            path: '',
            component: HelpCenterGuidesCategoryComponent,
            resolve: {
              guides: (
                route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot
              ) =>
                inject(HelpCenterService).getGuidesByCategory(
                  route.paramMap.get('categorySlug')
                ),
            },
          },
          {
            path: ':guideSlug',
            component: HelpCenterGuidesGuideComponent,
            resolve: {
              guides: (
                route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot
              ) =>
                inject(HelpCenterService).getGuide(
                  route.parent.paramMap.get('categorySlug'),
                  route.paramMap.get('guideSlug')
                ),
            },
          },
        ],
      },
    ],
  },
  {
    path: 'support',
    component: HelpCenterSupportComponent,
  },
] as Routes;
