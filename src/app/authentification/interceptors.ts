import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken(); 

  // 1. AJOUT DU TOKEN
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 2. GESTION DU RETOUR SERVEUR (Pour le "Dernier connecté gagne")
  return next(authReq).pipe(
  catchError((error: HttpErrorResponse) => {
    // On ne déconnecte que si c'est un vrai 401 sur une ressource de données
    if (error.status === 401 && !req.url.includes('api/clients')) {
      authService.logout(); 
      router.navigate(['/login']);
    }
    return throwError(() => error);
  })
);
};