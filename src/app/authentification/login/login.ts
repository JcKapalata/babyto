import { Component, inject, OnDestroy } from '@angular/core';
import { AuthService, Credentials } from '../auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { UserClientApi } from '../../Models/clientUser';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy{

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  private loginSubscription: Subscription| null = null;

  loginFormGroup = this.formBuilder.group({
    'email': ['', [Validators.required]],
    'password': ['', [Validators.required]]
  })

  invalidCredentials = false;

  login(){
    if (this.loginFormGroup.invalid) return;

    this.loginSubscription = this.authService.login(this.loginFormGroup.value as Credentials)
      .subscribe({
        next: (user: UserClientApi | null | undefined) => {
          if (user && user.id) {
            console.log('connexion reussie ...')
            this.router.navigate(['/']);
          } else {
            // Cas où l'API répond 200 mais sans utilisateur (ex: null)
            console.log('impossible de se connecte ...')
            this.invalidCredentials = true;
          }
        },
        error: (err: any) => {
          // Résout l'erreur "implicitly has an any type" et gère l'échec HTTP
          console.error('Erreur de login:', err);
          this.invalidCredentials = true;
        }
    });
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe()
  }





  // // 1. Injection des services
  // private authService = inject(AuthService);
  // private router = inject(Router);
  // private route = inject(ActivatedRoute);

  // // 2. Modèles pour les champs du formulaire
  // credentials = { email: '', password: '' };
  // errorMessage = '';

  // onSubmit() {
  //   this.errorMessage = '';
  //     this.authService.login(this.credentials).subscribe({
  //       next: success => {
  //         if (!success) {
  //           this.errorMessage = 'Vos identifiants sont incorrects';
  //           return;
  //         }

  //         const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  //         this.router.navigateByUrl(returnUrl);
  //       },
  //       error: err => {
  //         this.errorMessage = 'Erreur serveur lors de la connexion';
  //         console.error(err);
  //       }
  //   });
  // }
}
