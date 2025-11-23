import { Component, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-accueil',
  templateUrl: 'accueil.html',
  styleUrls: ['accueil.css']
})
export class Accueil implements AfterViewInit {

  ngAfterViewInit(): void {
    this.checkElementsInView(); // vérifie dès le chargement
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.checkElementsInView(); // vérifie à chaque scroll
  }

  private checkElementsInView() {
    const elements = document.querySelectorAll('.slide-left, .slide-right, .animate-fade');

    elements.forEach(el => {
      const position = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (position < windowHeight - 150 && position > 0) {
        // élément visible → ajoute la classe
        el.classList.add('visible');
      } else {
        // élément hors de la vue → retire la classe
        el.classList.remove('visible');
      }
    });
  }
}
