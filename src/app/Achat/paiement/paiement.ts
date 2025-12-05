
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommandeItem } from '../../Models/commande';

@Component({
  selector: 'app-paiement',
  imports: [ReactiveFormsModule],
  templateUrl: './paiement.html',
  styleUrls: ['./paiement.css']
})
export class Paiement implements OnInit{

  @Input() articleAchete: CommandeItem| undefined;
  paymentForm!: FormGroup;
  
  // propriete a place dans le formulaire
  operatorSelect: string[] = ['Airtel', 'Vodacom', 'Orange'];

  // propriete pour visa
  method: string;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
// propriete pour mobile money
  mobileNumber: string;
  operator: string;

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

    // Récupération de tous les contrôles une seule fois pour la mise à jour finale
    const visaControls = [
        this.paymentForm.get('cardNumber'),
        this.paymentForm.get('cardName'),
        this.paymentForm.get('expiry'),
        this.paymentForm.get('cvv')
    ];
    const mobileControls = [
        this.paymentForm.get('mobileNumber'),
        this.paymentForm.get('operator')
    ];

    // Gestion des validations dynamiques selon la méthode choisie
    this.paymentForm.get('method')?.valueChanges.subscribe(method => {

      // --- LOGIQUE VISA ---
      if (method === 'visa') {
        // 1. Définir les validateurs Visa
        this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.minLength(16), Validators.maxLength(16)]);
        this.paymentForm.get('cardName')?.setValidators([Validators.required]);
        this.paymentForm.get('expiry')?.setValidators([Validators.required]);
        this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(3)]);
        
        // 2. Supprimer les validateurs Mobile Money
        mobileControls.forEach(control => {
            control?.clearValidators();
        });

      // --- LOGIQUE MOBILE MONEY ---
      } else if (this.operatorSelect.includes(method)) {
        // 1. Définir les validateurs Mobile Money
        this.paymentForm.get('mobileNumber')?.setValidators([
            Validators.required, 
            Validators.minLength(10), 
            Validators.maxLength(10)
        ]);
        this.paymentForm.get('operator')?.setValidators([Validators.required]);

        // 2. Supprimer les validateurs Visa
        visaControls.forEach(control => {
            control?.clearValidators();
        });
      } 
      
      // --- MISE À JOUR FINALE DE LA VALIDITÉ ---
      // ⚠️ C'est ici qu'on appelle updateValueAndValidity, une seule fois pour tout !
      
      // Mettre à jour les contrôles Visa
      visaControls.forEach(control => {
          control?.updateValueAndValidity();
      });
      
      // Mettre à jour les contrôles Mobile
      mobileControls.forEach(control => {
          control?.updateValueAndValidity();
      });
    });
  }
  
  // submit le paiement
  onSubmit() {
    if (this.paymentForm.valid) {
      const paymentMethod = this.paymentForm.get('method')?.value

      // Si la transaction ce faite avec visa
      if (paymentMethod === 'visa') {
        this.cardName = this.paymentForm.get('cardName')?.value;
        this.cardNumber = this.paymentForm.get('cardNumber')?.value;
        this.cvv = this.paymentForm.get('cvv')?.value;
        this.expiry = this.paymentForm.get('expiry')?.value;
      }

      // si la transaction ce faite par mobile money
      if(paymentMethod === 'mobile' ){
        this.operator = this.paymentForm.get('operator')?.value;
        this.mobileNumber = this.paymentForm.get('mobileNumber')?.value
        console.log(`le numero qui a payer est ${this.mobileNumber} sur l'operateur ${this.operator}`);
        console.table(this.articleAchete)
      }
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }
}
