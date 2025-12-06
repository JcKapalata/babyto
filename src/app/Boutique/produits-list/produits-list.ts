import { AchatService } from './../../Achat/achat-service';
import { Component, OnInit } from '@angular/core';
import { Produit } from '../../Models/produits';
import {  Router } from '@angular/router';
import { BoutiqueService } from '../boutique-service';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from "@angular/material/icon";
import { CommandeItem } from '../../Models/commande';


@Component({
  selector: 'app-produits-list',
  imports: [MatCardModule, MatButtonModule, MatIcon],
  templateUrl: './produits-list.html',
  styleUrl: './produits-list.css',
  providers: [BoutiqueService]
})
export class ProduitsList implements OnInit{

  produitList: Produit[];
  
  constructor(
    private boutiqueService: BoutiqueService,
    private achatService: AchatService,
    private router: Router
  ){}

  ngOnInit() {
    this.boutiqueService.getProduitsList().subscribe(
      (produitList) => {
        this.produitList = produitList;
        console.table(this.produitList)
      }
    )
  }

  // Fonction pour tronquer n'importe quelle chaîne
  truncate(text: string, limit: number): string {
    if (!text) {
      return '';
    }
    // Si la description est plus longue que la limite, on la coupe et on ajoute "..."
    if (text.length > limit) {
      return text.substring(0, limit) + ' ...';
    }
    // Sinon, on retourne le texte complet
    return text;
  }

  goToDetailProduit(produit: Produit){
    this.router.navigate(['boutique/produit-detail', produit.id])
  }

  goToAchatDirect(produit: Produit){
    this.router.navigate(['achat/achat-direct', produit.id])
  }

  // AddToPanier
  addToPanier(event: Event, product: Produit, quantity: number = 1): void {
    event.stopPropagation()
    // 1. Instancier le CommandeItem avec le produit et la quantité
    const itemToAdd = new CommandeItem(product, quantity);
    // 2. Appeler la méthode du service (qui gère l'unicité et la persistance)
    this.achatService.ajouterProduit(itemToAdd);
    console.table(itemToAdd)
    
    // Optionnel : Afficher une notification ici
  }

}
