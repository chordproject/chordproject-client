import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { MusicGroupService } from 'app/core/firebase/api/music-group.service';
import { MusicGroup, MusicGroupMembership } from 'app/models/music-group';

@Component({
    selector: 'music-group-page',
    standalone: true,
    templateUrl: './music-group.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, MatButtonModule, MatButtonToggleModule, MatFormFieldModule, MatIconModule, MatInputModule, RouterLink, TranslocoModule],
})
export default class MusicGroupComponent implements OnInit, OnDestroy {
    group: MusicGroup | null = null;
    membership: MusicGroupMembership | null = null;
    groupName = '';
    groupCode = '';
    groupMode: 'create' | 'join' = 'create';
    loading = true;
    busy = false;
    errorMessage = '';
    private readonly unsubscribeAll = new Subject<void>();
    private readonly groupService = inject(MusicGroupService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.loadGroup();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    loadGroup(): void {
        this.loading = true;
        this.groupService.getMyGroup().pipe(takeUntil(this.unsubscribeAll)).subscribe({
            next: (result) => {
                this.group = result?.group ?? null;
                this.membership = result?.membership ?? null;
                this.loading = false;
                this.changeDetectorRef.markForCheck();
            },
            error: () => {
                this.errorMessage = 'music_group.load_error';
                this.loading = false;
                this.changeDetectorRef.markForCheck();
            },
        });
    }

    createGroup(): void {
        if (this.busy || !this.groupName.trim()) return;
        this.runAction(this.groupService.createGroup(this.groupName));
    }

    joinGroup(): void {
        if (this.busy || !this.groupCode.trim()) return;
        this.runAction(this.groupService.joinGroup(this.groupCode));
    }

    leaveGroup(): void {
        if (this.busy) return;
        this.busy = true;
        this.groupService.leaveGroup().pipe(takeUntil(this.unsubscribeAll)).subscribe({
            next: () => {
                this.group = null;
                this.membership = null;
                this.busy = false;
                this.changeDetectorRef.markForCheck();
            },
            error: () => {
                this.errorMessage = 'music_group.action_error';
                this.busy = false;
                this.changeDetectorRef.markForCheck();
            },
        });
    }

    private runAction(request: ReturnType<MusicGroupService['createGroup']>): void {
        this.busy = true;
        this.errorMessage = '';
        request.pipe(takeUntil(this.unsubscribeAll)).subscribe({
            next: (group) => {
                this.group = group;
                this.groupName = '';
                this.groupCode = '';
                this.membership = {
                    uid: '',
                    groupId: group.uid,
                    userId: '',
                    role: 'owner',
                    status: 'active',
                    creationDate: null,
                };
                this.busy = false;
                this.changeDetectorRef.markForCheck();
            },
            error: () => {
                this.errorMessage = 'music_group.action_error';
                this.busy = false;
                this.changeDetectorRef.markForCheck();
            },
        });
    }
}
