import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Lire le token directement depuis localStorage pour éviter la dépendance circulaire
  const token = localStorage.getItem('auth_tk_secur');
  const router = inject(Router);

  console.log('[AuthInterceptor] Interception requête vers:', req.url);
  console.log('[AuthInterceptor] Token récupéré:', token);

  let authReq = req;

  // Ajouter le header Authorization si token présent
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('[AuthInterceptor] Header Authorization ajouté');
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.warn('[AuthInterceptor] Erreur HTTP détectée:', error.status, error.url);

      //  Cas 401 sur ressource autre que api/clients → forcer logout
      if (error.status === 401 && !req.url.includes('api/clients')) {
        console.log('[AuthInterceptor] 401 détecté, logout forcé');
        localStorage.removeItem('auth_tk_secur'); // logout "manuel"
        router.navigate(['/login']);
      }

      //  Retourner l’erreur pour propagation
      return throwError(() => error);
    })
  );
};