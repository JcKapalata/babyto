import { Component, OnInit } from '@angular/core';
import { Navbar } from './Navbar/navbar';
import { RouterOutlet } from "@angular/router";
import { Footer } from "./footer/footer";
import { MatCardActions } from "@angular/material/card";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from './authentification/auth-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, RouterOutlet, Footer, MatCardActions, FontAwesomeModule],  
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  // Déclarez l'icône comme propriété pour le template
  public faWhatsapp = faWhatsapp;
  
  readonly phoneNumber: string = '243995069788'; // Remplacez par le numéro de téléphone souhaité


  goToWhatsappCommande() {
    const message: string = encodeURIComponent(`Bonjour, je souhaite passer une commande.`);
    const whatsappUrl: string = `https://wa.me/${this.phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}
