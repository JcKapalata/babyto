import { Produit } from "./produits";

export interface GroupeProduits {
  [classement: string]: Produit[];
}