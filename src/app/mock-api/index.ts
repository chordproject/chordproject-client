import { inject, Injectable } from '@angular/core';
import { ChatMockApi } from './apps/chat/api';
import { ContactsMockApi } from './apps/contacts/api';
import { ECommerceInventoryMockApi } from './apps/ecommerce/inventory/api';
import { MailboxMockApi } from './apps/mailbox/api';
import { NotesMockApi } from './apps/notes/api';
import { ScrumboardMockApi } from './apps/scrumboard/api';
import { MessagesMockApi } from './common/messages/api';
import { ShortcutsMockApi } from './common/shortcuts/api';

@Injectable({ providedIn: 'root' })
export class MockApiService {
  chatMockApi = inject(ChatMockApi);
  contactsMockApi = inject(ContactsMockApi);
  eCommerceInventoryMockApi = inject(ECommerceInventoryMockApi);
  mailboxMockApi = inject(MailboxMockApi);
  messagesMockApi = inject(MessagesMockApi);
  notesMockApi = inject(NotesMockApi);
  scrumboardMockApi = inject(ScrumboardMockApi);
  shortcutsMockApi = inject(ShortcutsMockApi);
}
