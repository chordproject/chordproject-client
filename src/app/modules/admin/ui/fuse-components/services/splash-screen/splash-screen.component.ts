import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseHighlightComponent } from '@fuse/components/highlight';
import { FuseComponentsComponent } from '../../fuse-components.component';

@Component({
    selector: 'splash-screen',
    templateUrl: './splash-screen.component.html',
    standalone: true,
    imports: [MatIconModule, MatButtonModule, FuseHighlightComponent],
})
export class SplashScreenComponent {
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
