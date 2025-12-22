import { Routes } from '@angular/router';
import { Boutique } from './Boutique/boutique';
import { PageNotFound } from './page-not-found/page-not-found';
import { Achats } from './Achat/achat';
import { GestionFooter } from './Gestion-Footer/GestionFooter';
import { UserRoutes } from './UserProfile/userRoutes';

export const routes: Routes = [
    { path: 'login', 
        loadComponent: () => import('./authentification/login/login')
            .then(m => m.Login)
    },
    { 
        path: 'signup', 
        loadComponent: () => import('./authentification/registre/registre')
            .then(m => m.Registre)
    },
    ...UserRoutes,
    ...Achats,
    ...Boutique,
    ...GestionFooter,
    { 
        path: 'accueil', 
        loadComponent: () => import('./Acceuil/accueil')
            .then(m => m.Accueil)
    },
    {path: '', redirectTo: 'accueil', pathMatch: 'full' },
    { path: '**', component: PageNotFound }
];
