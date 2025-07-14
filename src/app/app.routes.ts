import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission.guard';
import LoginComponent from './pages/login/login.component';

export const routes: Routes = [
    {
        path: 'pide',
        loadComponent: () => import('./pages/dashboard/dashboard.component'),
        canActivate: [authGuard],
        children: [
            {
                path: 'inicio',
                loadComponent: () => import('./pages/bienvenido/bienvenido.component'),
            },

            //==== IDENTIFICACION ====
            {
                path: 'reniec',
                loadComponent: () => import('./pages/identificacion/reniec/reniec.component'),
                canActivate: [permissionGuard]
            },
            {
                path: 'cextranjeria',
                loadComponent: () => import('./pages/identificacion/cextranjeria/cextranjeria.component'),
                canActivate: [permissionGuard]
            },

            //===== PROPIEDADES =====
            {
                path: 'sunarp/partida',
                loadComponent: () => import('./pages/propiedades/sunarp/partida/partida.component'),
                canActivate: [permissionGuard]
            },
            {
                path: 'sunarp/bienes',
                loadComponent: () => import('./pages/propiedades/sunarp/bienes/bienes.component'),
                canActivate: [permissionGuard]
            },
            {
                path: 'sunarp/vehicular',
                loadComponent: () => import('./pages/propiedades/sunarp/vehicular/vehicular.component'),
                canActivate: [permissionGuard]
            },
            {
                path: 'sunedu',
                loadComponent: () => import('./pages/propiedades/sunedu/sunedu.component'),
                canActivate: [permissionGuard]
            },

            //===== ANTECEDENTES =====
            {
                path: 'antecedentes/penales',
                loadComponent: () => import('./pages/antecedentes/penales/penales.component'),
                canActivate: [permissionGuard]
            },
            {
                path: 'antecedentes/policiales',
                loadComponent: () => import('./pages/antecedentes/policiales/policiales.component'),
                canActivate: [permissionGuard]
            },
            {
                path: 'antecedentes/judiciales',
                loadComponent: () => import('./pages/antecedentes/judiciales/judiciales.component'),
                canActivate: [permissionGuard]
            },

            // ===== ADMIN =====
            {
                path: 'admin/gestion',
                loadComponent: () => import('./pages/admin/gestion/gestion.component'),
                canActivate: [permissionGuard]
            },
            {
                path: 'admin/credenciales',
                loadComponent: () => import('./pages/admin/credenciales/credenciales.component'),
                canActivate: [permissionGuard]
            },
            {
                path: '**',
                redirectTo: 'inicio'
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component'),
    },
    {
        path: '',
        component: LoginComponent
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
