import { Routes } from "@angular/router";
import { Panier } from "./panier/panier";
import { WhatsappRedirect } from "./whatsapp-redirect/whatsapp-redirect";
import { AchatDirect } from "./achat-direct/achat-direct";


export const Achats: Routes = [
    { path: 'achat/watsapp-commande', component: WhatsappRedirect},
    { path: 'achat/achat-direct/:id', component: AchatDirect},
    { path: 'achat/panier', component: Panier}
]