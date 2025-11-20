import { Component, OnInit } from '@angular/core';
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
  templateUrl: './commande-form.html',
  styleUrls: ['./commande-form.css'],
})
export class CommandeFormComponent implements OnInit {

  produitForm: FormGroup;
  produit: Produit | null = null;
  prixTotal: number;
  quantite: number = 1;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private achatService: AchatService
  ) {
    this.produitForm = this.fb.group({
      quantite: [1, [Validators.required, Validators.min(1), this.integerValidator]],
    });

    this.produitForm.get('quantite')?.valueChanges.subscribe(qty => {
      this.updateTotal(qty);
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.achatService.getProduitById(id).subscribe(prod => {
        if (prod) {
          this.produit = prod;
          this.updateTotal(this.produitForm.value.quantite);
        }
      });
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
      this.ajouterAuPanier()
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

  // ajouterAuPanier() {
  //   if (this.produit) {
  //     this.panierService.ajouterProduit(this.produit);
  //     alert(`${this.produit.nom} ajouté au panier !`);
  //   }
  // }


  goBack(){
    this.router.navigate(['boutique/produits-list']);
  }
}

