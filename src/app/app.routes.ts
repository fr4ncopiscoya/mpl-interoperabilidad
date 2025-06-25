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

            //==== IDENTIFICACION ====
            {
                path:'reniec',
                loadComponent: () => import('./pages/identificacion/reniec/reniec.component')
            },
            {
                path:'cextranjeria',
                loadComponent: () => import('./pages/identificacion/cextranjeria/cextranjeria.component')
            },

            //===== PROPIEDADES =====
            {
                path:'sunarp/bienes',
                loadComponent: () => import('./pages/propiedades/sunarp/bienes/bienes.component')
            },
            {
                path:'sunarp/vehicular',
                loadComponent: () => import('./pages/propiedades/sunarp/vehicular/vehicular.component')
            },
            {
                path:'sunedu',
                loadComponent: () => import('./pages/propiedades/sunedu/sunedu.component')
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
