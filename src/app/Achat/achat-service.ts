import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, delay, forkJoin, map, Observable, tap, throwError } from 'rxjs';
import { CommandeItem } from '../Models/commande'; // Assurez-vous du bon chemin
import { BoutiqueService } from '../Boutique/boutique-service'; 
import { DetailAchat, ProduitAchete } from '../Models/produitAchete';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../authentification/auth-service';

@Injectable({
  providedIn: 'root',
})
export class AchatService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly API_URL_MES_ACHATS = 'api/achats';

  // BehaviorSubject est initialisé avec la fonction qui charge le panier depuis le local storage
  private itemsSubject = new BehaviorSubject<CommandeItem[]>([]);
  items$: Observable<CommandeItem[]> = this.itemsSubject.asObservable();

  constructor(private boutiqueService: BoutiqueService) { }

  // --- MÉTHODES DU SERVICE ---

  //recuperation d'un produit par id
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

  //LOGIQUE : Mise ajourdu produit
  updateProduitDetails(updatedItemData: CommandeItem): void {
    const itemId = updatedItemData.id;
    const currentItems = this.itemsSubject.getValue();

    // Récupérez directement les valeurs de SELECTION du formulaire
    const newCouleurSelection = updatedItemData.couleurSelectionnee; 
    const newTailleSelection = updatedItemData.tailleSelectionnee;
    
    const newItems = currentItems.map(item => {

        if (item.id === itemId) { 
            
            // 2. Créer une copie de l'article existant et mettre à jour la quantité
            const newItem = new CommandeItem(item, updatedItemData.quantity);
            
            // 3. Mettre à jour les champs de SÉLECTION avec les nouvelles valeurs du formulaire
            newItem.tailleSelectionnee = newTailleSelection;
            newItem.couleurSelectionnee = newCouleurSelection;
            
            // Recalculer le prix total (si non géré dans le setter de quantity ou dans le constructeur)
            newItem.prixTotal = newItem.quantity * newItem.prix; 
            return newItem
        }
        return item;
    });

    this.itemsSubject.next(newItems);
  }


  // mise en jour du panier (utilisé dans la vue panier pour changer la quantité directement)
  updateItems(items: CommandeItem[]) {
    // Si la liste complète est mise à jour, on publie
    this.itemsSubject.next([...items]);
  }

  /**
   * Récupère l'historique des achats pour l'utilisateur connecté.
   * Cette structure est optimisée pour le partitionnement NoSQL.
  */
  getUserHistoryAchat(): Observable<DetailAchat[]> {
    const userConnecte = this.authService.user();

    // 1. Sécurité : Vérification de l'utilisateur avant l'appel API
    if (!userConnecte || !userConnecte.id) {
      return throwError(() => new Error('Session expirée ou non connectée.'));
    }

    // 2. Performance : Utilisation de la Shard Key (clientId) pour filtrer côté serveur
    const params = new HttpParams().set('clientId', userConnecte.id.toString());

    return this.http.get<ProduitAchete[]>('api/achats', { params }).pipe(
      delay(500),
      map(achats => {
        // 3. Robustesse : Filtrage de sécurité et extraction des données métier (data)
        // On retourne un tableau de DetailAchat
        return achats
          .filter(a => a.clientId === userConnecte.id) 
          .map(a => a.data);
      }), 
      catchError(error => {
        console.error('Erreur API Historique:', error);
        return throwError(() => new Error('Impossible de charger votre historique.'));
      })
    );
  }
 
  /**
   * Récupère les détails d'un achat spécifique par son identifiant métier.
   * Sécurisé pour garantir que l'utilisateur ne consulte que ses propres données.
   */
  getUserHistoryAchatById(achatId: number): Observable<DetailAchat> {
    const userConnecte = this.authService.user();

    // 1. Sécurité : Vérification de l'existence de la session
    if (!userConnecte || !userConnecte.id) {
      return throwError(() => new Error('Session expirée ou non connectée.'));
    }

    // 2. Appel API
    // Note : En production avec Firebase, on utiliserait le 'id' technique (string)
    // Mais ici on utilise l'identifiant métier 'achatId' pour la recherche.
    return this.http.get<ProduitAchete>(`api/achats/${achatId}`).pipe(
      delay(500),
      map(achat => {
        // 3. Vérification de sécurité stricte (Propriété des données)
        // On compare le clientId du document avec l'ID de l'utilisateur connecté
        if (achat.clientId !== userConnecte.id) {
          throw new Error(`Accès refusé : Ce produit ne fait pas partie de votre historique.`);
        }

        // 4. Extraction des données métier pour le composant
        return achat.data;
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du détail:', error);
        // On renvoie un message d'erreur clair pour l'interface utilisateur
        return throwError(() => new Error(error.message || 'Impossible de charger les détails de cet achat.'));
      })
    );
  }

  // LOGIQUE : Vide complètement le panier
  viderPanier(): void {
    // On publie un tableau vide pour informer tous les composants abonnés
    this.itemsSubject.next([]);
    console.log("Le panier a été réinitialisé.");
  }

  /**
   * Enregistre une liste d'achats de manière atomique.
   * Pour chaque produit du panier, un POST est envoyé au serveur.
   */
  saveAchats(achats: ProduitAchete[]): Observable<any> {
    // 1. On crée un tableau de requêtes HTTP POST
    const requetes = achats.map(achat => this.http.post<ProduitAchete>(this.API_URL_MES_ACHATS, achat));

    // 2. forkJoin attend que TOUTES les requêtes réussissent
    // C'est crucial pour garantir que le client ne perd aucun article de son panier
    return forkJoin(requetes).pipe(
      // tap s'exécute uniquement en cas de SUCCÈS du forkJoin
      tap(() => this.viderPanier()), 
      map(resultats => {
        console.log(`${resultats.length} achats enregistrés.`);
        return resultats;
      }),
      catchError(err => {
        // En cas d'erreur, le panier n'est PAS vidé (l'utilisateur peut réessayer)
        console.error("Échec de l'enregistrement, le panier est conservé.");
        return throwError(() => err);
      })
    );
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