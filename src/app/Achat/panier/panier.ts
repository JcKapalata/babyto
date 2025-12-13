import { Component, OnInit } from '@angular/core';
import { CommandeItem } from '../../Models/commande';
import { CommonModule, Location } from '@angular/common';
import { AchatService} from '../achat-service';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Paiement } from "../paiement/paiement";
import { AchatForm } from "../achat-form/achat-form";
import { Produit } from '../../Models/produits';


@Component({
  selector: 'app-panier',
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, Paiement, AchatForm],
  templateUrl: './panier.html',
  styleUrls: ['./panier.css']
})
export class Panier implements OnInit {
  items: CommandeItem[] = [];
  showPaiement: boolean = false;
  idProduitUpdate: number[]=[];
  currentImageUrl: string = ''

  constructor(
    private achatService: AchatService,
    private location: Location
  ) {}

  ngOnInit() {
    this.achatService.items$.subscribe(items => {
      this.items = items;
      console.log('initialisation du produit dans le panier')
      console.table(this.items)
    });
  }

  getAfficheImageUrl(item: CommandeItem): string {
    const selectedCouleur = item.couleurSelectionnee as string;
    
    if (selectedCouleur && item.imagesParCouleur?.[selectedCouleur]) {
        // Retourne le chemin spécifique à la couleur
        return item.imagesParCouleur[selectedCouleur];
    }
    return ''
  }

  // Récupère le total des articles en USD
  getTotalUSD(): number {
    return this.items
      .filter(item => item.devise === 'USD') // Filtre uniquement les articles en USD
      .reduce((sum, item) => sum + item.prixTotal, 0);
  }

  // Récupère le total des articles en CDF
  getTotalCDF(): number {
    return this.items
      .filter(item => item.devise === 'CDF') // Filtre uniquement les articles en CDF
      .reduce((sum, item) => sum + item.prixTotal, 0);
  }

  supprimer(item: CommandeItem) {
    this.items = this.items.filter(i => {
      i !== item;
      console.log(`supression d'in element dans le panier`);
      console.table(i)
    });
    this.achatService.updateItems(this.items);
  }
  
  // button pour active mise a jour du produit
  goToUpdateProduit(item: CommandeItem){
    const itemId = item.id
    const index = this.idProduitUpdate.indexOf(itemId)
    
    if(index > -1){
      this.idProduitUpdate.splice(index, 1)
    } else{
      this.idProduitUpdate.push(itemId)
    }
  }

  // methode pour recupere le produit du achat-form
  articleMiseAJour(articleAchete: CommandeItem){
    // 1. Mise à jour des détails dans le service (déclenche la mise à jour de this.items via subscribe)
    this.achatService.updateProduitDetails(articleAchete)

    //log du reponse reussi du achat-form
    console.log('valider mise a jour')
    console.table(articleAchete)

    // 2. CORRECTION : Retirer l'ID du tableau idProduitUpdate (pour fermer le formulaire)
    const itemId = articleAchete.id;
    const index = this.idProduitUpdate.indexOf(itemId);
    
    // Vérifie si l'ID est bien présent dans la liste
    if (index > -1) {
        // Retire l'ID à l'index trouvé (ferme l'édition)
        this.idProduitUpdate.splice(index, 1); 
    }
  }

  goBack() {
    this.location.back();
  }

  // afficher paiement
  togglePaiement() {
    this.showPaiement = !this.showPaiement;
  }
}
