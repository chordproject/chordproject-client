import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/firebase/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'auth-sign-out',
    templateUrl: './sign-out.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MatIconModule],
    standalone: true,
})
export class AuthSignOutComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _router: Router,
        private _authService: AuthService
    ) {}

    ngOnInit(): void {
        this._authService
            .signOut()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._router.navigate(['/sign-in']);
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
