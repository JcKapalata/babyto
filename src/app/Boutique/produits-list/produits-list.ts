import { Component, OnInit } from '@angular/core';
import { Produit } from '../../Models/produits';
import {  Router } from '@angular/router';
import { BoutiqueService } from '../boutique-service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-produits-list',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './produits-list.html',
  styleUrl: './produits-list.css',
  providers: [BoutiqueService]
})
export class ProduitsList implements OnInit{

  produitList: Produit[];
  
  constructor(
    private boutiqueService: BoutiqueService,
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

}
