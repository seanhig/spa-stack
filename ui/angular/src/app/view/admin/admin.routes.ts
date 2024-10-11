import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'orders',
        loadComponent: () =>
            import('./orders/orders.component').then(
                (m) => m.AllOrdersComponent
            ),
    },
    {
        path: 'products',
        loadComponent: () =>
            import('./products/products.component').then(
                (m) => m.ProductsComponent
            ),
    },
    {
        path: 'shipments',
        loadComponent: () =>
            import('./shipments/shipments.component').then(
                (m) => m.ShipmentsComponent
            ),
    },
    {
        path: '',
        redirectTo: 'orders',
        pathMatch: 'full',
    }
    
];