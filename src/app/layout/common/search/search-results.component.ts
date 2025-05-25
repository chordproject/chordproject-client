import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'search-results',
    templateUrl: './search-results.component.html',
    standalone: true,
    imports: [CommonModule, MatAutocompleteModule, RouterModule, MatOptionModule],
})
export class SearchResultsComponent {
    @Input() resultSets: any;
    @Input() searchValue: string;
    @ViewChild('matAutocomplete') matAutocomplete: MatAutocomplete;

    highlightSearchTerm(text: string, searchTerm: string): string {
        if (!searchTerm) {
            return text;
        }
        const regex = new RegExp(searchTerm, 'gi');
        return text.replace(regex, '<mark>$&</mark>');
    }

    trackByUid(index: number, item: any): string {
        return item.uid;
    }
}
