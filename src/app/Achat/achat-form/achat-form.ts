import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, AbstractControl } from '@angular/forms';
import { Produit } from '../../Models/produits';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { AchatService} from '../achat-service';
import { CommandeItem } from '../../Models/commande';


@Component({
  selector: 'app-commande-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './achat-form.html',
  styleUrls: ['./achat-form.css'],
})
export class AchatForm implements OnInit {

  @Input() produit: Produit;
  produitForm: FormGroup;
  prixTotal: number;
  quantite: number = 1;
  taille: string = '';
  couleur: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private achatService: AchatService
  ) {
    this.produitForm = this.fb.group({
      quantite: [1, [Validators.required, Validators.min(1), this.integerValidator]],
      taille: ['', Validators.required],
      couleur: ['', Validators.required]
    });

    this.produitForm.get('quantite')?.valueChanges.subscribe(qty => {
      this.updateTotal(qty);
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

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

          this.updateTotal(this.produitForm.value.quantite);
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

  onSubmit() {
    if (this.produitForm.valid) {
      this.router.navigate(['boutique/produits-list']);
      console.log('le submit a reussit');
      
      // this.ajouterAuPanier()
    }
  }

  ajouterAuPanier() {
    if (this.produit && this.produitForm.valid) {
      // Récupère la valeur du FormControl "quantite"
      const quantite = this.produitForm.get('quantite')?.value;

      const itemCommande = new CommandeItem(this.produit, quantite);
      this.achatService.ajouterProduit(itemCommande);
    }
  }

}

