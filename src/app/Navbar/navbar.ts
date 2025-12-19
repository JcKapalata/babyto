import { Component, inject } from '@angular/core';
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
export class Navbar {

  pageActive: string;
  nombreProduits$;
  public authService = inject(AuthService);

  constructor(
    private route: Router,
    private achatService: AchatService,
  ){
    this.nombreProduits$ = this.achatService.nombreProduits$;
  }


  onLogout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
    }
  }

  goToAcceuil(){
    this.pageActive = 'accueil';
    this.route.navigate(['accueil']);
  }

  goToProduitList(){
    this.pageActive = 'boutique';
    this.route.navigate(['boutique/produits-list']);
  }

  goToConnexion(){
    this.pageActive = 'connexion';
    this.route.navigate(['login']);
  }

  goToPannier(){
    this.pageActive = 'panier';
    this.route.navigate(['achat/panier']);
  }
}
