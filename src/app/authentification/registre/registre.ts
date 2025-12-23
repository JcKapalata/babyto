import { Component, inject } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators, 
  AbstractControl, 
  ValidationErrors,
  AbstractControlOptions // <--- AJOUTEZ CET IMPORT
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registre.html',
  styleUrl: './registre.css',
})
export class Registre {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  hidePassword = true; // Par défaut, le mot de passe est masqué
  hideConfirmPassword = true; // Par défaut, le mot de passe de confirmation est masqué

  // Définition du formulaire avec la nouvelle syntaxe// Définition des options pour supprimer le warning de dépréciation
  private formOptions: AbstractControlOptions = {
    validators: [this.passwordMatchValidator]
  };

  registerForm: FormGroup = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(4)]],
    prenom: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    numero: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{7,15}$')]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, this.formOptions); 

  // Validateur personnalisé
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      
      this.authService.register(userData).subscribe({
        next: (response) => {
          if (response) {
            alert('Compte créé !');
            this.router.navigate(['/login']);
          }
        },
        error: (err) => console.error('Erreur inscription', err)
      });
    }
  }
}