import {  Routes } from "@angular/router";
import { ProduitsList } from "./produits-list/produits-list";
import { ProduitDetail } from "./produit-detail/produit-detail";


export const Boutique: Routes = [
    { path: 'boutique/produits-list', component: ProduitsList},
    { path: 'boutique/produit-detail/:id', component: ProduitDetail}
]