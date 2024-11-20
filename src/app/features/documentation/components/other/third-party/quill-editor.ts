import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'quill-editor',
    standalone: true,
    imports: [MatIconModule, MatButtonModule],
    template: `
        <div class="flex min-w-0 flex-auto flex-col">
            <!-- Header -->
            <div
                class="bg-card flex flex-0 flex-col border-b p-6 dark:bg-transparent sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-8"
            >
                <div class="min-w-0 flex-1">
                    <!-- Breadcrumbs -->
                    <div class="flex flex-wrap items-center font-medium">
                        <div>
                            <a class="whitespace-nowrap text-primary-500"
                                >Documentation</a
                            >
                        </div>
                        <div class="ml-1 flex items-center whitespace-nowrap">
                            <mat-icon
                                class="text-secondary icon-size-5"
                                [svgIcon]="'heroicons_mini:chevron-right'"
                            ></mat-icon>
                            <a class="ml-1 text-primary-500"
                                >Other Components</a
                            >
                        </div>
                        <div class="ml-1 flex items-center whitespace-nowrap">
                            <mat-icon
                                class="text-secondary icon-size-5"
                                [svgIcon]="'heroicons_mini:chevron-right'"
                            ></mat-icon>
                            <span class="text-secondary ml-1">Third Party</span>
                        </div>
                    </div>
                    <!-- Title -->
                    <div class="mt-2">
                        <h2
                            class="truncate text-3xl font-extrabold leading-7 tracking-tight sm:leading-10 md:text-4xl"
                        >
                            Quill Editor
                        </h2>
                    </div>
                </div>
            </div>

            <div class="prose prose-sm max-w-3xl flex-auto p-6 sm:p-10">
                <p>
                    <a
                        href="https://quilljs.com/"
                        rel="noreferrer"
                        target="_blank"
                        >Quill
                    </a>
                    is a free, open source WYSIWYG editor built for the modern
                    web. Fuse supports Quill editor through
                    <a
                        href="https://github.com/KillerCodeMonkey/ngx-quill"
                        rel="noreferrer"
                        target="_blank"
                        >ngx-quill
                    </a>
                    component.
                </p>
                <p>
                    The <strong>Compose</strong> dialog from
                    <strong>Mail</strong> app includes the
                    <em>Quill</em> editor.
                </p>
            </div>
        </div>
    `,
})
export default class QuillEditor {}
