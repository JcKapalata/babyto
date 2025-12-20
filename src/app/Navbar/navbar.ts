import { Component, inject, OnDestroy } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AchatService } from '../Achat/achat-service';
import { AsyncPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../authentification/auth-service';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [ 
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    RouterModule, 
    AsyncPipe,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnDestroy{

  pageActive: string;
  nombreProduits$;
  public authService = inject(AuthService);

  private logoutSubscription: Subscription|null = null;

  constructor(
    private router: Router,
    private achatService: AchatService,
  ){
    this.nombreProduits$ = this.achatService.nombreProduits$;
  }


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

  goToAcceuil(){
    this.pageActive = 'accueil';
    this.router.navigate(['accueil']);
  }

  goToProduitList(){
    this.pageActive = 'boutique';
    this.router.navigate(['boutique/produits-list']);
  }

  goToConnexion(){
    this.pageActive = 'connexion';
    this.router.navigate(['login']);
  }

  goToPannier(){
    this.pageActive = 'panier';
    this.router.navigate(['achat/panier']);
  }

  goToProfile(){
    this.pageActive = 'profile';
    this.router.navigate(['mon-compte/profil'])
  }
}
