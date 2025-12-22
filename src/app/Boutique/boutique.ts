import {  Routes } from "@angular/router";

export const Boutique: Routes = [
    { 
        path: 'boutique/produits-list', 
        loadComponent: () => import('./produits-list/produits-list').then(m => m.ProduitsList)
    },
    { 
        path: 'boutique/produit-detail/:id', 
        loadComponent: () => import('./produit-detail/produit-detail').then(m => m.ProduitDetail)
    }
]