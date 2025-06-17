import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'pide',
        loadComponent: () => import('./pages/dashboard/dashboard.component'),
        children:[
            {
                path:'inicio',
                loadComponent: () => import('./pages/bienvenido/bienvenido.component')
            },
            {
                path:'reniec',
                loadComponent: () => import('./pages/identificacion/reniec/reniec.component')
            },
            {
                path:'**',
                redirectTo: 'inicio'
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component'),
    },
    {
        path: '**',
        redirectTo: 'pide'
    }
];
