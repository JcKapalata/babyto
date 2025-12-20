// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from './auth-service';
// import { catchError, filter, map, of, switchMap, take} from 'rxjs';

// export const authGuard: CanActivateFn = (_route, state) => {

//   const authService = inject(AuthService);
//   const router = inject(Router);

//   const token = authService.getToken();
//   if (!token) {
//     return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
//   }

//   return authService.validateSession(token).pipe(
//     map(isValid => {
//       if (isValid) return true;
//       return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
//     })
//   );
// };
