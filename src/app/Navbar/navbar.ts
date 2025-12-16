import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AchatService } from '../Achat/achat-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [ 
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    RouterModule, 
    AsyncPipe
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  pageActive: string = 'accueil';
  nombreProduits$;

  constructor(
    private route: Router,
    private achatService: AchatService,
  ){
    this.nombreProduits$ = this.achatService.nombreProduits$;
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
    this.route.navigate(['auth/connexion']);
  }

  goToPannier(){
    this.pageActive = 'panier';
    this.route.navigate(['achat/panier']);
  }
}
