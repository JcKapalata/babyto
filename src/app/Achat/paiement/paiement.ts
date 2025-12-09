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

  @Input() articleAchete: CommandeItem | CommandeItem[] |undefined;
  paymentForm!: FormGroup;
  
  // Cette liste est utilisée dans le HTML pour les boutons radio
  operatorSelect: string[] = ['Airtel Money', 'M-pesa', 'Orange money'];

  // Propriétés du composant (ne sont pas utilisées directement pour la liaison, mais pour le submit)
  address!: string;
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
      address: ['', Validators.required],
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

  // desactive le button payer
  disableButtonPayer(){
    return this.paymentForm.valid && this.articleAchete
  }

  // Récupère le prix global des articles en USD
  getPrixGlobalUSD(): number| undefined {
    if (Array.isArray(this.articleAchete)) {
      return this.articleAchete
      .filter(item => item.devise === 'USD') // Filtre uniquement les articles en USD
      .reduce((sum, item) => sum + item.prixTotal, 0);
    } else if (this.articleAchete) {
      // Cas 1 : Achat direct (CommandeItem unique)
      return this.articleAchete.prixTotal; // <-- Ceci manquait !
    } else{
      return undefined
    }
  }

  // Récupère le prix global des articles en CDF
  getPrixGlobalCDF(): number| undefined {
    if (Array.isArray(this.articleAchete)) {
      return this.articleAchete
      .filter(item => item.devise === 'CDF') // Filtre uniquement les articles en USD
      .reduce((sum, item) => sum + item.prixTotal, 0);
    } else if (this.articleAchete) {
      // Cas 1 : Achat direct (CommandeItem unique)
      return this.articleAchete.prixTotal; // <-- Ceci manquait !
    } else{
      return undefined
    }
  }

  //Log du prix global
  logPrixGlobal(): void {

    // 1. --- LOGIQUE ACHAT DIRECT (articleAchete est un CommandeItem unique) ---
    // Cas 1.1 : Article unique en USD
    if (!Array.isArray(this.articleAchete) && this.articleAchete?.devise === 'USD') {
        const prixUSD = this.getPrixGlobalUSD(); // Récupère le prix de l'article unique en USD
        
        console.log("--- Achat Direct (USD) ---");
        console.log(`Paiement effectué au Prix Global en USD : ${prixUSD}`);
        console.log(`Paiement effectué au Prix Global en CDF : 0`); // Zéro car c'est un article en USD

    } 
    // Cas 1.2 : Article unique en CDF
    else if (!Array.isArray(this.articleAchete) && this.articleAchete?.devise === 'CDF') {
        const prixCDF = this.getPrixGlobalCDF(); // Récupère le prix de l'article unique en CDF
        
        console.log("--- Achat Direct (CDF) ---");
        console.log(`Paiement effectué au Prix Global en USD : 0`); // Zéro car c'est un article en CDF
        console.log(`Paiement effectué au Prix Global en CDF : ${prixCDF}`);
    } 
    
    // 2. --- LOGIQUE PANIER (articleAchete est un tableau CommandeItem[]) ---   
    // Cas 2 : Panier (peut contenir les deux devises)
    else if (Array.isArray(this.articleAchete)) {
        const prixUSD = this.getPrixGlobalUSD(); // Calcule la somme des articles en USD
        const prixCDF = this.getPrixGlobalCDF(); // Calcule la somme des articles en CDF
        
        console.log("--- Achat Panier (Multi-Devises) ---");
        console.log(`Paiement effectué au Prix Global en USD : ${prixUSD}`);
        console.log(`Paiement effectué au Prix Global en CDF : ${prixCDF}`);
    } 
    
    // 3. --- AUCUN ARTICLE ---
    else {
        console.log("Aucun article trouvé pour la journalisation.");
    }
  }

  // submit le paiement
  onSubmit() {
    if (this.disableButtonPayer()) {
      const paymentMethod = this.paymentForm.get('method')?.value;

      // Si la transaction ce faite avec visa
      if (paymentMethod === 'visa') {
        this.cardName = this.paymentForm.get('cardName')?.value;
        this.cardNumber = this.paymentForm.get('cardNumber')?.value;
        this.cvv = this.paymentForm.get('cvv')?.value;
        this.expiry = this.paymentForm.get('expiry')?.value;
        
        console.log(`Paiement Visa soumis pour la carte se terminant par: ${this.cardNumber.slice(-4)}`);
      }

      // Si la transaction se faite par mobile money (la méthode est un nom d'opérateur)
      if(this.operatorSelect.includes(paymentMethod) ){
        // L'opérateur est la valeur de la méthode elle-même
        this.operator = paymentMethod; 
        this.mobileNumber = this.paymentForm.get('mobileNumber')?.value;
        
        //log infoPayement
        console.table(this.getInfoPayement())
      }

      //log Adress de livraison
      console.log(`l'address de livraison est: ${this.paymentForm.get('address')?.value}`)
      //log le prix global
      this.logPrixGlobal()
      //log les article
      console.table(this.articleAchete);
    } else {
      this.paymentForm.markAllAsTouched();
      console.error(`Formulaire invalide ou de l'article. Veuillez vérifier les champs requis.`);
    }
  }
}