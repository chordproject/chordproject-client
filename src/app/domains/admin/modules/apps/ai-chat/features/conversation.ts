import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, computed, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { AiChatService } from '@/app/domains/admin/modules/apps/ai-chat/data/ai-chat';
import AiChat from '@/app/domains/admin/modules/apps/ai-chat/features/ai-chat';

@Component({
  selector: 'conversation',
  imports: [
    CdkTextareaAutosize,
    MatDivider,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatTooltip,
  ],
  host: {
    class: 'flex flex-auto flex-col overflow-hidden',
  },
  template: `
    @let conversation = this.conversation();

    <!-- Header -->
    <div class="flex items-center gap-x-2 border-b px-4 py-3 lg:px-6">
      <button
        class="text-neutral-500 lg:hidden"
        matIconButton
        [matTooltip]="'Conversations'"
        (click)="aiChat.panelOpened.set(true)"
      >
        <mat-icon svgIcon="menu" />
      </button>

      <div class="min-w-0 flex-auto truncate font-medium">
        {{ conversation.title }}
      </div>

      <button
        class="text-neutral-500"
        matIconButton
        [matMenuTriggerFor]="conversationMenu"
      >
        <mat-icon svgIcon="ellipsis" />
      </button>
      <mat-menu
        xPosition="before"
        #conversationMenu="matMenu"
      >
        <button mat-menu-item>
          <mat-icon svgIcon="pencil" />
          Rename
        </button>
        <button mat-menu-item>
          <mat-icon svgIcon="share-2" />
          Share
        </button>
        <mat-divider />
        <button mat-menu-item>
          <mat-icon svgIcon="trash-2" />
          Delete
        </button>
      </mat-menu>
    </div>

    <!-- Messages -->
    <div class="flex-auto overflow-y-auto px-6 py-8 lg:px-8">
      <div class="mx-auto flex w-full max-w-3xl flex-col gap-y-8">
        @for (message of conversation.messages; track message.id) {
          @if (message.role === 'user') {
            <!-- User message -->
            <div class="flex justify-end">
              <div
                class="max-w-[75%] rounded-xl bg-neutral-100 px-4 py-3 dark:bg-neutral-800"
              >
                @for (part of message.content; track $index) {
                  <div class="whitespace-pre-line">{{ part.value }}</div>
                }
              </div>
            </div>
          } @else {
            <!-- Assistant message -->
            <div class="flex gap-x-4">
              <div
                class="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
              >
                <mat-icon
                  class="size-4 text-primary-600"
                  svgIcon="sparkles"
                />
              </div>

              <div class="flex min-w-0 flex-auto flex-col gap-y-4">
                @for (part of message.content; track $index) {
                  @if (part.type === 'code') {
                    <!-- Code block -->
                    <div class="overflow-hidden rounded-lg bg-neutral-950">
                      <div
                        class="flex items-center gap-x-2 border-b border-white/10 py-2 pr-2 pl-4"
                      >
                        <div class="flex-auto text-neutral-400">
                          {{ part.language }}
                        </div>
                        <button
                          matIconButton
                          class="text-neutral-400 hover:text-neutral-200"
                          type="button"
                          [matTooltip]="'Copy code'"
                        >
                          <mat-icon svgIcon="copy" />
                        </button>
                      </div>
                      <pre
                        class="overflow-x-auto p-4 font-mono text-sm text-neutral-50"
                      ><code>{{ part.value }}</code></pre>
                    </div>
                  } @else {
                    <!-- Text -->
                    <div>
                      <span class="whitespace-pre-line">{{ part.value }}</span>
                      @if (message.streaming && $last) {
                        <span
                          class="ml-0.5 inline-block h-4 w-2 animate-pulse bg-current align-text-bottom"
                        ></span>
                      }
                    </div>
                  }
                }

                @if (message.streaming) {
                  <!-- Generating -->
                  <div class="text-sm text-neutral-400">Generating...</div>
                } @else {
                  <!-- Actions -->
                  <div class="-ml-1 flex items-center gap-x-1">
                    @for (action of actions; track action.icon) {
                      <button
                        class="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                        type="button"
                        [matTooltip]="action.label"
                      >
                        <mat-icon
                          class="size-4"
                          [svgIcon]="action.icon"
                        />
                      </button>
                    }
                  </div>
                }
              </div>
            </div>
          }
        }
      </div>
    </div>

    <!-- Composer -->
    <div class="px-6 pb-6 lg:px-8">
      <div class="mx-auto w-full max-w-3xl">
        <div class="rounded-2xl border bg-white p-2 dark:bg-neutral-800">
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
  `,
})
export default class Conversation {
  // Dependencies
  private aiChatService = inject(AiChatService);
  protected aiChat = inject(AiChat);

  // Input / Output
  readonly conversationId = input.required({ alias: 'id' });

  // State
  protected data = this.aiChatService.data;
  protected conversation = computed(() =>
    this.data.conversations.find(
      (conversation) => conversation.id === this.conversationId()
    )!
  );
  protected model = 'Nova 4.5';
  protected models = ['Nova 4.5', 'Nova 4.5 Mini', 'Nova 3 Turbo'];
  protected actions = [
    { icon: 'copy', label: 'Copy' },
    { icon: 'thumbs-up', label: 'Good response' },
    { icon: 'thumbs-down', label: 'Bad response' },
    { icon: 'refresh-cw', label: 'Regenerate' },
  ];
}
