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

  @Input() produit!: any;
  @Output() validationMiseAJour = new EventEmitter<any>();

  produitForm: FormGroup;
  prixTotal: number;
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

  ngOnChanges() {
    if (this.produit) {
      const tailleControl = this.produitForm.get('taille');
      const couleurControl = this.produitForm.get('couleur');
      const quantityControl = this.produitForm.get('quantity'); // Ajout du contrôle de quantité

      // 1. MISE À JOUR DE LA QUANTITÉ
      // Initialise le champ quantité avec la quantité actuelle de l'article (si présente, sinon 1)
      const currentQuantity = this.produit.quantity || 1;
      if (quantityControl && quantityControl.value !== currentQuantity) {
          quantityControl.setValue(currentQuantity, { emitEvent: false }); // Pas d'événement pour éviter un double appel à updateTotal
      }

      // 2. MISE À JOUR DE LA TAILLE

      // Logique pour l'édition dans le panier : utiliser la valeur taille de l'article si elle existe
      const selectedTaille = Array.isArray(this.produit.taille) 
          ? (this.produit.taille[0] || '') // Utilise la taille sélectionnée dans l'article
          : (this.produit.taille || ''); 
      
      if (tailleControl) {
        if (selectedTaille) {
          tailleControl.enable();
          tailleControl.setValue(selectedTaille); // Précoche la taille actuelle
        } else {
          // Si le produit n'a pas de taille sélectionnée (nouvel article ou détail manquant)
          tailleControl.disable();
          tailleControl.setValue('');
        }
      }

      // 3. MISE À JOUR DE LA COULEUR
      
      // Logique pour l'édition dans le panier : utiliser la valeur couleur de l'article si elle existe
      const selectedCouleur = Array.isArray(this.produit.couleur) 
          ? (this.produit.couleur[0] || '') // Utilise la couleur sélectionnée dans l'article
          : (this.produit.couleur || '');
      
      if (couleurControl) {
        if (selectedCouleur) {
          couleurControl.enable();
          couleurControl.setValue(selectedCouleur); // Précoche la couleur actuelle
        } else {
          // Si le produit n'a pas de couleur sélectionnée
          couleurControl.disable();
          couleurControl.setValue('');
        }
      }

      // 4. MISE À JOUR DU TOTAL
      this.updateTotal(currentQuantity);
    }
  }

  ngOnInit() {
    this.isAchatDirect = this.router.url.includes('achat-direct');
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

