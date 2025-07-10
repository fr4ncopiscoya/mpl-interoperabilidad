import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const isLogged = localStorage.getItem('session-dashboard') === 'true';
  const router = inject(Router);


  if (isLogged) {
    console.log('autorizado');
    return true;
  } else {
    console.log('no autorizado');
    router.navigate(['/login']);
    return false;
  }

};
