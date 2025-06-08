import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ChpEditorComponent } from 'app/components/editor/editor/editor.component';
import { ChpViewerComponent } from 'app/components/viewer/viewer/viewer.component';
import { EditorService } from 'app/core/chordpro/editor.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { Song } from 'app/models/song';
import { Tag } from 'app/models/tag';
import { Subject, takeUntil } from 'rxjs';
import { SongsListComponent } from '../list/list.component';

@Component({
    selector: 'songs-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButtonModule,
        MatTooltipModule,
        RouterLink,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        TextFieldModule,
        FuseFindByKeyPipe,
        ChpViewerComponent,
        ChpEditorComponent,
    ],
})
export class SongsDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    song: Song;
    songs: Song[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    songContent: string = '';

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _songsListComponent: SongsListComponent,
        private _songsService: SongService,
        private _fuseConfirmationService: FuseConfirmationService,
        private editorService: EditorService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    ) {}

    ngOnInit(): void {
        // Open the drawer
        this._songsListComponent.matDrawer.open();

        // Get the song
        this._songsService.song$.pipe(takeUntil(this._unsubscribeAll)).subscribe((song: Song) => {
            this._songsListComponent.matDrawer.open();
            this.song = song;
            this.songContent = song?.content || '';
            this.toggleEditMode(false);
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // // Get the tags
        // this._songsService.tags$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((tags: Tag[]) => {
        //         this.tags = tags;
        //         this.filteredTags = tags;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._songsListComponent.matDrawer.close();
    }

    toggleEditMode(editMode: boolean | null = null): void {
        // Actualizar el estado según el parámetro
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Si estamos entrando en modo edición
        if (this.editMode && this.song) {
            // Asegurarnos de que songContent contiene el contenido actual
            this.songContent = this.song.content || '';

            // Forzar la detección de cambios
            this._changeDetectorRef.detectChanges();

            // Dar tiempo para que Angular actualice la vista antes de intentar modificar el DOM
            setTimeout(() => {
                this._changeDetectorRef.detectChanges();
            }, 100);
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    updateSong(): void {
        const updatedSong = this.editorService.prepareSongFromContent(this.songContent);
        this.song = { ...this.song, ...updatedSong };
        this._songsService.save(this.song).then(() => {
            this.toggleEditMode(false);
        });
    }

    deleteSong(): void {
        this.editorService.confirmAndDelete(this.song).subscribe((success) => {
            if (success) {
                this._router.navigate(['../'], {
                    relativeTo: this._activatedRoute,
                });
            }
            this._changeDetectorRef.markForCheck();
        });
    }

    openTagsPanel(): void {
        // Create the overlay
        this._tagsPanelOverlayRef = this._overlay.create({
            backdropClass: '',
            hasBackdrop: true,
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(this._tagsPanelOrigin.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                ]),
        });

        // Subscribe to the attachments observable
        this._tagsPanelOverlayRef.attachments().subscribe(() => {
            // Add a class to the origin
            this._renderer2.addClass(this._tagsPanelOrigin.nativeElement, 'panel-opened');

            // Focus to the search input once the overlay has been attached
            this._tagsPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(this._tagsPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._tagsPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._tagsPanelOverlayRef.backdropClick().subscribe(() => {
            // Remove the class from the origin
            this._renderer2.removeClass(this._tagsPanelOrigin.nativeElement, 'panel-opened');

            // If overlay exists and attached...
            if (this._tagsPanelOverlayRef && this._tagsPanelOverlayRef.hasAttached()) {
                // Detach it
                this._tagsPanelOverlayRef.detach();

                // Reset the tag filter
                this.filteredTags = this.tags;

                // Toggle the edit mode off
                this.tagsEditMode = false;
            }

            // If template portal exists and attached...
            if (templatePortal && templatePortal.isAttached) {
                // Detach it
                templatePortal.detach();
            }
        });
    }

    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }

    filterTags(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter((tag) => tag.title.toLowerCase().includes(value));
    }

    filterTagsInputKeyDown(event): void {
        // // Return if the pressed key is not 'Enter'
        // if (event.key !== 'Enter') {
        //     return;
        // }
        // // If there is no tag available...
        // if (this.filteredTags.length === 0) {
        //     // Create the tag
        //     this.createTag(event.target.value);
        //     // Clear the input
        //     event.target.value = '';
        //     // Return
        //     return;
        // }
        // // If there is a tag...
        // const tag = this.filteredTags[0];
        // const isTagApplied = this.song.tags.find((id) => id === tag.id);
        // // If the found tag is already applied to the song...
        // if (isTagApplied) {
        //     // Remove the tag from the song
        //     this.removeTagFromSong(tag);
        // } else {
        //     // Otherwise add the tag to the song
        //     this.addTagToSong(tag);
        // }
    }

    createTag(title: string): void {
        // const tag = {
        //     title,
        // };
        // // Create tag on the server
        // this._songsService.createTag(tag).subscribe((response) => {
        //     // Add the tag to the song
        //     this.addTagToSong(response);
        // });
    }

    updateTagTitle(tag: Tag, event): void {
        // // Update the title on the tag
        // tag.title = event.target.value;
        // // Update the tag on the server
        // this._songsService
        //     .updateTag(tag.id, tag)
        //     .pipe(debounceTime(300))
        //     .subscribe();
        // // Mark for check
        // this._changeDetectorRef.markForCheck();
    }

    deleteTag(tag: Tag): void {
        // // Delete the tag from the server
        // this._songsService.deleteTag(tag.id).subscribe();
        // // Mark for check
        // this._changeDetectorRef.markForCheck();
    }

    addTagToSong(tag: Tag): void {
        // // Add the tag
        // this.song.tags.unshift(tag.id);
        // // Update the song form
        // this.songForm.get('tags').patchValue(this.song.tags);
        // // Mark for check
        // this._changeDetectorRef.markForCheck();
    }

    removeTagFromSong(tag: Tag): void {
        // // Remove the tag
        // this.song.tags.splice(
        //     this.song.tags.findIndex((item) => item === tag.id),
        //     1
        // );
        // // Update the song form
        // this.songForm.get('tags').patchValue(this.song.tags);
        // // Mark for check
        // this._changeDetectorRef.markForCheck();
    }

    toggleSongTag(tag: Tag): void {
        // if (this.song.tags.includes(tag.id)) {
        //     this.removeTagFromSong(tag);
        // } else {
        //     this.addTagToSong(tag);
        // }
    }

    shouldShowCreateTagButton(inputValue: string): boolean {
        return !!!(
            inputValue === '' || this.tags.findIndex((tag) => tag.title.toLowerCase() === inputValue.toLowerCase()) > -1
        );
    }

    openFullEditor(): void {
        if (this.song?.uid) {
            this._router.navigate(['/songs/create', this.song.uid]);
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
