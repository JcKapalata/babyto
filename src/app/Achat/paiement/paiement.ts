import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommandeItem } from '../../Models/commande';
import { MobileMoney } from '../../Models/mobileMoney';

@Component({
  selector: 'app-paiement',
  imports: [ReactiveFormsModule], 
  templateUrl: './paiement.html',
  styleUrls: ['./paiement.css']
})
export class Paiement implements OnInit{

  @Input() articleAchete: CommandeItem| undefined;
  paymentForm!: FormGroup;
  
  // Cette liste est utilisée dans le HTML pour les boutons radio
  operatorSelect: string[] = ['Airtel Money', 'M-pesa', 'Orange money'];

  // Propriétés du composant (ne sont pas utilisées directement pour la liaison, mais pour le submit)
  method!: string;
  cardNumber!: string;
  cardName!: string;
  expiry!: string;
  cvv!: string;
  mobileNumber!: string;
  operator!: string; // Maintenu pour stocker l'opérateur après soumission

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.paymentForm = this.fb.group({
      method: ['', Validators.required],
      cardNumber: ['', []],
      cardName: ['', []],
      expiry: ['', []],
      cvv: ['', []],
      mobileNumber: ['', []],
      operator: ['', []] 
    });

    const visaControls = [
        this.paymentForm.get('cardNumber'),
        this.paymentForm.get('cardName'),
        this.paymentForm.get('expiry'),
        this.paymentForm.get('cvv')
    ];
    // Le contrôle 'method' gère déjà le choix de l'opérateur.
    const mobileNumberControl = this.paymentForm.get('mobileNumber');


    // Gestion des validations dynamiques selon la méthode choisie
    this.paymentForm.get('method')?.valueChanges.subscribe(method => {
      
      // Assurez-vous que les valeurs des contrôles non-actifs sont effacées
      this.clearFormValues(method);

      // --- LOGIQUE VISA ---
      if (method === 'visa') {
        
        // 1. Définir les validateurs Visa
        this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.minLength(16), Validators.maxLength(16)]);
        this.paymentForm.get('cardName')?.setValidators([Validators.required]);
        this.paymentForm.get('expiry')?.setValidators([Validators.required]);
        this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(3)]);
        
        // 2. Supprimer les validateurs Mobile Money
        mobileNumberControl?.clearValidators();

      // --- LOGIQUE MOBILE MONEY (Un des opérateurs) ---
      } else if (this.operatorSelect.includes(method)) {
        
        // 1. Définir les validateurs Mobile Money (seul le numéro est nécessaire)
        mobileNumberControl?.setValidators([
            Validators.required, 
            Validators.minLength(10), // Adaptez la taille si nécessaire
            Validators.maxLength(10) // Adaptez la taille si nécessaire
        ]);

        // 2. Supprimer les validateurs Visa
        visaControls.forEach(control => {
            control?.clearValidators();
        });
        
      } else {
         // Si aucune méthode valide n'est sélectionnée (cas initial ou étrange)
         visaControls.forEach(control => control?.clearValidators());
         mobileNumberControl?.clearValidators();
      }
      
      // --- MISE À JOUR FINALE DE LA VALIDITÉ ---
      // Mise à jour de tous les contrôles affectés
      visaControls.forEach(control => control?.updateValueAndValidity());
      mobileNumberControl?.updateValueAndValidity();
    });
  }

  // Ajout d'une fonction pour effacer les valeurs des champs non utilisés
  private clearFormValues(currentMethod: string): void {
      const visaFields = ['cardNumber', 'cardName', 'expiry', 'cvv'];
      const mobileFields = ['mobileNumber']; // 'operator' n'est plus pertinent

      if (currentMethod === 'visa') {
          mobileFields.forEach(field => this.paymentForm.get(field)?.setValue(null));
      } else if (this.operatorSelect.includes(currentMethod)) {
          visaFields.forEach(field => this.paymentForm.get(field)?.setValue(null));
      } else {
          // Tout effacer si la méthode est réinitialisée ou invalide
          [...visaFields, ...mobileFields].forEach(field => this.paymentForm.get(field)?.setValue(null));
      }
  }

  // L'opérateur "method" est-il un opérateur Mobile Money valide?
  isMobileMoneySelected(): boolean {
    const method = this.paymentForm.get('method')?.value;
    // Vérifie si la méthode sélectionnée est présente dans la liste operatorSelect
    return !!method && this.operatorSelect.includes(method); 
  }

  // recuperation de l'information du payement
  getInfoPayement(): MobileMoney{
    return {
      numberPhone: this.mobileNumber,
      opereator: this.operator
    }
  }

  // submit le paiement
  onSubmit() {
    if (this.paymentForm.valid) {
      const paymentMethod = this.paymentForm.get('method')?.value;

      // Si la transaction ce faite avec visa
      if (paymentMethod === 'visa') {
        this.cardName = this.paymentForm.get('cardName')?.value;
        this.cardNumber = this.paymentForm.get('cardNumber')?.value;
        this.cvv = this.paymentForm.get('cvv')?.value;
        this.expiry = this.paymentForm.get('expiry')?.value;
        
        console.log(`Paiement Visa soumis pour la carte se terminant par: ${this.cardNumber.slice(-4)}`);
        console.table(this.articleAchete);
      }

      // Si la transaction se faite par mobile money (la méthode est un nom d'opérateur)
      if(this.operatorSelect.includes(paymentMethod) ){
        // L'opérateur est la valeur de la méthode elle-même
        this.operator = paymentMethod; 
        this.mobileNumber = this.paymentForm.get('mobileNumber')?.value;
        
        console.table(this.articleAchete);
        console.table(this.getInfoPayement())
      }
    } else {
      this.paymentForm.markAllAsTouched();
      console.error('Formulaire invalide. Veuillez vérifier les champs requis.');
    }
  }
}