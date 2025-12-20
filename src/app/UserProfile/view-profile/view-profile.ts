import { Component, inject } from '@angular/core';
import { UserService } from '../user-service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../authentification/auth-service';
import { Loading } from "../../loading/loading";

@Component({
  selector: 'app-view-profile',
  imports: [CommonModule],
  templateUrl: './view-profile.html',
  styleUrl: './view-profile.css',
})
export class ViewProfile {
  // // Injection du service
  // private userService = inject(UserService);
  // private authService = inject(AuthService);

  // // On expose le flux (observable) au template
  // public user$ = this.userService.currentUser$;

  // onLogout(): void {
  //   if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
  //     this.authService.logout();
  //     // La redirection vers /login est déjà gérée dans votre AuthService.logout()
  //   }
  // }
}
