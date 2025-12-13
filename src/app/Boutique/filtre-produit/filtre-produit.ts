import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BoutiqueService } from '../boutique-service';
import { GroupeProduits } from '../../Models/groupeProduits';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'filtre-produit',
  imports: [MatButtonModule],
  templateUrl: './filtre-produit.html',
  styleUrl: './filtre-produit.css',
})
export class FiltreProduit implements OnInit{

  menuClassement: string[];
  defaultClassementSelected: string;

  @Output() changeClassementSelected = new EventEmitter<string>();

  constructor(
    private boutiqueService: BoutiqueService
  ){}

  ngOnInit(): void {
    this.boutiqueService.getProduitsList().subscribe({
      next: (produitGroupes: GroupeProduits) => {
        this.menuClassement = Object.keys(produitGroupes);
        this.menuClassement.unshift('Tous');

        this.defaultClassementSelected = this.menuClassement[0] 

        console.log('Liste des classements récupérés :', this.menuClassement);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des produits", err);
      }
    })
  }

  selectionnerFiltre(classement: string): void {
    this.defaultClassementSelected = classement;
    this.changeClassementSelected.emit(classement);
  }
}
