import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { BoutiqueService } from '../boutique-service';
import { GroupeProduits } from '../../Models/groupeProduits';
import { MatButtonModule } from '@angular/material/button';
import { Loading } from "../../loading/loading";

@Component({
  selector: 'filtre-produit',
  imports: [MatButtonModule, Loading],
  templateUrl: './filtre-produit.html',
  styleUrl: './filtre-produit.css',
})
export class FiltreProduit implements OnInit{

  menuClassement: string[];
  defaultClassementSelected = signal<string>('Tous');

  @Output() changeClassementSelected = new EventEmitter<string>();
  @Output() searchTermChanged = new EventEmitter<string>();

  chargement = signal<boolean>(false);

  constructor(
    private boutiqueService: BoutiqueService
  ){}

  ngOnInit(): void {
    this.chargement.set(true);

    this.boutiqueService.getProduitsList().subscribe({
      next: (produitGroupes: GroupeProduits) => {
        this.menuClassement = Object.keys(produitGroupes);
        this.menuClassement.unshift('Tous');

        this.defaultClassementSelected.set(this.menuClassement[0]);
        this.chargement.set(false);
        console.log('Liste des classements récupérés :', this.menuClassement);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des produits", err);
      }
    })
  }

  // MÉTHODE : Déclenchée à chaque frappe dans le champ de recherche
  onSearchChange(term: string) {
    if (term.trim().length < 2) {
      this.searchTermChanged.emit('');
      return;
    }
    this.searchTermChanged.emit(term.trim()); 
  }

  selectionnerFiltre(classement: string): void {
    this.defaultClassementSelected.set(classement);
    this.changeClassementSelected.emit(classement);
  }
}
