import { DetailPaiement } from "./detailPaiement";

export type StatutProduit = 'livré' | 'en cours' | 'annulé' | 'en_attente_paiement';

export interface ProduitAchete {
    readonly AchatId: number;
    readonly codeProduit: string;
    readonly reference: string;
    readonly nom: string;

    readonly prixUnitaire: number;
    readonly quantite: number;
    readonly prixTotal: number;

    /** Gestion du paiement selon le mode choisi */
    readonly paiement: DetailPaiement;

    readonly tailleSelectionnee: string;
    readonly couleurSelectionnee: string;
    readonly image: string;

    readonly regionProduit: string;
    readonly addresseLivraison: string;

    readonly dateAchat: Date;
    status: StatutProduit;
}