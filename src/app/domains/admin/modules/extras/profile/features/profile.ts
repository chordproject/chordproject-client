import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'profile',
  imports: [
    CdkTextareaAutosize,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatTooltip,
  ],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-5xl flex-auto flex-col gap-4 p-6 sm:gap-6 lg:px-8 lg:py-10"
    >
      <!-- Header card -->
      <mat-card
        appearance="outlined"
        class="overflow-hidden"
      >
        <!-- Cover -->
        <div
          class="h-36 bg-linear-to-r from-primary-700 via-primary-500 to-primary-400 sm:h-44"
        ></div>

        <!-- Header content -->
        <div class="flex flex-col gap-4 p-6 pt-0 sm:px-8">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <!-- Avatar -->
            <img
              class="-mt-12 size-24 shrink-0 rounded-full ring-4 ring-white sm:-mt-16 sm:size-32 dark:ring-neutral-800"
              src="images/photos/brian-hughes.jpg"
              alt="Brian Hughes"
            />

            <!-- Actions -->
            <div class="flex items-center gap-x-3">
              <button matButton="outlined">
                <mat-icon svgIcon="mail" />
                Message
              </button>
              <button matButton="filled">
                <mat-icon svgIcon="user-round-plus" />
                Follow
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <!-- Identity -->
            <div class="flex flex-col gap-y-1">
              <div class="text-2xl font-semibold tracking-tighter sm:text-3xl">
                Brian Hughes
              </div>
              <div class="font-medium text-neutral-500">
                Senior Frontend Developer at Fuse
              </div>
              <div
                class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-neutral-500"
              >
                <div class="flex items-center gap-x-1.5">
                  <mat-icon
                    class="icon-size-4"
                    svgIcon="map-pin"
                  />
                  London, United Kingdom
                </div>
                <div class="flex items-center gap-x-1.5">
                  <mat-icon
                    class="icon-size-4"
                    svgIcon="calendar"
                  />
                  Joined April 2019
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex items-center gap-x-8">
              @for (stat of stats; track stat.label) {
                <div class="flex flex-col">
                  <div class="text-xl font-semibold tracking-tighter">
                    {{ stat.value }}
                  </div>
                  <div class="text-sm text-neutral-500">{{ stat.label }}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </mat-card>

      <!-- Content grid -->
      <div class="grid grid-cols-1 items-start gap-4 sm:gap-6 @3xl:grid-cols-3">
        <!-- Sidebar -->
        <div class="flex flex-col gap-4 sm:gap-6">
          <!-- About -->
          <mat-card
            appearance="filled"
            class="flex flex-col"
          >
            <mat-card-header>
              <div class="flex flex-auto items-center gap-x-2">
                <mat-icon
                  class="size-4"
                  svgIcon="user-round"
                />
                <div class="font-medium tracking-tight">About</div>
              </div>
            </mat-card-header>
            <mat-card-content class="flex flex-col gap-y-4">
              <p class="text-neutral-600 dark:text-neutral-400">
                Hey! I'm Brian, a frontend developer with a soft spot for design
                systems, clean component APIs and unreasonably smooth
                transitions. Currently building admin interfaces and helping
                teams ship faster.
              </p>

              <div class="flex flex-col gap-y-3">
                @for (detail of details; track detail.label) {
                  <div class="flex items-center gap-x-3">
                    <mat-icon
                      class="icon-size-5 text-neutral-400"
                      [svgIcon]="detail.icon"
                    />
                    <div class="truncate">{{ detail.label }}</div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Skills -->
          <mat-card
            appearance="filled"
            class="flex flex-col"
          >
            <mat-card-header>
              <div class="flex flex-auto items-center gap-x-2">
                <mat-icon
                  class="size-4"
                  svgIcon="sparkles"
                />
                <div class="font-medium tracking-tight">Skills</div>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div class="flex flex-wrap gap-2">
                @for (skill of skills; track skill) {
                  <div
                    class="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-500 dark:bg-black/20"
                  >
                    {{ skill }}
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Feed -->
        <div class="flex flex-col gap-4 sm:gap-6 @3xl:col-span-2">
          <!-- Composer -->
          <mat-card
            appearance="filled"
            class="flex flex-col"
          >
            <mat-card-header>
              <div class="flex flex-auto items-center gap-x-2">
                <mat-icon
                  class="size-4"
                  svgIcon="square-pen"
                />
                <div class="font-medium tracking-tight">New post</div>
              </div>
            </mat-card-header>
            <mat-card-content class="flex flex-col gap-y-4">
              <div class="flex items-start gap-x-4">
                <img
                  class="size-10 shrink-0 rounded-full"
                  src="images/photos/brian-hughes.jpg"
                  alt="Brian Hughes"
                />
                <mat-form-field class="flex-auto">
                  <textarea
                    matInput
                    cdkTextareaAutosize
                    placeholder="What's on your mind, Brian?"
                    [cdkAutosizeMinRows]="3"
                    [cdkAutosizeMaxRows]="8"
                  ></textarea>
                </mat-form-field>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-x-0.5">
                  <button
                    matIconButton
                    [matTooltip]="'Add photo'"
                  >
                    <mat-icon svgIcon="image" />
                  </button>
                  <button
                    matIconButton
                    [matTooltip]="'Attach file'"
                  >
                    <mat-icon svgIcon="paperclip" />
                  </button>
                  <button
                    matIconButton
                    [matTooltip]="'Add link'"
                  >
                    <mat-icon svgIcon="link" />
                  </button>
                </div>
                <button matButton="filled">Post</button>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Posts -->
          @for (post of posts; track post.id) {
            <mat-card
              appearance="filled"
              class="flex flex-col"
            >
              <mat-card-header>
                <div class="flex flex-auto items-center gap-x-3 py-2">
                  <img
                    class="size-10 shrink-0 rounded-full"
                    [src]="post.avatar"
                    [alt]="post.author"
                  />
                  <div class="flex flex-col">
                    <div class="leading-tight font-medium tracking-tight">
                      {{ post.author }}
                    </div>
                    <div class="text-sm text-neutral-500">{{ post.date }}</div>
                  </div>
                </div>
              </mat-card-header>
              <mat-card-content class="flex flex-col gap-y-4">
                <!-- Body -->
                @for (paragraph of post.body; track $index) {
                  <p class="text-neutral-600 dark:text-neutral-400">
                    {{ paragraph }}
                  </p>
                }

                <!-- Image -->
                @if (post.image) {
                  <img
                    class="max-h-80 w-full rounded-xl object-cover"
                    [src]="post.image"
                    [alt]="post.author"
                  />
                }

                <!-- Actions -->
                <div class="flex items-center gap-x-0.5 border-t pt-4">
                  <button matButton>
                    <mat-icon svgIcon="heart" />
                    {{ post.likes }}
                  </button>
                  <button matButton>
                    <mat-icon svgIcon="message-circle" />
                    {{ commentCount(post) }}
                  </button>
                  <button
                    class="ml-auto"
                    matButton
                  >
                    <mat-icon svgIcon="share-2" />
                    Share
                  </button>
                </div>

                <!-- Comments -->
                @if (post.comments.length) {
                  <div class="flex flex-col gap-y-4 border-t pt-4">
                    @for (comment of post.comments; track comment.author) {
                      <div class="flex flex-col gap-y-4">
                        <!-- Comment -->
                        <div class="flex items-start gap-x-3">
                          <img
                            class="size-8 shrink-0 rounded-full"
                            [src]="comment.avatar"
                            [alt]="comment.author"
                          />
                          <div class="flex flex-col gap-y-1">
                            <div class="flex items-baseline gap-x-2">
                              <div class="text-sm font-medium">
                                {{ comment.author }}
                              </div>
                              <div class="text-xs text-neutral-500">
                                {{ comment.date }}
                              </div>
                            </div>
                            <p class="text-neutral-600 dark:text-neutral-400">
                              {{ comment.text }}
                            </p>
                          </div>
                        </div>

                        <!-- Replies -->
                        @for (reply of comment.replies; track reply.author) {
                          <div
                            class="ml-4 flex items-start gap-x-3 border-l-2 pl-6"
                          >
                            <img
                              class="size-8 shrink-0 rounded-full"
                              [src]="reply.avatar"
                              [alt]="reply.author"
                            />
                            <div class="flex flex-col gap-y-1">
                              <div class="flex items-baseline gap-x-2">
                                <div class="text-sm font-medium">
                                  {{ reply.author }}
                                </div>
                                <div class="text-xs text-neutral-500">
                                  {{ reply.date }}
                                </div>
                              </div>
                              <p class="text-neutral-600 dark:text-neutral-400">
                                {{ reply.text }}
                              </p>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </mat-card-content>
            </mat-card>
          }
        </div>
      </div>
    </div>
  `,
})
export default class Profile {
  // State
  protected stats = [
    { value: '128', label: 'Posts' },
    { value: '4.2k', label: 'Followers' },
    { value: '380', label: 'Following' },
  ];

  protected details = [
    { icon: 'briefcase-business', label: 'Senior Frontend Developer' },
    { icon: 'building-2', label: 'Fuse' },
    { icon: 'mail', label: 'hughes.brian@company.com' },
    { icon: 'clock', label: 'Europe/London (GMT+1)' },
    { icon: 'link', label: 'fusetheme.com/brianh' },
  ];

  protected skills = [
    'Angular',
    'TypeScript',
    'Tailwind CSS',
    'Design Systems',
    'Accessibility',
    'Node.js',
    'Figma',
  ];

  protected posts: Post[] = [
    {
      id: 'POST-1',
      author: 'Brian Hughes',
      avatar: 'images/photos/brian-hughes.jpg',
      date: '2 hours ago',
      body: [
        'Spent the morning polishing the new mailbox layout. Inline reading panes beat drawers every time. Fewer moving parts, calmer UI. Sometimes the best interaction is the one you remove.',
      ],
      image: 'images/cards/14-640x480.jpg',
      likes: 48,
      comments: [
        {
          author: 'Josefina Lloyd',
          avatar: 'images/photos/female-02.jpg',
          date: '1 hour ago',
          text: 'Completely agree. The drawer version always felt like it was hiding the content I actually wanted to read.',
          replies: [
            {
              author: 'Brian Hughes',
              avatar: 'images/photos/brian-hughes.jpg',
              date: '45 minutes ago',
              text: 'Exactly. The empty pane state was the missing piece, it makes the whole thing feel intentional.',
            },
          ],
        },
      ],
    },
    {
      id: 'POST-2',
      author: 'Brian Hughes',
      avatar: 'images/photos/brian-hughes.jpg',
      date: 'Yesterday',
      body: [
        'Hot take: container queries quietly ended a decade of breakpoint gymnastics. Components that adapt to their container instead of the viewport just compose better.',
        'Migrated three layouts this week and deleted more CSS than I wrote.',
      ],
      image: null,
      likes: 132,
      comments: [
        {
          author: 'Dejesus Michael',
          avatar: 'images/photos/male-03.jpg',
          date: '20 hours ago',
          text: 'Deleting more CSS than you write is the real senior developer milestone.',
          replies: [
            {
              author: 'Brian Hughes',
              avatar: 'images/photos/brian-hughes.jpg',
              date: '19 hours ago',
              text: 'Putting that on my performance review.',
            },
            {
              author: 'Sarah Boone',
              avatar: 'images/photos/female-04.jpg',
              date: '18 hours ago',
              text: 'Waiting for the follow up post where the deleted CSS comes back from code review.',
            },
          ],
        },
        {
          author: 'Roger Murray',
          avatar: 'images/photos/male-05.jpg',
          date: '16 hours ago',
          text: 'Any gotchas with nested containers? We hit a few odd sizing loops on our end.',
        },
      ],
    },
    {
      id: 'POST-3',
      author: 'Brian Hughes',
      avatar: 'images/photos/brian-hughes.jpg',
      date: '3 days ago',
      body: [
        'Team offsite recap: two days, one whiteboard, and a roadmap we are actually excited about. Calendar and mailbox have shipped, profile pages are up next.',
      ],
      image: 'images/cards/18-640x480.jpg',
      likes: 86,
      comments: [
        {
          author: 'Tina Harris',
          avatar: 'images/photos/female-01.jpg',
          date: '2 days ago',
          text: 'That whiteboard photo does not do justice to the chaos it contained.',
        },
      ],
    },
  ];

  protected commentCount(post: Post) {
    return post.comments.reduce(
      (count, comment) => count + 1 + (comment.replies?.length ?? 0),
      0
    );
  }
}

type PostComment = {
  author: string;
  avatar: string;
  date: string;
  text: string;
  replies?: Omit<PostComment, 'replies'>[];
};

type Post = {
  id: string;
  author: string;
  avatar: string;
  date: string;
  body: string[];
  image: string | null;
  likes: number;
  comments: PostComment[];
};
