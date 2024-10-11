import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () =>
            import('./home/home.component').then(
                (m) => m.HomeComponent
            ),
    },
    {
        path: '404',
        loadComponent: () =>
            import('./not-found/not-found.component').then(
                (m) => m.NotFoundComponent
            ),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
];