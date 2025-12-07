import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CommandeItem } from '../Models/commande'; // Assurez-vous du bon chemin
import { Produit } from '../Models/produits'; // Assurez-vous d'importer la classe/interface Produit
import { BoutiqueService } from '../Boutique/boutique-service'; 

@Injectable({
  providedIn: 'root',
})
export class AchatService {

  // BehaviorSubject est initialisé avec la fonction qui charge le panier depuis le local storage
  private itemsSubject = new BehaviorSubject<CommandeItem[]>([]);
  items$: Observable<CommandeItem[]> = this.itemsSubject.asObservable();

  constructor(private boutiqueService: BoutiqueService) { }

  // --- MÉTHODES DU SERVICE ---

  getProduitById(produitId: number) {
    return this.boutiqueService.getProduitById(produitId);
  }

  //LOGIQUE : Ajoute un produit  
  ajouterProduit(item: CommandeItem) {
    const currentItems = this.itemsSubject.value;
    const existingIndex = currentItems.findIndex(p => p.id === item.id);
    // On travaille sur une copie pour respecter l'immutabilité
    let updatedItems = [...currentItems]; 

    if (existingIndex > -1) {
      // CAS 1: L'article existe déjà.
      console.log(`Produit ID ${item.id} déjà présent. Non ajouté. Sa quantité sera modifiée dans le panier.`);
      return;
    } else {
      // CAS 2: L'article est NOUVEAU (Ajout)
      updatedItems.push(item);
    }

    // Publier le nouvel état
    this.itemsSubject.next(updatedItems);
  }


  // LOGIQUE : Mise a jour de produit
  updateProduitDetails(updatedItemData: CommandeItem): void {
    const itemId = updatedItemData.id;

    // 1. Récupérer l'état actuel du panier
    const currentItems = this.itemsSubject.getValue();
    
    // 2. Créer le nouveau tableau (immutabilité)
    const newItems = currentItems.map(item => {

      const { quantity, ...productDetails } = item;

      if (item.id === itemId) { 
        // 1. SAUVEGARDE : Récupérer les options complètes de l'article existant
        const originalTailleOptions = item.taille;
        const originalCouleurOptions = item.couleur;

        const updatedProductDetails = {
          ...productDetails, 
          couleur: Array.isArray(updatedItemData.couleur) ? updatedItemData.couleur : [updatedItemData.couleur],
          taille: Array.isArray(updatedItemData.taille) ? updatedItemData.taille : [updatedItemData.taille],
        } as Produit; 

        // Création et retour direct
        console.table(new CommandeItem(updatedProductDetails, updatedItemData.quantity))

        // 4. CRÉATION DU NOUVEL ARTICLE : Création de la nouvelle instance de CommandeItem
        const newItem = new CommandeItem(updatedProductDetails, updatedItemData.quantity);
            
        // 5. RÉINJECTION : Réinjecter les options complètes sauvegardées (étape 1)
        newItem.taille = originalTailleOptions;
        newItem.couleur = originalCouleurOptions;

        return newItem
      }
      return item;
    });

    // 3. Publier le nouveau tableau
    this.updateItems(newItems);
  }


  // mise en jour du panier (utilisé dans la vue panier pour changer la quantité directement)
  updateItems(items: CommandeItem[]) {
    // Si la liste complète est mise à jour, on publie
    this.itemsSubject.next([...items]);
  }

  // recupere le nombre de produit
  nombreProduits$ = this.items$.pipe(
    map(items => items.length)
  );

  // Observable pour le total du panier (optionnel mais utile)
  totalPanier$ = this.items$.pipe(
    map(items => items.reduce((total, item) => total + item.prixTotal, 0))
  );
}