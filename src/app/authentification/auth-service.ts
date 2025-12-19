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

  // Token et état login
  private _token: string | null = localStorage.getItem(this.AUTH_KEY);
  private _isLoggedIn = new BehaviorSubject<boolean>(!!this._token);

  // Observable pour composants et Guard
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  // Récupérer le token courant
  getToken(): string | null {
    return this._token;
  }

  // Login
  login(credentials: { email: string; password: string }): Observable<boolean> {
    return this.http.get<UserClient[]>('api/clients').pipe(
      switchMap(users => {
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
        if (!user) return of(false);

        const sessionTag = Date.now().toString();
        const updatedUser = { ...user, lastSessionTag: sessionTag };

        return this.http.put(`api/clients/${user.id}`, updatedUser).pipe(
          map(() => {
            // Sauvegarde du token et mise à jour de l'état login
            this._token = `${user.id}.${sessionTag}`;
            localStorage.setItem(this.AUTH_KEY, this._token);
            this._isLoggedIn.next(true);
            return true;
          })
        );
      })
    );
  }

  // Logout
  logout(): void {
    this._token = null;
    localStorage.removeItem(this.AUTH_KEY);
    this._isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  // Vérifier expiration du token (optionnel)
  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true; // Malformé = expiré
    }
  }
}
