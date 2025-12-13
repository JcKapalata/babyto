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

  @Input() produit!: Produit;
  @Output() validationMiseAJour = new EventEmitter<any>();

  produitForm: FormGroup;
  prixTotal: number;
  taille: string;
  couleur: string;
  isAchatDirect: boolean;
  showPayementComponent: boolean = false;
  currentImageUrl: string = '';

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
      const currentQuantity = (this.produit as CommandeItem).quantity || 1;
      if (quantityControl && quantityControl.value !== currentQuantity) {
          quantityControl.setValue(currentQuantity, { emitEvent: false }); // Pas d'événement pour éviter un double appel à updateTotal
      }

      // 2. MISE À JOUR DE LA TAILLE
        // Utilisation du champ dédié et fiable (la sélection unique)
        const selectedTaille = (this.produit as CommandeItem).tailleSelectionnee || this.produit.taille[0];
        
        if (tailleControl) {
          if (selectedTaille) {
            tailleControl.enable();
            tailleControl.setValue(selectedTaille); // Précoche la taille actuelle
          } else {
            tailleControl.enable(); 
            tailleControl.setValue('');
          }
        }
        
        // 3. MISE À JOUR DE LA COULEUR
        // Utilisation du champ dédié et fiable (la sélection unique)
        const selectedCouleur = (this.produit as CommandeItem).couleurSelectionnee || this.produit.couleur[0];
        
        if (couleurControl) {
            if (selectedCouleur) {
              couleurControl.enable();
              couleurControl.setValue(selectedCouleur);
            } else { 
              couleurControl.enable(); 
              couleurControl.setValue('');
            }
        }
        
        
        console.log(`couleur selected ${selectedCouleur}`)
        this.updateTotal(currentQuantity);
    }
  }

  ngOnInit() {
    this.isAchatDirect = this.router.url.includes('achat-direct');

    this.produitForm.get('couleur')?.valueChanges.subscribe(selectedCouleur => {
        
        // 1. Mise à jour de l'image (Votre logique de dictionnaire)
        this.updateImageFromColor(selectedCouleur);
    });
  }

  // methode pour mettre a jour l'image
  updateImageFromColor(selectedCouleur: string){

    // Récupère l'URL du dictionnaire
    const nouveauChemin = this.produit.imagesParCouleur[selectedCouleur];
        
    if (nouveauChemin) {
        // Met à jour la variable bindée au template
        this.currentImageUrl = nouveauChemin; 
        console.log('Image mise à jour via FormGroup:', this.currentImageUrl);
    } else {
        // Revenir à l'image par défaut si la couleur n'a pas d'image spécifique
        this.currentImageUrl = (this.produit as any)?.imageUrl || ''; 
        console.warn('Chemin d\'image non défini pour la couleur:', selectedCouleur);
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
        
        const formValues = this.produitForm.value;
        const produitItem = this.produit as CommandeItem; 

        // Déterminez les options à injecter dans les champs dédiés de la CommandeItem
        const selectedTaille = formValues.taille;
        const selectedCouleur = formValues.couleur;

        // Assurez-vous d'avoir accès au prix total calculé
        const prixTotalCalcul = this.prixTotal;

        return {
            // 1. Récupère les valeurs du formulaire (quantity, taille, couleur)
            ...formValues,
            
            // 2. Champs dédiés à la SÉLECTION UNIQUE (essentiel pour la mise à jour)
            tailleSelectionnee: selectedTaille,
            couleurSelectionnee: selectedCouleur,
            
            // 3. Champs du Produit non modifiés par le formulaire
            id: produitItem.id,
            nom: produitItem.nom,
            prix: produitItem.prix,
            devise: produitItem.devise,
            
            // 4. Les OPTIONS complètes (si elles existent sur l'input) doivent être transmises
            taille: produitItem.taille,
            couleur: produitItem.couleur,
            
            // 5. Total
            prixTotal: prixTotalCalcul
            
        } as CommandeItem; // Castez l'objet retourné vers le type CommandeItem pour la sécurité
    } else {
        return undefined;
    }
}

  // Gestion du submit pour valider mise a jour
  onSubmit() {
    if (this.produitForm.valid) {

      if (!this.isAchatDirect) {
        console.log('Valide la mise a jour au panier');
        this.validationMiseAJour.emit(this.articleAchete())
      }
    }
  }

  // Navigue vers la page de payement
  goToActivePayement() {
    if(this.produitForm.valid){
      this.showPayementComponent = !this.showPayementComponent;
      console.log('clic buttton payement dans achat direct');
    } else{
      this.produitForm.markAllAsTouched();
      console.log("Formulaire invalide. Impossible d'activer le paiement.");
    }
  }

}

