import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user-service';
import { AuthService } from '../../authentification/auth-service';
import { Loading } from '../../loading/loading';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  imports: [CommonModule, Loading],
  templateUrl: './view-profile.html',
  styleUrl: './view-profile.css',
})
export class ViewProfile implements OnDestroy{
  // Injection des services
  public userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private logoutSubscription: Subscription|null = null;

  /**
   * On utilise directement le signal currentProfile du service.
   * Il se mettra à jour tout seul si les données changent.
   */
  public profile = this.userService.currentProfile;

  logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.logoutSubscription = this.authService.logout().subscribe({
        next: _ => {
          this.router.navigate(['login'])
        },
        error: _ =>{
          this.router.navigate(['login'])
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.logoutSubscription?.unsubscribe
  }
}
