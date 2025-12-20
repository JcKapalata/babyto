import { Routes } from "@angular/router";
import { Panier } from "./panier/panier";
import { AchatDirect } from "./achat-direct/achat-direct";


export const Achats: Routes = [
    { path: 'achat/achat-direct/:id', component: AchatDirect },
    { path: 'achat/panier', component: Panier }
]