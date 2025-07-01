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

            //===== ANTECEDENTES =====
            {
                path:'antecedentes/penales',
                loadComponent: () => import('./pages/antecedentes/penales/penales.component')
            },
            {
                path:'antecedentes/policiales',
                loadComponent: () => import('./pages/antecedentes/policiales/policiales.component')
            },
            {
                path:'antecedentes/judiciales',
                loadComponent: () => import('./pages/antecedentes/judiciales/judiciales.component')
            },

            // ===== ADMIN =====
            {
                path:'admin/gestion',
                loadComponent: () => import('./pages/admin/gestion/gestion.component')
            },
            {
                path:'admin/credenciales',
                loadComponent: () => import('./pages/admin/gestion/gestion.component')
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
