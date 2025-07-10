import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const permissionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const menus = JSON.parse(localStorage.getItem('menus') || '[]');
  const currentPath = state.url;

  // const hasPermission = menus.some((menu:any) => menu.RUTA === currentPath && menu.ESTATUS === 1 )

  const hasPermission = menus.some((menu: any) =>
    currentPath.startsWith(menu.RUTA) && menu.ESTATUS === 1
  );

  console.log('tienePermiso: ', hasPermission);


  if (hasPermission) {
    return true;
  } else {
    router.navigate(['/pide/inicio']);
    return false;
  }
};
