import { UserClientApi } from './../Models/clientUser';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { jwtDecode} from 'jwt-decode';

export interface Credentials{
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private BASE_URL= 'api/clients';

  user = signal<UserClientApi | null | undefined>(undefined);

  login(credentials: Credentials): Observable<UserClientApi| null| undefined>{
    // 1. On cherche l'utilisateur qui a cet email et ce password
    return this.http.get<UserClientApi[]>(`${this.BASE_URL}`).pipe(
      map((users: UserClientApi[]) => {
        const foundUser = users.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (!foundUser) {
          throw new Error('Identifiants incorrects');
        }

        // 2. Simuler un token et stocker
        const mockToken = 'fake-jwt-token-' + foundUser.id;
        localStorage.setItem('token', mockToken);

        const userInstance: UserClientApi = {
          ...foundUser,
          token: mockToken
        };

        // 3. Mettre à jour le signal
        this.user.set(userInstance);
        return userInstance;
      }),
      catchError((err) => {
        console.error('Login Error:', err);
        this.user.set(null);
        return of(null); // Retourne null pour déclencher "impossible de se connecter"
      })
    );
  }

  // getUsers(): Observable<UserClientApi| null | undefined>{
  //   return this.http.get(this.BASE_URL).pipe(
  //     map( (result: any) => {
  //       const userInstance: UserClientApi = {
  //         ...result
  //       }

  //       this.user.set(userInstance);

  //       return this.user();
  //     })
  //   )
  // }

  logout(): Observable<null> {
    return this.http.get(this.BASE_URL).pipe(
      tap( (result: any) => {
        localStorage.removeItem('token');
        this.user.set(null);
      })
    )
  }












  // private readonly AUTH_KEY = 'auth_tk_secur';
  // private http = inject(HttpClient);
  // private router = inject(Router);

  // // Token et état login
  // private _token: string | null;
  // private _isLoggedIn = new BehaviorSubject<boolean>(false);
  // public isLoggedIn$ = this._isLoggedIn.asObservable();

  // constructor() {
  //   this._token = localStorage.getItem(this.AUTH_KEY);
  //   this._isLoggedIn.next(!!this._token);
  //   console.log('[AuthService] Initialisation, token existant:', this._token);
  // }

  // getToken(): string | null {
  //   return this._token;
  // }

  // login(credentials: { email: string; password: string }): Observable<boolean> {
  //   console.log('[AuthService] Tentative login avec', credentials.email);

  //   return this.http.get<UserClient[]>('api/clients').pipe(
  //     switchMap(users => {
  //       const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
  //       if (!user) {
  //         console.log('[AuthService] Identifiants incorrects');
  //         return of(false);
  //       }

  //       const sessionTag = crypto.randomUUID();
  //       const updatedUser = { ...user, lastSessionTag: sessionTag };

  //       return this.http.put(`api/clients/${user.id}`, updatedUser).pipe(
  //         map(() => {
  //           // Stockage token et sessionTag
  //           this._token = `${user.id}.${sessionTag}`;
  //           localStorage.setItem(this.AUTH_KEY, this._token);
  //           localStorage.setItem(`sessionTag_${user.id}`, sessionTag);

  //           this._isLoggedIn.next(true);
  //           console.log('[AuthService] Token enregistré:', this._token);
  //           return true;
  //         })
  //       );
  //     })
  //   );
  // }

  // logout(): void {
  //   const token = this._token;
  //   if (token) {
  //     const [userId] = token.split('.');
  //     localStorage.removeItem(`sessionTag_${userId}`);
  //   }

  //   this._token = null;
  //   localStorage.removeItem(this.AUTH_KEY);
  //   this._isLoggedIn.next(false);
  //   console.log('[AuthService] Logout exécuté');
  //   this.router.navigate(['/login']);
  // }

  // validateSession(token?: string): Observable<boolean> {
  //   const currentToken = token || this.getToken();
  //   if (!currentToken) {
  //     console.log('[AuthService] validateSession: pas de token');
  //     this._isLoggedIn.next(false);
  //     return of(false);
  //   }

  //   const [userId, localTag] = currentToken.split('.');
  //   console.log('[AuthService] validateSession: vérification token', currentToken);

  //   // Comparaison avec la sessionTag côté serveur ou localStorage
  //   const serverTag = localStorage.getItem(`sessionTag_${userId}`);
  //   const valid = serverTag === localTag;
  //   console.log('[AuthService] validateSession: serverTag:', serverTag, 'vs localTag:', localTag, '=> valid=', valid);

  //   if (!valid) this.logout();
  //   else this._isLoggedIn.next(true);

  //   return of(valid);
  // }

}
