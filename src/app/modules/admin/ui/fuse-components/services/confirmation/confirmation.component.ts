import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseHighlightComponent } from '@fuse/components/highlight';
import { FuseComponentsComponent } from '../../fuse-components.component';

@Component({
    selector: 'confirmation',
    templateUrl: './confirmation.component.html',
    standalone: true,
    imports: [MatIconModule, MatButtonModule, FuseHighlightComponent],
})
export class ConfirmationComponent {
    /**
     * Constructor
     */
    constructor(private _fuseComponentsComponent: FuseComponentsComponent) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the drawer
     */
    toggleDrawer(): void {
        // Toggle the drawer
        this._fuseComponentsComponent.matDrawer.toggle();
    }
}
