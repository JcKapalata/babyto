export type MethodePaiement = 'visa' | 'mastercard' | 'mobile_money' | 'cash_delivery';
export type EtatTransaction = 'succès' | 'échec' | 'en_attente' | 'remboursé' | 'à_collecter';

export interface DetailPaiement {
    readonly methode: MethodePaiement;
    readonly etat: EtatTransaction;
    readonly montantPaye: number;
    readonly devise: string;
    
    // Optionnel : présent seulement si paiement déjà effectué en ligne/mobile
    readonly transactionId?: string; 
    readonly dateTransaction?: Date;

    // Spécifique Mobile Money (ex: numéro de téléphone utilisé)
    readonly numeroMobile?: string; 
    readonly operateur?: 'orange' | 'airtel' | 'mpesa' | 'mtn';

    // Spécifique Carte
    readonly cardLast4?: string;

    // Spécifique Livraison
    readonly fraisLivraison?: number;
}