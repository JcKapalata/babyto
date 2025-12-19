import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (_route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1), // on ne prend que le premier état disponible
    map(loggedIn => {
      if (loggedIn) return true;
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    })
  );
};
