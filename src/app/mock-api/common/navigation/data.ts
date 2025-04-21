/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'home',
        title: 'Inicio',
        tooltip: 'Inicio',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/example'
    },
    {
        id: 'library',
        title: 'Libreria',
        tooltip: 'Libreria',
        type: 'basic',
        icon: 'heroicons_outline:musical-note',
        link: '/library',
    },
    {
        id: 'editor',
        title: 'Editor',
        tooltip: 'Editor',
        type: 'basic',
        icon: 'heroicons_outline:code-bracket',
        link: '/editor',
    },
    {
        id: 'songbooks',
        title: 'Cancioneros',
        tooltip: 'Cancioneros',
        type: 'aside',
        icon: 'heroicons_outline:book-open',
        children: [], 
    },
];