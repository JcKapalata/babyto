import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-paiement',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paiement.html',
  styleUrls: ['./paiement.css']
})
export class Paiement implements OnInit {

  paymentForm!: FormGroup;
  
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

    // Gestion des validations dynamiques selon la méthode choisie
    this.paymentForm.get('method')?.valueChanges.subscribe(method => {
      if (method === 'visa') {
        this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.minLength(16), Validators.maxLength(16)]);
        this.paymentForm.get('cardName')?.setValidators([Validators.required]);
        this.paymentForm.get('expiry')?.setValidators([Validators.required]);
        this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(3)]);
        // Désactive Mobile Money
        this.paymentForm.get('mobileNumber')?.clearValidators();
        this.paymentForm.get('operator')?.clearValidators();
      } else if (method === 'mobile') {
        this.paymentForm.get('mobileNumber')?.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
        this.paymentForm.get('operator')?.setValidators([Validators.required]);
        // Désactive Visa
        this.paymentForm.get('cardNumber')?.clearValidators();
        this.paymentForm.get('cardName')?.clearValidators();
        this.paymentForm.get('expiry')?.clearValidators();
        this.paymentForm.get('cvv')?.clearValidators();
      }
      // Met à jour les erreurs
      this.paymentForm.get('cardNumber')?.updateValueAndValidity();
      this.paymentForm.get('cardName')?.updateValueAndValidity();
      this.paymentForm.get('expiry')?.updateValueAndValidity();
      this.paymentForm.get('cvv')?.updateValueAndValidity();
      this.paymentForm.get('mobileNumber')?.updateValueAndValidity();
      this.paymentForm.get('operator')?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const paymentMethod = this.paymentForm.get('method')?.value

      if (paymentMethod === 'visa') {
        this.cardName = this.paymentForm.get('cardName')?.value;
        this.cardNumber = this.paymentForm.get('cardNumber')?.value;
        this.cvv = this.paymentForm.get('cvv')?.value;
        this.expiry = this.paymentForm.get('expiry')?.value;
      }

      if(paymentMethod === 'mobile' ){
        this.operator = this.paymentForm.get('operator')?.value;
        this.mobileNumber = this.paymentForm.get('mobileNumber')?.value
        console.log(`le numero qui a payer est ${this.mobileNumber} sur l'operateur ${this.operator}`);
        
      }
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }
}
