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
  private itemsSubject = new BehaviorSubject<CommandeItem[]>(this.getInitialCart());
  items$: Observable<CommandeItem[]> = this.itemsSubject.asObservable();

  constructor(private boutiqueService: BoutiqueService) { }

  // --- LOGIQUE DE PERSISTANCE ---
  
  /**
   * Charge le panier depuis localStorage et reconstruit les instances de CommandeItem.
   */
  private getInitialCart(): CommandeItem[] {
    const storedCart = localStorage.getItem('shopping_add_cart_items_produit');
    if (!storedCart) {
      return [];
    }
    
    const rawItems: any[] = JSON.parse(storedCart);

    // VITAL : On reconstruit chaque CommandeItem pour que les méthodes (comme getTotal) fonctionnent.
    return rawItems.map(rawItem => {
      // 1. Reconstruire la partie Produit (doit correspondre à la structure de Produit)
      const produit: Produit = { 
          id: rawItem.id, 
          nom: rawItem.nom, 
          prix: rawItem.prix, 
          devise: rawItem.devise, 
          categorie: rawItem.categorie, 
          type: rawItem.type, 
          taille: rawItem.taille, 
          couleur: rawItem.couleur,
          description: rawItem.description,  
          imageUrl: rawItem.imageUrl
      } as Produit; 
      
      // 2. Créer une nouvelle instance de CommandeItem
      return new CommandeItem(produit, rawItem.quantity);
    });
  }

  /**
   * Sauvegarde l'état actuel du panier dans localStorage.
   */
  private persistCart(items: CommandeItem[]): void {
    // Le JSON.stringify sauvegarde la structure de données
    localStorage.setItem('shopping_add_cart_items_produit', JSON.stringify(items));
  }

  // --- MÉTHODES DU SERVICE ---

  getProduitById(produitId: number) {
    return this.boutiqueService.getProduitById(produitId);
  }

  /**
   * LOGIQUE : Ajoute un article ou incrémente sa quantité.
   * Assure l'immutabilité et la persistance.
   */
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
    
    // Persister la nouvelle liste
    this.persistCart(updatedItems); 
  }

  // mise en jour du panier (utilisé dans la vue panier pour changer la quantité directement)
  updateItems(items: CommandeItem[]) {
    // Si la liste complète est mise à jour, on publie et on persiste
    this.itemsSubject.next([...items]);
    this.persistCart(items);
  }

  // vide le panier
  viderPanier() {
    this.itemsSubject.next([]);
    // Vider aussi le stockage local
    this.persistCart([]);
  }

  // recupere la nombre produit
  nombreProduits$ = this.items$.pipe(
    map(items => items.length)
  );

  // Observable pour le total du panier (optionnel mais utile)
  totalPanier$ = this.items$.pipe(
    map(items => items.reduce((total, item) => total + item.getTotal(), 0))
  );
}