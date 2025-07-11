// ======  VALIDA SI EL USUARIO ESTÁ LOGEADO =======

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const isLogged = localStorage.getItem('session-dashboard') === 'true';
  const router = inject(Router);


  if (isLogged) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }

};
