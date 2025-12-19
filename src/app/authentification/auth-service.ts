import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { delay, map, Observable, tap } from 'rxjs';
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
  
    console.log('Vérification isLoggedIn - Valeur du Signal :', token);

    if (!token) return false;

    // Si c'est un token simulé "ID.SESSION.EMAIL"
    // On considère qu'il est valide s'il a bien nos 3 parties
    if (token.includes('.')) {
      const parts = token.split('.');
      if (parts.length === 3) {
        // Optionnel : ne vérifier l'expiration QUE si c'est un vrai JWT (3 parties + format Base64)
        // Pour l'instant, on retourne true pour valider ta session unique
        return true; 
      }
      return !this.isTokenExpired(token);
    }

    return true;
  });

  login(credentials: { email: string; password: string }): Observable<boolean> {
    return this.http.get<UserClient[]>('api/clients').pipe(
      map(users => {
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
        
        if (user) {
          // STRATÉGIE SÉCURITÉ : On crée un identifiant unique de session (Timestamp)
          const sessionTag = Date.now().toString();

          // On construit un token qui contient cet ID de session
          // Format: ID.SESSION.EMAIL_B64
          const simulatedToken = `${user.id}.${sessionTag}.${btoa(user.email)}`;
          
          // On sauvegarde (Met à jour le LocalStorage ET le Signal)
          this.saveToken(simulatedToken);

          console.log('Nouvelle session unique générée :', sessionTag);
          return true;
        }
        return false;
      }),

      // 2. On attend 100ms AVANT de renvoyer le résultat au composant
      delay(4000)
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
