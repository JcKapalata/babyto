import { Component, OnInit } from '@angular/core';
import { BoutiqueService } from '../boutique-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Produit } from '../../Models/produits';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Loading } from "../../loading/loading";

@Component({
  selector: 'app-produit-detail',
  imports: [CurrencyPipe, MatIconModule, MatButtonModule, Loading],
  templateUrl: './produit-detail.html',
  styleUrl: './produit-detail.css',
})
export class ProduitDetail implements OnInit{

  produit: Produit| undefined;

  constructor( 
    private boutiqueService: BoutiqueService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit() {
    const produitId: string | null = this.route.snapshot.paramMap.get('id')
    if(produitId){
      this.boutiqueService.getProduitById(+produitId).subscribe(
      (produit) => {
          this.produit = produit
          console.table(this.produit)
      }
    )
    }
  }

  goToWhatsApp(produit: Produit) {
    this.router.navigate(['achat/watsapp-commande'], { state: { produit } });
  }

  goToCommande(produit: Produit) {
    this.router.navigate(['achat/commande', produit.id]);
  }

  goBack(){
    this.router.navigate(['boutique/produits-list']);
  }
}
