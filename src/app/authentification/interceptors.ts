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
      // Si le code est 401, c'est que la session a été invalidée ailleurs
      if (error.status === 401) {
        console.warn('Session invalidée ou expirée. Déconnexion automatique.');
        
        // On vide le localStorage et le Signal
        authService.logout(); 
        
        // On redirige vers le login
        router.navigate(['/login']);
      }
      
      // On propage l'erreur pour que les services puissent la gérer si besoin
      return throwError(() => error);
    })
  )
};