import { AchatService } from './../../Achat/achat-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { debounceTime, distinctUntilChanged, map, Observable, Subject, Subscription, switchMap } from 'rxjs';


@Component({
  selector: 'app-produits-list',
  imports: [MatCardModule, MatButtonModule, MatIconModule, KeyValuePipe, FiltreProduit],
  templateUrl: './produits-list.html',
  styleUrl: './produits-list.css',
  providers: [BoutiqueService]
})
export class ProduitsList implements OnInit, OnDestroy{

  produitsGroupes: GroupeProduits = {};
  produitsAffiches: GroupeProduits;

  searchTerms = new Subject<string>();
  produits$: Observable<Produit[]>;

  filtreActif: string = 'Tous';
  showAllProduits: Map<string, boolean> = new Map();

  // NOUVEAU: Gérer l'abonnement pour éviter les fuites de mémoire (très important!)
  private searchSubscription: Subscription;
  
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

    this.produits$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap( term => this.boutiqueService.searchProduit(term)),
      
      // 3. Filtrage côté client basé sur le classement actif
      map((resultatsRecherche: Produit[]) => {
        // Si le filtre actif est 'Tous' ou si on est déjà en mode 'Recherche', on ne filtre pas.
        if (this.filtreActif === 'Tous' || this.filtreActif === 'Recherche') {
          return resultatsRecherche;
        } 
        // Sinon, on filtre les résultats par le classement actif
        return resultatsRecherche.filter(produit => produit.classement === this.filtreActif);
        
      })
    )

    // 4. ABONNEMENT CRUCIAL : Exécution du flux RxJS
    this.searchSubscription = this.produits$.subscribe({
        next: (resultatsFiltres: Produit[]) => {
            // Mettre le filtre actif sur 'Recherche' pour indiquer le mode
            this.filtreActif = 'Recherche'; 
            this.showAllProduits.clear();

            // Regrouper les résultats plats (Produit[]) avant l'assignation
            this.produitsAffiches = this.regrouperParClassement(resultatsFiltres);
            console.log( this.produitsAffiches)
        },
        error: (err) => {
            console.error("Erreur lors de la recherche RxJS :", err);
            this.produitsAffiches = {};
        }
    });
  }

  // METHODE MANQUANTE : Doit être implémentée pour la logique de l'abonnement
  private regrouperParClassement(produits: Produit[]): GroupeProduits {
    // (Insérer ici la fonction de regroupement montrée précédemment)
    // Cette fonction prend un Produit[] et retourne un { [key: string]: Produit[] }
    return produits.reduce((acc, produit) => {
      const cle = produit.classement || 'Non Classé'; 
      if (!acc[cle]) {
        acc[cle] = [];
      }
      acc[cle].push(produit);
        return acc;
    }, {} as GroupeProduits);
  }

  // NOUVELLE MÉTHODE CRUCIALE : Nettoyage à la destruction du composant
  ngOnDestroy(): void {
      // Nettoie l'abonnement du Subject pour éviter les fuites de mémoire.
      this.searchSubscription?.unsubscribe();
      // On peut aussi compléter le subject même si l'unsubscribe suffit souvent pour l'abonnement
      this.searchTerms.complete(); 
  }

  // filtre le classement
  appliquerFiltre(nouveauFiltre: string): void {
    this.filtreActif = nouveauFiltre;
    this.showAllProduits.clear();

    if (nouveauFiltre === 'Tous') {
      // Afficher la liste complète (le dictionnaire entier)
      this.produitsAffiches = this.produitsGroupes;

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

  // 
  rechercherProduits(term: string): void {
    this.searchTerms.next(term);
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
