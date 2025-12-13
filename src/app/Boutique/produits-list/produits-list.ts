import { AchatService } from './../../Achat/achat-service';
import { Component, OnInit } from '@angular/core';
import { Produit } from '../../Models/produits';
import {  Router } from '@angular/router';
import { BoutiqueService } from '../boutique-service';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {  MatIconModule } from "@angular/material/icon";
import { CommandeItem } from '../../Models/commande';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupeProduits } from '../../Models/groupeProduits';
import { KeyValuePipe } from '@angular/common';


@Component({
  selector: 'app-produits-list',
  imports: [MatCardModule, MatButtonModule, MatIconModule, KeyValuePipe],
  templateUrl: './produits-list.html',
  styleUrl: './produits-list.css',
  providers: [BoutiqueService]
})
export class ProduitsList implements OnInit{

  produitsGroupes: GroupeProduits = {};
  showAllProduits: Map<string, boolean> = new Map();
  
  constructor(
    private boutiqueService: BoutiqueService,
    private achatService: AchatService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ){}

  ngOnInit() {
    this.boutiqueService.getProduitsList().subscribe(
      (produitsGroupes) => {
        this.produitsGroupes = produitsGroupes;
        console.log('Produits reçus et regroupés par le service.');
      }
    );
  }

  // masque ou visibilite du produit
  toggleShowAll(groupKey: string): void {
    const currentState = this.showAllProduits.get(groupKey) || false;
    this.showAllProduits.set(groupKey, !currentState);
  }

  isShowingAll(groupKey: string): boolean {
    return this.showAllProduits.get(groupKey) || false;
  }


  goToDetailProduit(produit: Produit){
    this.router.navigate(['boutique/produit-detail', produit.id])
  }

  goToAchatDirect(produit: Produit){
    this.router.navigate(['achat/achat-direct', produit.id])
  }

  // AddToPanier
  addToPanier( product: Produit, quantity: number = 1): void {
    
    // 1. Instancier le CommandeItem avec le produit et la quantité
    const itemToAdd = new CommandeItem(product, quantity);
    // 2. Appeler la méthode du service (qui gère l'unicité et la persistance)
    this.achatService.ajouterProduit(itemToAdd);
    console.table(itemToAdd)
    
    // 3. Affichage du SnackBar (la notification)
    const message = `✅ ${product.nom} ajouté au panier !`;
    const action = 'Voir Panier';
    
    const snackBarRef = this.matSnackBar.open(message, action, {
        duration: 4000, 
        horizontalPosition: 'end', 
        verticalPosition: 'bottom',    
        panelClass: ['snackbar-success'] 
    });

    snackBarRef.onAction().subscribe(() => {
        this.router.navigate(['/achat/panier']);
    });
  }

}
