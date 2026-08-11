import { DatePipe, I18nPluralPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MailboxService } from '@/app/domains/admin/modules/apps/mailbox/data/mailbox';
import {
  Mail,
  MailFolder,
} from '@/app/domains/admin/modules/apps/mailbox/data/model';
import Compose from '@/app/domains/admin/modules/apps/mailbox/features/compose';

const PAGE_SIZE = 25;

type Folder = {
  id: MailFolder;
  label: string;
  icon: string;
};

@Component({
  selector: 'mailbox',
  imports: [
    DatePipe,
    I18nPluralPipe,
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatPrefix,
    MatPseudoCheckbox,
    MatTooltip,
  ],
  host: {
    class: 'lg:h-full',
  },
  template: `
    <div
      class="@container mx-auto flex h-full w-full flex-auto flex-col overflow-hidden"
    >
      <!-- Header -->
      <div
        class="flex flex-wrap items-center gap-4 border-b px-6 py-4 lg:px-8 lg:py-8"
      >
        <div class="flex flex-col gap-y-0.5">
          <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
            Mailbox
          </div>
          <div class="text-neutral-500">
            {{
              mailboxService.unreadCount()
                | i18nPlural
                  : {
                      '=0': 'No unread mails',
                      '=1': '1 unread mail',
                      other: '# unread mails',
                    }
            }}
          </div>
        </div>

        <!-- Spacer -->
        <div class="flex-auto"></div>

        <!-- Search -->
        <mat-form-field class="order-last w-full @2xl:order-none @2xl:w-64">
          <mat-icon
            matPrefix
            svgIcon="search"
          />
          <input
            placeholder="Search mails"
            matInput
          />
        </mat-form-field>

        <!-- Actions -->
        <button
          matButton="filled"
          (click)="compose()"
        >
          <mat-icon svgIcon="pen-line" />
          Compose
        </button>
      </div>

      <!-- Content -->
      <div class="flex min-h-0 flex-auto">
        <!-- Folders -->
        <div
          class="hidden w-56 shrink-0 flex-col gap-y-6 overflow-y-auto border-r p-4 @4xl:flex"
        >
          <!-- Folder list -->
          <div class="flex flex-col gap-y-0.5">
            @for (folder of folders; track folder.id) {
              <button
                class="flex items-center gap-x-3 rounded-lg px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-white/2.5"
                [class.bg-neutral-100]="folder.id === currentFolder()"
                [class.dark:bg-white/5]="folder.id === currentFolder()"
                (click)="selectFolder(folder.id)"
              >
                <mat-icon
                  class="size-4 text-neutral-500"
                  [svgIcon]="folder.icon"
                />
                <span class="flex-auto font-medium">{{ folder.label }}</span>
                <span class="text-sm text-neutral-500 tabular-nums">
                  {{ mailboxService.folderCount(folder.id) }}
                </span>
              </button>
            }
          </div>

          <!-- Labels -->
          <div class="flex flex-col gap-y-0.5">
            <div
              class="px-3 pb-2 text-sm font-medium text-neutral-500 uppercase"
            >
              Labels
            </div>
            @for (label of mailboxService.labels; track label.id) {
              <button
                class="flex items-center gap-x-3 rounded-lg px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-white/2.5"
              >
                <span class="size-2 rounded-full {{ label.color }}"></span>
                <span class="flex-auto font-medium">{{ label.label }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Mail list -->
        <div
          class="min-w-0 flex-auto flex-col overflow-y-auto"
          [class]="
            !folderMails().length
              ? 'flex'
              : selectedMail()
                ? 'hidden @2xl:flex @2xl:w-100 @2xl:flex-none @2xl:border-r'
                : 'flex @2xl:w-100 @2xl:flex-none @2xl:border-r'
          "
        >
          <!-- List toolbar -->
          <div
            class="items-center gap-x-1 border-b px-4 py-2"
            [class]="folderMails().length ? 'flex' : 'flex @4xl:hidden'"
          >
            <!-- Folder menu (compact) -->
            <button
              class="@4xl:hidden"
              matButton
              [matMenuTriggerFor]="folderMenu"
            >
              {{ currentFolderLabel() }}
              <mat-icon
                svgIcon="chevron-down"
                iconPositionEnd
              />
            </button>
            <mat-menu #folderMenu>
              @for (folder of folders; track folder.id) {
                <button
                  mat-menu-item
                  (click)="selectFolder(folder.id)"
                >
                  <mat-pseudo-checkbox
                    appearance="minimal"
                    [state]="
                      folder.id === currentFolder() ? 'checked' : 'unchecked'
                    "
                  />
                  <span class="ml-1 flex-auto">{{ folder.label }}</span>
                </button>
              }
            </mat-menu>

            <!-- Spacer -->
            <div class="flex-auto"></div>

            <!-- Pagination -->
            @if (folderMails().length) {
              <div class="text-sm text-neutral-500 tabular-nums">
                {{ pageStart() }}–{{ pageEnd() }} of {{ folderMails().length }}
              </div>
              <button
                matIconButton
                [matTooltip]="'Previous page'"
                [disabled]="page() === 0"
                (click)="prevPage()"
              >
                <mat-icon svgIcon="chevron-left" />
              </button>
              <button
                matIconButton
                [matTooltip]="'Next page'"
                [disabled]="pageEnd() >= folderMails().length"
                (click)="nextPage()"
              >
                <mat-icon svgIcon="chevron-right" />
              </button>
            }
          </div>

          <!-- Mails -->
          @for (mail of pagedMails(); track mail.id) {
            <div
              class="relative flex cursor-pointer items-start gap-x-3 border-b px-4 py-3 hover:bg-neutral-100 dark:hover:bg-white/2.5"
              [class.bg-neutral-100]="mail.id === selectedMail()?.id"
              [class.dark:bg-white/5]="mail.id === selectedMail()?.id"
              (click)="selectMail(mail)"
            >
              <!-- Avatar -->
              @if (mail.from.avatar) {
                <img
                  class="size-10 shrink-0 rounded-full object-cover"
                  [src]="mail.from.avatar"
                  alt="Sender avatar"
                />
              } @else {
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                >
                  {{ mail.from.name.charAt(0) }}
                </div>
              }

              <!-- Details -->
              <div class="flex min-w-0 flex-auto flex-col gap-y-0.5">
                <div class="flex items-center gap-x-2">
                  <div
                    class="truncate"
                    [class.font-semibold]="!mail.read"
                  >
                    {{ mail.from.name }}
                  </div>
                  @if (mail.thread?.length) {
                    <span class="text-sm text-neutral-500 tabular-nums">
                      {{ mail.thread!.length + 1 }}
                    </span>
                  }

                  <!-- Spacer -->
                  <div class="flex-auto"></div>

                  @if (!mail.read) {
                    <span
                      class="size-2 shrink-0 rounded-full bg-primary-600"
                    ></span>
                  }
                  <div class="shrink-0 text-sm text-neutral-500">
                    {{ mail.date | date: 'MMM d' }}
                  </div>
                </div>
                <div
                  class="truncate text-sm"
                  [class.font-medium]="!mail.read"
                >
                  {{ mail.subject }}
                </div>
                <div class="flex items-center gap-x-2">
                  <div class="truncate text-sm text-neutral-500">
                    {{ mail.body[0] }}
                  </div>

                  <!-- Spacer -->
                  <div class="flex-auto"></div>

                  @for (labelId of mail.labels; track labelId) {
                    <span
                      class="size-2 shrink-0 rounded-full {{
                        mailboxService.label(labelId)?.color
                      }}"
                    ></span>
                  }
                  @if (mail.attachments.length) {
                    <mat-icon
                      class="size-3.5 shrink-0 text-neutral-400"
                      svgIcon="paperclip"
                    />
                  }
                  @if (mail.starred) {
                    <mat-icon
                      class="size-3.5 shrink-0 text-amber-500"
                      svgIcon="star"
                    />
                  }
                </div>
              </div>
            </div>
          } @empty {
            <div
              class="flex flex-auto flex-col items-center justify-center gap-y-4 px-4 py-12"
            >
              <div
                class="flex size-24 items-center justify-center rounded-full bg-neutral-100 dark:bg-white/5"
              >
                <mat-icon
                  class="size-12 text-neutral-400"
                  [svgIcon]="currentFolderIcon()"
                />
              </div>
              <div class="text-2xl font-semibold tracking-tighter">
                Nothing in here
              </div>
              <div class="-mt-2 text-neutral-500">
                This folder doesn't have any mails
              </div>
            </div>
          }
        </div>

        <!-- Reading pane -->
        <div
          class="min-w-0 flex-auto flex-col overflow-y-auto"
          [class]="
            !folderMails().length
              ? 'hidden'
              : selectedMail()
                ? 'flex'
                : 'hidden @2xl:flex'
          "
        >
          @if (selectedMail(); as mail) {
            <!-- Mail toolbar -->
            <div class="flex items-center gap-x-1 border-b px-4 py-2">
              <button
                class="@2xl:hidden"
                matIconButton
                [matTooltip]="'Back to list'"
                (click)="closeMail()"
              >
                <mat-icon svgIcon="arrow-left" />
              </button>

              <!-- Spacer -->
              <div class="flex-auto"></div>

              <button
                matIconButton
                [matTooltip]="mail.starred ? 'Unstar' : 'Star'"
                (click)="mailboxService.toggleStar(mail.id)"
              >
                <mat-icon
                  [class.text-amber-500]="mail.starred"
                  svgIcon="star"
                />
              </button>
              <button
                matIconButton
                [matTooltip]="mail.read ? 'Mark as unread' : 'Mark as read'"
                (click)="toggleRead(mail)"
              >
                <mat-icon [svgIcon]="mail.read ? 'mail' : 'mail-open'" />
              </button>
              <button
                matIconButton
                [matTooltip]="
                  mail.folder === 'trash' ? 'Delete forever' : 'Move to trash'
                "
                (click)="deleteMail(mail)"
              >
                <mat-icon svgIcon="trash-2" />
              </button>
            </div>

            <!-- Mail -->
            <div class="flex flex-col gap-y-6 px-6 py-6 lg:px-8">
              <!-- Subject & labels -->
              <div class="flex flex-col gap-y-2">
                <div class="text-xl font-semibold tracking-tight">
                  {{ mail.subject }}
                </div>
                @if (mail.labels.length) {
                  <div class="flex items-center gap-x-2">
                    @for (labelId of mail.labels; track labelId) {
                      <div
                        class="flex items-center gap-x-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-sm dark:bg-white/5"
                      >
                        <span
                          class="size-2 rounded-full {{
                            mailboxService.label(labelId)?.color
                          }}"
                        ></span>
                        {{ mailboxService.label(labelId)?.label }}
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Messages -->
              @for (
                message of threadMessages(mail);
                track $index;
                let last = $last
              ) {
                <div
                  class="flex flex-col gap-y-6"
                  [class.border-b]="!last"
                  [class.pb-6]="!last"
                >
                  <!-- Sender -->
                  <div class="flex items-center gap-x-3">
                    @if (message.from.avatar) {
                      <img
                        class="size-10 shrink-0 rounded-full object-cover"
                        [src]="message.from.avatar"
                        alt="Sender avatar"
                      />
                    } @else {
                      <div
                        class="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                      >
                        {{ message.from.name.charAt(0) }}
                      </div>
                    }
                    <div class="flex min-w-0 flex-auto flex-col">
                      <div class="font-medium">{{ message.from.name }}</div>
                      <div class="truncate text-sm text-neutral-500">
                        {{ message.from.email }}
                      </div>
                    </div>
                    <div class="shrink-0 text-sm text-neutral-500">
                      {{ message.date | date: 'MMM d, y, h:mm a' }}
                    </div>
                  </div>

                  <!-- Body -->
                  <div class="flex flex-col gap-y-4">
                    @for (paragraph of message.body; track $index) {
                      <p>{{ paragraph }}</p>
                    }
                  </div>
                </div>
              }

              <!-- Attachments -->
              @if (mail.attachments.length) {
                <div class="flex flex-col gap-y-2 border-t pt-6">
                  <div class="text-sm font-medium text-neutral-500">
                    {{
                      mail.attachments.length
                        | i18nPlural
                          : { '=1': '1 attachment', other: '# attachments' }
                    }}
                  </div>
                  <div class="flex flex-wrap gap-2">
                    @for (
                      attachment of mail.attachments;
                      track attachment.name
                    ) {
                      <div
                        class="flex items-center gap-x-2 rounded-lg border px-3 py-2"
                      >
                        <mat-icon
                          class="size-4 text-neutral-500"
                          svgIcon="paperclip"
                        />
                        <span class="text-sm font-medium">
                          {{ attachment.name }}
                        </span>
                        <span class="text-sm text-neutral-500">
                          {{ attachment.size }}
                        </span>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Reply (decorative) -->
              <div class="flex items-center gap-x-3 border-t pt-6">
                <button matButton="outlined">
                  <mat-icon svgIcon="reply" />
                  Reply
                </button>
                <button matButton="outlined">
                  <mat-icon svgIcon="forward" />
                  Forward
                </button>
              </div>
            </div>
          } @else {
            <!-- Empty state -->
            <div
              class="flex flex-auto flex-col items-center justify-center gap-y-4 px-6"
            >
              <div
                class="flex size-24 items-center justify-center rounded-full bg-neutral-100 dark:bg-white/5"
              >
                <mat-icon
                  class="size-12 text-neutral-400"
                  svgIcon="mail-open"
                />
              </div>
              <div class="text-2xl font-semibold tracking-tighter">
                No mail selected
              </div>
              <div class="-mt-2 text-neutral-500">
                Select a mail from the list to read it here
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export default class Mailbox {
  // Dependencies
  protected mailboxService = inject(MailboxService);
  private matDialog = inject(MatDialog);

  // State
  protected folders: Folder[] = [
    { id: 'inbox', label: 'Inbox', icon: 'inbox' },
    { id: 'sent', label: 'Sent', icon: 'send' },
    { id: 'drafts', label: 'Drafts', icon: 'file-pen-line' },
    { id: 'archive', label: 'Archive', icon: 'archive' },
    { id: 'spam', label: 'Spam', icon: 'circle-alert' },
    { id: 'trash', label: 'Trash', icon: 'trash-2' },
  ];
  protected currentFolder = signal<MailFolder>('inbox');
  protected currentFolderLabel = computed(
    () =>
      this.folders.find((folder) => folder.id === this.currentFolder())?.label
  );
  protected currentFolderIcon = computed(
    () =>
      this.folders.find((folder) => folder.id === this.currentFolder())?.icon ??
      'inbox'
  );
  protected selectedMailId = signal<string | null>(null);
  protected page = signal(0);

  // Computed state
  protected folderMails = computed(() =>
    this.mailboxService
      .mails()
      .filter((mail) => mail.folder === this.currentFolder())
      .sort((a, b) => b.date.localeCompare(a.date))
  );
  protected pagedMails = computed(() =>
    this.folderMails().slice(
      this.page() * PAGE_SIZE,
      (this.page() + 1) * PAGE_SIZE
    )
  );
  protected pageStart = computed(() =>
    this.folderMails().length ? this.page() * PAGE_SIZE + 1 : 0
  );
  protected pageEnd = computed(() =>
    Math.min((this.page() + 1) * PAGE_SIZE, this.folderMails().length)
  );
  protected selectedMail = computed(
    () =>
      this.folderMails().find((mail) => mail.id === this.selectedMailId()) ??
      null
  );

  selectFolder(folder: MailFolder) {
    this.currentFolder.set(folder);
    this.selectedMailId.set(null);
    this.page.set(0);
  }

  selectMail(mail: Mail) {
    this.selectedMailId.set(mail.id);
    this.mailboxService.markAsRead(mail.id);
  }

  closeMail() {
    this.selectedMailId.set(null);
  }

  threadMessages(mail: Mail) {
    return [
      ...(mail.thread ?? []),
      { from: mail.from, date: mail.date, body: mail.body },
    ];
  }

  toggleRead(mail: Mail) {
    this.mailboxService.markAsRead(mail.id, !mail.read);
  }

  deleteMail(mail: Mail) {
    this.mailboxService.deleteMail(mail.id);
    this.selectedMailId.set(null);
  }

  prevPage() {
    this.page.update((page) => Math.max(0, page - 1));
  }

  nextPage() {
    this.page.update((page) => page + 1);
  }

  compose() {
    this.matDialog.open(Compose, {
      width: '560px',
      maxWidth: '90vw',
      autoFocus: false,
    });
  }
}
