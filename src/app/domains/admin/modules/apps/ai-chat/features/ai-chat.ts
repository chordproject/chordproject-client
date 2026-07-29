import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Media } from '@/app/core/media';
import { AiChatService } from '@/app/domains/admin/modules/apps/ai-chat/data/ai-chat';

@Component({
  selector: 'ai-chat',
  imports: [
    CdkTextareaAutosize,
    MatIcon,
    MatIconButton,
    MatFormField,
    MatInput,
    MatPrefix,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatTooltip,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  host: {
    class: 'lg:h-full',
  },
  template: `
    <div
      class="@container mx-auto flex h-full w-full flex-auto flex-col overflow-hidden"
    >
      <mat-sidenav-container
        class="h-full flex-auto [&_.mat-drawer-backdrop]:fixed"
        (backdropClick)="panelOpened.set(false)"
      >
        <!-- Conversations panel -->
        <mat-sidenav
          class="w-72 border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
          [mode]="isMobile() ? 'over' : 'side'"
          [opened]="!isMobile() || panelOpened()"
          [position]="'start'"
          [fixedInViewport]="isMobile()"
          disableClose
        >
          <div class="flex h-full w-full flex-col">
            <!-- Panel header -->
            <div class="flex items-center gap-x-2 py-4 pr-3 pl-4">
              <div class="flex-auto text-lg font-semibold tracking-tighter">
                AI Chat
              </div>
              <button
                class="text-neutral-500"
                matIconButton
                [matTooltip]="'New chat'"
              >
                <mat-icon svgIcon="square-pen" />
              </button>
            </div>

            <!-- Search -->
            <div class="px-4">
              <mat-form-field class="w-full">
                <mat-icon
                  matPrefix
                  svgIcon="search"
                />
                <input
                  placeholder="Search chats"
                  matInput
                />
              </mat-form-field>
            </div>

            <!-- Conversations -->
            <div class="mt-4 flex-auto overflow-y-auto px-2 pb-4">
              @for (group of groups(); track group.label) {
                <div
                  class="px-2 pt-4 pb-1 text-xs font-medium text-neutral-500 uppercase"
                >
                  {{ group.label }}
                </div>

                <div class="flex flex-col gap-y-1">
                  @for (
                    conversation of group.conversations;
                    track conversation.id
                  ) {
                    <a
                      class="flex items-center rounded-lg px-2 py-2 not-data-active:hover:bg-neutral-700/5 dark:not-data-active:hover:bg-neutral-300/5"
                      routerLinkActive="bg-neutral-700/10 dark:bg-neutral-300/10"
                      [attr.data-active]="rla.isActive || null"
                      [routerLink]="['./', conversation.id]"
                      (click)="selectConversation()"
                      #rla="routerLinkActive"
                    >
                      <span class="min-w-0 flex-auto truncate">
                        {{ conversation.title }}
                      </span>
                    </a>
                  }
                </div>
              }
            </div>
          </div>
        </mat-sidenav>

        <mat-sidenav-content class="flex flex-auto flex-col overflow-hidden">
          <router-outlet
            (activate)="hasConversation.set(true)"
            (deactivate)="hasConversation.set(false)"
          ></router-outlet>

          <!-- Empty state -->
          @if (!hasConversation()) {
            <div class="flex items-center gap-x-2 px-4 py-4 lg:hidden">
              <button
                class="text-neutral-500"
                matIconButton
                [matTooltip]="'Conversations'"
                (click)="panelOpened.set(true)"
              >
                <mat-icon svgIcon="menu" />
              </button>
            </div>

            <div
              class="flex flex-auto flex-col items-center justify-center px-6 py-8 lg:px-8"
            >
              <div class="w-full max-w-3xl">
                <div class="flex flex-col items-center text-center">
                  <mat-icon
                    class="size-10 text-primary-600"
                    svgIcon="sparkles"
                  />
                  <div
                    class="mt-4 text-2xl font-semibold tracking-tighter sm:text-3xl"
                  >
                    How can I help you today?
                  </div>
                  <div class="mt-1 text-neutral-500">
                    Pick a suggestion below or start typing.
                  </div>
                </div>

                <!-- Suggestions -->
                <div class="mt-8 grid grid-cols-1 gap-3 @xl:grid-cols-2">
                  @for (suggestion of suggestions; track suggestion.title) {
                    <button
                      class="flex cursor-pointer flex-col gap-y-1 rounded-xl border p-4 text-left hover:bg-neutral-100 dark:hover:bg-white/2.5"
                      type="button"
                    >
                      <div class="flex items-center gap-x-2">
                        <mat-icon
                          class="size-4 shrink-0 text-neutral-400"
                          [svgIcon]="suggestion.icon"
                        />
                        <span class="text-sm font-medium">
                          {{ suggestion.title }}
                        </span>
                      </div>
                      <div class="text-sm text-neutral-500">
                        {{ suggestion.description }}
                      </div>
                    </button>
                  }
                </div>
              </div>
            </div>

            <!-- Composer -->
            <div class="px-6 pb-6 lg:px-8">
              <div class="mx-auto w-full max-w-3xl">
                <div
                  class="rounded-2xl border bg-white p-2 dark:bg-neutral-800"
                >
                  <textarea
                    class="w-full resize-none border-0 bg-transparent px-2 py-2 outline-none"
                    placeholder="Message AI Chat..."
                    cdkTextareaAutosize
                    [cdkAutosizeMinRows]="1"
                    cdkAutosizeMaxRows="8"
                  ></textarea>

                  <div class="flex items-center gap-x-1">
                    <button
                      class="text-neutral-500"
                      matIconButton
                      [matTooltip]="'Attach a file'"
                    >
                      <mat-icon svgIcon="paperclip" />
                    </button>
                    <button
                      class="text-neutral-500"
                      matIconButton
                      [matTooltip]="'Dictate'"
                    >
                      <mat-icon svgIcon="mic" />
                    </button>

                    <!-- Spacer -->
                    <div class="flex-auto"></div>

                    <button
                      class="text-sm font-medium text-neutral-500"
                      type="button"
                      [matMenuTriggerFor]="modelMenu"
                    >
                      <span class="flex items-center gap-x-1 px-2 py-1">
                        {{ model }}
                        <mat-icon
                          class="size-4"
                          svgIcon="chevron-down"
                        />
                      </span>
                    </button>
                    <mat-menu
                      xPosition="before"
                      #modelMenu="matMenu"
                    >
                      @for (item of models; track item) {
                        <button mat-menu-item>{{ item }}</button>
                      }
                    </mat-menu>

                    <button
                      class="bg-primary-600 text-white"
                      matIconButton
                      [matTooltip]="'Send'"
                    >
                      <mat-icon svgIcon="send" />
                    </button>
                  </div>
                </div>

                <div class="mt-2 text-center text-xs text-neutral-400">
                  AI can make mistakes. Check important info.
                </div>
              </div>
            </div>
          }
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
})
export default class AiChat {
  // Dependencies
  private aiChatService = inject(AiChatService);
  private media = inject(Media);

  // State
  protected data = this.aiChatService.data;
  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );
  protected model = 'Nova 4.5';
  protected models = ['Nova 4.5', 'Nova 4.5 Mini', 'Nova 3 Turbo'];
  protected suggestions = [
    {
      icon: 'code',
      title: 'Review a migration plan',
      description: 'Walk through the risky steps before we ship it.',
    },
    {
      icon: 'file-text',
      title: 'Summarize a long document',
      description: 'Pull out the decisions and the open questions.',
    },
    {
      icon: 'lightbulb',
      title: 'Brainstorm launch angles',
      description: 'Three positioning options for a new plan.',
    },
    {
      icon: 'bug',
      title: 'Debug a failing query',
      description: 'Explain a plan and suggest a better index.',
    },
  ];
  protected groups = computed(() => this.groupConversations());
  protected hasConversation = signal(false);
  panelOpened = signal(false);

  selectConversation() {
    if (this.isMobile()) {
      this.panelOpened.set(false);
    }
  }

  private groupConversations() {
    const conversations = [...this.data.conversations].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // The mock data is fixed in time, so the newest conversation defines "today"
    const startOfDay = (date: string) => {
      const value = new Date(date);
      return new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate()
      ).getTime();
    };
    const today = startOfDay(conversations[0].createdAt);
    const daysAgo = (date: string) =>
      Math.round((today - startOfDay(date)) / (24 * 60 * 60 * 1000));

    const groups = [
      { label: 'Today', conversations: [] },
      { label: 'Yesterday', conversations: [] },
      { label: 'Previous 7 days', conversations: [] },
    ] as { label: string; conversations: typeof conversations }[];

    for (const conversation of conversations) {
      const days = daysAgo(conversation.createdAt);
      groups[days === 0 ? 0 : days === 1 ? 1 : 2].conversations.push(
        conversation
      );
    }

    return groups.filter((group) => group.conversations.length > 0);
  }
}
