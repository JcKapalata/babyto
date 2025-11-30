import { Component, OnInit } from '@angular/core';
import { Produit } from '../../Models/produits';
import { Router } from '@angular/router';

@Component({
  selector: 'whatsapp-redirect',
  imports: [],
  template: ``,
})
export class WhatsappRedirect implements OnInit{

  produit: Produit;
  readonly phoneNumber: string = '243995069788'; // Remplacez par le numéro de téléphone souhaité

  constructor(
    private router: Router
  ) {
    const navigation = this.router.currentNavigation();
    this.produit = navigation?.extras.state?.['produit'];
    this.redirectToWhatsApp(this.produit);
  }

  ngOnInit(): void {
    this.router.navigate(['boutique/produits-list']);
  }

  redirectToWhatsApp(produit: Produit) {
    const message: string = encodeURIComponent(`Bonjour, je souhaite passer une commande.
      Produit: ${produit.nom}
      id: ${produit.id}`);
    const whatsappUrl: string = `https://wa.me/${this.phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}
