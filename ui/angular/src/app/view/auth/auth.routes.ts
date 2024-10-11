import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'signin',
        loadComponent: () =>
            import('./signin/signin.component').then(
                (m) => m.SigninComponent
            ),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./register/register.component').then(
                (m) => m.RegisterComponent
            ),
    },
    {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full',
    },
];