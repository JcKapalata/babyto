import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CommandeItem } from '../Models/commande';
import { BoutiqueService } from '../Boutique/boutique-service';

@Injectable({
  providedIn: 'root',
})
export class AchatService {

  // private showPanierSubject = new BehaviorSubject<boolean>(false);
  // showPanier$ = this.showPanierSubject.asObservable();

  private itemsSubject = new BehaviorSubject<CommandeItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(private boutiqueService: BoutiqueService) { }

  //go chercher un produit par son id
  getProduitById(produitId: number) {
    return this.boutiqueService.getProduitById(produitId);
  }

  //Achat rapide ou access direct du formulaire et du payemnt
  // achatRapide(item: CommandeItem) {
    // Traitement de l'achat rapide, par exemple, redirection vers la page de paiement
    // console.log('Achat rapide pour le produit:', item);
    // Implémenter la logique d'achat rapide ici
  // }

  // important pour ajoute un article au panier avant de mettre a jour le produit 
  // donc ajout du panier puis dans panier pour mettre a jour le produit avant de payer 
  // Ajouter un produit
  ajouterProduit(item: CommandeItem) {
    const currentItems = this.itemsSubject.value;

    const existing = currentItems.find(p => p.id === item.id);
    if (existing) {
      currentItems.push(item);
      this.itemsSubject.next([...currentItems]);
    } else {
      alert(`Produit ${item.id} est déjà dans le panier. Pas d'incrémentation.`);
    }
  }

  // mise en jour du panier
  updateItems(items: CommandeItem[]) {
    this.itemsSubject.next([...items]);
  }

  // vide le panier
  viderPanier() {
    this.itemsSubject.next([]);
  }

  // recupere la nombre produit
  nombreProduits$ = this.items$.pipe(
    map(items => items.length)
  );
}
