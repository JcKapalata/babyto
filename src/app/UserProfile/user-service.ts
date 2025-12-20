import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../authentification/auth-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private http = inject(HttpClient);
  // private authService = inject(AuthService);

  // /**
  //  * FLUX UNIQUE DU PROFIL
  //  * - S'écoute automatiquement quand l'utilisateur se connecte/déconnecte.
  //  * - shareReplay(1) : Évite de refaire un appel HTTP inutilement.
  //  */
  // public readonly currentUser$: Observable<UserClient | null> = this.authService.isLoggedIn$.pipe(
  //   switchMap(isLoggedIn => {
  //     if (!isLoggedIn) return of(null);
  //     return this.fetchProfile();
  //   }),
  //   shareReplay(1), // Très important pour la performance
  //   catchError(err => {
  //     console.error('[UserService] Erreur critique profil:', err);
  //     this.authService.logout(); // Sécurité : déconnexion si les données sont corrompues
  //     return of(null);
  //   })
  // );

  // private fetchProfile(): Observable<UserClient | null> {
  //   const token = this.authService.getToken();
  //   if (!token) return of(null);

  //   const [userId] = token.split('.');
    
  //   // On récupère les données fraîches depuis l'API
  //   return this.http.get<UserClient>(`api/clients/${userId}`).pipe(
  //     tap(user => console.log('[UserService] Profil synchronisé avec succès'))
  //   );
  // }
}
