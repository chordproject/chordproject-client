import { inject, Injectable } from '@angular/core';
import { ChatMockApi } from './apps/chat/api';
import { ECommerceInventoryMockApi } from './apps/ecommerce/inventory/api';
import { MailboxMockApi } from './apps/mailbox/api';
import { ScrumboardMockApi } from './apps/scrumboard/api';

@Injectable({ providedIn: 'root' })
export class MockApiService {
  chatMockApi = inject(ChatMockApi);
  eCommerceInventoryMockApi = inject(ECommerceInventoryMockApi);
  mailboxMockApi = inject(MailboxMockApi);
  scrumboardMockApi = inject(ScrumboardMockApi);
}
