import { inject, Injectable } from '@angular/core';
import { ChatMockApi } from './apps/chat/api';
import { ContactsMockApi } from './apps/contacts/api';
import { ECommerceInventoryMockApi } from './apps/ecommerce/inventory/api';
import { FileManagerMockApi } from './apps/file-manager/api';
import { HelpCenterMockApi } from './apps/help-center/api';
import { MailboxMockApi } from './apps/mailbox/api';
import { NotesMockApi } from './apps/notes/api';
import { ScrumboardMockApi } from './apps/scrumboard/api';
import { MessagesMockApi } from './common/messages/api';
import { NotificationsMockApi } from './common/notifications/api';
import { ShortcutsMockApi } from './common/shortcuts/api';
import { ActivitiesMockApi } from './pages/activities/api';

@Injectable({ providedIn: 'root' })
export class MockApiService {
  activitiesMockApi = inject(ActivitiesMockApi);
  chatMockApi = inject(ChatMockApi);
  contactsMockApi = inject(ContactsMockApi);
  eCommerceInventoryMockApi = inject(ECommerceInventoryMockApi);
  fileManagerMockApi = inject(FileManagerMockApi);
  helpCenterMockApi = inject(HelpCenterMockApi);
  mailboxMockApi = inject(MailboxMockApi);
  messagesMockApi = inject(MessagesMockApi);
  notesMockApi = inject(NotesMockApi);
  notificationsMockApi = inject(NotificationsMockApi);
  scrumboardMockApi = inject(ScrumboardMockApi);
  shortcutsMockApi = inject(ShortcutsMockApi);
}
