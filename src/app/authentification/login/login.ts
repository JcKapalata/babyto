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
    this.authService.login(this.credentials).subscribe({
      next: (success) => {
        if (success) {
          if (success) {
            // On récupère la destination (ex: /achat/achat-direct/18)
            let returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

            // Sécurité : si returnUrl est un tableau (rare mais possible), on le répare
            if (Array.isArray(returnUrl)) {
              returnUrl = '/' + returnUrl.join('/');
            }

            console.log('Connexion réussie. Redirection vers :', returnUrl);

            // ASTUCE PRODUCTION : Un léger délai pour laisser le Signal se propager
            // Cela évite que le Guard ne rejette la redirection à cause d'un micro-délai
            setTimeout(() => {
              this.router.navigateByUrl(returnUrl);
            }, 10);
          
          } else {
            this.errorMessage = 'Email ou mot de passe incorrect.';
          }
        } 
      },
      error: (err) => {
        this.errorMessage = 'Une erreur serveur est survenue.';
        console.error(err);
      }
    });
  }
}
