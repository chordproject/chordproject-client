import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { RepertoireService } from 'app/core/firebase/api/repertoire.service';
import { EventSlot } from 'app/models/event-slot';
import { EventType } from 'app/models/event-type';

@Component({
    selector: 'repertoire-settings-page',
    standalone: true,
    templateUrl: './repertoire-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        DragDropModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        RouterLink,
        TranslocoModule,
    ],
})
export class RepertoireSettingsComponent implements OnInit, OnDestroy {
    eventTypes: EventType[] = [];
    selectedEventType: EventType | null = null;
    eventSlots: EventSlot[] = [];
    newEventTypeName = '';
    newSlotName = '';
    editingSlotId: string | null = null;
    editingSlotName = '';
    private readonly unsubscribeAll = new Subject<void>();

    constructor(
        private readonly repertoireService: RepertoireService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadEventTypes();
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
                if (!this.selectedEventType && eventTypes.length) {
                    this.selectEventType(eventTypes[0]);
                }
                this.changeDetectorRef.markForCheck();
            });
    }

    selectEventType(eventType: EventType): void {
        this.selectedEventType = eventType;
        this.eventSlots = [];
        this.repertoireService
            .getEventSlots(eventType.uid)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((eventSlots) => {
                this.eventSlots = eventSlots;
                this.changeDetectorRef.markForCheck();
            });
    }

    async createEventType(): Promise<void> {
        const name = this.newEventTypeName.trim();
        if (!name) {
            return;
        }

        const uid = await this.repertoireService.saveEventType({ name } as EventType);
        if (uid) {
            this.newEventTypeName = '';
            this.loadEventTypes();
        }
    }

    async createEventSlot(): Promise<void> {
        const name = this.newSlotName.trim();
        if (!name || !this.selectedEventType?.uid) {
            return;
        }

        const uid = await this.repertoireService.saveEventSlot({
            eventTypeId: this.selectedEventType.uid,
            name,
            order: this.eventSlots.length,
            required: false,
        } as EventSlot);
        if (uid) {
            this.newSlotName = '';
            this.eventSlots = [
                ...this.eventSlots,
                {
                    uid,
                    eventTypeId: this.selectedEventType.uid,
                    name,
                    order: this.eventSlots.length,
                    required: false,
                } as EventSlot,
            ];
            this.changeDetectorRef.markForCheck();
        }
    }

    startEditingSlot(slot: EventSlot): void {
        this.editingSlotId = slot.uid;
        this.editingSlotName = slot.name;
    }

    cancelEditingSlot(): void {
        this.editingSlotId = null;
        this.editingSlotName = '';
    }

    async saveSlotName(slot: EventSlot): Promise<void> {
        const name = this.editingSlotName.trim();
        if (!name || !slot.uid) {
            return;
        }

        const uid = await this.repertoireService.saveEventSlot({
            ...slot,
            name,
        });
        if (uid) {
            this.eventSlots = this.eventSlots.map((currentSlot) =>
                currentSlot.uid === slot.uid ? { ...currentSlot, name } : currentSlot
            );
            this.cancelEditingSlot();
            this.changeDetectorRef.markForCheck();
        }
    }

    onSlotDrop(event: CdkDragDrop<EventSlot[]>): void {
        if (event.previousIndex === event.currentIndex || !this.selectedEventType?.uid) {
            return;
        }

        const reorderedSlots = [...this.eventSlots];
        moveItemInArray(reorderedSlots, event.previousIndex, event.currentIndex);
        this.eventSlots = reorderedSlots.map((slot, index) => ({ ...slot, order: index }));
        this.repertoireService.updateEventSlotOrder(
            this.selectedEventType.uid,
            this.eventSlots.map((slot) => ({ uid: slot.uid, order: slot.order }))
        );
        this.changeDetectorRef.markForCheck();
    }

    trackByUid(_index: number, item: { uid: string }): string {
        return item.uid;
    }
}
