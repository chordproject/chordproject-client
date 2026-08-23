import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from './dialog/dialog.component';
import { FuseConfirmationConfig } from './confirmation.types';

export type { FuseConfirmationConfig } from './confirmation.types';

const DEFAULT_CONFIG: FuseConfirmationConfig = {
    title: 'confirmation.default_title',
    message: 'confirmation.default_message',
    icon: {
        show: true,
        name: 'triangle-alert',
        color: 'error',
    },
    actions: {
        confirm: {
            show: true,
            label: 'confirmation.confirm',
            color: 'error',
        },
        cancel: {
            show: true,
            label: 'confirmation.cancel',
        },
    },
    dismissible: false,
};

@Injectable({ providedIn: 'root' })
export class FuseConfirmationService {
    private matDialog = inject(MatDialog);

    open(
        config: FuseConfirmationConfig = {}
    ): MatDialogRef<FuseConfirmationDialogComponent, 'confirmed' | 'cancelled'> {
        const userConfig: FuseConfirmationConfig = {
            ...DEFAULT_CONFIG,
            ...config,
            icon: { ...DEFAULT_CONFIG.icon, ...config.icon },
            actions: {
                confirm: {
                    ...DEFAULT_CONFIG.actions?.confirm,
                    ...config.actions?.confirm,
                },
                cancel: {
                    ...DEFAULT_CONFIG.actions?.cancel,
                    ...config.actions?.cancel,
                },
            },
        };

        return this.matDialog.open(FuseConfirmationDialogComponent, {
            autoFocus: false,
            disableClose: !userConfig.dismissible,
            data: userConfig,
            panelClass: 'fuse-confirmation-dialog-panel',
        });
    }
}
