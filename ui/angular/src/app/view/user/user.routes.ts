import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'my-orders',
        loadComponent: () =>
            import('./my-orders/my-orders.component').then(
                (m) => m.MyOrdersComponent
            ),
    },
    {
        path: '',
        redirectTo: 'my-orders',
        pathMatch: 'full',
    },
];