import { Component, inject } from '@angular/core';
import { AuthService } from '../auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // 1. Injection des services
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // 2. Modèles pour les champs du formulaire
  credentials = { email: '', password: '' };
  errorMessage = '';

  onSubmit() {
    console.log('Tentative de connexion...');
  
  this.authService.login(this.credentials).subscribe({
    next: (success) => {
      if (success) {
        // 1. Récupération de l'URL de retour
        let returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        // 2. Correction si l'URL est un tableau (sécurité pour le routage)
        if (Array.isArray(returnUrl)) {
          returnUrl = '/' + returnUrl.join('/');
        }

        console.log('Login réussi. Signal actuel :', this.authService.isLoggedIn());
        console.log('Redirection vers :', returnUrl);

        // 3. Délai de 10ms pour laisser le Signal et l'Interceptor se synchroniser
        setTimeout(() => {
          this.router.navigateByUrl(returnUrl);
        }, 10);

      } else {
        // Ce bloc est maintenant correctement placé
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    },
    error: (err) => {
      this.errorMessage = 'Une erreur serveur est survenue.';
      console.error('Erreur API Login:', err);
    }
  });
  }
}
