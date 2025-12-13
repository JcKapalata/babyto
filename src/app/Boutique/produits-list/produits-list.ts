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
import { FiltreProduit } from "../filtre-produit/filtre-produit";


@Component({
  selector: 'app-produits-list',
  imports: [MatCardModule, MatButtonModule, MatIconModule, KeyValuePipe, FiltreProduit],
  templateUrl: './produits-list.html',
  styleUrl: './produits-list.css',
  providers: [BoutiqueService]
})
export class ProduitsList implements OnInit{

  produitsGroupes: GroupeProduits = {};
  showAllProduits: Map<string, boolean> = new Map();
  produitsAffiches: GroupeProduits;
  filtreActif: string = 'Tous';
  
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
        this.produitsAffiches = this.produitsGroupes;
        console.log('Produits reçus et regroupés par le service.');
      }
    );
  }

  // filtre le classement
  appliquerFiltre(nouveauFiltre: string): void {
    this.filtreActif = nouveauFiltre;

    if (nouveauFiltre === 'Tous') {
      // Afficher la liste complète (le dictionnaire entier)
      this.produitsAffiches = this.produitsGroupes;
      this.showAllProduits.set(nouveauFiltre, false);

    } else {
      
      if (this.produitsGroupes[nouveauFiltre]) {

        // 1. Créer un NOUVEL objet GroupeProduits
        // 2. Ajouter la clé [nouveauFiltre] et sa valeur (le tableau de produits) à ce nouvel objet.
        this.produitsAffiches = {
          [nouveauFiltre]: this.produitsGroupes[nouveauFiltre]
        };

        this.showAllProduits.set(nouveauFiltre, true);
      } else {
        this.produitsAffiches = {};
      }
    }
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
