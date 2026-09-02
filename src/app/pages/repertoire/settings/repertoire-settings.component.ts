import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RepertoireService } from 'app/core/firebase/api/repertoire.service';
import { EventSlot } from 'app/models/event-slot';
import { EventType } from 'app/models/event-type';
import { Repertoire } from 'app/models/repertoire';
import { RepertoireGroup, RepertoireGroupWithChildren } from 'app/models/repertoire-group';

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
        MatCheckboxModule,
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
    repertoires: Repertoire[] = [];
    repertoireGroups: RepertoireGroupWithChildren[] = [];
    selectedEventType: EventType | null = null;
    selectedRepertoireGroup: RepertoireGroup | null = null;
    eventSlots: EventSlot[] = [];
    newEventTypeName = '';
    newRepertoireGroupName = '';
    newSlotName = '';
    editingSlotId: string | null = null;
    editingSlotName = '';
    editingEventTypeId: string | null = null;
    editingEventTypeName = '';
    private readonly unsubscribeAll = new Subject<void>();

    constructor(
        private readonly repertoireService: RepertoireService,
        private readonly confirmationService: FuseConfirmationService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadEventTypes();
        this.loadRepertoires();
        this.loadRepertoireGroups();
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

    loadRepertoires(): void {
        this.repertoireService
            .getRepertoires()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((repertoires) => {
                this.repertoires = repertoires;
                this.changeDetectorRef.markForCheck();
            });
    }

    loadRepertoireGroups(): void {
        this.repertoireService
            .getRepertoireGroups()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((groups) => {
                this.repertoireGroups = groups;
                if (this.selectedRepertoireGroup) {
                    this.selectedRepertoireGroup = groups.find(
                        ({ group }) => group.uid === this.selectedRepertoireGroup?.uid
                    )?.group ?? null;
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

    async createRepertoireGroup(): Promise<void> {
        const name = this.newRepertoireGroupName.trim();
        if (!name) {
            return;
        }

        const uid = await this.repertoireService.saveRepertoireGroup({ name } as RepertoireGroup);
        if (uid) {
            this.newRepertoireGroupName = '';
            this.selectedRepertoireGroup = { uid, name } as RepertoireGroup;
            this.loadRepertoireGroups();
        }
    }

    selectRepertoireGroup(group: RepertoireGroup): void {
        this.selectedRepertoireGroup = group;
    }

    isRepertoireInSelectedGroup(repertoireId: string): boolean {
        return !!this.repertoireGroups
            .find(({ group }) => group.uid === this.selectedRepertoireGroup?.uid)
            ?.repertoires.some((repertoire) => repertoire.uid === repertoireId);
    }

    get selectedGroupRepertoires(): Repertoire[] {
        return this.repertoireGroups
            .find(({ group }) => group.uid === this.selectedRepertoireGroup?.uid)
            ?.repertoires ?? [];
    }

    async toggleRepertoireInSelectedGroup(repertoireId: string, checked: boolean): Promise<void> {
        if (!this.selectedRepertoireGroup?.uid) {
            return;
        }

        const current = this.repertoireGroups.find(({ group }) => group.uid === this.selectedRepertoireGroup?.uid);
        const repertoireIds = current?.repertoires.map(({ uid }) => uid) ?? [];
        const updatedRepertoireIds = checked
            ? [...repertoireIds, repertoireId]
            : repertoireIds.filter((id) => id !== repertoireId);

        if (await this.repertoireService.saveRepertoireGroupMembers(this.selectedRepertoireGroup.uid, updatedRepertoireIds)) {
            this.loadRepertoireGroups();
        }
    }

    async onRepertoireGroupDrop(event: CdkDragDrop<Repertoire[]>): Promise<void> {
        if (event.previousIndex === event.currentIndex || !this.selectedRepertoireGroup?.uid) {
            return;
        }

        const reordered = [...this.selectedGroupRepertoires];
        moveItemInArray(reordered, event.previousIndex, event.currentIndex);
        this.repertoireGroups = this.repertoireGroups.map((groupWithChildren) =>
            groupWithChildren.group.uid === this.selectedRepertoireGroup?.uid
                ? { ...groupWithChildren, repertoires: reordered }
                : groupWithChildren
        );
        this.changeDetectorRef.markForCheck();

        await this.repertoireService.saveRepertoireGroupMembers(
            this.selectedRepertoireGroup.uid,
            reordered.map((repertoire) => repertoire.uid)
        );
    }

    deleteRepertoireGroup(group: RepertoireGroup): void {
        this.confirmationService
            .open({
                title: 'repertoire_page.delete_group_confirm_title',
                message: 'repertoire_page.delete_group_confirm_message',
                icon: { name: 'trash-2', color: 'error' },
                actions: {
                    confirm: { label: 'repertoire_page.delete_group', color: 'error' },
                    cancel: { label: 'repertoire_page.cancel_edit' },
                },
            })
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(async (result) => {
                if (result === 'confirmed' && (await this.repertoireService.deleteRepertoireGroup(group.uid))) {
                    if (this.selectedRepertoireGroup?.uid === group.uid) {
                        this.selectedRepertoireGroup = null;
                    }
                    this.loadRepertoireGroups();
                }
            });
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

    deleteSlot(slot: EventSlot): void {
        if (!slot.uid) {
            return;
        }

        this.confirmationService
            .open({
                title: 'repertoire_page.delete_space_confirm_title',
                message: 'repertoire_page.delete_space_confirm_message',
                icon: {
                    name: 'trash-2',
                    color: 'error',
                },
                actions: {
                    confirm: {
                        label: 'repertoire_page.delete_space',
                        color: 'error',
                    },
                    cancel: {
                        label: 'repertoire_page.cancel_edit',
                    },
                },
            })
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(async (result) => {
                if (result === 'confirmed') {
                    const success = await this.repertoireService.deleteEventSlot(slot.uid);
                    if (success) {
                        this.eventSlots = this.eventSlots.filter((item) => item.uid !== slot.uid);
                        this.changeDetectorRef.markForCheck();
                    }
                }
            });
    }

    startEditingEventType(eventType: EventType, event: MouseEvent): void {
        event.stopPropagation();
        this.editingEventTypeId = eventType.uid;
        this.editingEventTypeName = eventType.name;
    }

    cancelEditingEventType(): void {
        this.editingEventTypeId = null;
        this.editingEventTypeName = '';
    }

    async saveEventTypeName(eventType: EventType): Promise<void> {
        const name = this.editingEventTypeName.trim();
        if (!name || !eventType.uid) {
            return;
        }

        const uid = await this.repertoireService.saveEventType({
            ...eventType,
            name,
        });
        if (uid) {
            this.eventTypes = this.eventTypes.map((currentEventType) =>
                currentEventType.uid === eventType.uid ? { ...currentEventType, name } : currentEventType
            );
            if (this.selectedEventType?.uid === eventType.uid) {
                this.selectedEventType = { ...this.selectedEventType, name };
            }
            this.cancelEditingEventType();
            this.changeDetectorRef.markForCheck();
        }
    }

    deleteEventType(eventType: EventType, event: MouseEvent): void {
        event.stopPropagation();
        if (!eventType.uid) {
            return;
        }

        this.confirmationService
            .open({
                title: 'repertoire_page.delete_event_type_confirm_title',
                message: 'repertoire_page.delete_event_type_confirm_message',
                icon: {
                    name: 'trash-2',
                    color: 'error',
                },
                actions: {
                    confirm: {
                        label: 'repertoire_page.delete_event_type',
                        color: 'error',
                    },
                    cancel: {
                        label: 'repertoire_page.cancel_edit',
                    },
                },
            })
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(async (result) => {
                if (result === 'confirmed') {
                    const success = await this.repertoireService.deleteEventType(eventType.uid);
                    if (success) {
                        if (this.selectedEventType?.uid === eventType.uid) {
                            this.selectedEventType = null;
                            this.eventSlots = [];
                        }
                        this.loadEventTypes();
                    }
                }
            });
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
