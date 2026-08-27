import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { FeedbackService } from 'app/core/firebase/api/feedback.service';
import { UserService } from 'app/core/user/user.service';
import { Feedback, FeedbackType } from 'app/models/feedback';

@Component({
    selector: 'admin-feedback-list',
    standalone: true,
    templateUrl: './list.html',
    imports: [CommonModule, MatIconModule, TranslocoModule],
})
export default class FeedbackList implements OnInit, OnDestroy {
    private _unsubscribeAll = new Subject<void>();

    isAdmin = signal(false);
    feedback = signal<Feedback[]>([]);
    selectedType = signal<FeedbackType | 'all'>('all');

    constructor(
        private _userService: UserService,
        private _feedbackService: FeedbackService
    ) {}

    ngOnInit(): void {
        this._userService.isAdmin().pipe(takeUntil(this._unsubscribeAll)).subscribe((isAdmin) => {
            this.isAdmin.set(isAdmin);
            if (isAdmin) {
                this._feedbackService.getAllOpen().pipe(takeUntil(this._unsubscribeAll)).subscribe((feedback) => this.feedback.set(feedback));
            }
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    setType(type: FeedbackType | 'all'): void {
        this.selectedType.set(type);
    }

    filteredFeedback(): Feedback[] {
        const type = this.selectedType();
        return type === 'all' ? this.feedback() : this.feedback().filter((item) => item.type === type);
    }

    countByType(type: FeedbackType): number {
        return this.feedback().filter((item) => item.type === type).length;
    }

    trackByFn(index: number, item: Feedback): string | number {
        return item.uid || index;
    }

    toDate(value: unknown): Date | null {
        return (value as { toDate?: () => Date })?.toDate?.() ?? null;
    }
}
