import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, combineLatest, finalize, from, map, of, switchMap, take, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SongbookService } from 'app/core/firebase/api/songbook.service';
import { UserService } from 'app/core/user/user.service';
import { Songbook } from 'app/models/songbook';
import { environment } from 'environments/environment';
import { SongbookCreateDialogComponent } from './songbook-create-dialog.component';

type SongbookGroup = {
    root: Songbook;
    children: Songbook[];
};

@Component({
    selector: 'chp-songbook-list',
    standalone: true,
    templateUrl: './songbook-list.component.html',
    imports: [AsyncPipe, MatIconModule, MatTooltipModule, RouterLink, TranslocoModule],
})
export class SongbookListComponent implements OnDestroy {
    private _unsubscribeAll = new Subject<void>();

    personalSongbookGroups$: Observable<SongbookGroup[]>;
    recommendedSongbookGroups$: Observable<SongbookGroup[]>;
    deletingGroupIds = signal<Set<string>>(new Set());
    creatingSongbook = signal(false);
    isAuthenticated;
    isHomenaJesus = environment.brand === 'hj';

    constructor(
        private _songbookService: SongbookService,
        private _confirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        private _userService: UserService,
        private _translocoService: TranslocoService,
        private _router: Router,
        private _matDialog: MatDialog
    ) {
        this.isAuthenticated = toSignal(this._userService.isAuthenticated(), { initialValue: false });
        const personalSongbooks$ = this._userService.isAuthenticated().pipe(
            switchMap((isAuthenticated) => isAuthenticated ? this._songbookService.getPersonal() : of([]))
        );

        this.personalSongbookGroups$ = combineLatest([
            personalSongbooks$,
            this.isAuthenticated() ? this._songbookService.getPersonalGroups() : of([]),
        ]).pipe(
            map(([songbooks, groups]) => {
                const groupedSongbookIds = new Set(groups.flatMap(({ group, songbooks: members }) => [group.uid, ...members.map((songbook) => songbook.uid)]));
                const standaloneGroups = this.toGroups(songbooks.filter((songbook) => !groupedSongbookIds.has(songbook.uid)));
                const migratedGroups = groups.map(({ group, songbooks: members }) => ({ root: { ...group, badgeText: '' } as unknown as Songbook, children: members }));
                return [...migratedGroups, ...standaloneGroups];
            })
        );
        this.recommendedSongbookGroups$ = combineLatest([
            this._songbookService.getRecommendedGroups(),
            personalSongbooks$,
        ]).pipe(
            map(([groups, personalSongbooks]) => {
                const copiedSourceIds = new Set(
                    personalSongbooks.filter((songbook) => songbook.deleted !== true).map((songbook) => songbook.copiedFrom).filter(Boolean)
                );
                return groups
                    .map(({ group, songbooks }) => ({
                        root: { ...group, badgeText: '' } as unknown as Songbook,
                        children: songbooks,
                    }))
                    .filter(({ root, children }) => !copiedSourceIds.has(root.uid) || children.some((child) => !copiedSourceIds.has(child.uid)));
            })
        );
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createNewSongbook(): void {
        if (this.creatingSongbook()) {
            return;
        }

        this._matDialog
            .open(SongbookCreateDialogComponent)
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (!result) {
                    return;
                }

                this.creatingSongbook.set(true);
                from(this._songbookService.save({ name: result.name, scope: 'personal' } as Songbook))
                    .pipe(
                        finalize(() => this.creatingSongbook.set(false)),
                        takeUntil(this._unsubscribeAll)
                    )
                    .subscribe((uid) => {
                        if (uid) {
                            this._router.navigate(['/songbook', uid]);
                        }
                    });
            });
    }

    deleteCopy(group: SongbookGroup): void {
        const groupId = group.root.uid;
        if (!groupId || this.deletingGroupIds().has(groupId)) {
            return;
        }

        this._confirmationService.open({
            title: 'Eliminar copia',
            message: `Se eliminara tu copia de "${group.root.name}" y sus cancioneros relacionados.`,
            actions: {
                confirm: {
                    label: 'Eliminar',
                    color: 'error',
                },
                cancel: {
                    label: 'Cancelar',
                },
            },
        })
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result === 'confirmed') {
                    this.setBusy(this.deletingGroupIds, groupId, true);
                    this._songbookService
                        .deleteCopies([group.root.uid])
                        .pipe(
                            finalize(() => this.setBusy(this.deletingGroupIds, groupId, false)),
                            takeUntil(this._unsubscribeAll)
                        )
                        .subscribe((deleted) => {
                            if (!deleted) {
                                this._snackBar.open('No se pudo eliminar la copia', 'Cerrar', {
                                    duration: 3000,
                                    horizontalPosition: 'center',
                                    verticalPosition: 'bottom',
                                    panelClass: ['warning'],
                                });
                            }
                        });
                }
            });
    }

    requireAuthentication(): void {
        this._translocoService
            .selectTranslate('songbook_service.authentication_required')
            .pipe(take(1))
            .subscribe((message) => {
                this._snackBar.open(message, undefined, {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    panelClass: ['warning'],
                });
                this._router.navigate(['/auth/sign-in']);
            });
    }

    trackByFn(index: number, item: Songbook): string | number {
        return item.uid || index;
    }

    trackGroupByFn(index: number, item: SongbookGroup): string | number {
        return item.root.uid || index;
    }

    private toGroups(songbooks: Songbook[]): SongbookGroup[] {
        return this.sortSongbooks(songbooks).map((songbook) => ({ root: songbook, children: [] }));
    }

    private sortSongbooks(songbooks: Songbook[]): Songbook[] {
        return [...songbooks].sort((first, second) => first.name.localeCompare(second.name, 'es', { sensitivity: 'base' }));
    }

    private setBusy(target: typeof this.deletingGroupIds, id: string, busy: boolean): void {
        const values = new Set(target());

        if (busy) {
            values.add(id);
        } else {
            values.delete(id);
        }

        target.set(values);
    }
}
