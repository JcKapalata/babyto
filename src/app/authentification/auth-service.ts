import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, delay, map, Observable, of, switchMap, tap } from 'rxjs';
import { jwtDecode} from 'jwt-decode';
import { UserClient } from '../Models/clientUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_tk_secur';
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token: string | null = localStorage.getItem(this.AUTH_KEY);
  private _isLoggedIn = new BehaviorSubject<boolean | null>(null); // null = session non validée
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor() {
    console.log('[AuthService] Initialisation, token existant:', this._token);
    this.initSession();
  }

  private initSession() {
    const token = localStorage.getItem(this.AUTH_KEY);
    if (!token) {
      console.log('[AuthService] Aucun token trouvé, session non connectée');
      this._isLoggedIn.next(false);
      return;
    }

    console.log('[AuthService] Token trouvé, validation session...');
    this.validateSession(token).subscribe(valid => {
      console.log('[AuthService] Résultat validation session:', valid);
    });
  }

  getToken(): string | null {
    return this._token;
  }

  login(credentials: { email: string; password: string }): Observable<boolean> {
    return this.http.get<UserClient[]>('api/clients').pipe(
      switchMap(users => {
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
        if (!user) return of(false);

        const sessionTag = crypto.randomUUID();
        const updatedUser = { ...user, lastSessionTag: sessionTag };

        // Mettre à jour la "base" simulée
        return this.http.put(`api/clients/${user.id}`, updatedUser).pipe(
          map(() => {
            this._token = `${user.id}.${sessionTag}`;
            localStorage.setItem(this.AUTH_KEY, this._token);

            // --- Ajouté pour persistance sur refresh ---
            localStorage.setItem(`sessionTag_${user.id}`, sessionTag);

            this._isLoggedIn.next(true);
            console.log('[AuthService] Token enregistré:', this._token);
            return true;
          })
        );
      })
    )
  }

  logout(): void {
    console.log('[AuthService] Logout exécuté');
    this._token = null;
    localStorage.removeItem(this.AUTH_KEY);
    this._isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  validateSession(token?: string): Observable<boolean> {
    const currentToken = token || this.getToken();
    if (!currentToken) {
      console.log('[AuthService] validateSession: pas de token');
      this._isLoggedIn.next(false);
      return of(false);
    }

    const [userId, localTag] = currentToken.split('.');
    console.log('[AuthService] validateSession: vérification token', currentToken);

    // --- Utilisation du sessionTag stocké côté client pour persistance ---
    const storedTag = localStorage.getItem(`sessionTag_${userId}`);
    if (storedTag && storedTag === localTag) {
      console.log('[AuthService] validateSession: sessionTag local valide');
      this._isLoggedIn.next(true);
      return of(true);
    }

    // --- Si pas de tag local ou divergence, tentative vérification serveur ---
    return this.http.get<UserClient>(`api/clients/${userId}`).pipe(
      map(user => {
        const valid = user.lastSessionTag === localTag;
        console.log('[AuthService] validateSession: lastSessionTag serveur:', user.lastSessionTag, ' vs token:', localTag, ' => valid=', valid);
        if (!valid) this.logout();
        else this._isLoggedIn.next(true);
        return valid;
      }),
      catchError(err => {
        console.error('[AuthService] Erreur validateSession:', err);
        this.logout();
        return of(false);
      })
    );
  }
}
