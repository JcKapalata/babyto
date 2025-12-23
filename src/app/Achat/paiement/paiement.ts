import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

// Models & Interfaces
import { CommandeItem } from '../../Models/commande';
import { ProduitAchete } from '../../Models/produitAchete';
import { AuthService } from '../../authentification/auth-service';
import { AchatService } from '../achat-service'; 

// Configuration des opérateurs pour éviter les erreurs de typage
const OPERATEUR_MAP: Record<string, 'orange' | 'airtel' | 'mpesa' | 'mtn'> = {
  'Airtel Money': 'airtel',
  'M-pesa': 'mpesa',
  'Orange money': 'orange'
};

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './paiement.html',
  styleUrls: ['./paiement.css']
})
export class Paiement implements OnInit {
  // --- INJECTIONS ---
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private achatService = inject(AchatService);
  private router = inject(Router);

  // --- INPUTS & PROPRIÉTÉS ---
  @Input() articleAchete: CommandeItem | CommandeItem[] | undefined;
  
  paymentForm!: FormGroup;
  isSubmitting = false; // Pour éviter les doubles clics
  // Cette liste est utilisée dans le HTML pour les boutons radio
  readonly operatorSelect = Object.keys(OPERATEUR_MAP);

  ngOnInit() {
    this.initForm();
    this.listenToMethodChanges();
  }

  // --- INITIALISATION ---

  private initForm() {
    this.paymentForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(5)]],
      method: ['', Validators.required],
      // Visa fields
      cardNumber: [''],
      cardName: [''],
      expiry: [''],
      cvv: [''],
      // Mobile fields
      mobileNumber: ['']
    });
  }

  // Gestion des validations dynamiques selon la méthode choisie
  private listenToMethodChanges() {
    this.paymentForm.get('method')?.valueChanges.subscribe(method => {
      this.updateValidators(method);
    });
  }

  // --- LOGIQUE DE VALIDATION DYNAMIQUE ---

  private updateValidators(method: string) {
    const visaFields = ['cardNumber', 'cardName', 'expiry', 'cvv'];
    const mobileFields = ['mobileNumber'];

    if (method === 'visa') {
      // 1. Définir les validateurs Visa
      this.setFieldsValidators(visaFields, [Validators.required]);
      // 2. Supprimer les validateurs Mobile Money
      this.clearFieldsValidators(mobileFields);
    } else if (this.operatorSelect.includes(method)) {
      // 1. Définir les validateurs Mobile Money
      this.setFieldsValidators(mobileFields, [Validators.required, Validators.pattern('^[0-9]{10}$')]);
      // 2. Supprimer les validateurs Visa
      this.clearFieldsValidators(visaFields);
    }
    
    this.paymentForm.updateValueAndValidity();
  }

  private setFieldsValidators(fields: string[], validators: any[]) {
    fields.forEach(f => {
      const ctrl = this.paymentForm.get(f);
      ctrl?.setValidators(validators);
      ctrl?.updateValueAndValidity();
    });
  }

  private clearFieldsValidators(fields: string[]) {
    fields.forEach(f => {
      const ctrl = this.paymentForm.get(f);
      ctrl?.clearValidators();
      ctrl?.setValue(null); // Efface les valeurs des champs non utilisés
      ctrl?.updateValueAndValidity();
    });
  }

  // --- MÉTHODES POUR LE HTML ---

  // L'opérateur "method" est-il un opérateur Mobile Money valide?
  isMobileMoneySelected(): boolean {
    const method = this.paymentForm.get('method')?.value;
    // Vérifie si la méthode sélectionnée est présente dans la liste operatorSelect
    return !!method && this.operatorSelect.includes(method); 
  }

  // desactive le button payer
  disableButtonPayer(): boolean {
    // On vérifie que le formulaire est valide et qu'il y a un article
    return this.paymentForm.valid && !!this.articleAchete && !this.isSubmitting;
  }

  // --- MAPPING ET SOUCOISSION ---

  // Gestion du donne a envoyer au paiement
  private createAchatPayload(item: CommandeItem, method: string, address: string): ProduitAchete {
    const user = this.authService.user();
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Génération d'une référence de suivi unique
    const ref = `REF-${dateStr}-U${user?.id}-${item.code}-${Math.floor(Math.random() * 100)}`;
    // Génération d'un ID unique pour éviter l'erreur 422
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

    return {
      id: uniqueId.toString(),
      clientId: user?.id ?? 0,
      data: {
        achatId: Date.now() + Math.floor(Math.random() * 1000),
        codeProduit: item.code,
        reference: ref,
        nom: item.nom,
        prixUnitaire: item.prix,
        quantite: item.quantity,
        prixTotal: item.prixTotal,
        tailleSelectionnee: Array.isArray(item.tailleSelectionnee) ? item.tailleSelectionnee[0] : item.tailleSelectionnee,
        couleurSelectionnee: Array.isArray(item.couleurSelectionnee) ? item.couleurSelectionnee[0] : item.couleurSelectionnee,
        image: Array.isArray(item.imagesParCouleur) ? item.imagesParCouleur[0] : (item.imagesParCouleur as any || ''),
        regionProduit: item.region,
        addresseLivraison: address,
        dateAchat: date,
        status: 'en cours',
        paiement: {
          methode: this.operatorSelect.includes(method) ? 'mobile_money' : 'visa',
          etat: 'succès',
          montantPaye: item.prixTotal,
          devise: item.devise as 'USD' | 'CDF',
          transactionId: `TXN-${Math.random().toString(36).toUpperCase().substring(2, 10)}`,
          dateTransaction: date,
          ...(this.operatorSelect.includes(method) && {
            operateur: OPERATEUR_MAP[method],
            numeroMobile: this.paymentForm.get('mobileNumber')?.value
          })
        }
      }
    };
  }

  // submit le paiement
  onSubmit() {
    const user = this.authService.user();
    
    if (this.paymentForm.invalid || !this.articleAchete || !user) {
      this.paymentForm.markAllAsTouched();
      console.error(`Formulaire invalide ou article manquant.`);
      return;
    }

    this.isSubmitting = true;
    const { method, address } = this.paymentForm.value;

    // Log Adress de livraison
    console.log(`l'address de livraison est: ${address}`);

    // Transformer les articles en format ProduitAchete
    const items = Array.isArray(this.articleAchete) ? this.articleAchete : [this.articleAchete];
    const payloads = items.map(item => this.createAchatPayload(item, method, address));

    // Envoi au service d'achat
    this.achatService.saveAchats(payloads)
      .pipe(
        finalize(() => this.isSubmitting = false),
        catchError(err => {
          console.error("Erreur paiement:", err);
          return of(null);
        })
      )
      .subscribe(res => {
        if (res) {
          console.log("Paiement réussi");
          this.router.navigate(['/mes-achats']);
        }
      });
  }
}