import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const adminRoutes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./view/admin/admin.routes').then((m) => m.routes),
    },
];

const userRoutes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./view/user/user.routes').then((m) => m.routes),
    },
];

const siteRoutes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./view/site/site.routes').then((m) => m.routes),
    },
];

const authRoutes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./view/auth/auth.routes').then((m) => m.routes),
    },
];

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'site/home',
    },
    {
        path: 'user',
        loadComponent: () =>
            import('./shared/layouts/main/main.component').then(
                (m) => m.MainComponent
            ),
        children: userRoutes

    },
    {
        path: 'admin',
/*         canActivate: [AuthGuard], */
         loadComponent: () =>
            import('./shared/layouts/main/main.component').then(
                (m) => m.MainComponent
            ),
        children: adminRoutes
    },
    {
        path: 'site',
         loadComponent: () =>
            import('./shared/layouts/main/main.component').then(
                (m) => m.MainComponent
            ),
        children: siteRoutes
    },
    {
        path: 'auth',
         loadComponent: () =>
            import('./shared/layouts/auth/auth.component').then(
                (m) => m.AuthComponent
            ),
        children: authRoutes
    },
    {
        path: '**',
        redirectTo: 'site/404',
    }
];