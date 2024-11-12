import { Routes } from '@angular/router';
import { LanguagesComponent } from './common/languages/languages.component';
import { MessagesComponent } from './common/messages/messages.component';
import { NotificationsComponent } from './common/notifications/notifications.component';
import { OverviewComponent } from './common/overview/overview.component';
import { QuickChatComponent } from './common/quick-chat/quick-chat.component';
import { SearchComponent } from './common/search/search.component';
import { ShortcutsComponent } from './common/shortcuts/shortcuts.component';
import { UserComponent } from './common/user/user.component';
import { OtherComponentsComponent } from './other-components.component';
import { ApexChartsComponent } from './third-party/apex-charts/apex-charts.component';
import { QuillEditorComponent } from './third-party/quill-editor/quill-editor.component';

export default [
    {
        path: '',
        component: OtherComponentsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'common/overview',
            },
            {
                path: 'common',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'overview',
                    },
                    {
                        path: 'overview',
                        component: OverviewComponent,
                    },
                    {
                        path: 'languages',
                        component: LanguagesComponent,
                    },
                    {
                        path: 'messages',
                        component: MessagesComponent,
                    },
                    {
                        path: 'notifications',
                        component: NotificationsComponent,
                    },
                    {
                        path: 'search',
                        component: SearchComponent,
                    },
                    {
                        path: 'quick-chat',
                        component: QuickChatComponent,
                    },
                    {
                        path: 'shortcuts',
                        component: ShortcutsComponent,
                    },
                    {
                        path: 'user',
                        component: UserComponent,
                    },
                ],
            },
            {
                path: 'third-party',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'apex-charts',
                    },
                    {
                        path: 'apex-charts',
                        component: ApexChartsComponent,
                    },
                    {
                        path: 'quill-editor',
                        component: QuillEditorComponent,
                    },
                ],
            },
        ],
    },
] as Routes;
