import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

export const authGuard: CanActivateFn = (_route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Vérification de la sécurité sur :', state.url);

  // 1. On vérifie via le Signal sécurisé (qui vérifie aussi l'expiration)
  if (authService.isLoggedIn()) {
    return true; // Accès autorisé
  }

  // 2. Si non connecté ou token expiré : Redirection vers Login
  console.warn('Accès refusé - Redirection vers Login');
  
  // On peut passer l'URL actuelle en paramètre pour y revenir après le login
  return router.createUrlTree(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
};
