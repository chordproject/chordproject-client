import { inject } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { ShortcutsService } from 'app/layout/common/shortcuts/shortcuts.service';
import { firstValueFrom } from 'rxjs';

export const initialDataResolver = async () => {
    const navigationService = inject(NavigationService);
    const shortcutsService = inject(ShortcutsService);

    return Promise.all([
        firstValueFrom(navigationService.get()),
        firstValueFrom(shortcutsService.getAll()),
    ]);
};
