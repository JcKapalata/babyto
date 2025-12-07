import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, AbstractControl } from '@angular/forms';
import { Produit } from '../../Models/produits';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { AchatService} from '../achat-service';
import { CommandeItem } from '../../Models/commande';
import { Paiement } from "../paiement/paiement";


@Component({
  selector: 'app-achat-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, MatButtonModule, Paiement],
  templateUrl: './achat-form.html',
  styleUrls: ['./achat-form.css'],
})
export class AchatForm implements OnInit, OnChanges {

  @Input() produit: Produit;
  @Output() validationMiseAJour = new EventEmitter<any>();

  produitForm: FormGroup;
  prixTotal: number;
  // quantity: number = 1;
  taille: string;
  couleur: string;
  isAchatDirect: boolean;
  showPayementComponent: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.produitForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), this.integerValidator]],
      taille: [ '', Validators.required],
      couleur: [ '', Validators.required]
    });

    this.produitForm.get('quantity')?.valueChanges.subscribe(qty => {
      this.updateTotal(qty);
    });
  }

  ngOnInit() {
    this.isAchatDirect = this.router.url.includes('achat-direct');
  }

  ngOnChanges() {
      if (this.produit){
      const tailleControl = this.produitForm.get('taille');
      const couleurControl = this.produitForm.get('couleur');

      // Si des tailles sont disponibles, présélectionner la première option
      if (this.produit.taille && this.produit.taille.length > 0 && tailleControl) {
        tailleControl.setValue(this.produit.taille[0]);     
      } else if (tailleControl) {
      // Si aucune taille n'est disponible, le désactiver et/ou retirer le validateur
        tailleControl.disable(); 
      }

      // Si des couleurs sont disponibles, présélectionner la première option
      if (this.produit.couleur && this.produit.couleur.length > 0 && couleurControl) {
        couleurControl.setValue(this.produit.couleur[0]);
      } else if (couleurControl) {
        couleurControl.disable();
      }
      this.updateTotal(this.produitForm.value.quantity);
    }
  }

  private updateTotal(qty: number) {
    if (this.produit) {
      this.prixTotal = qty * this.produit.prix;
    }
  }

  // validateur erreurs
  integerValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value != null && !Number.isInteger(value)) {
      return { notInteger: true };
    }
    return null;
  }

  // Récupère les informations de l'article acheté
  articleAchete(): CommandeItem | undefined {
    if (this.produitForm.valid) {
      return {
        ...this.produitForm.value,
        id: this.produit.id,
        nom: this.produit.nom,
        prix: this.produit.prix,
        devise: this.produit.devise,
        prixTotal: this.prixTotal
      }
    }else{
      return undefined
    }
  }

  // Gestion du submit
  onSubmit() {
    if (this.produitForm.valid) {

      if (this.isAchatDirect) {
        console.log('Achat direct reussir')
        console.table(this.articleAchete())
      }else{
        this.validationMiseAJour.emit(this.articleAchete())
        console.log('le submit a reussit');
      }
    }
  }

  // Navigue vers la page de payement
  goToActivePayement() {
    if(this.produitForm.valid){
      this.showPayementComponent = !this.showPayementComponent;
      console.log('clic buttton payement');
    } else{
      this.produitForm.markAllAsTouched();
      console.log("Formulaire invalide. Impossible d'activer le paiement.");
    }
  }


  // 
  // ajouterAuPanier() {
  //   if (this.produit && this.produitForm.valid) {
  //     // Récupère la valeur du FormControl "quantite"
  //     const quantite = this.produitForm.get('quantite')?.value;

  //     const itemCommande = new CommandeItem(this.produit, quantite);
  //     this.achatService.ajouterProduit(itemCommande);
  //   }
  // }

}

