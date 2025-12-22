import { Routes } from "@angular/router";

export const GestionFooter: Routes =[
    { 
        path: 'conditions-generales-ventes', 
        loadComponent: () => import('./conditions-generales-ventes/conditions-generales-ventes')
            .then(m => m.ConditionsGeneralesVentes)
    },
    { 
        path: 'politique-retour', 
        loadComponent: () => import('./politique-retour/politique-retour')
            .then(m => m.PolitiqueRetour)
    },
    { 
        path: 'politique-confidentialite', 
        loadComponent: () => import('./politique-confidentialite/politique-confidentialite')
            .then(m => m.PolitiqueConfidentialite)
    },
    { 
        path: 'a-propos', 
        loadComponent: () => import('./apropos/apropos')
            .then(m => m.Apropos)
    }
]