import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { jwtDecode} from 'jwt-decode';
import { UserClient } from '../Models/clientUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_tk_secur'; // Une seule variable pour éviter les erreurs de frappe
  private http = inject(HttpClient);
  private router = inject(Router);

  // On initialise le signal
  private _token = signal<string | null>(localStorage.getItem(this.AUTH_KEY));

  // isLoggedIn vérifie maintenant DEUX choses : 
  // 1. Si le token existe. 2. S'il n'est pas expiré.
  public isLoggedIn = computed(() => {
    const token = this._token();
  
    // Debug pour voir si le Signal reçoit bien le token après le login
    console.log('Signal _token actuel :', token);

    if (!token) return false;

    // Si c'est un vrai JWT (contient des points), on vérifie l'expiration
    if (token.includes('.')) {
      return !this.isTokenExpired(token);
    }

    return true; // Token de test valide
  });

  login(credentials: { email: string; password: string }): Observable<boolean> {
    // 1. On interroge la table 'clients' de ton InMemoryDb
    return this.http.get<UserClient[]>('api/clients').pipe(
      map(users => {
        // 2. On cherche si un utilisateur correspond aux identifiants
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
        
        if (user) {
          // 3. Si trouvé, on simule la création d'un token et on sauvegarde
          const simulatedToken = user.token || 'token-simule-' + user.id;
          this.saveToken(simulatedToken);
          return true;
        }
        return false; // Identifiants incorrects
      })
    );
  }

  logout() {
    localStorage.removeItem(this.AUTH_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  private saveToken(token: string) {
    localStorage.setItem(this.AUTH_KEY, token);
    this._token.set(token);
  }


  //==============VRAIN MODELS ===========

  // getToken(): string | null {
  //   // Si le token est expiré au moment de l'appel, on déconnecte
  //   const token = this._token();
  //   if (token && this.isTokenExpired(token)) {
  //     this.logout();
  //     return null;
  //   }
  //   return token;
  // }


  //======Pour simulation ==========
  getToken(): string | null {
    const token = this._token();
    // Sécurité : si vrai JWT expiré, on déconnecte
    if (token && token.includes('.') && this.isTokenExpired(token)) {
      this.logout();
      return null;
    }
    return token;
  }

  // --- LOGIQUE DE SÉCURITÉ SUPPLÉMENTAIRE ---

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime; // Renvoie vrai si la date d'expiration est passée
    } catch {
      return true; // Si le token est malformé, on considère qu'il est expiré
    }
  }
}
