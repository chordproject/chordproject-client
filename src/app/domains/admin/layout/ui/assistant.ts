import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AiChatService } from '@/app/domains/admin/modules/apps/ai-chat/data/ai-chat';

const CONVERSATION_ID = 'b7d0e3a5';

@Component({
  selector: 'assistant',
  imports: [
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    CdkTextareaAutosize,
    MatIcon,
    MatIconButton,
    MatTooltip,
    RouterLink,
  ],
  template: `
    <button
      matIconButton
      cdkOverlayOrigin
      [matTooltip]="'Assistant'"
      (click)="toggle()"
      #trigger="cdkOverlayOrigin"
    >
      <mat-icon
        class="text-primary-600"
        svgIcon="sparkles"
      />
    </button>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="opened()"
      [cdkConnectedOverlayHasBackdrop]="true"
      (detach)="toggle(false)"
      (backdropClick)="toggle(false)"
    >
      <div
        class="fixed inset-y-0 right-0 flex w-96 max-w-full flex-col bg-white shadow-(--mat-sys-level2) dark:bg-neutral-800"
      >
        <!-- Header -->
        <div class="flex items-center gap-x-2 border-b px-4 py-3">
          <div class="flex min-w-0 flex-auto items-center gap-x-3">
            <mat-icon
              class="size-4.5 text-primary-600"
              svgIcon="sparkles"
            />
            <div class="truncate text-xl font-semibold tracking-tighter">
              Assistant
            </div>
          </div>

          <button
            class="text-neutral-500"
            matIconButton
            [matTooltip]="'Open in AI Chat'"
            [routerLink]="'/admin/ai-chat/' + conversation.id"
            (click)="toggle(false)"
          >
            <mat-icon svgIcon="arrow-up-right" />
          </button>
          <button
            class="text-neutral-500"
            matIconButton
            [matTooltip]="'Close'"
            (click)="toggle(false)"
          >
            <mat-icon svgIcon="x" />
          </button>
        </div>

        <!-- Messages -->
        <div class="flex flex-auto flex-col gap-y-6 overflow-y-auto px-4 py-6">
          @for (message of messages; track message.id) {
            @if (message.role === 'user') {
              <!-- User message -->
              <div class="flex justify-end">
                <div
                  class="max-w-[85%] rounded-xl bg-neutral-100 px-3 py-2 dark:bg-neutral-700/50"
                >
                  @for (part of message.content; track $index) {
                    <div class="whitespace-pre-line">{{ part.value }}</div>
                  }
                </div>
              </div>
            } @else {
              <!-- Assistant message -->
              <div class="flex gap-x-3">
                <div
                  class="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700/50"
                >
                  <mat-icon
                    class="size-3.5 text-primary-600"
                    svgIcon="sparkles"
                  />
                </div>

                <div class="flex min-w-0 flex-auto flex-col gap-y-3">
                  @for (part of message.content; track $index) {
                    <div class="whitespace-pre-line">{{ part.value }}</div>
                  }
                </div>
              </div>
            }
          }
        </div>

        <!-- Composer -->
        <div class="px-4 pb-4">
          <div class="rounded-2xl border bg-white p-2 dark:bg-neutral-800">
            <textarea
              class="w-full resize-none border-0 bg-transparent px-2 py-2 outline-none"
              placeholder="Ask me anything..."
              cdkTextareaAutosize
              [cdkAutosizeMinRows]="1"
              cdkAutosizeMaxRows="6"
            ></textarea>

            <div class="flex items-center gap-x-1">
              <!-- Spacer -->
              <div class="flex-auto"></div>

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
    </ng-template>
  `,
})
export class Assistant {
  // Dependencies
  private aiChatService = inject(AiChatService);

  // State
  protected opened = signal(false);

  // Data
  protected conversation = this.aiChatService.data.conversations.find(
    (conversation) => conversation.id === CONVERSATION_ID
  )!;
  protected messages = this.conversation.messages.slice(0, 4);

  toggle(force: boolean | null = null) {
    this.opened.update((value) => {
      if (force === null) {
        return !value;
      }

      return force;
    });
  }
}
