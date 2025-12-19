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
    this.errorMessage = '';
      this.authService.login(this.credentials).subscribe({
        next: success => {
          if (!success) {
            this.errorMessage = 'Vos identifiants sont incorrects';
            return;
          }

          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: err => {
          this.errorMessage = 'Erreur serveur lors de la connexion';
          console.error(err);
        }
    });
  }
}
