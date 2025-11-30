import { Routes } from "@angular/router";
import { CommandeFormComponent } from "./commande-form/commande-form";
import { Panier } from "./panier/panier";
import { WhatsappRedirect } from "./whatsapp-redirect/whatsapp-redirect";


export const Achats: Routes = [
    { path: 'achat/watsapp-commande', component: WhatsappRedirect},
    { path: 'achat/commande/:id', component: CommandeFormComponent},
    { path: 'achat/panier', component: Panier}
]