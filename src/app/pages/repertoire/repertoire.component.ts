import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { RepertoireService } from 'app/core/firebase/api/repertoire.service';
import { EventType } from 'app/models/event-type';
import { Repertoire } from 'app/models/repertoire';

@Component({
    selector: 'repertoire-page',
    standalone: true,
    templateUrl: './repertoire.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatSelectModule,
        MatTooltipModule,
        RouterLink,
        TranslocoModule,
    ],
})
export class RepertoireComponent implements OnInit, OnDestroy {
    eventTypes: EventType[] = [];
    repertoires: Repertoire[] = [];
    repertoireSearchTerm = '';
    newRepertoireEventTypeId: string | null = null;
    newRepertoireTitle = '';
    newRepertoireDescription = '';
    newRepertoireDate = new Date();
    loading = false;
    private readonly unsubscribeAll = new Subject<void>();

    constructor(
        private readonly repertoireService: RepertoireService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadEventTypes();
        this.loadRepertoires();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    loadEventTypes(): void {
        this.repertoireService
            .getEventTypes()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((eventTypes) => {
                this.eventTypes = eventTypes;
                if (!this.newRepertoireEventTypeId && eventTypes.length) {
                    this.newRepertoireEventTypeId = eventTypes[0].uid;
                }
                this.changeDetectorRef.markForCheck();
            });
    }

    loadRepertoires(): void {
        this.repertoireService
            .getRepertoires()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((repertoires) => {
                this.repertoires = repertoires;
                this.changeDetectorRef.markForCheck();
            });
    }

    async createRepertoire(): Promise<void> {
        const title = this.newRepertoireTitle.trim();
        const description = this.newRepertoireDescription.trim();
        if (!title || !this.newRepertoireEventTypeId || !this.newRepertoireDate) {
            return;
        }

        const uid = await this.repertoireService.saveRepertoire({
            eventTypeId: this.newRepertoireEventTypeId,
            title,
            description: description || undefined,
            date: this.newRepertoireDate,
        } as Repertoire);
        if (uid) {
            this.newRepertoireTitle = '';
            this.newRepertoireDescription = '';
            this.loadRepertoires();
        }
    }

    trackByUid(_index: number, item: { uid: string }): string {
        return item.uid;
    }

    get filteredRepertoires(): Repertoire[] {
        const term = this.normalize(this.repertoireSearchTerm);
        if (!term) {
            return this.repertoires;
        }

        return this.repertoires.filter(
            (repertoire) => this.normalize(repertoire.title).includes(term) || this.normalize(repertoire.description ?? '').includes(term)
        );
    }

    /** Accent-insensitive comparison so "biblica"/"bíblica" or "misa"/"Misa" match the same way. */
    private normalize(value: string): string {
        return value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
}
