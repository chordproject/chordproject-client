import { Routes } from '@angular/router';
import { JwtComponent } from './authentication/jwt/jwt';
import { ComponentThemingComponent } from './customization/component-theming/component-theming';
import { MultiLanguageCustomizationComponent } from './customization/multi-language/multi-language';
import { PageLayoutsComponent } from './customization/page-layouts/page-layouts';
import { SplashScreenCustomizationComponent } from './customization/splash-screen/splash-screen';
import { TailwindCSSComponent } from './customization/tailwindcss/tailwindcss';
import { ThemeLayoutsComponent } from './customization/theme-layouts/theme-layouts';
import { ThemingComponent } from './customization/theming/theming';
import { ComponentStructureComponent } from './development/component-structure/component-structure';
import { DeploymentComponent } from './development/deployment/deployment';
import { DirectoryStructureComponent } from './development/directory-structure/directory-structure';
import { StarterKitComponent } from './development/starter-kit/starter-kit';
import { UpdatingComponent } from './development/updating/updating';
import { InstallationComponent } from './getting-started/installation/installation';
import { IntroductionComponent } from './getting-started/introduction/introduction';
import { PrerequisitesComponent } from './getting-started/prerequisites/prerequisites';
import { ServingComponent } from './getting-started/serving/serving';
import { GuidesComponent } from './guides.component';

export default [
    {
        path: '',
        component: GuidesComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'getting-started',
            },
            {
                path: 'getting-started',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'introduction',
                    },
                    {
                        path: 'introduction',
                        component: IntroductionComponent,
                    },
                    {
                        path: 'prerequisites',
                        component: PrerequisitesComponent,
                    },
                    {
                        path: 'installation',
                        component: InstallationComponent,
                    },
                    {
                        path: 'serving',
                        component: ServingComponent,
                    },
                ],
            },
            {
                path: 'development',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'structure',
                    },
                    {
                        path: 'directory-structure',
                        component: DirectoryStructureComponent,
                    },
                    {
                        path: 'component-structure',
                        component: ComponentStructureComponent,
                    },
                    {
                        path: 'starter-kit',
                        component: StarterKitComponent,
                    },
                    {
                        path: 'deployment',
                        component: DeploymentComponent,
                    },
                    {
                        path: 'updating',
                        component: UpdatingComponent,
                    },
                ],
            },
            {
                path: 'customization',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'theme-layouts',
                    },
                    {
                        path: 'theme-layouts',
                        component: ThemeLayoutsComponent,
                    },
                    {
                        path: 'page-layouts',
                        component: PageLayoutsComponent,
                    },
                    {
                        path: 'tailwindcss',
                        component: TailwindCSSComponent,
                    },
                    {
                        path: 'theming',
                        component: ThemingComponent,
                    },
                    {
                        path: 'component-theming',
                        component: ComponentThemingComponent,
                    },
                    {
                        path: 'splash-screen',
                        component: SplashScreenCustomizationComponent,
                    },
                    {
                        path: 'multi-language',
                        component: MultiLanguageCustomizationComponent,
                    },
                ],
            },
            {
                path: 'authentication',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'jwt',
                    },
                    {
                        path: 'jwt',
                        component: JwtComponent,
                    },
                ],
            },
        ],
    },
] as Routes;
